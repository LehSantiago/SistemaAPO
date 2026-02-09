# Manual de Implantação - Sistema APO

## 1. Introdução

Este manual descreve o procedimento completo para implantação do Sistema APO (Atividades Práticas Orientadas), desde os requisitos de infraestrutura até a validação do funcionamento da aplicação.

---

## 2. Requisitos de Hardware

### 2.1 Servidor de Aplicação

**Configuração Mínima:**
- Processador: 2 cores (2.0 GHz)
- Memória RAM: 4 GB
- Armazenamento: 20 GB SSD
- Rede: 100 Mbps

**Configuração Recomendada:**
- Processador: 4 cores (2.5 GHz ou superior)
- Memória RAM: 8 GB
- Armazenamento: 50 GB SSD
- Rede: 1 Gbps

### 2.2 Estação de Desenvolvimento

- Processador: Intel i5 ou equivalente
- Memória RAM: 8 GB (mínimo)
- Armazenamento: 10 GB disponíveis
- Sistema Operacional: Windows 10+, macOS 10.15+, ou Linux (Ubuntu 20.04+)

---

## 3. Requisitos de Software

### 3.1 Dependências Obrigatórias

#### Node.js
- **Versão:** 18.0 ou superior
- **Download:** https://nodejs.org/
- **Verificação:**
```bash
node --version  # Deve retornar v18.x.x ou superior
npm --version   # Deve retornar 9.x.x ou superior
```

#### Python
- **Versão:** 3.8 ou superior
- **Download:** https://www.python.org/downloads/
- **Verificação:**
```bash
python --version  # ou python3 --version
pip --version     # ou pip3 --version
```

### 3.2 Gerenciadores de Pacotes

- **npm** (incluído com Node.js) ou **yarn**
- **pip** (incluído com Python)

### 3.3 Ferramentas Recomendadas

- **Git:** Para controle de versão
- **Visual Studio Code:** Editor de código
- **Postman:** Para testes de API (opcional)

---

## 4. Preparação do Ambiente

### 4.1 Clonagem do Repositório

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/sistema-apo.git

# Acesse o diretório
cd sistema-apo
```

### 4.2 Estrutura de Diretórios

Verifique se a estrutura está completa:

```
sistema-apo/
├── app/
│   ├── api/                    # API Routes (Next.js)
│   ├── backend/                # Backend Flask
│   │   ├── app.py
│   │   ├── data/
│   │   │   ├── usuarios.csv
│   │   │   ├── items.csv
│   │   │   └── assinaturas.csv
│   │   └── uploads/
│   ├── dashboard/              # Dashboards por perfil
│   ├── login/                  # Páginas de login
│   ├── globals.css
│   ├── layout.js
│   └── page.js
├── docs/                       # Documentação
├── package.json
└── README.md
```

---

## 5. Instalação do Backend (Flask)

### 5.1 Criar Ambiente Virtual (Recomendado)

```bash
# Navegue até o diretório do backend
cd app/backend

# Crie o ambiente virtual
python -m venv venv

# Ative o ambiente virtual

# Windows:
venv\Scripts\activate

# Linux/macOS:
source venv/bin/activate
```

### 5.2 Instalar Dependências

```bash
# Instale as bibliotecas necessárias
pip install flask==3.0.0
pip install flask-cors==4.0.0
pip install pandas==2.1.0
pip install werkzeug==3.0.0
```

**Ou crie um arquivo `requirements.txt`:**

```txt
flask==3.0.0
flask-cors==4.0.0
pandas==2.1.0
werkzeug==3.0.0
```

E instale com:
```bash
pip install -r requirements.txt
```

### 5.3 Criar Diretórios Necessários

```bash
# Certifique-se de que as pastas existem
mkdir -p data
mkdir -p uploads
```

### 5.4 Iniciar o Servidor Backend

```bash
# No diretório app/backend
python app.py
```

**Saída esperada:**
```
 * Running on http://127.0.0.1:5000
 * Restarting with stat
 * Debugger is active!
```

**Mantenha este terminal aberto durante toda a execução.**

---

## 6. Instalação do Frontend (Next.js)

### 6.1 Instalar Dependências

Abra um **novo terminal** e execute:

```bash
# Navegue até o diretório raiz do app
cd app

