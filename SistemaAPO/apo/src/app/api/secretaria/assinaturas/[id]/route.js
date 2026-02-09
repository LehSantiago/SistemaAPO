export async function GET(request, { params }) {
  try {
    const id = params.id;
    const response = await fetch(`http://localhost:5000/api/secretaria/assinaturas/${id}`);
    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Erro ao carregar assinaturas:', error);
    return Response.json({ 
      error: 'Erro ao carregar assinaturas',
      assinaturas: []
    }, { status: 500 });
  }
}
