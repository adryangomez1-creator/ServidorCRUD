# ServidorCRUD

## Descripción

Proyecto desarrollado en Node.js y TypeScript que implementa una API REST utilizando el módulo nativo HTTP, sin usar Express. Permite realizar operaciones CRUD sobre usuarios y productos.

---

## Investigaciones previas

### ¿Qué es una API REST?

Es una interfaz que permite la comunicación entre aplicaciones mediante el protocolo HTTP utilizando métodos como GET, POST, PUT y DELETE.

### ¿Qué es CRUD?

CRUD representa las cuatro operaciones básicas sobre los datos:

- Create (Crear)
- Read (Leer)
- Update (Actualizar)
- Delete (Eliminar)

### Métodos HTTP

- GET: Obtener información.
- POST: Crear un registro.
- PUT: Actualizar un registro.
- DELETE: Eliminar un registro.

### Códigos HTTP

- 200: Operación realizada correctamente.
- 201: Recurso creado.
- 400: Solicitud incorrecta.
- 404: Recurso no encontrado.
- 405: Método no permitido.
- 409: Conflicto.
- 500: Error interno del servidor.

---

## Tecnologías utilizadas

- Node.js
- TypeScript
- pnpm
- Git
- GitHub
- Postman

---

## Funcionalidades

### Usuarios

- Crear usuario
- Listar usuarios
- Actualizar usuario
- Eliminar usuario

### Productos

- Crear producto
- Listar productos
- Actualizar producto
- Eliminar producto

---

## Validaciones

### Usuarios

- Nombre obligatorio.
- Correo obligatorio.
- Correo válido.
- Edad entre 1 y 120 años.
- Contraseña mínima de 6 caracteres.

### Productos

- Nombre obligatorio.
- Descripción obligatoria.
- Precio mayor a cero.
- Stock mayor o igual a cero.
- Categoría obligatoria.

### Servidor

- Validación de rutas.
- Validación del método HTTP.
- Validación del ID.
- Validación del JSON recibido.
- Manejo de errores.

---

## Pruebas realizadas

Se realizaron pruebas con Postman para:

- GET
- POST
- PUT
- DELETE

También se verificaron los casos de error para comprobar las validaciones del servidor.

---

## Autor

Adryan Gómez
