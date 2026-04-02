# Instrucciones para Replicar la Responsividad del DemoView

## Contexto
Necesito crear una vista de demostración que muestre un mockup de tótem físico con una pantalla interactiva incrustada. La pantalla debe escalar automáticamente el contenido (diseñado para 1080x1920) para que se ajuste perfectamente dentro del área visible del mockup, sin importar el tamaño de la ventana del navegador.

## Estructura de Datos Requerida

Necesito almacenar la configuración de posicionamiento de la pantalla en el estado (puede ser context, Redux, Zustand, etc.):

```typescript
interface DemoConfig {
  frameImageUrl: string;        // URL de la imagen del marco/tótem
  screenTop: string;             // Posición top de la pantalla (ej: "14.5%")
  screenLeft: string;            // Posición left de la pantalla (ej: "12.6%")
  screenWidth: string;           // Ancho de la pantalla (ej: "76.5%")
  screenHeight: string;          // Alto de la pantalla (ej: "54%")
  screenBorderRadius: string;    // Radio del borde (ej: "8px")
}
```

Valores de ejemplo que funcionan bien:
```typescript
{
  frameImageUrl: 'https://imagenes.inedito.digital/INEDITO%20DIGITAL/Totem.png',
  screenTop: '14.5%',
  screenLeft: '12.6%',
  screenWidth: '76.5%',
  screenHeight: '54%',
  screenBorderRadius: '8px'
}
```

## Código del Componente

### 1. Imports y Estado

```typescript
import React, { useRef, useEffect, useState } from 'react';

const DemoView: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  
  // Obtener la configuración desde tu estado global
  // const demoConfig = tuEstadoGlobal.demoConfig;
```

### 2. Hook de Escalado Automático

Este es el corazón de la responsividad. Calcula la escala necesaria para que el contenido 1080x1920 quepa en el área disponible:

```typescript
  useEffect(() => {
    const updateScale = () => {
      if (screenRef.current) {
        const rect = screenRef.current.getBoundingClientRect();
        // El contenido interno usa 1080x1920, calculamos escala basada en el área disponible
        const scaleX = rect.width / 1080;
        const scaleY = rect.height / 1920;
        // Usamos el menor para que todo quepa sin recortar
        setScale(Math.min(scaleX, scaleY));
      }
    };

    // Esperar a que la imagen del marco se cargue
    const img = new Image();
    img.src = demoConfig.frameImageUrl;
    img.onload = () => {
      setTimeout(updateScale, 100);
    };

    // Actualizar cuando cambie la configuración o el tamaño de ventana
    updateScale();

    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [demoConfig.frameImageUrl, demoConfig.screenTop, demoConfig.screenLeft, demoConfig.screenWidth, demoConfig.screenHeight]);
```

### 3. Estructura HTML/JSX

```tsx
  return (
    <div
      ref={containerRef}
      className="w-full min-h-screen flex flex-col items-center justify-center overflow-auto py-8 px-4 relative"
      style={{
        backgroundImage: 'url(TU_FONDO_AQUI)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Overlay semi-transparente para mejorar legibilidad */}
      <div className="absolute inset-0 bg-black/10 -z-10" />
      
      {/* Texto informativo superior (opcional) */}
      <div className="text-center mb-6 max-w-2xl bg-white/90 backdrop-blur-md rounded-2xl shadow-lg px-8 py-6 border border-gray-200">
        <h1 className="text-4xl font-bold text-gray-800 mb-3">
          Demostración Interactiva
        </h1>
        <p className="text-gray-600 text-lg mb-2">
          Esta es una simulación de cómo se verá la experiencia en un tótem físico
        </p>
      </div>

      {/* Contenedor del marco del tótem */}
      <div className="relative">
        {/* Sombra en el suelo (opcional pero recomendada) */}
        <div 
          className="absolute bottom-0 w-full h-16 bg-black blur-3xl rounded-full"
          style={{
            left: '50%',
            transform: 'translateX(-50%) translateY(50%)',
          }}
        />
        
        {/* Marco del tótem - la imagen PNG del mockup */}
        <img
          src={demoConfig.frameImageUrl}
          alt="Marco del Tótem"
          className="w-auto h-auto max-h-[75vh] object-contain select-none pointer-events-none relative z-10"
          draggable={false}
        />

        {/* Pantalla interactiva posicionada SOBRE el marco */}
        <div
          ref={screenRef}
          className="absolute overflow-hidden bg-white cursor-pointer hover:ring-4 hover:ring-purple-500 transition-all z-20"
          style={{
            top: demoConfig.screenTop,
            left: demoConfig.screenLeft,
            width: demoConfig.screenWidth,
            height: demoConfig.screenHeight,
            borderRadius: demoConfig.screenBorderRadius,
          }}
        >
          {/* 🔑 CLAVE: Contenedor escalado para simular viewport de 1080x1920 */}
          <div
            style={{
              width: '1080px',
              height: '1920px',
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
              pointerEvents: 'none',
            }}
          >
            {/* AQUÍ VA TU CONTENIDO QUE DEBE SER DISEÑADO PARA 1080x1920 */}
            <TuComponenteMovil />
          </div>

          {/* Overlay con indicador de clic (opcional) */}
          <div className="absolute inset-0 bg-black/0 hover:bg-black/5 transition-all flex items-center justify-center pointer-events-none">
            <div className="bg-purple-600 text-white px-6 py-3 rounded-full font-semibold text-lg opacity-0 hover:opacity-100 transition-opacity">
              Clic para ver experiencia completa
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
```

