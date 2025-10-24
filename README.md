# 🌞 Simulador de Optimización Multivariable - Sistemas Solares Híbridos

## 📋 Descripción

Este es un simulador web avanzado para la optimización de sistemas solares híbridos aplicados al almacenamiento térmico y tratamiento sostenible del agua. La aplicación utiliza **cálculo multivariable** y **derivadas parciales** para analizar y optimizar el rendimiento de sistemas de energía solar.

## 🚀 Características Principales

### 📊 Panel de Parámetros de Entrada
- **Ubicación Geográfica**: Latitud y longitud para cálculos de irradiancia solar
- **Configuración Temporal**: Fecha de simulación y duración
- **Configuración de Paneles**: Número, área, inclinación y orientación (azimut)
- **Propiedades Térmicas**: Capacidad calorífica, masa térmica y difusividad térmica
- **Tratamiento de Agua**: Eficiencia y energía requerida por litro

### 📈 Visualizaciones Interactivas
- **Gráfico de Irradiancia Solar**: Curva de irradiancia por hora del día
- **Evolución Térmica**: Temperatura del sistema a lo largo del tiempo
- **Análisis de Eficiencia**: Sensibilidad del sistema a diferentes parámetros
- **Derivadas Parciales**: Análisis matemático de optimización

### 🧮 Cálculos Matemáticos Avanzados
- **Cálculo de Irradiancia Solar**: Basado en posición geográfica y ángulos solares
- **Modelado Térmico**: Transferencia de calor con difusividad térmica
- **Derivadas Parciales**: Para optimización de parámetros
- **Integración Numérica**: Cálculo de energía total captada

## 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura semántica y accesible
- **CSS3**: Diseño responsivo con gradientes y animaciones
- **JavaScript ES6+**: Lógica de simulación y cálculos matemáticos
- **Chart.js**: Visualizaciones interactivas de datos
- **Math.js**: Cálculos matemáticos avanzados

## 📁 Estructura del Proyecto

```
simulador-solar/
├── simulador-solar.html    # Página principal
├── styles.css             # Estilos CSS
├── script.js              # Lógica JavaScript
└── README.md              # Documentación
```

## 🚀 Instalación y Uso

1. **Clonar o descargar** los archivos del proyecto
2. **Abrir** `simulador-solar.html` en un navegador web moderno
3. **Configurar** los parámetros del sistema en el panel izquierdo
4. **Hacer clic** en "Ejecutar Simulación" para ver los resultados
5. **Analizar** los gráficos y derivadas parciales para optimización

## 📊 Parámetros de Entrada

### Ubicación Geográfica
- **Latitud**: -90° a +90° (grados)
- **Longitud**: -180° a +180° (grados)

### Configuración de Paneles
- **Número de paneles**: 1 a 1000
- **Área por panel**: 0.1 a 10 m²
- **Inclinación**: 0° a 90°
- **Orientación (Azimut)**: 0° a 360°

### Propiedades Térmicas
- **Capacidad calorífica**: 1000 a 10000 J/kg·K
- **Masa térmica**: 100 a 10000 kg
- **Difusividad térmica**: 1e-8 a 1e-5 m²/s

## 🧮 Modelos Matemáticos

### Cálculo de Irradiancia Solar
```javascript
// Ángulo de elevación solar
elevacion = asin(sin(lat) * sin(decl) + cos(lat) * cos(decl) * cos(anguloHorario))

// Irradiancia directa
irradianciaDirecta = 1000 * sin(elevacion) * exp(-0.1 / sin(elevacion))

// Factor de inclinación
factorInclinacion = cos((inclinacion - elevacion) * π/180)
```

### Modelado Térmico
```javascript
// Cambio de temperatura
ΔT = (calorGenerado - perdidasTermicas) * dt / (masa * capacidadCalorifica)

// Aplicación de difusividad
T_nueva = T_actual * (1 - difusividad * 1000)
```

### Derivadas Parciales
```javascript
// Derivada respecto a la inclinación
∂T/∂θ ≈ (T(θ+h) - T(θ)) / h

// Derivada respecto al área
∂E/∂A ≈ (E(A+h) - E(A)) / h
```

## 📈 Resultados y Métricas

- **Energía Solar Captada**: Energía total en Wh
- **Temperatura Máxima**: Temperatura pico del sistema en °C
- **Agua Tratada**: Volumen de agua purificada en L/día
- **Eficiencia Global**: Rendimiento del sistema en %
- **Derivadas Parciales**: Sensibilidad a cambios en parámetros

## 🎯 Aplicaciones Prácticas

### Sostenibilidad Energética
- Optimización de sistemas solares para comunidades rurales
- Reducción de dependencia de fuentes no renovables
- Análisis de viabilidad de proyectos solares

### Tratamiento de Agua
- Purificación de agua usando energía solar
- Sistemas de desalinización sostenibles
- Tratamiento de aguas residuales

### Educación y Investigación
- Herramienta educativa para cálculo multivariable
- Simulación de sistemas de energía renovable
- Análisis de optimización matemática

## 🔧 Personalización

El simulador es altamente personalizable:

- **Modificar modelos matemáticos** en `script.js`
- **Ajustar estilos visuales** en `styles.css`
- **Agregar nuevos parámetros** en el HTML
- **Implementar nuevos cálculos** en la clase `SimuladorSolar`

## 📚 Referencias Científicas

- Modelos de irradiancia solar basados en algoritmos astronómicos
- Ecuaciones de transferencia de calor con difusividad térmica
- Métodos numéricos para derivadas parciales
- Optimización multivariable para sistemas de energía renovable

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Puedes:

- Reportar bugs o problemas
- Sugerir nuevas funcionalidades
- Mejorar los modelos matemáticos
- Añadir nuevas visualizaciones

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo LICENSE para más detalles.

---

**Desarrollado con ❤️ para la educación en sostenibilidad energética y cálculo multivariable**
