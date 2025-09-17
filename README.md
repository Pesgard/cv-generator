# CV Generator 📄✨

Un generador de CV moderno y elegante construido con **SvelteKit** y **LaTeX**, que permite crear currículums profesionales en formato PDF de manera automática.

## 🚀 Características

- **Interfaz moderna**: Construida con SvelteKit y componentes reactivos
- **Generación LaTeX**: Utiliza plantillas LaTeX profesionales para crear PDFs de alta calidad
- **Compilación con Tectonic**: Motor LaTeX moderno y rápido
- **Arquitectura modular**: Fácil de extender y personalizar
- **Responsive**: Funciona perfectamente en dispositivos móviles y desktop
- **Personal Branding**: Template optimizado para desarrolladores y profesionales tech

## 🛠️ Tecnologías

### Frontend
- **SvelteKit** - Framework web moderno y reactivo
- **TypeScript** - Tipado estático para mayor robustez
- **CSS/SCSS** - Estilos modernos y responsive

### Backend
- **Node.js** - Runtime del servidor
- **LaTeX** - Sistema de composición tipográfica
- **Tectonic** - Compilador LaTeX moderno

## 📁 Arquitectura del Proyecto

```
cv-generator/
├── src/
│   ├── routes/
│   │   └── api/generate/
│   │       └── +server.ts          # API endpoint para generar PDF
│   ├── lib/
│   │   └── generation/
│   │       ├── buildLatex.ts        # Motor principal de generación
│   │       ├── escapeLatex.ts       # Utilidades de escape LaTeX
│   │       └── sections/            # Generadores por sección
│   │           ├── summary.ts
│   │           ├── experience.ts
│   │           ├── projects.ts
│   │           ├── education.ts
│   │           └── skills.ts
│   └── app.html
├── static/
│   └── cv-template.tex              # Template LaTeX base
└── .output/                         # Directorio temporal (ignorado en git)
```

## 🔄 Flujo de Generación

1. **Input de datos**: El usuario completa el formulario con su información
2. **Procesamiento**: Los datos se envían al endpoint `/api/generate`
3. **Generación LaTeX**: Se lee el template y se reemplazan los placeholders
4. **Compilación**: Tectonic compila el archivo `.tex` a PDF
5. **Entrega**: El PDF se retorna como respuesta para descarga

## 📋 Secciones del CV

- **Header**: Nombre y datos de contacto con iconos
- **Summary**: Resumen profesional personalizable
- **Work Experience**: Experiencia laboral con bullets o descripción
- **Projects**: Proyectos destacados con enlaces
- **Education**: Formación académica con GPA opcional
- **Skills**: Habilidades organizadas por categorías

## 🚀 Instalación y Uso

### Prerrequisitos

- **Node.js** (v18+)
- **Tectonic** - [Instalación](https://tectonic-typesetting.github.io/en-US/install.html)

```bash
# macOS con Homebrew
brew install tectonic

# Ubuntu/Debian
sudo apt install tectonic

# Windows con Chocolatey
choco install tectonic
```

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/cv-generator.git
cd cv-generator

# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Producción
npm run build
npm run preview
```

## 🎨 Personalización

### Modificar el Template LaTeX

Edita `static/cv-template.tex` para personalizar:
- Estilos y colores
- Tipografía
- Espaciado y layout
- Nuevas secciones

### Agregar Nuevas Secciones

1. Crea un nuevo archivo en `src/lib/generation/sections/`
2. Implementa la función generadora
3. Importa y usa en `buildLatex.ts`
4. Añade el placeholder al template

Ejemplo:
```typescript
// src/lib/generation/sections/certifications.ts
import { escapeLatex } from '../escapeLatex';

export function generateCertificationsSection(certifications: any[]): string {
  return certifications.map(cert => 
    `${escapeLatex(cert.name)} & ${escapeLatex(cert.date)} \\\\`
  ).join('\n');
}
```

## 📱 Template LaTeX Features

El template incluye:
- **Environments personalizados**: `jobshort` y `joblong` para experiencias
- **Iconos FontAwesome**: GitHub, LinkedIn, Email, Teléfono
- **Diseño responsive**: Optimizado para A4
- **Colores profesionales**: Enlaces en azul corporativo
- **Footer automático**: Fecha de última actualización

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para cambios importantes:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 👤 Autor

**Tu Nombre**
- GitHub: [@pesgard](https://github.com/pesgard)
- LinkedIn: [esgardpeinado](https://linkedin.com/in/esgardpeinado)
- Email: esgard.p@axmetech.com

## 🙏 Agradecimientos

- [SvelteKit](https://kit.svelte.dev/) por el excelente framework
- [Tectonic](https://tectonic-typesetting.github.io/) por el moderno compilador LaTeX
- [FontAwesome](https://fontawesome.com/) por los iconos
- Comunidad de LaTeX por las plantillas de inspiración

---

⭐ ¡Dale una estrella si te gusta el proyecto!