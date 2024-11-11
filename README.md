# BookFinderApp

BookFinderApp es una aplicación de React para buscar libros utilizando la API de Google Books. Los usuarios pueden seleccionar categorías, filtrar resultados por idioma y ver más detalles de cada libro, incluyendo un enlace a Amazon para posibles compras. La aplicación también cuenta con scroll infinito para cargar más resultados automáticamente.

## Características

- **Selección de Categorías:** Filtra los resultados de búsqueda por categorías como Ficción, Ciencia, Historia y Tecnología.
- **Filtro por Idioma:** Permite a los usuarios filtrar los resultados según el idioma deseado (Español, Inglés, Francés, Alemán).
- **Scroll Infinito:** Carga automática de más libros al llegar al final de la página.
- **Enlaces a Amazon:** Incluye un enlace en cada libro para buscarlo en Amazon con el Amazon Tag configurado.

## Requisitos Previos

Antes de iniciar la aplicación, asegúrate de contar con:

- Node.js y npm instalados.
- Una cuenta en [Google Cloud](https://console.cloud.google.com/) para obtener una API Key de Google Books.
- Un Amazon Tag (afiliado) para incluir en los enlaces de Amazon.

## Instalación

1. Clona el repositorio:

   ```bash
   git clone https://github.com/tuusuario/BookFinderApp.git
   cd BookFinderApp
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Configura las variables de entorno:

   Crea un archivo `.env` en el directorio raíz y agrega tu API Key de Google y Amazon Tag:

   ```env
   REACT_APP_API_KEY=tu_google_books_api_key
   REACT_APP_AMAZON_TAG=tu_amazon_tag
   ```

## Uso

Ejecuta la aplicación en modo de desarrollo:

```bash
npm start
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

## Estructura de Archivos

- `src/Card.js` y `src/Button.jsx`: Componentes reutilizables para la interfaz de usuario.
- `src/Alert.jsx`: Muestra mensajes de error cuando la API falla o hay problemas en la búsqueda.
- `src/App.js`: Archivo principal que contiene la lógica de búsqueda, carga de libros y renderización de la aplicación.

## Funcionalidades Principales

- **Descubrir Categorías Dinámicamente**: La aplicación usa `discoverCategories()` para descubrir categorías populares según la búsqueda.
- **Cargar Más Resultados**: La función `loadMoreBooks()` permite cargar más libros cuando se detecta que el usuario ha llegado al final de la página.
- **Interfaz Limpia y Fácil de Usar**: Gracias a los componentes `Card`, `Button`, y `Alert`, la aplicación presenta un diseño limpio y profesional.

## Dependencias

- **React**: Biblioteca de JavaScript para construir interfaces de usuario.
- **Lucide-React**: Iconos SVG para mejorar la experiencia visual.
- **Google Books API**: Fuente de datos de libros.

## Personalización

Puedes personalizar las categorías iniciales en `INITIAL_CATEGORIES` dentro de `App.js`, o modificar los estilos CSS según tus necesidades.

## Contribuir

Las contribuciones son bienvenidas. Si encuentras un problema o tienes una mejora, abre un issue o envía un pull request.

## Licencia

Este proyecto está bajo la Licencia MIT.

