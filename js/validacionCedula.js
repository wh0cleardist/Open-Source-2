/**
 * Valida una cédula dominicana según el algoritmo de módulo 11
 * Adaptado de validación en C#
 * @param {string} pCedula - La cédula a validar (con o sin guiones)
 * @returns {boolean} - true si la cédula es válida, false en caso contrario
 */
function validaCedula(pCedula) {
  let vnTotal = 0;
  
  // Eliminar guiones de la cédula
  const vcCedula = pCedula.replace(/-/g, '').trim();
  const pLongCed = vcCedula.length;
  
  // Validar que la cédula tenga exactamente 11 dígitos
  if (pLongCed !== 11) {
    return false;
  }
  
  // Validar que sean solo números
  if (!/^\d+$/.test(vcCedula)) {
    return false;
  }
  
  // Multiplicadores para cada dígito
  const digitoMult = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1];
  
  // Calcular el total según el algoritmo
  for (let vDig = 1; vDig <= pLongCed; vDig++) {
    // FIX: substring(start, end) - extraer 1 carácter usando charAt
    const digit = parseInt(vcCedula.charAt(vDig - 1));
    let vCalculo = digit * digitoMult[vDig - 1];
    
    if (vCalculo < 10) {
      vnTotal += vCalculo;
    } else {
      // Si el resultado tiene 2 dígitos, sumar los dígitos individualmente
      // Ejemplo: 12 -> 1 + 2 = 3
      const vCalculoStr = vCalculo.toString();
      const primerDigito = parseInt(vCalculoStr.charAt(0));
      const segundoDigito = parseInt(vCalculoStr.charAt(1));
      vnTotal += primerDigito + segundoDigito;
    }
  }
  
  // Si el total es divisible por 10, la cédula es válida
  return vnTotal % 10 === 0;
}

/**
 * Formatea una cédula sin guiones a formato con guiones (XXX-XXXXXXX-X)
 * @param {string} cedula - La cédula sin formato
 * @returns {string} - La cédula formateada
 */
function formatearCedula(cedula) {
  const limpia = cedula.replace(/-/g, '').trim();
  if (limpia.length === 11) {
    return `${limpia.substring(0, 3)}-${limpia.substring(3, 10)}-${limpia.substring(10)}`;
  }
  return cedula;
}

/**
 * Valida y formatea una cédula
 * @param {string} cedula - La cédula a validar
 * @returns {object} - { valida: boolean, cedula: string, mensaje: string }
 */
function validarYFormatearCedula(cedula) {
  if (!cedula || cedula.trim() === '') {
    return {
      valida: false,
      cedula: '',
      mensaje: 'La cédula no puede estar vacía'
    };
  }
  
  if (!validaCedula(cedula)) {
    return {
      valida: false,
      cedula: cedula,
      mensaje: 'La cédula ingresada no es válida'
    };
  }
  
  const cedulaFormateada = formatearCedula(cedula);
  return {
    valida: true,
    cedula: cedulaFormateada,
    mensaje: 'Cédula válida'
  };
}

// Exportar para uso global
window.validacionCedula = {
  validaCedula,
  formatearCedula,
  validarYFormatearCedula
};
