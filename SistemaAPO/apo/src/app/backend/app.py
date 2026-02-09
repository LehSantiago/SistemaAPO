from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import pandas as pd
import os
from datetime import datetime
from werkzeug.utils import secure_filename

app = Flask(__name__)

# Configuração CORS
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000", "http://127.0.0.1:3000"],
        "methods": ["GET", "POST", "PUT", "DELETE"],
        "allow_headers": ["Content-Type"]
    },
    r"/uploads/*": {
        "origins": ["http://localhost:3000", "http://127.0.0.1:3000"],
        "methods": ["GET"],
        "allow_headers": ["Content-Type"]
    }
})

# Configurações
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg', 'doc', 'docx'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max

# Criar pastas necessárias
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs('data', exist_ok=True)

def init_dataframes():
    """Inicializa os arquivos CSV necessários"""
    if not os.path.exists('data/items.csv'):
        items_df = pd.DataFrame(columns=[
            'id', 'aluno_id', 'aluno_matricula', 'tipo', 'titulo', 'descricao', 
            'arquivo', 'arquivo_assinado', 'status', 'pontos', 'data_submissao', 
            'data_aprovacao_orientador', 'data_aprovacao_comissao',
            'data_aprovacao_coordenacao', 'comentario_orientador',
            'comentario_comissao', 'comentario_coordenacao'
        ])
        items_df.to_csv('data/items.csv', index=False)
    
    if not os.path.exists('data/usuarios.csv'):
        usuarios_df = pd.DataFrame([
            {'id': 1, 'nome': 'João Silva', 'email': 'aluno@teste.com', 
             'senha': '123456', 'tipo': 'aluno', 'matricula': '202401', 'pontos_total': 0},
            {'id': 2, 'nome': 'Prof. Dr. Ana Beatriz Lima', 'email': 'orientador@teste.com',
             'senha': '123456', 'tipo': 'orientador', 'matricula': '', 'pontos_total': 0},
            {'id': 3, 'nome': 'Prof. Carlos Mendes', 'email': 'comissao@teste.com',
             'senha': '123456', 'tipo': 'comissao', 'matricula': '', 'pontos_total': 0},
            {'id': 4, 'nome': 'Prof. Dr. Maria Santos', 'email': 'coordenacao@teste.com',
             'senha': '123456', 'tipo': 'coordenacao', 'matricula': '', 'pontos_total': 0},
            {'id': 5, 'nome': 'Secretária Paula Costa', 'email': 'secretaria@teste.com',
             'senha': '123456', 'tipo': 'secretaria', 'matricula': '', 'pontos_total': 0}
        ])
        usuarios_df.to_csv('data/usuarios.csv', index=False)
    
    if not os.path.exists('data/assinaturas.csv'):
        assinaturas_df = pd.DataFrame(columns=[
            'id', 'item_id', 'usuario_id', 'nome', 'cargo', 'status', 'data_assinatura'
        ])
        assinaturas_df.to_csv('data/assinaturas.csv', index=False)

init_dataframes()

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def enviar_email_notificacao(destinatario, assunto, mensagem):
    """Simula envio de e-mail"""
    print(f"\n📧 EMAIL ENVIADO:")
    print(f"Para: {destinatario}")
    print(f"Assunto: {assunto}")
    print(f"Mensagem: {mensagem}\n")
    return True

# ============= SERVIR ARQUIVOS =============
@app.route('/uploads/<path:filename>', methods=['GET'])
def download_file(filename):
    """Serve arquivos da pasta uploads"""
    try:
        # Normalizar o caminho do arquivo
        filename = filename.replace('uploads/', '').replace('uploads\\', '')
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        
        print(f"\n📥 Tentando baixar arquivo:")
        print(f"  Filename solicitado: {filename}")
        print(f"  Caminho completo: {file_path}")
        print(f"  Arquivo existe: {os.path.exists(file_path)}")
        
        if os.path.exists(file_path):
            return send_from_directory(app.config['UPLOAD_FOLDER'], filename, as_attachment=True)
        else:
            print(f"❌ Arquivo não encontrado: {file_path}")
            return jsonify({'error': 'Arquivo não encontrado'}), 404
    except Exception as e:
        print(f"❌ Erro ao baixar arquivo: {e}")
        return jsonify({'error': str(e)}), 500

