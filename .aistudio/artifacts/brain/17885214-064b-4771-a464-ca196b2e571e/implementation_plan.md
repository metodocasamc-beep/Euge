# El Método Diferencial: Todo tu proyecto en un solo lugar

Integración del método diferencial de Método CASA como pilar central de valor en la portada de Inicio y en toda la plataforma, comunicando con precisión cómo esta solución centralizada agiliza, facilita y economiza tiempo y dinero para el cliente, combinando cercanía profesional con un proceso 100% intuitivo, transparente y predecible.

### User Review & Critical Decisions

> [!IMPORTANT]
> A partir de las aclaraciones confirmadas por el usuario en la Fase 1, se establecen las siguientes definiciones de diseño e integración:

- **Ubicación en Inicio**: Inmediatamente debajo del Hero principal, visible en el primer scroll, se implementará un **bloque interactivo destacado** que despliega los 4 pilares de agilidad y la comparativa visual de la experiencia.
- **Identidad y Título Oficial**: Se adoptará el título confirmado: **"El Método Diferencial: Todo tu proyecto en un solo lugar"** con la bajada explicativa: *"Buscamos practicidad y funcionalidad en los espacios y también en el proceso. Diseñar tu casa debería ser claro, ordenado, confiable y seguro."*
- **Cuadro Comparativo Directo**: Se incorporará una tabla comparativa interactiva que contrapone el **Interiorismo Tradicional** vs. **Método CASA** en 5 ejes clave:
  1. *Presupuestos y Costos*: Precios ocultos y sorpresas vs. Tarifas públicas, calculadora inmediata y hasta 3 cuotas.
  2. *Tiempo y Agilidad*: Semanas de idas y vueltas por chat vs. Reserva directa en 72hs y entregas en 5 a 10 días hábiles.
  3. *Organización y Documentación*: Archivos y fotos perdidos en emails o WhatsApp vs. Mi Espacio centralizado con visor de láminas y videos.
  4. *Visualización y Certeza*: Explicaciones en el aire o croquis confusos vs. Renders fotorrealistas 3D con recorrido en video de Euge.
  5. *Ejecución con Gremios*: Dudas de carpinteros y albañiles en obra vs. Carpeta técnica con planos milimétricos y especificaciones.
- **Consistencia Transversal**: Esta misma dinámica de previsibilidad y orden se reflejará en `ServicesView` (tiempos de entrega y qué incluye), `DiagnosticView` (soluciones sin vueltas) y en el portal privado `Mi Espacio`.

---

### 1. Overview & Core Concept

- **El Problema del Interiorismo Convencional**: Quienes buscan renovar su casa a menudo se encuentran con falta de transparencia en los honorarios, tiempos de espera indefinidos, dispersión de información entre chats y correos, y la incertidumbre de no saber cómo va a quedar el espacio hasta que ya gastaron demasiado dinero.
- **La Solución de Método CASA**: Una plataforma integral que profesionaliza y digitaliza el ciclo completo (cotización instantánea, reserva online, formulario de diagnóstico asistido, entrega de láminas 3D y video, feedback en 10 días y carpeta técnica), brindando una experiencia personalizada, cálida y sin fricciones.

---

### 2. User Experience & Visual Design

#### Flujo Visual en la Portada de Inicio

```
┌────────────────────────────────────────────────────────────────────────┐
│ HERO: "Diseño espacios que se adaptan a tu forma de vivirlos"         │
│       Subtítulo con énfasis en la plataforma online integral           │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ BLOQUE INTERACTIVO: "El Método Diferencial"                            │
│ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌──────────────┐ │
│ │ 01. Ahorro de │ │ 02. Precios a │ │ 03. Todo en un │ │ 04. Cercanía │ │
│ │     Tiempo    │ │     la Vista  │ │  solo Lugar    │ │  Mano a Mano │ │
│ └───────────────┘ └───────────────┘ └───────────────┘ └──────────────┘ │
│                                                                        │
│ TABLA COMPARATIVA: Interiorismo Tradicional  vs.  Método CASA          │
│ • Tiempos · Costos · Canales · Entregables · Certeza en Obra          │
│                                                                        │
│ RECORRIDO DEL PROCESO EN 4 PASOS:                                      │
│ Cotizás online ➔ Reservás en 1 clic ➔ Diagnóstico ➔ Propuesta 3D       │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ FILOSOFÍA "A eso me dedico" + MIS SERVICIOS + DIAGNÓSTICO GUIADO       │
└────────────────────────────────────────────────────────────────────────┘
```

