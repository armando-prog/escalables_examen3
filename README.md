# Notas Rápidas

Examen parcial 3 de la materia **Aplicaciones Web Escalables**. Es una aplicación web
para crear, consultar y editar notas, desarrollada con Angular, Node.js, Express y MongoDB.

Este ejercicio implementa el alcance de la consigna de Notas Rápidas, con edición
de notas como mejora adicional. No es el proyecto final del curso descrito en el
PDF de especificaciones, que tiene requisitos adicionales y se trabajará por separado.

## Requisitos

- Node.js 20.19.x, 22.12.x o 24.x.
- Una instancia de MongoDB local o una URI de MongoDB Atlas.

## Preparar el backend

Si no tienes MongoDB instalado, inicia la base de datos local con Docker desde la
carpeta del proyecto:

```powershell
docker compose up -d mongodb
```

Abre otra terminal en `backend` e instala las dependencias:

```powershell
npm install
Copy-Item .env.example .env
```

Revisa `backend/.env`. El valor de ejemplo conecta a una instancia local en el puerto
27017. Si usas MongoDB Atlas, reemplaza `MONGODB_URI` con la URI de tu cluster.

Inicia la API:

```powershell
npm run dev
```

La API queda disponible en `http://localhost:3000`. El estado del servidor se puede
consultar en `http://localhost:3000/api/health`.

## Preparar Angular

En otra terminal, desde `frontend`, instala dependencias e inicia la aplicación:

```powershell
npm install
npm start
```

Abre la dirección que muestra Angular CLI (normalmente `http://localhost:4200`).
El frontend envía las solicitudes a `http://localhost:3000/api/notas`.

## Probar la API con Postman

- `GET http://localhost:3000/api/notas` devuelve todas las notas.
- `POST http://localhost:3000/api/notas` crea una nota. Usa `Body` → `raw` → `JSON`:

```json
{
  "titulo": "Primera nota",
  "contenido": "Probando la API desde Postman"
}
```

Una nota sin título o contenido recibe una respuesta `400`. Las notas guardadas se
conservan en MongoDB.

- `PATCH http://localhost:3000/api/notas/ID_DE_LA_NOTA` actualiza título y contenido
  de una nota existente. Usa el mismo JSON del ejemplo, sustituyendo el ID por el
  `_id` devuelto al crearla.

Para detener MongoDB al terminar, ejecuta `docker compose down` desde la carpeta del
proyecto. Los datos se conservan en el volumen de Docker.