# ============= LOGIN =============
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email', '').strip()
    senha = data.get('senha', '').strip()
    tipo = data.get('tipo', '').strip()
    
    print(f"\n🔐 Tentativa de login:")
    print(f"  Email: {email}")
    print(f"  Tipo: {tipo}")
    
    usuarios_df = pd.read_csv('data/usuarios.csv')
    usuarios_df['email'] = usuarios_df['email'].str.strip()
    usuarios_df['senha'] = usuarios_df['senha'].astype(str).str.strip()
    usuarios_df['tipo'] = usuarios_df['tipo'].str.strip()
    
    user = usuarios_df[
        (usuarios_df['email'] == email) & 
        (usuarios_df['senha'] == senha) &
        (usuarios_df['tipo'] == tipo)
    ]
    
    if not user.empty:
        user_data = user.iloc[0].to_dict()
        
        response_data = {
            'success': True,
            'user': {
                'id': int(user_data['id']),
                'nome': user_data['nome'],
                'email': user_data['email'],
                'tipo': user_data['tipo'],
                'matricula': user_data.get('matricula', ''),
                'pontos_total': int(user_data['pontos_total']) if pd.notna(user_data['pontos_total']) else 0
            }
        }
        
        print(f"✅ Login bem-sucedido:")
        print(f"  ID: {response_data['user']['id']}")
        print(f"  Nome: {response_data['user']['nome']}")
        print(f"  Tipo: {response_data['user']['tipo']}\n")
        
        return jsonify(response_data)
    
    print(f"❌ Login falhou: Credenciais inválidas\n")
    return jsonify({'success': False, 'message': 'Credenciais inválidas'}), 401

# ============= ALUNO =============
@app.route('/api/aluno/dashboard', methods=['GET'])
def get_dashboard():
    aluno_id = request.args.get('aluno_id', 1, type=int)
    
    items_df = pd.read_csv('data/items.csv')
    usuarios_df = pd.read_csv('data/usuarios.csv')
    
    aluno_items = items_df[items_df['aluno_id'] == aluno_id]
    
    pendentes = len(aluno_items[aluno_items['status'].str.contains('pendente', na=False)])
    aprovados = len(aluno_items[aluno_items['status'].isin(['aprovado_final', 'aguardando_formalizacao'])])
    
    # Calcular pontos do aluno
    pontos_atual = aluno_items[
        aluno_items['status'].isin(['aprovado_final', 'aguardando_formalizacao'])
    ]['pontos'].sum()
    
    # Atualizar pontos no usuario
    usuarios_df.loc[usuarios_df['id'] == aluno_id, 'pontos_total'] = pontos_atual
    usuarios_df.to_csv('data/usuarios.csv', index=False)
    
    items_list = []
    for _, item in aluno_items.iterrows():
        item_dict = {
            'id': int(item['id']),
            'titulo': item['titulo'],
            'tipo': item['tipo'],
            'descricao': item['descricao'],
            'status': item['status'],
            'pontos': int(item['pontos']) if pd.notna(item['pontos']) else 0,
            'data': item['data_submissao'],
            'arquivo': item['arquivo'] if pd.notna(item['arquivo']) else None,
            'comentario_orientador': item['comentario_orientador'] if pd.notna(item['comentario_orientador']) else '',
            'comentario_comissao': item['comentario_comissao'] if pd.notna(item['comentario_comissao']) else '',
            'comentario_coordenacao': item['comentario_coordenacao'] if pd.notna(item['comentario_coordenacao']) else ''
        }
        items_list.append(item_dict)
    
    return jsonify({
        'stats': {
            'pontosAtual': int(pontos_atual) if pd.notna(pontos_atual) else 0,
            'pontosTotal': 12,
            'pendentes': int(pendentes),
            'aprovados': int(aprovados)
        },
        'items': items_list
    })