## Cómo Funciona

### Paso a Paso:

1. **Marco Base**: Una imagen PNG del tótem se muestra con `max-h-[75vh]` para que siempre quepa en pantalla

2. **Área de Pantalla**: Un `div` posicionado de forma `absolute` sobre el marco usando porcentajes (top, left, width, height)

3. **Contenedor Interno**: Un `div` de tamaño fijo 1080x1920px que contiene tu componente móvil

4. **Escalado Dinámico**: 
   - Se obtiene el tamaño real del área de pantalla con `getBoundingClientRect()`
   - Se calcula `scaleX = anchoPantalla / 1080`
   - Se calcula `scaleY = altoPantalla / 1920`
   - Se usa `Math.min(scaleX, scaleY)` para que quepa sin deformarse
   - Se aplica con `transform: scale(${scale})`

5. **Transform Origin**: Se usa `top left` para que el escalado empiece desde la esquina superior izquierda

### Ajustes de Posicionamiento

Para ajustar dónde aparece la pantalla en el mockup:

1. Abre tu imagen del tótem en un editor
2. Mide los porcentajes desde arriba y desde la izquierda donde empieza la pantalla
3. Mide el ancho y alto de la pantalla como porcentaje del marco total
4. Actualiza los valores en `demoConfig`

Ejemplo:
- Si la pantalla empieza al 14.5% desde arriba → `screenTop: "14.5%"`
- Si empieza al 12.6% desde la izquierda → `screenLeft: "12.6%"`
- Si ocupa el 76.5% del ancho total → `screenWidth: "76.5%"`
- Si ocupa el 54% del alto total → `screenHeight: "54%"`

## Lightbox Modal (Bonus)

Si quieres añadir un modal que muestre la experiencia móvil completa al hacer clic:

```tsx
const [isLightboxOpen, setIsLightboxOpen] = useState(false);

// En el onClick del área de pantalla:
onClick={() => setIsLightboxOpen(true)}

// El modal (requiere framer-motion o similar):
{isLightboxOpen && (
  <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
    <div className="relative flex flex-col items-center">
      <button
        onClick={() => setIsLightboxOpen(false)}
        className="bg-white text-black p-3 rounded-full mb-4"
      >
        Cerrar
      </button>

      {/* Frame estilo iPhone */}
      <div className="bg-gray-900 rounded-[3rem] p-3 shadow-2xl">
        <div className="bg-white rounded-[2.5rem] overflow-hidden" style={{ aspectRatio: '9/16' }}>
          <iframe
            src="/tu-ruta-movil"
            className="w-full h-full border-0"
            style={{
              width: '450px',
              height: '800px',
              maxWidth: '90vw',
              maxHeight: '85vh',
            }}
          />
        </div>
      </div>
    </div>
  </div>
)}
```

## Dependencias de Tailwind CSS

Asegúrate de que Tailwind esté configurado con estas utilidades:
- `backdrop-blur-md`
- `ring-4`
- Opacidades (`/10`, `/90`, etc.)
- Bordes redondeados (`rounded-[3rem]`)

## Resumen de Valores Clave

```typescript
// Tamaño del viewport móvil simulado:
MOBILE_WIDTH = 1080
MOBILE_HEIGHT = 1920

// Fórmula de escalado:
scale = Math.min(
  anchoPantallaReal / MOBILE_WIDTH,
  altoPantallaReal / MOBILE_HEIGHT
)

// Aplicación:
transform: `scale(${scale})`
transformOrigin: 'top left'
```

## Notas Importantes

1. **El componente interno debe estar diseñado para 1080x1920**: No uses media queries dentro, asume que siempre tendrás ese tamaño
2. **Eventos de puntero**: Usa `pointerEvents: 'none'` en el contenedor escalado si tienes overlays encima
3. **Actualización en tiempo real**: El efecto se dispara cuando cambian las props del `demoConfig`, perfecto para un panel de admin
4. **Performance**: El cálculo es muy ligero, se puede ejecutar en cada resize sin problemas

## Testing

Prueba estos escenarios:
1. Redimensionar la ventana del navegador
2. Zoom del navegador (Ctrl/Cmd +/-)
3. Diferentes tamaños de pantalla (móvil, tablet, desktop)
4. Cambiar la imagen del marco dinámicamente
5. Ajustar los valores de posicionamiento en tiempo real
