export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const aluno_id = searchParams.get('aluno_id') || '1';
    
    console.log('Buscando dashboard para aluno_id:', aluno_id);
    
    const response = await fetch(`http://localhost:5000/api/aluno/dashboard?aluno_id=${aluno_id}`);
    const data = await response.json();
    
    console.log('Resposta do backend:', data);
    
    return Response.json(data);
  } catch (error) {
    console.error('Erro ao carregar dashboard:', error);
    return Response.json({ 
      error: 'Erro ao carregar dashboard',
      stats: {
        pontosAtual: 0,
        pontosTotal: 12,
        pendentes: 0,
        aprovados: 0
      },
      items: []
    }, { status: 500 });
  }
}