@app.route('/api/aluno/submit-item', methods=['POST'])
def submit_item():
    aluno_id = request.form.get('aluno_id', 1)
    tipo = request.form.get('tipo')
    titulo = request.form.get('titulo')
    descricao = request.form.get('descricao')
    
    print(f"\n📤 Recebendo submissão:")
    print(f"  Aluno ID: {aluno_id}")
    print(f"  Tipo: {tipo}")
    print(f"  Título: {titulo}")
    
    if not all([tipo, titulo, descricao]):
        return jsonify({
            'success': False,
            'message': 'Por favor, preencha todos os campos obrigatórios.'
        }), 400
    
    arquivo_path = None
    if 'arquivo' in request.files:
        file = request.files['arquivo']
        if file and file.filename and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            filename = f"{timestamp}_{filename}"
            arquivo_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(arquivo_path)
            print(f"  ✅ Arquivo salvo: {arquivo_path}")
    
    items_df = pd.read_csv('data/items.csv')
    usuarios_df = pd.read_csv('data/usuarios.csv')
    
    # Buscar matrícula do aluno
    aluno = usuarios_df[usuarios_df['id'] == int(aluno_id)]
    aluno_matricula = aluno.iloc[0]['matricula'] if not aluno.empty else ''
    
    new_id = len(items_df) + 1 if len(items_df) > 0 else 1
    new_item = pd.DataFrame([{
        'id': new_id,
        'aluno_id': int(aluno_id),
        'aluno_matricula': aluno_matricula,
        'tipo': tipo,
        'titulo': titulo,
        'descricao': descricao,
        'arquivo': arquivo_path if arquivo_path else '',
        'arquivo_assinado': '',
        'status': 'pendente_orientador',
        'pontos': 0,
        'data_submissao': datetime.now().strftime('%d/%m/%Y %H:%M'),
        'data_aprovacao_orientador': '',
        'data_aprovacao_comissao': '',
        'data_aprovacao_coordenacao': '',
        'comentario_orientador': '',
        'comentario_comissao': '',
        'comentario_coordenacao': ''
    }])
    
    items_df = pd.concat([items_df, new_item], ignore_index=True)
    items_df.to_csv('data/items.csv', index=False)
    
    aluno = usuarios_df[usuarios_df['id'] == int(aluno_id)].iloc[0]
    orientador = usuarios_df[usuarios_df['tipo'] == 'orientador'].iloc[0]
    
    enviar_email_notificacao(
        orientador['email'],
        'Novo Item APO para Avaliação',
        f"O aluno {aluno['nome']} submeteu o item '{titulo}' para sua avaliação."
    )
    
    return jsonify({
        'success': True,
        'message': 'Item submetido com sucesso e encaminhado ao orientador',
        'item_id': new_id
    })

# ============= ORIENTADOR =============
@app.route('/api/orientador/items-pendentes', methods=['GET'])
def get_items_pendentes():
    items_df = pd.read_csv('data/items.csv')
    usuarios_df = pd.read_csv('data/usuarios.csv')
    
    pendentes = items_df[items_df['status'] == 'pendente_orientador']
    
    items_list = []
    for _, item in pendentes.iterrows():
        aluno = usuarios_df[usuarios_df['id'] == item['aluno_id']]
        aluno_nome = aluno.iloc[0]['nome'] if not aluno.empty else 'Desconhecido'
        
        items_list.append({
            'id': int(item['id']),
            'titulo': item['titulo'],
            'tipo': item['tipo'],
            'descricao': item['descricao'],
            'aluno_nome': aluno_nome,
            'data_submissao': item['data_submissao'],
            'arquivo': item['arquivo'] if pd.notna(item['arquivo']) else None,
            'arquivo_url': f"http://localhost:5000/{item['arquivo']}" if pd.notna(item['arquivo']) and item['arquivo'] else None
        })
    
    return jsonify({'items': items_list})

