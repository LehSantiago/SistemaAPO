export async function POST(request) {
  try {
    const body = await request.json();
    
    const response = await fetch('http://localhost:5000/api/comissao/validar-item', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    
    const data = await response.json();
    
    if (response.ok) {
      return Response.json(data);
    } else {
      return Response.json(data, { status: response.status });
    }
  } catch (error) {
    console.error('Erro ao validar item:', error);
    return Response.json({ 
      success: false,
      error: 'Erro ao validar item' 
    }, { status: 500 });
  }
}