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
            <a href="/s/${i.url_recortada}" target="_blanc" class="url1">short--link/s/${i.url_recortada}</a>
            <a href="https://${i.url_original}" target="_blanc" class="url2">${i.url_original}</a>
        </div>
        <img class="qr" src="https://apiqr.vercel.app/qr/short--link.verce.app" alt="">
    </div>`///s/${i.url_recortada}
    });
    if (count < 10){
      urlsContiner.innerHTML += `<form class="form" action="/api/createurl" method="post">
      <div>
      <input type="text" name="url_recortada">
      <input type="text" name="url_original">
      </div>
      <button type="submit">enviar</button>
  </form>`
    }  
  })
  .catch(error => {
    console.error('Error:', error);
  });
