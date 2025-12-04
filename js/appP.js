const formulario = document.getElementById("formulario");
const tabla = document.getElementById("tabla").querySelector("tbody");

formulario.addEventListener("submit", function(e) {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const cedula = document.getElementById("cedula").value;
  const identificador = document.getElementById("identificador").value;
  const tipoP = document.getElementById("tipo").value;
  const estado = document.getElementById("Estado").value;
  const doctor = document.getElementById("Doctor").value;

  const fila = document.createElement("tr");

  fila.innerHTML = `
    <td>${nombre}</td>
    <td>${cedula}</td>
    <td>${identificador}</td>
    <td>${tipoP}</td>
    <td>${estado}</td>
    <td>${doctor}</td>
  `;

  // Al hacer clic en la fila, se oculta o muestra
  fila.addEventListener("click", () => {
    fila.classList.toggle("oculto");
  });

  tabla.appendChild(fila);
  formulario.reset();
});