@app.route('/api/orientador/avaliar-item', methods=['POST'])
def avaliar_item():
    data = request.json
    item_id = data.get('item_id')
    status = data.get('status')
    pontos = data.get('pontos', 0)
    comentario = data.get('comentario', '')
    
    items_df = pd.read_csv('data/items.csv')
    usuarios_df = pd.read_csv('data/usuarios.csv')
    
    if status == 'rejeitado':
        if not comentario:
            return jsonify({
                'success': False,
                'message': 'Comentário obrigatório para devolução'
            }), 400
        
        items_df.loc[items_df['id'] == item_id, 'status'] = 'devolvido_orientador'
        items_df.loc[items_df['id'] == item_id, 'comentario_orientador'] = comentario
        items_df.to_csv('data/items.csv', index=False)
        
        item = items_df[items_df['id'] == item_id].iloc[0]
        aluno = usuarios_df[usuarios_df['id'] == item['aluno_id']].iloc[0]
        
        enviar_email_notificacao(
            aluno['email'],
            'Item APO Devolvido',
            f"Seu item '{item['titulo']}' foi devolvido pelo orientador. Motivo: {comentario}"
        )
        
        return jsonify({
            'success': True,
            'message': 'Item devolvido ao aluno com justificativa'
        })
    
    if status == 'aprovado':
        items_df.loc[items_df['id'] == item_id, 'status'] = 'pendente_comissao'
        items_df.loc[items_df['id'] == item_id, 'pontos'] = pontos
        items_df.loc[items_df['id'] == item_id, 'data_aprovacao_orientador'] = datetime.now().strftime('%d/%m/%Y %H:%M')
        items_df.loc[items_df['id'] == item_id, 'comentario_orientador'] = comentario
        items_df.to_csv('data/items.csv', index=False)
        
        item = items_df[items_df['id'] == item_id].iloc[0]
        comissao = usuarios_df[usuarios_df['tipo'] == 'comissao'].iloc[0]
        
        enviar_email_notificacao(
            comissao['email'],
            'Novo Item APO para Validação',
            f"O item '{item['titulo']}' foi aprovado pelo orientador e aguarda validação da comissão."
        )
        
        return jsonify({
            'success': True,
            'message': 'Item aprovado e encaminhado à comissão'
        })

# ============= COMISSÃO =============
@app.route('/api/comissao/items-aprovados', methods=['GET'])
def get_items_comissao():
    items_df = pd.read_csv('data/items.csv')
    usuarios_df = pd.read_csv('data/usuarios.csv')
    
    pendentes = items_df[items_df['status'] == 'pendente_comissao']
    
    items_list = []
    for _, item in pendentes.iterrows():
        aluno = usuarios_df[usuarios_df['id'] == item['aluno_id']]
        aluno_nome = aluno.iloc[0]['nome'] if not aluno.empty else 'Desconhecido'
        
        items_list.append({
            'id': int(item['id']),
            'titulo': item['titulo'],
            'tipo': item['tipo'],
            'descricao': item['descricao'],
            'aluno_nome': aluno_nome,
            'pontos': int(item['pontos']),
            'data_submissao': item['data_submissao'],
            'data_aprovacao_orientador': item['data_aprovacao_orientador'],
            'comentario_orientador': item['comentario_orientador'] if pd.notna(item['comentario_orientador']) else '',
            'arquivo': item['arquivo'] if pd.notna(item['arquivo']) else None,
            'arquivo_url': f"http://localhost:5000/{item['arquivo']}" if pd.notna(item['arquivo']) and item['arquivo'] else None
        })
    
    return jsonify({'items': items_list})

@app.route('/api/comissao/validar-item', methods=['POST'])
def validar_item_comissao():
    data = request.json
    item_id = data.get('item_id')
    status = data.get('status')
    parecer = data.get('parecer', '')
    
    items_df = pd.read_csv('data/items.csv')
    usuarios_df = pd.read_csv('data/usuarios.csv')
    
    if status == 'devolvido_comissao':
        if not parecer:
            return jsonify({
                'success': False,
                'message': 'Parecer obrigatório para devolução'
            }), 400
        
        items_df.loc[items_df['id'] == item_id, 'status'] = 'devolvido_comissao'
        items_df.loc[items_df['id'] == item_id, 'comentario_comissao'] = parecer
        items_df.to_csv('data/items.csv', index=False)
        
        orientador = usuarios_df[usuarios_df['tipo'] == 'orientador'].iloc[0]
        item = items_df[items_df['id'] == item_id].iloc[0]
        
        enviar_email_notificacao(
            orientador['email'],
            'Item APO Devolvido pela Comissão',
            f"O item '{item['titulo']}' foi devolvido pela comissão. Motivo: {parecer}"
        )
        
        return jsonify({
            'success': True,
            'message': 'Item devolvido ao orientador'
        })
    
    if status == 'validado_comissao':
        items_df.loc[items_df['id'] == item_id, 'status'] = 'pendente_coordenacao'
        items_df.loc[items_df['id'] == item_id, 'data_aprovacao_comissao'] = datetime.now().strftime('%d/%m/%Y %H:%M')
        items_df.loc[items_df['id'] == item_id, 'comentario_comissao'] = parecer
        items_df.to_csv('data/items.csv', index=False)
        
        coordenacao = usuarios_df[usuarios_df['tipo'] == 'coordenacao'].iloc[0]
        item = items_df[items_df['id'] == item_id].iloc[0]
        
        enviar_email_notificacao(
            coordenacao['email'],
            'Novo Item APO para Validação Final',
            f"O item '{item['titulo']}' foi validado pela comissão e aguarda sua aprovação."
        )
        
        return jsonify({
            'success': True,
            'message': 'Item validado e encaminhado à coordenação'
        })

