const formulario = document.getElementById("formulario");
const tabla = document.getElementById("tabla").querySelector("tbody");

formulario.addEventListener("submit", function(e) {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const tipo = document.getElementById("tipo").value;
  const marca = document.getElementById("marca").value;
  const estado = document.getElementById("Estado").value;

  const fila = document.createElement("tr");

  fila.innerHTML = `
    <td>${nombre}</td>
    <td>${tipo}</td>
    <td>${marca}</td>
    <td>${estado}</td>
  `;

  // Al hacer clic en la fila, se oculta o muestra
  fila.addEventListener("click", () => {
    fila.classList.toggle("oculto");
  });

  tabla.appendChild(fila);
  formulario.reset();
});
