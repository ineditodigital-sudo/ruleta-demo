# Sistema de Ruleta de Premios - White Label

## 🎯 Descripción

Sistema completamente **white-label** de activación de marca basado en una ruleta de premios interactiva con registro de leads. Sin menciones de marca específica, listo para personalizar con tu propia identidad corporativa. Optimizado para tótems táctiles y eventos.

## 🏷️ Valores Predeterminados (White Label)

El sistema viene preconfigurado con valores genéricos y neutrales:
- **Nombre de Empresa**: "Tu Empresa" (personalizable)
- **Nombre del Sistema**: "Ruleta de Premios" (personalizable)
- **Modo White Label**: Activado por defecto
- **Logo**: No incluido (configurable vía URL)
- **Colores**: Gradiente indigo/púrpura neutro (totalmente personalizable)

## 🔄 Migración Automática de Datos

Si el sistema detecta datos antiguos (ej: "Inédito Digital"), mostrará automáticamente un diálogo sugiriendo resetear el sistema. También puedes:

1. **Usar la página de reset**: Visita `/reset.html`
2. **Reset manual**: Abre DevTools > Console > `localStorage.clear()` > Recargar página

## 🚀 Características Principales

### Vista Pública (/totem)
- ✅ **Pantalla Splash Animada** con logo de la empresa
- ✅ Pantalla de registro con validación de campos
- ✅ **Logo visible en todas las pantallas** (registro, ruleta, resultado)
- ✅ **Flecha indicadora mejorada** en la ruleta
  - Color rojo brillante para máxima visibilidad
  - Sombra pronunciada para contraste
  - Indicador vertical extendido
  - Apunta claramente al premio ganador
- ✅ Ruleta animada con segmentos personalizables
- ✅ **Sin desbordamientos** durante la animación de giro
- ✅ Sistema de premios con probabilidades configurables
- ✅ Pantalla de resultados con animaciones de celebración
- ✅ **Diseño optimizado para móviles verticales (portrait)**
- ✅ **Interfaz táctil responsive (320px - 1080px de ancho)**
- ✅ **Tamaños de fuente y botones optimizados para touch**
- ✅ Auto-reinicio para siguiente participante
- ✅ **Reinicio con splash screen** después de cada participación
- ✅ Contador de participaciones diarias
- ✅ Sin scroll horizontal innecesario
- ✅ Botones grandes y fáciles de presionar
- ✅ Formulario compacto y eficiente

### Flujo de Usuario Completo
1. **Splash Screen** (2.5 segundos)
   - Logo animado con efecto de escala y rotación
   - Indicador de carga con puntos animados
   - Transición suave a registro
   
2. **Registro de Participante**
   - Logo en la parte superior
   - Formulario con validación en tiempo real
   - Mensaje de bienvenida personalizado
   
3. **Ruleta de Premios**
   - Logo discreto en la parte superior
   - Ruleta contenida sin desbordamientos
   - Animación fluida de giro
   - Sin elementos que se salgan de pantalla
   
4. **Resultado del Premio**
   - Logo en la tarjeta de resultado
   - Efecto confetti celebratorio
   - Mensaje personalizado
   - Auto-regreso al splash en 5 segundos

### Panel de Administración (/admin)
- ✅ Login protegido (contraseña: admin123)
- ✅ Gestión completa de premios
- ✅ Configuración white-label
- ✅ Personalización de marca (logos, colores)
- ✅ Editor de mensajes del sistema
- ✅ Gestión de leads con exportación a CSV
- ✅ Configuración de juego (límites, animaciones, sonidos)
- ✅ Estadísticas en tiempo real
- ✅ Vista previa del diseño
- ✅ **Responsive para tablets y desktop**

## 📱 Optimización Móvil Táctil

### Tamaños Adaptables
- **Ruleta**: 320px en móvil, 400px en tablet
- **Botones**: Altura mínima de 56px para fácil tap
- **Inputs**: Altura de 56px (14 unidades Tailwind)
- **Texto**: Escalado apropiado para legibilidad

### Espaciados
- Padding compacto pero respirable
- Márgenes optimizados para contenido vertical
- Sin scroll horizontal
- Contenido centrado verticalmente

### Interacciones Táctiles
- Áreas de tap amplias (44px mínimo)
- Feedback visual en todos los toques
- Animaciones suaves y responsivas
- Estados hover/active claros

## 📱 Rutas

- `/totem` - Vista pública para tótem interactivo
- `/admin` - Panel de administración
- `/` - Redirige a /totem

## 🎨 Personalización

### Marca
- Logo personalizable
- Colores primarios y secundarios
- Nombre de empresa y sistema
- Modo white-label on/off

### Premios
- Crear/editar/eliminar premios
- Configurar probabilidades
- Límites de entrega por premio
- Colores personalizados por segmento
- Activar/desactivar premios

### Mensajes
- Mensaje de bienvenida
- Texto antes de girar
- Mensaje de felicitación
- Mensaje adicional configurable
- Texto de términos y condiciones

### Configuración
- Límite diario de participaciones
- Duración del giro de ruleta
- Activar/desactivar registro obligatorio
- Activar/desactivar sonidos
- Activar/desactivar animaciones

## 💾 Persistencia de Datos

El sistema usa `localStorage` para guardar:
- Configuración de marca
- Lista de premios
- Participantes y leads
- Mensajes del sistema
- Configuración del juego

## 📊 Gestión de Leads

- Tabla completa de participantes
- Filtros y búsqueda
- Exportación a CSV
- Indicador de consentimiento
- Historial de premios ganados

## 🎯 Características Especiales

- **Auto-reset**: La pantalla del tótem se reinicia automáticamente después de 5 segundos
- **Validación**: Límite de una participación por email/teléfono
- **Animaciones**: Confetti y efectos visuales en premios ganados
- **Responsive**: Optimizado para pantallas táctiles verticales
- **Modular**: Código organizado y reutilizable

## 🔧 Tecnologías Utilizadas

- React 18
- TypeScript
- React Router DOM
- Motion (Framer Motion)
- Tailwind CSS v4
- Radix UI Components
- Lucide Icons

## 🎮 Cómo Usar

1. **Acceder al tótem**: Visita `/totem` para la experiencia del usuario
2. **Administrar**: Ve a `/admin` e ingresa con la contraseña
3. **Configurar**: Personaliza premios, marca y mensajes
4. **Exportar datos**: Descarga los leads en formato CSV

## 🔒 Seguridad

- Sistema de autenticación simple para el admin
- Validación de formularios
- Protección de rutas
- Almacenamiento local seguro

## 📈 Próximas Mejoras Sugeridas

- Integración con Supabase para persistencia real
- Autenticación avanzada con JWT
- API REST para múltiples clientes
- Dashboard de analytics avanzado
- Notificaciones por email
- Integración con CRM
- Modo offline
- PWA para instalación

## 🎨 Personalización Visual

El sistema es completamente personalizable:
- Gradientes de fondo dinámicos
- Colores de marca configurables
- Tipografía moderna y legible
- Animaciones suaves y profesionales
- Diseño limpio tipo SaaS

---

**Sistema de Ruleta de Premios** - White Label 🚀  
Producto listo para personalizar y vender a múltiples clientes