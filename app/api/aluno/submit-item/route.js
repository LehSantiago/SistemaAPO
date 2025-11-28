export async function POST(request) {
  try {
    const formData = await request.formData();
    
    // Log para debug
    console.log('Dados recebidos:');
    for (let [key, value] of formData.entries()) {
      console.log(key, ':', value instanceof File ? value.name : value);
    }
    
    const response = await fetch('http://localhost:5000/api/aluno/submit-item', {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    
    if (response.ok) {
      return Response.json(data);
    } else {
      return Response.json(data, { status: response.status });
    }
  } catch (error) {
    console.error('Erro ao submeter item:', error);
    return Response.json({ 
      success: false,
      error: 'Erro ao submeter item' 
    }, { status: 500 });
  }
}