# ============= COORDENAÇÃO =============
@app.route('/api/coordenacao/items-validados', methods=['GET'])
def get_items_coordenacao():
    items_df = pd.read_csv('data/items.csv')
    usuarios_df = pd.read_csv('data/usuarios.csv')
    
    pendentes = items_df[items_df['status'] == 'pendente_coordenacao']
    
    items_list = []
    for _, item in pendentes.iterrows():
        aluno = usuarios_df[usuarios_df['id'] == item['aluno_id']]
        aluno_nome = aluno.iloc[0]['nome'] if not aluno.empty else 'Desconhecido'
        
        items_list.append({
            'id': int(item['id']),
            'titulo': item['titulo'],
            'tipo': item['tipo'],
            'descricao': item['descricao'],
            'aluno_nome': aluno_nome,
            'pontos': int(item['pontos']),
            'data_submissao': item['data_submissao'],
            'data_coordenacao': item.get('data_aprovacao_comissao', ''),
            'comentario_orientador': item['comentario_orientador'] if pd.notna(item['comentario_orientador']) else '',
            'comentario_comissao': item['comentario_comissao'] if pd.notna(item['comentario_comissao']) else '',
            'arquivo': item['arquivo'] if pd.notna(item['arquivo']) else None,
            'arquivo_url': f"http://localhost:5000/{item['arquivo']}" if pd.notna(item['arquivo']) and item['arquivo'] else None
        })
    
    return jsonify({'items': items_list})

@app.route('/api/coordenacao/aprovar-final', methods=['POST'])
def aprovar_final():
    data = request.json
    item_id = data.get('item_id')
    status = data.get('status')
    
    items_df = pd.read_csv('data/items.csv')
    usuarios_df = pd.read_csv('data/usuarios.csv')
    
    if status == 'devolvido_coordenacao':
        comentario = data.get('comentario', '')
        if not comentario:
            return jsonify({
                'success': False,
                'message': 'Comentário obrigatório para devolução'
            }), 400
        
        items_df.loc[items_df['id'] == item_id, 'status'] = 'devolvido_coordenacao'
        items_df.loc[items_df['id'] == item_id, 'comentario_coordenacao'] = comentario
        items_df.to_csv('data/items.csv', index=False)
        
        comissao = usuarios_df[usuarios_df['tipo'] == 'comissao'].iloc[0]
        item = items_df[items_df['id'] == item_id].iloc[0]
        
        enviar_email_notificacao(
            comissao['email'],
            'Item APO Devolvido pela Coordenação',
            f"O item '{item['titulo']}' foi devolvido pela coordenação. Motivo: {comentario}"
        )
        
        return jsonify({
            'success': True,
            'message': 'Item devolvido à comissão'
        })
    
    if status == 'aprovado_final':
        items_df.loc[items_df['id'] == item_id, 'status'] = 'aguardando_formalizacao'
        items_df.loc[items_df['id'] == item_id, 'data_aprovacao_coordenacao'] = datetime.now().strftime('%d/%m/%Y %H:%M')
        items_df.to_csv('data/items.csv', index=False)
        
        secretaria = usuarios_df[usuarios_df['tipo'] == 'secretaria'].iloc[0]
        item = items_df[items_df['id'] == item_id].iloc[0]
        
        enviar_email_notificacao(
            secretaria['email'],
            'Novo Item APO para Formalização',
            f"O item '{item['titulo']}' foi aprovado pela coordenação e está pronto para formalização."
        )
        
        return jsonify({
            'success': True,
            'message': 'Item aprovado e encaminhado para formalização'
        })

