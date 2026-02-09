// src/app/api/secretaria/upload-assinado/route.js
export async function POST(request) {
  try {
    const formData = await request.formData();
    
    console.log('📤 Recebendo upload de arquivo assinado...');
    for (let [key, value] of formData.entries()) {
      console.log(key, ':', value instanceof File ? value.name : value);
    }
    
    const response = await fetch('http://localhost:5000/api/secretaria/upload-assinado', {
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
    console.error('Erro ao fazer upload:', error);
    return Response.json({ 
      success: false,
      error: 'Erro ao fazer upload do arquivo assinado' 
    }, { status: 500 });
  }
}