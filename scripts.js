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