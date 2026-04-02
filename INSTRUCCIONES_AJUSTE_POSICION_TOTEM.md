# Instrucciones para Ajustar la Vista Previa en el Tótem

## Problema a Resolver
Necesito que la vista previa interactiva (diseñada para 1080x1920) se posicione perfectamente dentro de la pantalla del mockup del tótem. Actualmente puede estar desalineada, muy grande, muy pequeña, o fuera de posición.

## Configuración Actual que Funciona

En el proyecto de referencia, estos valores funcionan perfectamente con la imagen del tótem de Inédito Digital:

```typescript
demoConfig: {
  frameImageUrl: 'https://imagenes.inedito.digital/INEDITO%20DIGITAL/Totem.png',
  screenTop: '14.5%',
  screenLeft: '12.6%',
  screenWidth: '76.5%',
  screenHeight: '54%',
  screenBorderRadius: '8px'
}
```

## Cómo Funcionan los Valores

### 1. `frameImageUrl`
- URL de la imagen PNG del mockup del tótem
- Debe tener fondo transparente
- La pantalla del tótem debe ser visible (generalmente de color verde o azul para facilitar la medición)

### 2. `screenTop` (posición vertical)
- Porcentaje desde la parte **superior** de la imagen del tótem hasta donde **empieza** la pantalla
- Ejemplo: `'14.5%'` significa que la pantalla empieza al 14.5% de altura desde arriba

### 3. `screenLeft` (posición horizontal)
- Porcentaje desde la parte **izquierda** de la imagen del tótem hasta donde **empieza** la pantalla
- Ejemplo: `'12.6%'` significa que la pantalla empieza al 12.6% de ancho desde la izquierda

### 4. `screenWidth` (ancho de la pantalla)
- Porcentaje del **ancho total** de la imagen que ocupa la pantalla
- Ejemplo: `'76.5%'` significa que la pantalla ocupa el 76.5% del ancho total del tótem

### 5. `screenHeight` (alto de la pantalla)
- Porcentaje de la **altura total** de la imagen que ocupa la pantalla
- Ejemplo: `'54%'` significa que la pantalla ocupa el 54% de la altura total del tótem

### 6. `screenBorderRadius`
- Radio de borde para las esquinas de la pantalla
- Ejemplo: `'8px'` para esquinas ligeramente redondeadas
- Usa `'0px'` para esquinas cuadradas
- Usa `'16px'` o más para esquinas muy redondeadas

## Proceso de Calibración Paso a Paso

### Método 1: Usando un Editor de Imágenes (Recomendado)

1. **Abre tu imagen del tótem en Photoshop, GIMP, Figma o cualquier editor**

2. **Obtén las dimensiones totales de la imagen**
   - Ejemplo: 1000px de ancho × 2000px de alto

3. **Mide la posición de la pantalla desde arriba (screenTop)**
   - Usa la herramienta de medición
   - Mide desde el borde superior hasta donde empieza la pantalla
   - Ejemplo: Si son 290px desde arriba en una imagen de 2000px de alto
   - Cálculo: `(290 / 2000) × 100 = 14.5%`
   - Resultado: `screenTop: '14.5%'`

4. **Mide la posición desde la izquierda (screenLeft)**
   - Mide desde el borde izquierdo hasta donde empieza la pantalla
   - Ejemplo: Si son 126px desde la izquierda en una imagen de 1000px de ancho
   - Cálculo: `(126 / 1000) × 100 = 12.6%`
   - Resultado: `screenLeft: '12.6%'`

5. **Mide el ancho de la pantalla (screenWidth)**
   - Mide el ancho de la zona de la pantalla
   - Ejemplo: Si la pantalla mide 765px de ancho en una imagen de 1000px total
   - Cálculo: `(765 / 1000) × 100 = 76.5%`
   - Resultado: `screenWidth: '76.5%'`

6. **Mide el alto de la pantalla (screenHeight)**
   - Mide el alto de la zona de la pantalla
   - Ejemplo: Si la pantalla mide 1080px de alto en una imagen de 2000px total
   - Cálculo: `(1080 / 2000) × 100 = 54%`
   - Resultado: `screenHeight: '54%'`

### Método 2: Ajuste Visual Iterativo (Más Rápido)

Si no quieres usar un editor de imágenes, puedes ajustar visualmente:

1. **Crea controles en el panel de admin** (si no los tienes):