1. **Kicker y Hero Reforzado**:
   - Se añade en el Hero de `HomeView` la afirmación de la plataforma: *"Una experiencia diseñada para ahorrarte tiempo, dinero e incertidumbre: todo tu proyecto organizado, de punta a punta."*
2. **Bloque "El Método Diferencial"**:
   - Tarjetas dinámicas con microinteracciones que muestran el impacto real en el cliente:
     - **Economía de Tiempo**: Proceso estandarizado que evita meses de reuniones preliminares improductivas.
     - **Economía de Dinero**: Conocer el costo exacto antes de empezar, calcular m² online y abonar en cuotas fijas.
     - **Orden & Centralización**: Acceso privado desde cualquier dispositivo a los entregables sin descargar archivos gigantes.
     - **Criterio Profesional**: La mirada experta de la Lic. Euge Demarco resolviendo las dudas reales del hogar.
3. **Tabla Comparativa Interactiva**:
   - Diseño limpio y editorial con contrastes visuales (fondo suave y tipografía nítida, sin slop ni colores chillones) destacando el antes y el después de elegir Método CASA.
4. **Refuerzo en Servicios y Mi Espacio**:
   - En las tarjetas de servicios y en el footer se ratifican los principios de claridad, confiabilidad y cumplimiento de expectativas.

---

### 3. Key Product Decisions & Trade-Offs

- **Integración Nativa dentro de `HomeView`**:
  - *Decisión*: Implementar el bloque directamente en `HomeView.tsx` entre el Hero y el Manifiesto, permitiendo que cualquier persona que aterrice en la web lo comprenda en los primeros 10 segundos de navegación.
  - *Razón*: Cumple con el requerimiento de *"debería verse de buenas a primeras cuando entra una persona a mi web/plataforma"*.
- **Cuadro Comparativo con Métricas Humanas**:
  - *Decisión*: Enfocar los ejes comparativos en el estrés, tiempo y dinero del cliente cotidiano en lugar de tecnicismos gremiales.
  - *Razón*: Conecta inmediatamente con la frustración previa que suelen experimentar los clientes al contratar servicios de diseño.
- **Preservación Integral de la Arquitectura Existente**:
  - *Decisión*: La implementación no altera ninguna lógica de backend, reservas ni el portal del cliente, sino que enriquece los componentes de frontend y navegación.

---

### 4. Technical Architecture & Component Mapping

```
┌──────────────────────────────────────────────────────────────────┐
│                           HomeView.tsx                           │
│  ├── Hero Section (Con badge de plataforma integral)             │
│  ├── DifferentialMethodSection (NUEVO COMPONENTE / BLOQUE)       │
│  │   ├── 4 Pilares de Agilidad & Economía                        │
│  │   ├── Interactive Comparison Table (Tradicional vs CASA)      │
│  │   └── Step-by-Step Delivery Roadmap (4 hitos claros)          │
│  ├── Manifiesto & Filosofía ("A eso me dedico")                  │
│  ├── Servicios Preview (Tarjetas $110k+)                         │
│  └── Diagnóstico Teaser & Sobre Euge                             │
└──────────────────────────────────────────────────────────────────┘
```

- **Archivos a modificar**:
  - `src/components/HomeView.tsx`: Inserción del bloque interactivo con los pilares, comparativa y roadmap guiado.
  - `src/components/ServicesView.tsx`: Inclusión de notas de certeza y agilidad en las descripciones de entrega.
