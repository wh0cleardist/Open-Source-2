/**
 * Valida una cédula dominicana según el algoritmo de módulo 11
 * Adaptado de validación en C#
 * @param {string} pCedula - La cédula a validar (con o sin guiones)
 * @returns {boolean} - true si la cédula es válida, false en caso contrario
 */
function validaCedula(pCedula) {
  let vnTotal = 0;
  
  // Eliminar espacios en blanco
  const pCedulaTrimmed = pCedula.trim();
  
  // Validar que no esté vacío
  if (!pCedulaTrimmed) {
    return false;
  }
  
  // Eliminar guiones de la cédula
  const vcCedula = pCedulaTrimmed.replace(/-/g, '');
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
 * Extrae solo números de un string
 * @param {string} valor - El valor a limpiar
 * @returns {string} - Solo los números
 */
function extraerNumeros(valor) {
  return valor.replace(/\D/g, '');
}

/**
 * Formatea una cédula sin guiones a formato con guiones (XXX-XXXXXXX-X)
 * @param {string} cedula - La cédula sin formato
 * @returns {string} - La cédula formateada
 */
function formatearCedula(cedula) {
  const limpia = extraerNumeros(cedula);
  if (limpia.length === 11) {
    return `${limpia.substring(0, 3)}-${limpia.substring(3, 10)}-${limpia.substring(10)}`;
  }
  return limpia;
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
      mensaje: 'Cédula inválida (formato: XXX-XXXXXXX-X o 11 dígitos)'
    };
  }
  
  const cedulaFormateada = formatearCedula(cedula);
  return {
    valida: true,
    cedula: cedulaFormateada,
    mensaje: 'Cédula válida'
  };
}

/**
 * Actualiza el estado visual del input basado en validación
 * @param {HTMLElement} input - El elemento input
 * @param {string} inputId - El ID del input
 * @param {object} resultado - Resultado de validación
 */
function actualizarEstadoInput(input, inputId, resultado) {
  const mensajeEl = document.getElementById(`${inputId}-mensaje`);
  
  if (!resultado.valida) {
    input.classList.remove('cedula-valida');
    input.classList.add('cedula-invalida');
    if (mensajeEl) {
      mensajeEl.textContent = '✗ ' + resultado.mensaje;
      mensajeEl.classList.remove('success');
      mensajeEl.classList.add('error');
      mensajeEl.style.display = 'block';
    }
  } else {
    input.classList.remove('cedula-invalida');
    input.classList.add('cedula-valida');
    input.value = resultado.cedula;
    if (mensajeEl) {
      mensajeEl.textContent = '✓ ' + resultado.mensaje;
      mensajeEl.classList.remove('error');
      mensajeEl.classList.add('success');
      mensajeEl.style.display = 'block';
    }
  }
}

/**
 * Limpia el estado del input
 * @param {HTMLElement} input - El elemento input
 * @param {string} inputId - El ID del input
 */
function limpiarEstadoInput(input, inputId) {
  input.classList.remove('cedula-invalida', 'cedula-valida');
  const mensajeEl = document.getElementById(`${inputId}-mensaje`);
  if (mensajeEl) {
    mensajeEl.textContent = '';
    mensajeEl.style.display = 'none';
  }
}

/**
 * Configura un input de cédula con validación y formateo en tiempo real
 * @param {string} inputId - El ID del input a configurar (ej: "cedula")
 */
function configurarInputCedula(inputId) {
  const input = document.getElementById(inputId);
  
  if (!input) {
    console.error(`No se encontró el elemento con id: ${inputId}`);
    return;
  }
  
  // Estado para prevenir validación duplicada
  let ultimoValor = '';
  let timeoutValidacion = null;
  
  // Evento: mientras el usuario escribe
  input.addEventListener('input', function(e) {
    // Limpiar cualquier timeout anterior
    if (timeoutValidacion) {
      clearTimeout(timeoutValidacion);
    }
    
    // Extraer solo números
    let valor = extraerNumeros(this.value);
    
    // Limitar a máximo 11 dígitos
    if (valor.length > 11) {
      valor = valor.slice(0, 11);
    }
    
    // Formatear automáticamente: XXX-XXXXXXX-X
    let valorFormateado = '';
    if (valor.length > 0) {
      valorFormateado = valor.substring(0, 3);
      if (valor.length > 3) {
        valorFormateado += '-' + valor.substring(3, 10);
      }
      if (valor.length > 10) {
        valorFormateado += '-' + valor.substring(10);
      }
    }
    
    // Actualizar el valor del input
    this.value = valorFormateado;
    
    // Validar después de 500ms de que el usuario deje de escribir
    timeoutValidacion = setTimeout(() => {
      if (this.value.trim() !== '' && this.value !== ultimoValor) {
        const resultado = validarYFormatearCedula(this.value);
        if (resultado.valida) {
          actualizarEstadoInput(this, inputId, resultado);
          ultimoValor = this.value;
        } else {
          // No mostrar error mientras escriben, solo cuando pierde foco
          limpiarEstadoInput(this, inputId);
        }
      }
    }, 500);
  });
  
  // Evento: cuando pierde el foco
  input.addEventListener('blur', function(e) {
    if (timeoutValidacion) {
      clearTimeout(timeoutValidacion);
    }
    
    const valorLimpio = this.value.trim();
    
    if (valorLimpio === '') {
      limpiarEstadoInput(this, inputId);
    } else {
      const resultado = validarYFormatearCedula(this.value);
      actualizarEstadoInput(this, inputId, resultado);
      ultimoValor = this.value;
    }
  });
  
  // Evento: cuando obtiene foco
  input.addEventListener('focus', function(e) {
    if (timeoutValidacion) {
      clearTimeout(timeoutValidacion);
    }
    // No limpiar el estado, solo deja que el usuario vea el estado actual
  });
  
  // Evento: cuando se intenta enviar el formulario
  const formulario = input.closest('form');
  if (formulario) {
    const handleSubmit = function(e) {
      const valorLimpio = input.value.trim();
      
      if (valorLimpio === '') {
        e.preventDefault();
        const resultado = {
          valida: false,
          mensaje: 'La cédula es requerida'
        };
        actualizarEstadoInput(input, inputId, resultado);
        input.focus();
        return false;
      }
      
      const resultado = validarYFormatearCedula(input.value);
      if (!resultado.valida) {
        e.preventDefault();
        actualizarEstadoInput(input, inputId, resultado);
        input.focus();
        return false;
      }
      
      // Asegurar que el valor está formateado correctamente
      input.value = resultado.cedula;
    };
    
    // Evitar múltiples listeners
    formulario.removeEventListener('submit', handleSubmit);
    formulario.addEventListener('submit', handleSubmit);
  }
}

// Exportar para uso global
window.validacionCedula = {
  validaCedula,
  formatearCedula,
  validarYFormatearCedula,
  configurarInputCedula,
  extraerNumeros
};
