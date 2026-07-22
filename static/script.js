// ========================================
// FUNCIÓN PARA MOSTRAR NOTIFICACIONES TOAST
// ========================================

function showToast(message, type = "warning") {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    // Si ya hay notificaciones abiertas, quitar la más antigua
    if (container.children.length >= 3) {
        container.firstElementChild.remove();
    }

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;

    let icon = "⚠️";
    if (type === "error") icon = "❌";
    if (type === "success") icon = "✅";

    toast.innerHTML = `
        <span class="toast-icon">${icon}</span>
        <span class="toast-message">${message}</span>
        <span class="toast-close">&times;</span>
    `;

    container.appendChild(toast);

    // Animación de entrada
    setTimeout(() => toast.classList.add("show"), 10);

    const closeBtn = toast.querySelector(".toast-close");
    const removeToast = () => {
        toast.classList.remove("show");
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 350);
    };

    closeBtn.addEventListener("click", removeToast);

    // Auto cerrar en 4 segundos
    setTimeout(removeToast, 4000);
}


// ========================================
// ELEMENTOS Y EVENTOS PRINCIPALES
// ========================================

const btn = document.getElementById("btnPredecir");
const form = document.getElementById("studentForm");

const modal = document.getElementById("modalResultado");
const modalBody = document.getElementById("modalBody");
const closeModalBtn = document.getElementById("closeModal");
const btnCerrarModal = document.getElementById("btnCerrarModal");

// Función para abrir el modal
function mostrarModal(htmlContent) {
    if (modal && modalBody) {
        modalBody.innerHTML = htmlContent;
        modal.classList.add("show");
    }
}

// Función para cerrar el modal
function ocultarModal() {
    if (modal) {
        modal.classList.remove("show");
    }
}

// Eventos para cerrar el modal
if (closeModalBtn) closeModalBtn.addEventListener("click", ocultarModal);
if (btnCerrarModal) btnCerrarModal.addEventListener("click", ocultarModal);
if (modal) {
    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            ocultarModal();
        }
    });
}

// Quitar borde rojo dinámicamente al interactuar con cualquier campo
document.querySelectorAll("input, select").forEach((elemento) => {
    elemento.addEventListener("input", () => {
        elemento.classList.remove("error-input");
    });
    elemento.addEventListener("change", () => {
        elemento.classList.remove("error-input");
    });
});

