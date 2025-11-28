// src/app/api/coordenacao/items-validados/route.js
export async function GET(request) {
  try {
    const response = await fetch(`http://localhost:5000/api/secretaria/assinaturas/${id}`);
    const data = await response.json();
    
    // Garantir que os arquivos estejam com o caminho correto
    if (data.items && Array.isArray(data.items)) {
      data.items = data.items.map(item => ({
        ...item,
        arquivo: item.arquivo ? item.arquivo : null,
        arquivo_url: item.arquivo ? `http://localhost:5000/${item.arquivo}` : null
      }));
    }
    
    return Response.json(data);
  } catch (error) {
    console.error('Erro ao carregar documento assinado', error);
    return Response.json({ 
      error: 'Erro ao carregar itens',
      items: []
    }, { status: 500 });
  }
}