# Instale as dependências
npm install
```

Isso instalará:
- Next.js 14.0
- React 18
- Outras dependências do package.json

### 6.2 Verificar Instalação

```bash
# Verifique se node_modules foi criado
ls -la node_modules  # ou dir node_modules (Windows)
```

---

## 7. Configuração da Aplicação

### 7.1 Variáveis de Ambiente (Opcional)

Crie um arquivo `.env.local` na raiz de `app/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 7.2 Configuração de CORS

No arquivo `app/backend/app.py`, verifique:

```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:3000"],
        "methods": ["GET", "POST", "PUT", "DELETE"],
        "allow_headers": ["Content-Type"]
    }
})
```

### 7.3 Dados Iniciais

O sistema cria automaticamente os arquivos CSV com dados de teste na primeira execução. Usuários padrão:

| Tipo | E-mail | Senha |
|------|--------|-------|
| Aluno | aluno@teste.com | 123456 |
| Orientador | orientador@teste.com | 123456 |
| Comissão | comissao@teste.com | 123456 |
| Coordenação | coordenacao@teste.com | 123456 |
| Secretaria | secretaria@teste.com | 123456 |

---

## 8. Execução da Aplicação

### 8.1 Iniciar o Frontend

Em um novo terminal:

```bash
cd app
npm run dev
```

**Saída esperada:**
```
- ready started server on 0.0.0.0:3000, url: http://localhost:3000
- event compiled client and server successfully
```

### 8.2 Verificar Serviços

Você deve ter **2 terminais ativos**:

1. **Terminal 1 (Backend):** `python app.py` na porta 5000
2. **Terminal 2 (Frontend):** `npm run dev` na porta 3000

---

## 9. Validação da Instalação

### 9.1 Teste de Acesso

1. Abra o navegador em: **http://localhost:3000**
2. Você deve ver a página inicial do Sistema APO

### 9.2 Teste de Login

1. Clique em "Login Aluno"
2. Use as credenciais:
   - E-mail: `aluno@teste.com`
   - Senha: `123456`
3. Você deve ser redirecionado para o dashboard do aluno

### 9.3 Teste de API

Teste diretamente a API do backend:

```bash
# Teste de health check
curl http://localhost:5000/

# Teste de login
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"aluno@teste.com","senha":"123456","tipo":"aluno"}'
```

### 9.4 Teste de Upload

1. Faça login como aluno
2. Clique em "Submeter Nova Atividade"
3. Preencha o formulário
4. Faça upload de um arquivo PDF
5. Verifique se o arquivo aparece em `app/backend/uploads/`

---

## 10. Implantação em Produção

### 10.1 Build do Frontend

```bash
cd app
npm run build
```

Isso gera uma versão otimizada em `.next/`

### 10.2 Iniciar em Modo Produção

```bash
npm start
```

### 10.3 Servidor Backend para Produção

**Não use o servidor Flask embutido em produção!**

**Opção 1: Gunicorn**

```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

**Opção 2: uWSGI**

```bash
pip install uwsgi
uwsgi --http :5000 --wsgi-file app.py --callable app
```

### 10.4 Proxy Reverso (Nginx)

Exemplo de configuração Nginx:

```nginx
server {
    listen 80;
    server_name seudominio.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Uploads
    location /uploads {
        proxy_pass http://localhost:5000/uploads;
    }
}
```

### 10.5 SSL/TLS (HTTPS)

Use **Certbot** para obter certificado Let's Encrypt:

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d seudominio.com
```

---

## 11. Configurações de Segurança

### 11.1 Firewall

