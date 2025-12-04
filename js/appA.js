const formulario = document.getElementById("formulario");
const tabla = document.getElementById("tabla").querySelector("tbody");

formulario.addEventListener("submit", function(e) {
  e.preventDefault();

  const indentificador = document.getElementById("indentificador").value;
  const nombre = document.getElementById("nombre").value;
  const descripicion = document.getElementById("descripicion").value;
  const estante = document.getElementById("estante").value;
  const estado = document.getElementById("estado").value;

  const fila = document.createElement("tr");

  fila.innerHTML = `
    <td>${indentificador}</td>
    <td>${nombre}</td>
    <td>${descripicion}</td>
    <td>${estante}</td>
    <td>${estado}</td>
  `;

  // Al hacer clic en la fila, se oculta o muestra
  fila.addEventListener("click", () => {
    fila.classList.toggle("oculto");
  });

  tabla.appendChild(fila);
  formulario.reset();
});