btn.addEventListener("click", async () => {
    // Limpiar errores previos
    document.querySelectorAll(".error-input").forEach((el) => el.classList.remove("error-input"));

    const camposNumericos = ["age", "absences", "G1", "G2"];
    let faltanCampos = false;

    camposNumericos.forEach((id) => {
        const campo = document.getElementById(id);
        if (campo && campo.value.trim() === "") {
            campo.classList.add("error-input");
            faltanCampos = true;
        }
    });

    if (faltanCampos) {
        showToast("Por favor, complete todos los campos marcados en rojo.", "warning");
        const primerError = document.querySelector(".error-input");
        if (primerError) primerError.focus();
        return;
    }

    const ageRaw = document.getElementById("age").value.trim();
    const absencesRaw = document.getElementById("absences").value.trim();
    const G1Raw = document.getElementById("G1").value.trim();
    const G2Raw = document.getElementById("G2").value.trim();

    const ageVal = Number(ageRaw);
    const absencesVal = Number(absencesRaw);
    const g1Val = Number(G1Raw);
    const g2Val = Number(G2Raw);

    // Validar rango de notas G1 y G2 (0 a 20)
    let errorNotas = false;
    if (isNaN(g1Val) || g1Val < 0 || g1Val > 20) {
        document.getElementById("G1").classList.add("error-input");
        errorNotas = true;
    }
    if (isNaN(g2Val) || g2Val < 0 || g2Val > 20) {
        document.getElementById("G2").classList.add("error-input");
        errorNotas = true;
    }

    if (errorNotas) {
        showToast("Las notas (G1 y G2) deben ser un valor numérico de 0 a 20.", "warning");
        const primerError = document.querySelector(".error-input");
        if (primerError) primerError.focus();
        return;
    }

    // Validar rango de edad (15 a 22)
    if (isNaN(ageVal) || ageVal < 15 || ageVal > 22) {
        document.getElementById("age").classList.add("error-input");
        showToast("La edad debe ser un valor entre 15 y 22 años.", "warning");
        document.getElementById("age").focus();
        return;
    }

    // Validar rango de faltas (0 a 100)
    if (isNaN(absencesVal) || absencesVal < 0 || absencesVal > 100) {
        document.getElementById("absences").classList.add("error-input");
        showToast("El número de faltas debe ser entre 0 y 100.", "warning");
        document.getElementById("absences").focus();
        return;
    }

    const datos = {
        sex: document.querySelector('input[name="sex"]:checked').value,
        age: Number(ageRaw),
        address: document.querySelector('input[name="address"]:checked').value,
        famsize: document.querySelector('input[name="famsize"]:checked').value,
        Pstatus: document.querySelector('input[name="Pstatus"]:checked').value,
        Medu: Number(document.getElementById("Medu").value),
        Fedu: Number(document.getElementById("Fedu").value),
        traveltime: Number(document.getElementById("traveltime").value),
        studytime: Number(document.getElementById("studytime").value),
        failures: Number(document.getElementById("failures").value),
        schoolsup: document.querySelector('input[name="schoolsup"]:checked').value,
        paid: document.querySelector('input[name="paid"]:checked').value,
        higher: document.querySelector('input[name="higher"]:checked').value,
        internet: document.querySelector('input[name="internet"]:checked').value,
        romantic: document.querySelector('input[name="romantic"]:checked').value,
        famrel: Number(document.getElementById("famrel").value),
        freetime: Number(document.getElementById("freetime").value),
        goout: Number(document.getElementById("goout").value),
        Dalc: Number(document.getElementById("Dalc").value),
        Walc: Number(document.getElementById("Walc").value),
        health: Number(document.getElementById("health").value),
        absences: Number(absencesRaw),
        G1: Number(G1Raw),
        G2: Number(G2Raw)
    };

    // ==========================
    // Validación de números válidos
    // ==========================
    for (const campo in datos) {
        if (
            datos[campo] === "" ||
            datos[campo] === null ||
            Number.isNaN(datos[campo])
        ) {
            showToast("Por favor, complete todos los campos obligatorios.", "warning");
            return;
        }
    }

    // ==========================
    // Enviar a Flask
    // ==========================
    try {
        const response = await fetch("/predecir", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datos)
        });

        const resultado = await response.json();
        const caja = document.getElementById("resultado");

        if (resultado.resultado === 1) {
            const htmlContent = `
                <div class="modal-icon">🎓</div>
                <h3 class="modal-title approved">¡Aprobado!</h3>
                <p class="modal-message">El modelo de Inteligencia Artificial predice que el estudiante <strong>aprobará</strong> la asignatura de Matemáticas.</p>
            `;
            mostrarModal(htmlContent);

            if (caja) {
                caja.innerHTML = `
                    <div class="success">
                        ✅ El estudiante aprobará la asignatura.
                    </div>
                `;
            }
        } else {
            const htmlContent = `
                <div class="modal-icon">❌</div>
                <h3 class="modal-title failed">No Aprobado</h3>
                <p class="modal-message">El modelo de Inteligencia Artificial predice que el estudiante <strong>no aprobará</strong> la asignatura de Matemáticas.</p>
            `;
            mostrarModal(htmlContent);

            if (caja) {
                caja.innerHTML = `
                    <div class="danger">
                        ❌ El estudiante no aprobará la asignatura.
                    </div>
                `;
            }
        }
    } catch (error) {
        console.error(error);
        showToast("Error al comunicarse con el servidor.", "error");
    }
});

// ========================================
// BOTÓN LIMPIAR / RESET FORMULARIO
// ========================================
if (form) {
    form.addEventListener("reset", () => {
        document.querySelectorAll(".error-input").forEach((el) => el.classList.remove("error-input"));
        const caja = document.getElementById("resultado");
        if (caja) {
            caja.innerHTML = "";
        }
        ocultarModal();
    });
}