# ============= SECRETARIA =============
@app.route('/api/secretaria/items-aprovados', methods=['GET'])
def get_items_secretaria():
    try:
        items_df = pd.read_csv('data/items.csv')
        usuarios_df = pd.read_csv('data/usuarios.csv')
        
        # Converter matrículas para string
        usuarios_df['matricula'] = usuarios_df['matricula'].astype(str)
        items_df['aluno_matricula'] = items_df['aluno_matricula'].astype(str)
        
        pendentes = items_df[items_df['status'].isin(['aguardando_formalizacao', 'aprovado_final'])]
        
        items_list = []
        for _, item in pendentes.iterrows():
            aluno = usuarios_df[usuarios_df['id'] == item['aluno_id']]
            aluno_nome = str(aluno.iloc[0]['nome']) if not aluno.empty else 'Desconhecido'
            aluno_email = str(aluno.iloc[0]['email']) if not aluno.empty else ''
            aluno_matricula = str(aluno.iloc[0]['matricula']) if not aluno.empty else str(item.get('aluno_matricula', ''))
            
            items_list.append({
                'id': int(item['id']) if pd.notna(item['id']) else 0,
                'titulo': str(item['titulo']) if pd.notna(item['titulo']) else '',
                'tipo': str(item['tipo']) if pd.notna(item['tipo']) else '',
                'descricao': str(item['descricao']) if pd.notna(item['descricao']) else '',
                'aluno_nome': aluno_nome,
                'aluno_email': aluno_email,
                'aluno_id': int(item['aluno_id']) if pd.notna(item['aluno_id']) else 0,
                'aluno_matricula': aluno_matricula,
                'pontos': int(item['pontos']) if pd.notna(item['pontos']) else 0,
                'data_submissao': str(item['data_submissao']) if pd.notna(item['data_submissao']) else '',
                'data_coordenacao': str(item.get('data_aprovacao_coordenacao', '')) if pd.notna(item.get('data_aprovacao_coordenacao', '')) else '',
                'arquivo': str(item['arquivo']) if pd.notna(item['arquivo']) and item['arquivo'] else None,
                'arquivo_url': f"http://localhost:5000/{item['arquivo']}" if pd.notna(item['arquivo']) and item['arquivo'] else None,
                'arquivo_assinado': str(item.get('arquivo_assinado', '')) if pd.notna(item.get('arquivo_assinado', '')) and item.get('arquivo_assinado', '') else '',
                'arquivo_assinado_url': f"http://localhost:5000/{item['arquivo_assinado']}" if pd.notna(item.get('arquivo_assinado', '')) and item.get('arquivo_assinado', '') else None
            })
        
        return jsonify({'items': items_list})
    except Exception as e:
        print(f"❌ Erro em get_items_secretaria: {e}")
        return jsonify({'error': str(e), 'items': []}), 500

@app.route('/api/secretaria/upload-assinado', methods=['POST'])
def upload_assinado():
    try:
        print("\n📤 Recebendo upload de arquivo assinado...")
        
        item_id = request.form.get('item_id')
        aluno_matricula = request.form.get('aluno_matricula')
        
        print(f"  Item ID: {item_id}")
        print(f"  Matrícula: {aluno_matricula}")
        
        if not item_id:
            return jsonify({
                'success': False,
                'message': 'ID do item não fornecido'
            }), 400
        
        if 'arquivo_assinado' not in request.files:
            return jsonify({
                'success': False,
                'message': 'Nenhum arquivo enviado'
            }), 400
        
        file = request.files['arquivo_assinado']
        
        if file.filename == '':
            return jsonify({
                'success': False,
                'message': 'Arquivo sem nome'
            }), 400
        
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            filename = f"assinado_{timestamp}_{filename}"
            arquivo_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(arquivo_path)
            
            print(f"  ✅ Arquivo assinado salvo: {arquivo_path}")
            
            items_df = pd.read_csv('data/items.csv')
            items_df.loc[items_df['id'] == int(item_id), 'arquivo_assinado'] = arquivo_path
            items_df.loc[items_df['id'] == int(item_id), 'status'] = 'aprovado_final'
            items_df.to_csv('data/items.csv', index=False)
            
            # Atualizar pontos do aluno
            item = items_df[items_df['id'] == int(item_id)].iloc[0]
            usuarios_df = pd.read_csv('data/usuarios.csv')
            usuarios_df.loc[usuarios_df['id'] == item['aluno_id'], 'pontos_total'] += item['pontos']
            usuarios_df.to_csv('data/usuarios.csv', index=False)
            
            return jsonify({
                'success': True,
                'message': 'Arquivo assinado enviado com sucesso',
                'arquivo_path': arquivo_path
            })
        else:
            return jsonify({
                'success': False,
                'message': 'Tipo de arquivo não permitido'
            }), 400
            
    except Exception as e:
        print(f"❌ Erro ao fazer upload: {e}")
        return jsonify({
            'success': False,
            'message': f'Erro ao processar arquivo: {str(e)}'
        }), 500

