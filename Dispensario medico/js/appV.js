const formulario = document.getElementById("formulario");
const tabla = document.getElementById("tabla").querySelector("tbody");

formulario.addEventListener("submit", function(e) {
  e.preventDefault();

  const Nombre_del_Visitante = document.getElementById("Nombre_del_Visitante").value;
  const Nombre_del_Medico = document.getElementById("Nombre_del_Medico").value;
  const Nombre_del_paciente = document.getElementById("Nombre_del_paciente").value;
  const Fecha_de_visita = document.getElementById("Fecha_de_visita").value;
  const Hora_de_Visita = document.getElementById("Hora_de_Visita").value;
  const Sintomas = document.getElementById("Sintomas").value;
  const Medicamento_Suministrado = document.getElementById("Medicamento_Suministrado").value;
  const estado = document.getElementById("estado").value;

  const fila = document.createElement("tr");

  fila.innerHTML = `
    <td>${Nombre_del_Visitante}</td>
    <td>${Nombre_del_Medico}</td>
    <td>${Nombre_del_paciente}</td>
    <td>${Fecha_de_visita}</td>
    <td>${Hora_de_Visita}</td>
    <td>${Sintomas}</td>
    <td>${Medicamento_Suministrado}</td>
    <td>${estado}</td>
  `;

  // Al hacer clic en la fila, se oculta o muestra
  fila.addEventListener("click", () => {
    fila.classList.toggle("oculto");
  });

  tabla.appendChild(fila);
  formulario.reset();
});
