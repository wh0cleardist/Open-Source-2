// appL.js
function Acceder() {
  // Obtener valores de los inputs
  const usuario = document.getElementById("UsuarioID").value.trim();
  const password = document.getElementById("PaswordID").value.trim();
  const resultado = document.getElementById("resultado");

  // Validar que no estén vacíos
  if (usuario === "" || password === "") {
    resultado.textContent = "Por favor, ingrese usuario y contraseña.";
    resultado.style.color = "red";
    return;
  } else if(usuario=="invitado" && password=="invitado123"){
    resultado.textContent = "Acceso concedido. Redirigiendo...";
     resultado.textContent = `Validando.......`;
    resultado.style.color = "green";
  }else if(usuario=="admin" && password=="admin123"){
    resultado.textContent = "Acceso total concedido. Redirigiendo...";
     resultado.textContent = `Validando.......`;
    resultado.style.color = "blue";
  }else{
    resultado.textContent = "Usuario o contraseña incorrectos.";
    resultado.style.color = "red";
    return;
  }

  // Página destino
  const destino = "index.html";

  // Redirigir después de un pequeño retraso (2 segundos)
  setTimeout(() => {
    window.location.href = destino;
  }, 2000);
}
