"use strict"
const urlsContiner = document.getElementById('urlsContainer')

fetch('/api/geturls')
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
    let count = 0
    data.forEach(i => {
      count++
        urlsContiner.innerHTML += `<div class="containerUrl">
        <div class="subContainer">
            <a href="/s/${i.url_recortada}" target="_blanc" class="url1">short--link/s/${i.url_recortada} <i class="fa-solid fa-link url"></i></a>
            <a href="https://${i.url_original}" target="_blanc" class="url2">${i.url_original} <i class="fa-solid fa-link url"></i></a>
        </div>
        <img class="qr" src="https://apiqr.vercel.app/qr/short--link.verce.app" alt="">
        <i class="fa-solid fa-trash trash"onclick="deleteUrl(${i.id})"></i>
    </div>`///s/${i.url_recortada}
    });
    if (count < 10){
      urlsContiner.innerHTML += `<form class="form" action="/api/createurl" method="post">
      <div>
      <input type="text" name="url_recortada" placeholder="Short Url">
      <input type="text" name="url_original" placeholder="Url">
      </div>
      <button type="submit"><i class="fa-solid fa-check"></i></button>
  </form>`
    }  
  })
  .catch(error => {
    console.error('Error:', error);
  });
const deleteUrl = (id) =>{
  console.log(id)
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', // Tipo de contenido (JSON en este caso)
    },
    body: JSON.stringify({id: id}), // Convierte el objeto a una cadena JSON
  };
  fetch('/api/deleteurls', requestOptions)
  .then(response => response.json())
  .then(data => {
    console.log('Respuesta del servidor:', data);
    location.reload()
    // Puedes manejar la respuesta del servidor aquí
  })
  .catch(error => {
    console.error('Error al enviar la solicitud:', error);
  });
}