@app.route('/api/secretaria/arquivos-aluno/<matricula>', methods=['GET'])
def get_arquivos_aluno(matricula):
    try:
        items_df = pd.read_csv('data/items.csv')
        usuarios_df = pd.read_csv('data/usuarios.csv')
        
        # Buscar aluno pela matrícula
        aluno = usuarios_df[usuarios_df['matricula'] == matricula]
        
        if aluno.empty:
            return jsonify({
                'error': 'Aluno não encontrado',
                'arquivos': []
            }), 404
        
        aluno_id = aluno.iloc[0]['id']
        
        # Buscar todos os items do aluno
        aluno_items = items_df[items_df['aluno_id'] == aluno_id]
        
        arquivos_list = []
        for _, item in aluno_items.iterrows():
            arquivos_list.append({
                'id': int(item['id']),
                'titulo': item['titulo'],
                'tipo': item['tipo'],
                'pontos': int(item['pontos']),
                'status': item['status'],
                'data_submissao': item['data_submissao'],
                'arquivo': item['arquivo'] if pd.notna(item['arquivo']) else None,
                'arquivo_url': f"http://localhost:5000/{item['arquivo']}" if pd.notna(item['arquivo']) and item['arquivo'] else None,
                'arquivo_assinado': item.get('arquivo_assinado', ''),
                'arquivo_assinado_url': f"http://localhost:5000/{item['arquivo_assinado']}" if pd.notna(item.get('arquivo_assinado', '')) and item.get('arquivo_assinado', '') else None
            })
        
        return jsonify({'arquivos': arquivos_list})
        
    except Exception as e:
        print(f"❌ Erro ao buscar arquivos do aluno: {e}")
        return jsonify({
            'error': str(e),
            'arquivos': []
        }), 500

@app.route('/api/secretaria/assinaturas/<int:item_id>', methods=['GET'])
def get_assinaturas(item_id):
    assinaturas_df = pd.read_csv('data/assinaturas.csv')
    
    if assinaturas_df[assinaturas_df['item_id'] == item_id].empty:
        usuarios_df = pd.read_csv('data/usuarios.csv')
        items_df = pd.read_csv('data/items.csv')
        item = items_df[items_df['id'] == item_id].iloc[0]
        
        coordenador = usuarios_df[usuarios_df['tipo'] == 'coordenacao'].iloc[0]
        orientador = usuarios_df[usuarios_df['tipo'] == 'orientador'].iloc[0]
        aluno = usuarios_df[usuarios_df['id'] == item['aluno_id']].iloc[0]
        
        novo_id_base = len(assinaturas_df) + 1
        
        novas_assinaturas = [
            {
                'id': novo_id_base,
                'item_id': item_id,
                'usuario_id': coordenador['id'],
                'nome': coordenador['nome'],
                'cargo': 'Coordenador',
                'status': 'pendente',
                'data_assinatura': ''
            },
            {
                'id': novo_id_base + 1,
                'item_id': item_id,
                'usuario_id': orientador['id'],
                'nome': orientador['nome'],
                'cargo': 'Orientador',
                'status': 'pendente',
                'data_assinatura': ''
            },
            {
                'id': novo_id_base + 2,
                'item_id': item_id,
                'usuario_id': aluno['id'],
                'nome': aluno['nome'],
                'cargo': 'Aluno',
                'status': 'pendente',
                'data_assinatura': ''
            }
        ]
        
        assinaturas_df = pd.concat([assinaturas_df, pd.DataFrame(novas_assinaturas)], ignore_index=True)
        assinaturas_df.to_csv('data/assinaturas.csv', index=False)
    
    assinaturas = assinaturas_df[assinaturas_df['item_id'] == item_id]
    assinaturas_list = assinaturas.to_dict('records')
    
    return jsonify({'assinaturas': assinaturas_list})