```bash
# Permita apenas portas necessárias
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 11.2 Permissões de Arquivos

```bash
# Backend
chmod 755 app/backend
chmod 644 app/backend/data/*.csv
chmod 755 app/backend/uploads

# Proprietário correto
chown -R www-data:www-data app/backend/uploads
```

### 11.3 Variáveis de Ambiente

Em produção, use variáveis de ambiente reais:

```bash
export FLASK_ENV=production
export SECRET_KEY=sua-chave-secreta-aqui
export DATABASE_URL=postgresql://user:pass@localhost/apo_db
```

---

## 12. Banco de Dados (Migração Futura)

### 12.1 PostgreSQL

```bash
# Instalar PostgreSQL
sudo apt install postgresql postgresql-contrib

# Criar banco
sudo -u postgres createdb apo_database

# Criar usuário
sudo -u postgres createuser apo_user -P
```

### 12.2 Script de Migração

Para migrar dados de CSV para PostgreSQL:

```python
import pandas as pd
import psycopg2

# Conectar ao banco
conn = psycopg2.connect(
    dbname="apo_database",
    user="apo_user",
    password="senha",
    host="localhost"
)

# Migrar usuários
df = pd.read_csv('data/usuarios.csv')
df.to_sql('usuarios', conn, if_exists='replace', index=False)

# Migrar items
df = pd.read_csv('data/items.csv')
df.to_sql('items', conn, if_exists='replace', index=False)
```

---

## 13. Monitoramento e Logs

### 13.1 Logs do Backend

Adicione logging em `app.py`:

```python
import logging

logging.basicConfig(
    filename='app.log',
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
```

### 13.2 Logs do Frontend

Next.js gera logs automaticamente no terminal.

### 13.3 PM2 para Gerenciamento de Processos

```bash
# Instalar PM2
npm install -g pm2

# Iniciar aplicações
pm2 start npm --name "frontend" -- start
pm2 start app.py --name "backend" --interpreter python3

# Ver status
pm2 status

# Ver logs
pm2 logs

# Reiniciar automaticamente
pm2 startup
pm2 save
```

---

## 14. Backup e Recuperação

### 14.1 Backup dos Dados

```bash
# Script de backup diário
#!/bin/bash
BACKUP_DIR="/backups/apo_$(date +%Y%m%d)"
mkdir -p $BACKUP_DIR

# Backup dos CSVs
cp -r app/backend/data $BACKUP_DIR/
cp -r app/backend/uploads $BACKUP_DIR/

# Compactar
tar -czf $BACKUP_DIR.tar.gz $BACKUP_DIR
rm -rf $BACKUP_DIR
```

### 14.2 Recuperação

```bash
# Descompactar backup
tar -xzf /backups/apo_20241128.tar.gz

# Restaurar dados
cp -r apo_20241128/data app/backend/
cp -r apo_20241128/uploads app/backend/
```

---

## 15. Troubleshooting

### 15.1 Porta Já em Uso

**Erro:** `Address already in use: 5000`

**Solução:**
```bash
# Linux/macOS
lsof -ti:5000 | xargs kill -9

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### 15.2 Módulo Não Encontrado

**Erro:** `ModuleNotFoundError: No module named 'flask'`

**Solução:**
```bash
# Ative o ambiente virtual
source venv/bin/activate  # Linux/macOS
venv\Scripts\activate     # Windows

# Reinstale dependências
pip install -r requirements.txt
```

### 15.3 CORS Error

**Erro:** `Access to fetch blocked by CORS policy`

**Solução:**
Verifique em `app/backend/app.py`:
```python
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
```

### 15.4 Arquivo Não Encontrado no Upload

**Erro:** `FileNotFoundError: uploads/arquivo.pdf`

**Solução:**
```bash
# Criar diretório de uploads
mkdir -p app/backend/uploads

# Verificar permissões
chmod 755 app/backend/uploads
```

---

## 16. Implantação

### Desenvolvimento
- Node.js 18+ instalado
- Python 3.8+ instalado
- Repositório clonado
- Dependências do backend instaladas
- Dependências do frontend instaladas
- Backend rodando na porta 5000
- Frontend rodando na porta 3000
- Dados de teste criados
- Login funcional

### Produção
- Servidor configurado
- Build do frontend gerado
- Backend com Gunicorn/uWSGI
- Nginx configurado como proxy
- SSL/TLS configurado (HTTPS)
- Firewall configurado
- Variáveis de ambiente definidas
- PM2 ou systemd configurado
- Backup automatizado
- Monitoramento ativo
- Testes de carga realizados
