// Función global para manejar la expansión
function toggleDetails(softwareName, buttonElement) {
    console.log('toggleDetails llamada desde onclick:', softwareName, buttonElement);
    
    const detailsRow = document.getElementById(`details-${softwareName}`);
    console.log('Fila encontrada:', detailsRow);
    
    if (detailsRow) {
        const isHidden = detailsRow.style.display === 'none' || 
                       detailsRow.style.display === '' || 
                       getComputedStyle(detailsRow).display === 'none';
        
        console.log('Estado actual - isHidden:', isHidden);
        
        if (isHidden) {
            // Expandir
            console.log('Expandiendo...');
            detailsRow.style.display = 'table-row';
            detailsRow.classList.add('show');
            buttonElement.innerHTML = '▲ Ocultar Detalles';
            buttonElement.classList.add('expanded');
            
            // Scroll suave hacia la fila expandida
            setTimeout(() => {
                detailsRow.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
            }, 300);
        } else {
            // Contraer
            console.log('Contrayendo...');
            detailsRow.style.display = 'none';
            detailsRow.classList.remove('show');
            buttonElement.innerHTML = '▼ Ver Detalles';
            buttonElement.classList.remove('expanded');
        }
    } else {
        console.error('No se encontró la fila de detalles para:', softwareName);
        alert('Error: No se pudo encontrar la información detallada');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM cargado, iniciando scripts...');
    // --- Limpieza cliente: borrar cookies, caches y service workers para evitar contenido cacheado ---
    (async function clearClientStorageAndUnregisterServiceWorkers(){
        try {
            // borrar cookies (establecer expiración pasada)
            document.cookie.split(';').forEach(function(c) {
                document.cookie = c.replace(/=.*/, '=;expires=' + new Date(0).toUTCString() + ';path=/');
            });

            // limpiar localStorage y sessionStorage
            try { localStorage.clear(); } catch(e){/* no-op */}
            try { sessionStorage.clear(); } catch(e){/* no-op */}

            // borrar caches (Cache API)
            if ('caches' in window) {
                const keys = await caches.keys();
                await Promise.all(keys.map(k => caches.delete(k)));
            }

            // unregister service workers
            if ('serviceWorker' in navigator) {
                const regs = await navigator.serviceWorker.getRegistrations();
                await Promise.all(regs.map(r => r.unregister()));
            }

            console.info('Client caches, cookies and service workers cleared.');
        } catch (err) {
            console.warn('Error clearing client storages:', err);
        }
    })();
    
    const filterInput = document.getElementById('filterInput');
    const softwareTable = document.getElementById('softwareTable');
    const rows = softwareTable ? softwareTable.getElementsByTagName('tbody')[0].getElementsByTagName('tr') : [];
    
    console.log('Elementos encontrados:', {
        filterInput: !!filterInput,
        softwareTable: !!softwareTable,
        rowsCount: rows.length
    });

    // Funcionalidad del filtro
    if (filterInput && softwareTable) {
        filterInput.addEventListener('keyup', function() {
            const filter = filterInput.value.toLowerCase();
            
            for (let i = 0; i < rows.length; i++) {
                // Solo procesar filas que no sean de detalles
                if (!rows[i].classList.contains('details-row')) {
                    const rowText = rows[i].textContent.toLowerCase();
                    const carrera = rows[i].getAttribute('data-carrera') || '';
                    
                    // Mostrar u ocultar la fila
                    if (rowText.includes(filter) || carrera.toLowerCase().includes(filter)) {
                        rows[i].style.display = "";
                    } else {
                        rows[i].style.display = "none";
                    }
                }
            }
        });
    }

    // Manejar otros botones de detalles que no tengan expansión específica
    document.querySelectorAll('.details-button:not(.expand-button)').forEach(button => {
        button.addEventListener('click', (event) => {
            const softwareName = event.target.getAttribute('data-software');
            alert(`Instrucciones para ${softwareName}:\n\nPor favor, contacta a la coordinación de tu Centro Universitario para más información sobre licencias y acceso.`);
        });
    });

    // Funcionalidad para el botón de notificaciones de tiempo limitado
    const notificationButton = document.querySelector('.notification-button');
    if (notificationButton) {
        notificationButton.addEventListener('click', () => {
            // Verificar si el navegador soporta notificaciones
            if ("Notification" in window) {
                // Solicitar permiso para notificaciones
                Notification.requestPermission().then(permission => {
                    if (permission === "granted") {
                        notificationButton.innerHTML = "✅ Notificaciones Activadas";
                        notificationButton.style.background = "linear-gradient(45deg, #27ae60, #2ecc71)";
                        
                        // Mostrar notificación de confirmación
                        new Notification("¡Notificaciones Activadas!", {
                            body: "Te notificaremos sobre nuevos beneficios por tiempo limitado",
                            icon: "./assets/udg-logo.png"
                        });
                        
                        // Simular notificación programada (ejemplo)
                        setTimeout(() => {
                            new Notification("🚀 Nuevo Beneficio Disponible", {
                                body: "¡Revisa las nuevas ofertas de software por tiempo limitado!",
                                icon: "./assets/udg-logo.png"
                            });
                        }, 10000); // 10 segundos después
                        
                    } else if (permission === "denied") {
                        alert("Las notificaciones han sido bloqueadas. Puedes habilitarlas en la configuración de tu navegador.");
                    }
                });
            } else {
                alert("Tu navegador no soporta notificaciones.");
            }
        });
    }
});

