const formulario = document.getElementById("formulario");
const tabla = document.getElementById("tabla").querySelector("tbody");

formulario.addEventListener("submit", function(e) {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const identificador = document.getElementById("identificador").value;
  const cedula = document.getElementById("cedula").value;
  const tanda_laboral = document.getElementById("tanda_laboral").value;
  const especialidad = document.getElementById("especialidad").value;
  const estado = document.getElementById("estado").value;


  const fila = document.createElement("tr");

  fila.innerHTML = `
    <td>${nombre}</td>
    <td>${identificador}</td>
    <td>${cedula}</td>
    <td>${tanda_laboral}</td>
    <td>${especialidad}</td>
    <td>${estado}</td>
  `;

  // Al hacer clic en la fila, se oculta o muestra
  fila.addEventListener("click", () => {
    fila.classList.toggle("oculto");
  });

  tabla.appendChild(fila);
  formulario.reset();
});
