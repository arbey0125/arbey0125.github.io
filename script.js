// Simulador de Optimización Multivariable - Sistemas Solares Híbridos
class SimuladorSolar {
    constructor() {
        this.charts = {};
        this.initializeEventListeners();
        this.initializeCharts();
    }

    // Inicializar event listeners
    initializeEventListeners() {
        document.getElementById('ejecutarSimulacion').addEventListener('click', () => {
            this.ejecutarSimulacion();
        });

        // Actualización en tiempo real al cambiar parámetros
        const inputs = document.querySelectorAll('.input-panel input');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.ejecutarSimulacion();
            });
        });
    }

    // Inicializar gráficos
    initializeCharts() {
        this.initializeIrradianciaChart();
        this.initializeTemperaturaChart();
        this.initializeEficienciaChart();
    }

    // Gráfico de irradiancia solar
    initializeIrradianciaChart() {
        const ctx = document.getElementById('irradianciaChart').getContext('2d');
        this.charts.irradiancia = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Irradiancia Solar (W/m²)',
                    data: [],
                    borderColor: '#f39c12',
                    backgroundColor: 'rgba(243, 156, 18, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Irradiancia (W/m²)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Hora del día'
                        }
                    }
                }
            }
        });
    }

    // Gráfico de temperatura
    initializeTemperaturaChart() {
        const ctx = document.getElementById('temperaturaChart').getContext('2d');
        this.charts.temperatura = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Temperatura del Sistema (°C)',
                    data: [],
                    borderColor: '#e74c3c',
                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Temperatura (°C)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Tiempo (horas)'
                        }
                    }
                }
            }
        });
    }

    // Gráfico de eficiencia
    initializeEficienciaChart() {
        const ctx = document.getElementById('eficienciaChart').getContext('2d');
        this.charts.eficiencia = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Inclinación', 'Área', 'Masa Térmica', 'Difusividad'],
                datasets: [{
                    label: 'Sensibilidad (%)',
                    data: [],
                    backgroundColor: [
                        'rgba(52, 152, 219, 0.8)',
                        'rgba(46, 204, 113, 0.8)',
                        'rgba(241, 196, 15, 0.8)',
                        'rgba(155, 89, 182, 0.8)'
                    ],
                    borderColor: [
                        '#3498db',
                        '#2ecc71',
                        '#f1c40f',
                        '#9b59b6'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Sensibilidad (%)'
                        }
                    }
                }
            }
        });
    }

    // Función principal de simulación
    async ejecutarSimulacion() {
        try {
            // Mostrar estado de carga
            this.mostrarCarga();

            // Obtener parámetros de entrada
            const parametros = this.obtenerParametros();

            // Realizar cálculos
            const resultados = this.calcularSimulacion(parametros);

            // Actualizar interfaz
            this.actualizarResultados(resultados);
            this.actualizarGraficos(resultados);
            this.calcularDerivadasParciales(parametros, resultados);
            this.actualizarInterpretacion(resultados);

        } catch (error) {
            console.error('Error en la simulación:', error);
            this.mostrarError('Error en la simulación. Verifique los parámetros de entrada.');
        } finally {
            this.ocultarCarga();
        }
    }

    // Obtener parámetros del formulario
    obtenerParametros() {
        return {
            latitud: parseFloat(document.getElementById('latitud').value),
            longitud: parseFloat(document.getElementById('longitud').value),
            fecha: new Date(document.getElementById('fecha').value),
            duracion: parseInt(document.getElementById('duracion').value),
            numPaneles: parseInt(document.getElementById('numPaneles').value),
            areaPanel: parseFloat(document.getElementById('areaPanel').value),
            inclinacion: parseFloat(document.getElementById('inclinacion').value),
            azimut: parseFloat(document.getElementById('azimut').value),
            capacidadCalorifica: parseFloat(document.getElementById('capacidadCalorifica').value),
            masaTermica: parseFloat(document.getElementById('masaTermica').value),
            difusividadTermica: parseFloat(document.getElementById('difusividadTermica').value),
            eficienciaTratamiento: parseFloat(document.getElementById('eficienciaTratamiento').value),
            energiaPorLitro: parseFloat(document.getElementById('energiaPorLitro').value)
        };
    }

    // Cálculos principales de simulación
    calcularSimulacion(parametros) {
        const { latitud, longitud, fecha, duracion, numPaneles, areaPanel, inclinacion, azimut, 
                capacidadCalorifica, masaTermica, difusividadTermica, eficienciaTratamiento, energiaPorLitro } = parametros;

        // Calcular irradiancia solar por hora
        const irradianciaData = this.calcularIrradianciaSolar(latitud, fecha, duracion, inclinacion, azimut);
        
        // Calcular energía total captada
        const areaTotal = numPaneles * areaPanel;
        const energiaTotal = this.calcularEnergiaTotal(irradianciaData, areaTotal);
        
        // Calcular evolución térmica
        const temperaturaData = this.calcularEvolucionTermica(irradianciaData, masaTermica, capacidadCalorifica, difusividadTermica);
        
        // Calcular agua tratada
        const aguaTratada = this.calcularAguaTratada(energiaTotal, eficienciaTratamiento, energiaPorLitro);
        
        // Calcular eficiencia global
        const eficienciaGlobal = this.calcularEficienciaGlobal(energiaTotal, irradianciaData, areaTotal);

        return {
            irradianciaData,
            temperaturaData,
            energiaTotal,
            temperaturaMaxima: Math.max(...temperaturaData),
            aguaTratada,
            eficienciaGlobal,
            areaTotal
        };
    }

    // Calcular irradiancia solar
    calcularIrradianciaSolar(latitud, fecha, duracion, inclinacion, azimut) {
        const irradiancia = [];
        const horas = duracion * 24;
        
        for (let h = 0; h < horas; h++) {
            const hora = h % 24;
            const diaDelAno = this.obtenerDiaDelAno(fecha);
            
            // Ángulo horario
            const anguloHorario = (hora - 12) * 15;
            
            // Declinación solar
            const declinacion = 23.45 * Math.sin((284 + diaDelAno) * Math.PI / 180);
            
            // Ángulo de elevación solar
            const elevacion = Math.asin(
                Math.sin(latitud * Math.PI / 180) * Math.sin(declinacion * Math.PI / 180) +
                Math.cos(latitud * Math.PI / 180) * Math.cos(declinacion * Math.PI / 180) * 
                Math.cos(anguloHorario * Math.PI / 180)
            );
            
            // Irradiancia directa (simplificada)
            let irradianciaDirecta = 0;
            if (elevacion > 0) {
                irradianciaDirecta = 1000 * Math.sin(elevacion) * Math.exp(-0.1 / Math.sin(elevacion));
            }
            
            // Factor de inclinación
            const factorInclinacion = Math.cos((inclinacion - elevacion * 180 / Math.PI) * Math.PI / 180);
            
            // Irradiancia total en el panel
            const irradianciaTotal = Math.max(0, irradianciaDirecta * factorInclinacion);
            
            irradiancia.push(irradianciaTotal);
        }
        
        return irradiancia;
    }

    // Obtener día del año
    obtenerDiaDelAno(fecha) {
        const inicioAno = new Date(fecha.getFullYear(), 0, 1);
        return Math.floor((fecha - inicioAno) / (1000 * 60 * 60 * 24)) + 1;
    }

    // Calcular energía total
    calcularEnergiaTotal(irradianciaData, areaTotal) {
        const eficienciaPanel = 0.2; // 20% eficiencia típica
        const energiaPorHora = irradianciaData.map(irr => irr * areaTotal * eficienciaPanel);
        return energiaPorHora.reduce((sum, energia) => sum + energia, 0);
    }

    // Calcular evolución térmica
    calcularEvolucionTermica(irradianciaData, masaTermica, capacidadCalorifica, difusividadTermica) {
        const temperatura = [];
        let tempActual = 20; // Temperatura inicial (20°C)
        const dt = 3600; // Paso de tiempo en segundos (1 hora)
        
        for (let i = 0; i < irradianciaData.length; i++) {
            const irradiancia = irradianciaData[i];
            
            // Calor generado por la irradiancia
            const calorGenerado = irradiancia * 0.8; // 80% se convierte en calor
            
            // Pérdidas térmicas (simplificadas)
            const perdidasTermicas = 0.1 * (tempActual - 20); // Pérdidas proporcionales a la diferencia de temperatura
            
            // Cambio de temperatura
            const deltaT = (calorGenerado - perdidasTermicas) * dt / (masaTermica * capacidadCalorifica);
            tempActual += deltaT;
            
            // Aplicar difusividad térmica
            tempActual = tempActual * (1 - difusividadTermica * 1000);
            
            temperatura.push(Math.max(20, tempActual));
        }
        
        return temperatura;
    }

    // Calcular agua tratada
    calcularAguaTratada(energiaTotal, eficienciaTratamiento, energiaPorLitro) {
        const energiaUtil = energiaTotal * (eficienciaTratamiento / 100);
        return energiaUtil / energiaPorLitro;
    }

    // Calcular eficiencia global
    calcularEficienciaGlobal(energiaTotal, irradianciaData, areaTotal) {
        const irradianciaTotal = irradianciaData.reduce((sum, irr) => sum + irr, 0);
        const energiaTeorica = irradianciaTotal * areaTotal;
        return (energiaTotal / energiaTeorica) * 100;
    }

    // Calcular derivadas parciales
    calcularDerivadasParciales(parametros, resultados) {
        const h = 0.01; // Paso para derivada numérica
        
        // Derivada respecto a la inclinación
        const paramInclinacion = { ...parametros, inclinacion: parametros.inclinacion + h };
        const resultadosInclinacion = this.calcularSimulacion(paramInclinacion);
        const derivadaInclinacion = (resultadosInclinacion.temperaturaMaxima - resultados.temperaturaMaxima) / h;
        
        // Derivada respecto al área
        const paramArea = { ...parametros, areaPanel: parametros.areaPanel + h };
        const resultadosArea = this.calcularSimulacion(paramArea);
        const derivadaArea = (resultadosArea.energiaTotal - resultados.energiaTotal) / h;
        
        // Derivada respecto al tiempo (velocidad de cambio térmico)
        const derivadaTiempo = this.calcularDerivadaTemporal(resultados.temperaturaData);
        
        // Actualizar interfaz
        document.getElementById('derivadaInclinacion').textContent = derivadaInclinacion.toFixed(4);
        document.getElementById('derivadaArea').textContent = derivadaArea.toFixed(2);
        document.getElementById('derivadaTiempo').textContent = derivadaTiempo.toFixed(4);
        
        // Actualizar gráfico de eficiencia
        this.actualizarGraficoEficiencia(derivadaInclinacion, derivadaArea, parametros);
    }

    // Calcular derivada temporal
    calcularDerivadaTemporal(temperaturaData) {
        if (temperaturaData.length < 2) return 0;
        
        const cambios = [];
        for (let i = 1; i < temperaturaData.length; i++) {
            cambios.push(temperaturaData[i] - temperaturaData[i-1]);
        }
        
        return cambios.reduce((sum, cambio) => sum + Math.abs(cambio), 0) / cambios.length;
    }

    // Actualizar gráfico de eficiencia
    actualizarGraficoEficiencia(derivadaInclinacion, derivadaArea, parametros) {
        const sensibilidadInclinacion = Math.abs(derivadaInclinacion) * 100;
        const sensibilidadArea = Math.abs(derivadaArea) * 100;
        const sensibilidadMasa = Math.abs(derivadaInclinacion) * 50; // Aproximación
        const sensibilidadDifusividad = Math.abs(derivadaInclinacion) * 30; // Aproximación
        
        this.charts.eficiencia.data.datasets[0].data = [
            sensibilidadInclinacion,
            sensibilidadArea,
            sensibilidadMasa,
            sensibilidadDifusividad
        ];
        this.charts.eficiencia.update();
    }

    // Actualizar resultados numéricos
    actualizarResultados(resultados) {
        document.getElementById('energiaTotal').textContent = `${resultados.energiaTotal.toFixed(0)} Wh`;
        document.getElementById('temperaturaMax').textContent = `${resultados.temperaturaMaxima.toFixed(1)}°C`;
        document.getElementById('aguaTratada').textContent = `${resultados.aguaTratada.toFixed(1)} L/día`;
        document.getElementById('eficienciaGlobal').textContent = `${resultados.eficienciaGlobal.toFixed(1)}%`;
    }

    // Actualizar gráficos
    actualizarGraficos(resultados) {
        // Actualizar gráfico de irradiancia
        const horas = Array.from({length: resultados.irradianciaData.length}, (_, i) => i);
        this.charts.irradiancia.data.labels = horas;
        this.charts.irradiancia.data.datasets[0].data = resultados.irradianciaData;
        this.charts.irradiancia.update();

        // Actualizar gráfico de temperatura
        this.charts.temperatura.data.labels = horas;
        this.charts.temperatura.data.datasets[0].data = resultados.temperaturaData;
        this.charts.temperatura.update();
    }

    // Actualizar interpretación
    actualizarInterpretacion(resultados) {
        const interpretacion = `
            <p><strong>Análisis del Sistema:</strong></p>
            <ul>
                <li>El sistema captó <strong>${resultados.energiaTotal.toFixed(0)} Wh</strong> de energía solar</li>
                <li>La temperatura máxima alcanzada fue de <strong>${resultados.temperaturaMaxima.toFixed(1)}°C</strong></li>
                <li>Se pueden tratar <strong>${resultados.aguaTratada.toFixed(1)} litros</strong> de agua por día</li>
                <li>La eficiencia global del sistema es del <strong>${resultados.eficienciaGlobal.toFixed(1)}%</strong></li>
            </ul>
            <p><strong>Optimización:</strong> Las derivadas parciales muestran la sensibilidad del sistema a cambios en los parámetros. Valores altos indican mayor impacto en el rendimiento.</p>
        `;
        
        document.getElementById('interpretacionFisica').innerHTML = interpretacion;

        // Recomendaciones dinámicas
        const recomendaciones = this.generarRecomendaciones(resultados);
        document.getElementById('recomendaciones').innerHTML = recomendaciones;

        // Generar diagnóstico inteligente
        this.generarDiagnostico(resultados);
    }

    // Sistema de diagnóstico inteligente
    generarDiagnostico(resultados) {
        const parametros = this.obtenerParametros();
        const diagnostico = this.analizarSistema(resultados, parametros);
        
        // Actualizar puntuación de salud
        this.actualizarPuntuacionSalud(diagnostico.healthScore);
        
        // Actualizar métricas de salud
        this.actualizarMetricasSalud(diagnostico.metrics);
        
        // Generar alertas
        this.generarAlertas(diagnostico.alerts);
        
        // Generar recomendaciones
        this.generarRecomendacionesDiagnostico(diagnostico.recommendations);
    }

    // Analizar el sistema y generar diagnóstico
    analizarSistema(resultados, parametros) {
        const { energiaTotal, temperaturaMaxima, aguaTratada, eficienciaGlobal } = resultados;
        const { latitud, inclinacion, numPaneles, areaPanel, masaTermica } = parametros;
        
        // Calcular métricas de salud
        const solarEfficiency = Math.min(100, (eficienciaGlobal / 25) * 100); // Normalizar a 25% como 100%
        const thermalStability = Math.max(0, 100 - ((temperaturaMaxima - 60) / 40) * 100); // 60°C como óptimo
        const waterProduction = Math.min(100, (aguaTratada / 500) * 100); // 500L como 100%
        
        // Calcular puntuación general de salud
        const healthScore = Math.round((solarEfficiency + thermalStability + waterProduction) / 3);
        
        // Generar alertas
        const alerts = [];
        
        if (eficienciaGlobal < 15) {
            alerts.push({
                type: 'warning',
                title: 'Baja Eficiencia Solar',
                description: 'La eficiencia del sistema es inferior al 15%. Considera optimizar la inclinación y orientación de los paneles.',
                priority: 'ALTA'
            });
        }
        
        if (temperaturaMaxima > 80) {
            alerts.push({
                type: 'danger',
                title: 'Sobrecalentamiento',
                description: 'La temperatura del sistema excede los 80°C. Aumenta la masa térmica o mejora la disipación de calor.',
                priority: 'CRÍTICA'
            });
        }
        
        if (aguaTratada < 100) {
            alerts.push({
                type: 'warning',
                title: 'Producción de Agua Baja',
                description: 'La producción de agua es menor a 100L/día. Considera aumentar el área de paneles o mejorar la eficiencia.',
                priority: 'MEDIA'
            });
        }
        
        if (inclinacion < latitud - 10 || inclinacion > latitud + 10) {
            alerts.push({
                type: 'info',
                title: 'Inclinación Subóptima',
                description: `La inclinación actual (${inclinacion}°) no es óptima para la latitud ${latitud}°. La inclinación ideal sería ${latitud}°.`,
                priority: 'BAJA'
            });
        }
        
        // Generar recomendaciones
        const recommendations = [];
        
        if (solarEfficiency < 60) {
            recommendations.push({
                type: 'optimization',
                title: 'Optimizar Orientación Solar',
                description: 'Ajusta la inclinación a la latitud del lugar y orienta los paneles hacia el sur (hemisferio norte).',
                impact: 'ALTO',
                action: `Cambiar inclinación a ${latitud}° y azimut a 180°`
            });
        }
        
        if (thermalStability < 70) {
            recommendations.push({
                type: 'thermal',
                title: 'Mejorar Estabilidad Térmica',
                description: 'Aumenta la masa térmica o implementa un sistema de disipación de calor más eficiente.',
                impact: 'ALTO',
                action: `Aumentar masa térmica a ${Math.round(masaTermica * 1.5)}kg`
            });
        }
        
        if (waterProduction < 50) {
            recommendations.push({
                type: 'production',
                title: 'Aumentar Capacidad de Producción',
                description: 'Incrementa el número de paneles o mejora la eficiencia del sistema de tratamiento.',
                impact: 'MEDIO',
                action: `Aumentar paneles a ${Math.round(numPaneles * 1.3)} unidades`
            });
        }
        
        if (eficienciaGlobal > 20) {
            recommendations.push({
                type: 'maintenance',
                title: 'Mantenimiento Preventivo',
                description: 'El sistema funciona bien. Programa mantenimiento regular para mantener el rendimiento óptimo.',
                impact: 'BAJO',
                action: 'Programar limpieza mensual de paneles'
            });
        }
        
        return {
            healthScore,
            metrics: {
                solarEfficiency,
                thermalStability,
                waterProduction
            },
            alerts,
            recommendations
        };
    }

    // Actualizar puntuación de salud
    actualizarPuntuacionSalud(score) {
        const scoreElement = document.getElementById('healthScore');
        const scoreCircle = document.querySelector('.score-circle');
        
        scoreElement.textContent = score;
        scoreCircle.style.setProperty('--score', `${score}%`);
        
        // Cambiar color según la puntuación
        if (score >= 80) {
            scoreCircle.style.background = `conic-gradient(from 0deg, #10b981 0%, #10b981 ${score}%, #374151 ${score}%, #374151 100%)`;
        } else if (score >= 60) {
            scoreCircle.style.background = `conic-gradient(from 0deg, #f59e0b 0%, #f59e0b ${score}%, #374151 ${score}%, #374151 100%)`;
        } else {
            scoreCircle.style.background = `conic-gradient(from 0deg, #ef4444 0%, #ef4444 ${score}%, #374151 ${score}%, #374151 100%)`;
        }
    }

    // Actualizar métricas de salud
    actualizarMetricasSalud(metrics) {
        // Eficiencia Solar
        const solarEfficiencyBar = document.getElementById('solarEfficiency');
        const solarEfficiencyValue = document.getElementById('solarEfficiencyValue');
        solarEfficiencyBar.style.width = `${metrics.solarEfficiency}%`;
        solarEfficiencyValue.textContent = `${metrics.solarEfficiency.toFixed(1)}%`;
        
        // Estabilidad Térmica
        const thermalStabilityBar = document.getElementById('thermalStability');
        const thermalStabilityValue = document.getElementById('thermalStabilityValue');
        thermalStabilityBar.style.width = `${metrics.thermalStability}%`;
        thermalStabilityValue.textContent = `${metrics.thermalStability.toFixed(1)}%`;
        
        // Producción de Agua
        const waterProductionBar = document.getElementById('waterProduction');
        const waterProductionValue = document.getElementById('waterProductionValue');
        waterProductionBar.style.width = `${metrics.waterProduction}%`;
        waterProductionValue.textContent = `${metrics.waterProduction.toFixed(1)}%`;
    }

    // Generar alertas
    generarAlertas(alerts) {
        const container = document.getElementById('alertsContainer');
        container.innerHTML = '';
        
        if (alerts.length === 0) {
            container.innerHTML = `
                <div class="alert-item">
                    <div class="alert-header">
                        <i class="fas fa-check-circle alert-icon"></i>
                        <div class="alert-title">Sistema Funcionando Correctamente</div>
                    </div>
                    <div class="alert-description">No se detectaron problemas críticos en el sistema.</div>
                </div>
            `;
            return;
        }
        
        alerts.forEach(alert => {
            const alertElement = document.createElement('div');
            alertElement.className = 'alert-item';
            alertElement.innerHTML = `
                <div class="alert-header">
                    <i class="fas fa-exclamation-triangle alert-icon"></i>
                    <div class="alert-title">${alert.title}</div>
                </div>
                <div class="alert-description">${alert.description}</div>
                <div class="alert-priority">${alert.priority}</div>
            `;
            container.appendChild(alertElement);
        });
    }

    // Generar recomendaciones de diagnóstico
    generarRecomendacionesDiagnostico(recommendations) {
        const container = document.getElementById('recommendationsContainer');
        container.innerHTML = '';
        
        if (recommendations.length === 0) {
            container.innerHTML = `
                <div class="recommendation-item">
                    <div class="recommendation-header">
                        <i class="fas fa-check-circle recommendation-icon"></i>
                        <div class="recommendation-title">Sistema Optimizado</div>
                    </div>
                    <div class="recommendation-description">El sistema está funcionando en condiciones óptimas.</div>
                </div>
            `;
            return;
        }
        
        recommendations.forEach(rec => {
            const recElement = document.createElement('div');
            recElement.className = 'recommendation-item';
            recElement.innerHTML = `
                <div class="recommendation-header">
                    <i class="fas fa-lightbulb recommendation-icon"></i>
                    <div class="recommendation-title">${rec.title}</div>
                </div>
                <div class="recommendation-description">${rec.description}</div>
                <div class="recommendation-impact">${rec.impact}</div>
            `;
            container.appendChild(recElement);
        });
    }

    // Generar recomendaciones dinámicas
    generarRecomendaciones(resultados) {
        let recomendaciones = '<ul>';
        
        if (resultados.eficienciaGlobal < 15) {
            recomendaciones += '<li>🔧 <strong>Optimizar inclinación:</strong> Ajustar a la latitud del lugar para maximizar captación solar</li>';
        }
        
        if (resultados.temperaturaMaxima > 80) {
            recomendaciones += '<li>🌡️ <strong>Mejorar disipación térmica:</strong> Aumentar la masa térmica o mejorar el aislamiento</li>';
        }
        
        if (resultados.aguaTratada < 100) {
            recomendaciones += '<li>💧 <strong>Aumentar área de paneles:</strong> Más paneles para mayor producción energética</li>';
        }
        
        recomendaciones += '<li>📊 <strong>Monitoreo continuo:</strong> Implementar sensores para optimización en tiempo real</li>';
        recomendaciones += '<li>🔄 <strong>Mantenimiento regular:</strong> Limpieza de paneles y verificación del sistema térmico</li>';
        
        recomendaciones += '</ul>';
        return recomendaciones;
    }

    // Mostrar estado de carga
    mostrarCarga() {
        const boton = document.getElementById('ejecutarSimulacion');
        boton.classList.add('loading');
        boton.textContent = '🔄 Calculando...';
    }

    // Ocultar estado de carga
    ocultarCarga() {
        const boton = document.getElementById('ejecutarSimulacion');
        boton.classList.remove('loading');
        boton.textContent = '🚀 Ejecutar Simulación';
    }

    // Mostrar error
    mostrarError(mensaje) {
        alert('Error: ' + mensaje);
    }
}

