// src/app/api/secretaria/arquivos-aluno/[matricula]/route.js
export async function GET(request, { params }) {
  try {
    const matricula = params.matricula;
    const response = await fetch(`http://localhost:5000/api/secretaria/arquivos-aluno/${matricula}`);
    const data = await response.json();
    
    // Garantir URLs completas e corretas
    if (data.arquivos && Array.isArray(data.arquivos)) {
      data.arquivos = data.arquivos.map(arq => {
        // Normalizar caminhos de arquivo
        const normalizeFile = (file) => {
          if (!file) return null;
          return file.replace('uploads/', '').replace('uploads\\', '');
        };
        
        return {
          ...arq,
          arquivo: normalizeFile(arq.arquivo),
          arquivo_url: arq.arquivo ? `http://localhost:5000/uploads/${normalizeFile(arq.arquivo)}` : null,
          arquivo_assinado: normalizeFile(arq.arquivo_assinado),
          arquivo_assinado_url: arq.arquivo_assinado ? `http://localhost:5000/uploads/${normalizeFile(arq.arquivo_assinado)}` : null
        };
      });
    }
    
    return Response.json(data);
  } catch (error) {
    console.error('Erro ao carregar arquivos:', error);
    return Response.json({ 
      error: 'Erro ao carregar arquivos',
      arquivos: []
    }, { status: 500 });
  }
}