// Escucha postMessage desde el iframe con la respuesta del Web App (suscripción)
window.addEventListener('message', function(ev) {
    console.log('postMessage recibido desde iframe:', ev.origin, ev.source);
    let data = ev.data;
    try {
        if (typeof data === 'string') data = JSON.parse(data);
    } catch (e) {
        console.warn('Mensaje no JSON en postMessage:', ev.data);
        return;
    }

    // Integración con la UI: quitar estado de loading y mostrar mensaje bonito
    const msgEl = document.getElementById('subscribeMsg');
    const form = document.getElementById('subscribeForm');
    if (form && form._subscribeTimeout) {
        clearTimeout(form._subscribeTimeout);
        form._subscribeTimeout = null;
    }

    // quitar loading del botón
    if (form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.classList.remove('btn-loading');
            submitBtn.disabled = false;
        }
    }

    if (!msgEl) return;

    // mostrar mensaje con clases
    const icon = msgEl.querySelector('.msg-icon');
    const text = msgEl.querySelector('.msg-text');
    msgEl.classList.remove('msg-success','msg-error','msg-fade-in');
    if (data && data.ok) {
        msgEl.classList.add('msg-success','msg-fade-in');
        if (text) text.textContent = data.msg || 'Guardado correctamente.';
        if (form) form.reset();
    } else {
        msgEl.classList.add('msg-error','msg-fade-in');
        if (text) text.textContent = (data && data.msg) ? data.msg : 'Ocurrió un error. Intenta más tarde.';
    }

    // auto-limpiar
    if (form) {
        clearTimeout(form._msgClearTimeout);
        form._msgClearTimeout = setTimeout(() => {
            if (text) text.textContent = '';
            msgEl.classList.remove('msg-success','msg-error','msg-fade-in');
        }, 8000);
    }
});

// DEBUG: comprobar que el formulario tiene una URL válida
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('subscribeForm');
    if (!form) return;
    form.addEventListener('submit', () => {
        console.log('subscribeForm submit -> action=', form.action);
    });
    // Constante con la URL real del Web App (usar para pruebas locales y referencias consistentes)
    const SUBSCRIBE_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbwNE7eomL2tDZqEWcJ5lI3UuEcMs2Hb9h2ZeolvU5LhEevMV0k2_2O9xUFhOtp0FP7e/exec';

    // Si el atributo action está vacío o contiene el placeholder, lo inicializamos para pruebas locales
    const msgEl = document.getElementById('subscribeMsg');
    if (!form.action || form.action.includes('TU_WEBAPP_URL_AQUI') || form.action.includes('TU-WEBAPP-URL')) {
        console.info('subscribeForm action vacío o con placeholder — asignando SUBSCRIBE_WEBAPP_URL para pruebas locales');
        form.action = SUBSCRIBE_WEBAPP_URL;
        if (msgEl) {
            msgEl.style.color = 'orange';
            msgEl.textContent = '⚠️ Acción del formulario auto-configurada para pruebas locales.';
        }
    } else if (form.action !== SUBSCRIBE_WEBAPP_URL) {
        // Si el action está presente y es distinto al valor esperado, solo registrarlo (no sobrescribir)
        console.log('subscribeForm action detectado:', form.action);
    } else {
        // action ya apunta a la URL esperada
        console.log('subscribeForm action configurado correctamente');
    }
    
    // Mejora UX: validar email en cliente y mostrar spinner mientras se envía
    const emailInput = document.getElementById('email');
    const submitBtn = form.querySelector('button[type="submit"]');
    const spinner = submitBtn ? submitBtn.querySelector('.btn-spinner') : null;
    const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;

    function setLoading(on) {
        if (!submitBtn) return;
        if (on) {
            submitBtn.classList.add('btn-loading');
            submitBtn.disabled = true;
        } else {
            submitBtn.classList.remove('btn-loading');
            submitBtn.disabled = false;
        }
    }

    // Client-side simple email regex
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    form.addEventListener('submit', (ev) => {
        const email = (emailInput && emailInput.value || '').trim();
        if (!email || !emailRe.test(email)) {
            ev.preventDefault();
            showMessage({ ok: false, msg: 'Correo inválido. Usa un correo válido.' });
            return;
        }

        // iniciar loading state, el iframe responderá con postMessage
        setLoading(true);

        // fallback: si no recibimos respuesta en 10s, mostrar error y liberar botón
        form._subscribeTimeout = setTimeout(() => {
            setLoading(false);
            showMessage({ ok: false, msg: 'No se recibió respuesta. Intenta de nuevo más tarde.' });
        }, 10000);
    });

    function showMessage(payload) {
        if (!msgEl) return;
        const icon = msgEl.querySelector('.msg-icon');
        const text = msgEl.querySelector('.msg-text');
        // quitar clases previas
        msgEl.classList.remove('msg-success','msg-error','msg-fade-in');
        if (payload.ok) {
            msgEl.classList.add('msg-success','msg-fade-in');
            if (icon) icon.innerHTML = '';
            if (text) text.textContent = payload.msg || 'Listo, gracias.';
        } else {
            msgEl.classList.add('msg-error','msg-fade-in');
            if (icon) icon.innerHTML = '';
            if (text) text.textContent = payload.msg || 'Ocurrió un error.';
        }
        // small auto-clear after a while
        clearTimeout(form._msgClearTimeout);
        form._msgClearTimeout = setTimeout(() => {
            if (text) text.textContent = '';
            msgEl.classList.remove('msg-success','msg-error','msg-fade-in');
        }, 8000);
    }
});