// Inicializar la aplicación cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    new SimuladorSolar();
});

// Funciones auxiliares para cálculos matemáticos avanzados
class CalculosMatematicos {
    // Integración numérica usando regla del trapecio
    static integrarTrapecio(funcion, a, b, n) {
        const h = (b - a) / n;
        let suma = funcion(a) + funcion(b);
        
        for (let i = 1; i < n; i++) {
            suma += 2 * funcion(a + i * h);
        }
        
        return (h / 2) * suma;
    }

    // Derivada numérica usando diferencia central
    static derivadaNumerica(funcion, x, h = 0.001) {
        return (funcion(x + h) - funcion(x - h)) / (2 * h);
    }

    // Gradiente numérico para optimización
    static calcularGradiente(funcion, punto, h = 0.001) {
        const gradiente = [];
        for (let i = 0; i < punto.length; i++) {
            const puntoMas = [...punto];
            const puntoMenos = [...punto];
            puntoMas[i] += h;
            puntoMenos[i] -= h;
            
            gradiente.push((funcion(puntoMas) - funcion(puntoMenos)) / (2 * h));
        }
        return gradiente;
    }
}

// Exportar para uso global
window.SimuladorSolar = SimuladorSolar;
window.CalculosMatematicos = CalculosMatematicos;
