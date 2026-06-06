// --- CLASE DE LÓGICA DE CÁLCULO Y PERSISTENCIA ---
class Calculadora {
    constructor() {
        this.cantPersonas = 1;
        this.gastos = [];
        this.cargar();
    }

    cargar() {
        try {
            const savedState = localStorage.getItem('calculadora_gastos_state');
            if (savedState) {
                const parsed = JSON.parse(savedState);
                this.cantPersonas = parseInt(parsed.cantPersonas) || 1;
                this.gastos = parsed.gastos || [];
            }
        } catch (e) {
            console.error('Error al cargar del localStorage', e);
        }
    }

    guardar() {
        try {
            localStorage.setItem('calculadora_gastos_state', JSON.stringify({
                cantPersonas: this.cantPersonas,
                gastos: this.gastos
            }));
        } catch (e) {
            console.error('Error al guardar en el localStorage', e);
        }
    }

    actualizarPersonas(cant) {
        if (cant < 1) cant = 1;
        if (cant > 10) cant = 10;
        this.cantPersonas = cant;
        this.guardar();
    }

    agregarGasto(descripcion, monto) {
        if (!descripcion.trim()) throw new Error('La descripción es obligatoria.');
        if (isNaN(monto) || monto <= 0) throw new Error('El monto debe ser mayor a cero.');

        const nuevoGasto = {
            id: Date.now().toString(),
            descripcion: descripcion.trim(),
            monto: Math.round(monto * 100) / 100 // Evitar problemas de coma flotante
        };
        this.gastos.push(nuevoGasto);
        this.guardar();
        return nuevoGasto;
    }

    eliminarGasto(id) {
        this.gastos = this.gastos.filter(g => g.id !== id);
        this.guardar();
    }

    reiniciar() {
        this.cantPersonas = 1;
        this.gastos = [];
        this.guardar();
    }

    obtenerResultados() {
        const total = this.gastos.reduce((sum, g) => sum + g.monto, 0);
        const promedio = this.cantPersonas > 0 ? total / this.cantPersonas : 0;
        return {
            total: Math.round(total * 100) / 100,
            personas: this.cantPersonas,
            promedio: Math.round(promedio * 100) / 100
        };
    }
}

// --- CONTROLADOR DE LA INTERFAZ (DOM) ---
const calc = new Calculadora();

const DOM = {
    cantPersonasInput: document.getElementById('cant_personas'),
    formGasto: document.getElementById('form-gasto'),
    descripcionInput: document.getElementById('descripcion'),
    montoInput: document.getElementById('monto'),
    tablaGastosBody: document.getElementById('tabla-gastos-body'),
    sinGastosPlaceholder: document.getElementById('sin-gastos'),
    totalGastado: document.getElementById('total-gastado'),
    personasElegidas: document.getElementById('personas-elegidas'),
    cuotaPersona: document.getElementById('cuota-persona'),
    btnReset: document.getElementById('btn-reset'),
    alertContainer: document.getElementById('alert-container')
};

const formatter = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS'
});

function render() {
    // Sincronizar input personas
    DOM.cantPersonasInput.value = calc.cantPersonas;

    // Renderizar listado de gastos
    DOM.tablaGastosBody.innerHTML = '';
    if (calc.gastos.length === 0) {
        DOM.sinGastosPlaceholder.style.display = 'block';
    } else {
        DOM.sinGastosPlaceholder.style.display = 'none';
        calc.gastos.forEach(g => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${g.descripcion}</td>
                <td><strong>${formatter.format(g.monto)}</strong></td>
                <td style="text-align: center;">
                    <button class="btn btn-danger btn-delete" data-id="${g.id}">Eliminar</button>
                </td>
            `;
            tr.querySelector('.btn-delete').addEventListener('click', () => {
                calc.eliminarGasto(g.id);
                render();
                showAlert('Gasto eliminado.', 'success');
            });
            DOM.tablaGastosBody.appendChild(tr);
        });
    }

    // Renderizar totales
    const res = calc.obtenerResultados();
    DOM.totalGastado.textContent = formatter.format(res.total);
    DOM.personasElegidas.textContent = res.personas;
    DOM.cuotaPersona.textContent = formatter.format(res.promedio);
}

function showAlert(message, type = 'success') {
    const alert = document.createElement('div');
    alert.className = `alert ${type === 'error' ? 'alert-error' : ''}`;
    alert.textContent = message;
    
    DOM.alertContainer.appendChild(alert);
    setTimeout(() => {
        alert.style.transition = 'opacity 0.5s ease';
        alert.style.opacity = '0';
        setTimeout(() => alert.remove(), 500);
    }, 2000);
}

// --- BINDING DE EVENTOS ---
DOM.cantPersonasInput.addEventListener('change', () => {
    let cant = parseInt(DOM.cantPersonasInput.value);
    if (isNaN(cant) || cant < 1) {
        cant = 1;
    } else if (cant > 10) {
        cant = 10;
        showAlert('El máximo es 10 personas.', 'error');
    }
    calc.actualizarPersonas(cant);
    render();
});

DOM.formGasto.addEventListener('submit', (e) => {
    e.preventDefault();
    const desc = DOM.descripcionInput.value;
    const monto = parseFloat(DOM.montoInput.value);

    try {
        calc.agregarGasto(desc, monto);
        render();
        showAlert('Gasto agregado.', 'success');
        
        DOM.descripcionInput.value = '';
        DOM.montoInput.value = '';
        DOM.descripcionInput.focus();
    } catch (err) {
        showAlert(err.message, 'error');
    }
});

DOM.btnReset.addEventListener('click', () => {
    if (confirm('¿Quieres reiniciar la planilla? Se perderán todos los datos cargados.')) {
        calc.reiniciar();
        render();
        showAlert('Planilla reiniciada.', 'success');
    }
});

// Primer renderizado
render();