@app.route('/api/secretaria/enviar-lembrete', methods=['POST'])
def enviar_lembrete():
    data = request.json
    item_id = data.get('item_id')
    
    assinaturas_df = pd.read_csv('data/assinaturas.csv')
    usuarios_df = pd.read_csv('data/usuarios.csv')
    
    pendentes = assinaturas_df[
        (assinaturas_df['item_id'] == item_id) & 
        (assinaturas_df['status'] == 'pendente')
    ]
    
    for _, ass in pendentes.iterrows():
        usuario = usuarios_df[usuarios_df['id'] == ass['usuario_id']].iloc[0]
        enviar_email_notificacao(
            usuario['email'],
            'Lembrete: Assinatura Pendente - DocuSign',
            f"Prezado(a) {ass['nome']}, você tem uma assinatura pendente no sistema APO."
        )
    
    return jsonify({
        'success': True,
        'message': f'{len(pendentes)} lembrete(s) enviado(s)'
    })

@app.route('/api/secretaria/finalizar-item', methods=['POST'])
def finalizar_item():
    data = request.json
    item_id = data.get('item_id')
    
    items_df = pd.read_csv('data/items.csv')
    usuarios_df = pd.read_csv('data/usuarios.csv')
    assinaturas_df = pd.read_csv('data/assinaturas.csv')
    
    pendentes = assinaturas_df[
        (assinaturas_df['item_id'] == item_id) & 
        (assinaturas_df['status'] == 'pendente')
    ]
    
    if not pendentes.empty:
        return jsonify({
            'success': False,
            'message': 'Aguardando conclusão de todas as assinaturas'
        }), 400
    
    item = items_df[items_df['id'] == item_id].iloc[0]
    items_df.loc[items_df['id'] == item_id, 'status'] = 'aprovado_final'
    items_df.to_csv('data/items.csv', index=False)
    
    aluno_id = item['aluno_id']
    usuarios_df.loc[usuarios_df['id'] == aluno_id, 'pontos_total'] += item['pontos']
    
    pontos_totais = usuarios_df.loc[usuarios_df['id'] == aluno_id, 'pontos_total'].values[0]
    
    if pontos_totais >= 12:
        print(f"\n🎓 REGISTRO ACADÊMICO: Aluno {item['aluno_id']} atingiu {pontos_totais} pontos")
        print("Sistema acadêmico atualizado automaticamente\n")
    
    usuarios_df.to_csv('data/usuarios.csv', index=False)
    
    aluno = usuarios_df[usuarios_df['id'] == aluno_id].iloc[0]
    enviar_email_notificacao(
        aluno['email'],
        'Item APO Aprovado e Registrado',
        f"Parabéns! Seu item '{item['titulo']}' foi aprovado. Você possui agora {pontos_totais} pontos APO."
    )
    
    return jsonify({
        'success': True,
        'message': f"Item '{item['titulo']}' finalizado e pontos atualizados"
    })

if __name__ == '__main__':
    print("🚀 Servidor Flask iniciando na porta 5000...")
    print("📊 Rotas disponíveis:")
    print("  - POST /api/login")
    print("  - GET  /api/aluno/dashboard")
    print("  - POST /api/aluno/submit-item")
    print("  - GET  /api/orientador/items-pendentes")
    print("  - POST /api/orientador/avaliar-item")
    print("  - GET  /api/comissao/items-aprovados")
    print("  - POST /api/comissao/validar-item")
    print("  - GET  /api/coordenacao/items-validados")
    print("  - POST /api/coordenacao/aprovar-final")
    print("  - GET  /api/secretaria/items-aprovados")
    print("  - POST /api/secretaria/upload-assinado")
    print("  - GET  /api/secretaria/arquivos-aluno/<matricula>")
    print("  - GET  /api/secretaria/assinaturas/<id>")
    print("  - POST /api/secretaria/enviar-lembrete")
    print("  - POST /api/secretaria/finalizar-item")
    print("  - GET  /uploads/<filename>")
    app.run(debug=True, port=5000, host='0.0.0.0')