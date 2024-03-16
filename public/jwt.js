"use strict"
const aSignup = document.getElementById('aSingup')
const aLogin = document.getElementById('aLogin')


fetch('/api/protected')
  .then(response => {
    // Verifica si la respuesta es exitosa (código de estado HTTP 200-299)
    if (!response.ok) {
      throw new Error('Hubo un problema con la petición.');
    }
    // Parsea la respuesta JSON
    return response.json();
  })
  .then(data => {
    // Muestra los datos en la consola
    console.log(data);
    if (data.auth){
      aSignup.textContent = 'AUTH: TRUE'
      aLogin.textContent = data.id.usuario.nombre_usuario
      const info = data.id
    }    
  })
  .catch(error => {
    console.error('Error:', error);
  });
