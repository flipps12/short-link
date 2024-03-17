"use strict"
const urlsContiner = document.getElementById('urlsContainer');

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
        <div class="qrContainer">
          <img class="qr" src="https://apiqr.vercel.app/qr/short--link.verce.app" alt="">
          <a class="openQr" href="#"><i class="fa-solid fa-arrow-up-right-from-square"></i></a>
        </div>
        <i class="fa-solid fa-trash trash"onclick="deleteUrl(${i.id})"></i>
    </div>`///s/${i.url_recortada}
    });
    if (count < 10){
      urlsContiner.innerHTML += `<form class="form" action="">
      <div>
      <input id="inputShortUrl" type="text" name="url_recortada" placeholder="Short Url">
      <input id="inputUrl" type="text" name="url_original" placeholder="Url">
      </div>
      <label id="labelError"></label>
      <div class="button" onclick="addUrl()"><i class="fa-solid fa-check"></i></div>
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
const addUrl = async () =>{
  const inputShortUrl = document.getElementById('inputShortUrl').value;
  const inputUrl = document.getElementById('inputUrl').value;
  const labelError = document.getElementById('labelError');
  if (inputUrl == '' || inputShortUrl == ''){
    labelError.textContent = 'Completa los campos'
    return
  }
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', // Tipo de contenido (JSON en este caso)
    },
    body: JSON.stringify({ url_original: await inputUrl, url_recortada: await inputShortUrl }), // Convierte el objeto a una cadena JSON
  };
  fetch('/api/createurl', requestOptions)
  .then(response => response.json())
  .then(data => {
    console.log(data.status)
    if (data.status) {
      location.reload()
    }
    else if (data.status = 'registered'){
      labelError.textContent = "Url en uso"
      return
    } else if (data.status = 'error'){
      labelError.textContent = "Internal server Error"
      //location.reload()
    }
    // Puedes manejar la respuesta del servidor aquí
  })
  .catch(error => {
    console.error('Error al enviar la solicitud:', error);
  });
}