```tsx
<div className="space-y-4">
  <div>
    <Label>Posición Top (desde arriba)</Label>
    <Input
      type="text"
      value={demoConfig.screenTop}
      onChange={(e) => updateDemoConfig({ screenTop: e.target.value })}
      placeholder="14.5%"
    />
  </div>

  <div>
    <Label>Posición Left (desde izquierda)</Label>
    <Input
      type="text"
      value={demoConfig.screenLeft}
      onChange={(e) => updateDemoConfig({ screenLeft: e.target.value })}
      placeholder="12.6%"
    />
  </div>

  <div>
    <Label>Ancho de Pantalla</Label>
    <Input
      type="text"
      value={demoConfig.screenWidth}
      onChange={(e) => updateDemoConfig({ screenWidth: e.target.value })}
      placeholder="76.5%"
    />
  </div>

  <div>
    <Label>Alto de Pantalla</Label>
    <Input
      type="text"
      value={demoConfig.screenHeight}
      onChange={(e) => updateDemoConfig({ screenHeight: e.target.value })}
      placeholder="54%"
    />
  </div>

  <div>
    <Label>Radio de Borde</Label>
    <Input
      type="text"
      value={demoConfig.screenBorderRadius}
      onChange={(e) => updateDemoConfig({ screenBorderRadius: e.target.value })}
      placeholder="8px"
    />
  </div>
</div>
```

2. **Ajusta los valores en tiempo real**:
   - Abre el `/demo` en una ventana
   - Abre el `/admin` en otra ventana
   - Modifica los valores en el admin y observa los cambios en el demo

3. **Empieza con valores base** si no sabes por dónde empezar:
   ```typescript
   screenTop: '15%'      // Ajusta ±5% hasta que se alinee arriba
   screenLeft: '12%'     // Ajusta ±5% hasta que se alinee a la izquierda
   screenWidth: '76%'    // Ajusta ±10% hasta que cubra el ancho
   screenHeight: '55%'   // Ajusta ±10% hasta que cubra el alto
   ```

4. **Ajuste fino**:
   - Si la pantalla está muy arriba: **aumenta** `screenTop`
   - Si está muy abajo: **disminuye** `screenTop`
   - Si está muy a la izquierda: **aumenta** `screenLeft`
   - Si está muy a la derecha: **disminuye** `screenLeft`
   - Si es muy ancha: **disminuye** `screenWidth`
   - Si es muy angosta: **aumenta** `screenWidth`
   - Si es muy alta: **disminuye** `screenHeight`
   - Si es muy baja: **aumenta** `screenHeight`

## Tabla de Referencia Rápida

| Problema | Ajustar | Dirección |
|----------|---------|-----------|
| Pantalla muy arriba | `screenTop` | ⬆️ Aumentar (ej: de 14% a 16%) |
| Pantalla muy abajo | `screenTop` | ⬇️ Disminuir (ej: de 14% a 12%) |
| Pantalla muy a la izquierda | `screenLeft` | ⬆️ Aumentar |
| Pantalla muy a la derecha | `screenLeft` | ⬇️ Disminuir |
| Pantalla muy ancha | `screenWidth` | ⬇️ Disminuir |
| Pantalla muy angosta | `screenWidth` | ⬆️ Aumentar |
| Pantalla muy alta | `screenHeight` | ⬇️ Disminuir |
| Pantalla muy baja | `screenHeight` | ⬆️ Aumentar |

## Verificación de que Está Bien Ajustado

La pantalla está correctamente ajustada cuando:

✅ Los **bordes superiores** de la pantalla del mockup y la vista previa coinciden
✅ Los **bordes inferiores** coinciden
✅ Los **bordes izquierdos** coinciden
✅ Los **bordes derechos** coinciden
✅ No hay **espacios blancos** visibles entre el mockup y la vista previa
✅ El contenido **no se desborda** fuera de la pantalla del mockup
✅ Se mantiene **bien alineado** al redimensionar la ventana del navegador

## Código Completo de la Sección de Admin

Añade esta sección a tu panel de administración:

```tsx
{/* Configuración de Vista Demo del Tótem */}
<div className="border rounded-lg p-4 sm:p-6 bg-white shadow-sm">
  <h3 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2">
    🖼️ Configuración de Vista Demo
  </h3>
  
  <div className="space-y-4">
    <div>
      <Label htmlFor="frameImageUrl">URL de la Imagen del Tótem</Label>
      <Input
        id="frameImageUrl"
        type="url"
        value={state.demoConfig.frameImageUrl}
        onChange={(e) => updateDemoConfig({ frameImageUrl: e.target.value })}
        placeholder="https://ejemplo.com/totem.png"
        className="font-mono text-sm"
      />
      <p className="text-xs text-gray-500 mt-1">
        Imagen PNG con fondo transparente del mockup del tótem
      </p>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="screenTop">Posición Top</Label>
        <Input
          id="screenTop"
          value={state.demoConfig.screenTop}
          onChange={(e) => updateDemoConfig({ screenTop: e.target.value })}
          placeholder="14.5%"
        />
        <p className="text-xs text-gray-500 mt-1">Desde arriba</p>
      </div>

      <div>
        <Label htmlFor="screenLeft">Posición Left</Label>
        <Input
          id="screenLeft"
          value={state.demoConfig.screenLeft}
          onChange={(e) => updateDemoConfig({ screenLeft: e.target.value })}
          placeholder="12.6%"
        />
        <p className="text-xs text-gray-500 mt-1">Desde la izquierda</p>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="screenWidth">Ancho de Pantalla</Label>
        <Input
          id="screenWidth"
          value={state.demoConfig.screenWidth}
          onChange={(e) => updateDemoConfig({ screenWidth: e.target.value })}
          placeholder="76.5%"
        />
        <p className="text-xs text-gray-500 mt-1">% del ancho total</p>
      </div>

      <div>
        <Label htmlFor="screenHeight">Alto de Pantalla</Label>
        <Input
          id="screenHeight"
          value={state.demoConfig.screenHeight}
          onChange={(e) => updateDemoConfig({ screenHeight: e.target.value })}
          placeholder="54%"
        />
        <p className="text-xs text-gray-500 mt-1">% de la altura total</p>
      </div>
    </div>

    <div>
      <Label htmlFor="screenBorderRadius">Radio de Borde</Label>
      <Input
        id="screenBorderRadius"
        value={state.demoConfig.screenBorderRadius}
        onChange={(e) => updateDemoConfig({ screenBorderRadius: e.target.value })}
        placeholder="8px"
      />
      <p className="text-xs text-gray-500 mt-1">
        Redondeo de esquinas (ej: 0px, 8px, 16px)
      </p>
    </div>

    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
      <p className="text-sm text-blue-800 font-semibold mb-2">💡 Valores actuales:</p>
      <div className="grid grid-cols-2 gap-2 text-xs text-blue-700 font-mono">
        <div>Top: {state.demoConfig.screenTop}</div>
        <div>Left: {state.demoConfig.screenLeft}</div>
        <div>Width: {state.demoConfig.screenWidth}</div>
        <div>Height: {state.demoConfig.screenHeight}</div>
      </div>
    </div>

    <Button
      onClick={() => {
        window.open('/demo', '_blank');
      }}
      className="w-full"
    >
      🔍 Abrir Vista Demo para Verificar
    </Button>
  </div>
</div>
```

## Función de Actualización del Estado

Asegúrate de tener esta función en tu Context/Estado global:

```typescript
const updateDemoConfig = (updates: Partial<DemoConfig>) => {
  setState((prev) => ({
    ...prev,
    demoConfig: {
      ...prev.demoConfig,
      ...updates,
    },
  }));
};
```

## Tips Importantes

1. **Siempre usa porcentajes para posición y tamaño** (excepto `borderRadius` que usa px)
2. **Incluye el símbolo %** en los valores: `'14.5%'` no `'14.5'`
3. **Los cambios son inmediatos**: si tienes localStorage, se guardarán automáticamente
4. **Prueba en diferentes tamaños de pantalla**: redimensiona la ventana para verificar
5. **La imagen del tótem debe tener fondo transparente**: PNG con canal alpha

## Valores por Defecto Seguros

Si pierdes los valores o necesitas resetear, usa estos valores base que funcionan con la mayoría de mockups estándar:

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

## Solución de Problemas Comunes

### Problema: La pantalla no aparece
**Solución**: Verifica que `screenTop` y `screenLeft` no sean valores muy altos (no más de 30%)

### Problema: La pantalla es muy pequeña
**Solución**: Aumenta `screenWidth` y `screenHeight` (prueba con 80% y 60% respectivamente)

### Problema: La pantalla se sale del tótem
**Solución**: Disminuye `screenWidth` y `screenHeight`, o ajusta `screenTop` y `screenLeft`

### Problema: El contenido se ve distorsionado
**Solución**: Esto es normal en el escalado. Asegúrate de que tu componente móvil esté diseñado para 1080x1920

### Problema: Los cambios no se guardan
**Solución**: Verifica que la función `updateDemoConfig` esté correctamente conectada al estado global y que se esté guardando en localStorage

## Comando Final para la IA

Copia y pega esto:

```
Necesito implementar controles en mi panel de administración (/admin) para ajustar la posición de la vista previa en el mockup del tótem (/demo).

Requisitos:
1. Añadir una sección "Configuración de Vista Demo" con inputs para:
   - frameImageUrl (URL de la imagen del tótem)
   - screenTop (posición desde arriba, ej: "14.5%")
   - screenLeft (posición desde la izquierda, ej: "12.6%")
   - screenWidth (ancho de la pantalla, ej: "76.5%")
   - screenHeight (alto de la pantalla, ej: "54%")
   - screenBorderRadius (redondeo de esquinas, ej: "8px")

2. Los cambios deben reflejarse inmediatamente en /demo
3. Los valores deben guardarse en el estado global y localStorage
4. Incluir un botón para abrir /demo en una nueva ventana

Valores por defecto que funcionan:
{
  frameImageUrl: 'https://imagenes.inedito.digital/INEDITO%20DIGITAL/Totem.png',
  screenTop: '14.5%',
  screenLeft: '12.6%',
  screenWidth: '76.5%',
  screenHeight: '54%',
  screenBorderRadius: '8px'
}

Usa el código de referencia del documento "INSTRUCCIONES_AJUSTE_POSICION_TOTEM.md"
```
