# Documentación del Proyecto

Esta documentación cubre el flujo completo de la aplicación: creación, edición y eliminación de productos; gestión de carrito; pasarela de pagos con Stripe; actualización de estado vía webhook; y despliegue con Docker.

---

## Índice

1. [Descripción general](#descripción-general)
2. [Stack tecnológico](#stack-tecnológico)
3. [Arquitectura de la aplicación](#arquitectura-de-la-aplicación)
4. [Estructura del repositorio](#estructura-del-repositorio)
5. [Entornos y variables de configuración](#entornos-y-variables-de-configuración)
6. [Instalación y ejecución local](#instalación-y-ejecución-local)
7. [Despliegue con Docker](#despliegue-con-docker)
8. [Detalles de la API](#detalles-de-la-api)
9. [Flujo de Stripe y webhook](#flujo-de-stripe-y-webhook)
10. [Comandos disponibles](#comandos-disponibles)
11. [Testing](#testing)
12. [Licencia](#licencia)

---


## Descripción general

La aplicación permite gestionar un catálogo de productos (create, read, update, delete), un carrito de compras y realizar el pago a través de Stripe. Tras el pago, un webhook de Stripe actualiza el estado del carrito.

La aplicación incluye:

- `Autenticación` con JWT (registro, login, perfil) y control de roles (USER, ADMIN)
- CRUD de tareas con validaciones, filtros y paginación
- Documentación interactiva con `Swagger`
- Pruebas unitarias y E2E con `Jest y Supertest`
- Emisión de eventos en tiempo real vía `WebSockets` cuando se crea o actualiza una tarea
- `Upload de archivos`: Se utiliza Multer para adjuntar imágenes a las tareas
- `Docker Compose`: Configuración para levantar backend, frontend y PostgreSQL en contenedores



---

## Stack tecnológico

* **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Framer Motion, React Router v6
* **Backend**: NestJS 9, TypeScript, TypeORM, PostgreSQL
* **Autenticación**: JWT (Passport)
* **Pagos**: Stripe SDK & Stripe CLI (webhooks)
* **Almacenamiento de archivos**: ServeStatic (local) o AWS S3
* **Testing**: Jest, Supertest
* **Docker**: Dockerfiles para front y back, Docker Compose

---

## Arquitectura de la aplicación

1. **Frontend** (SPA) consume la API REST del backend.
2. **Backend** expone endpoints bajo prefijo `/api`:

   * Gestión de productos `/api/productos`
   * Carrito `/api/carrito`
   * Pasarela de pago `/api/pagos`
   * Webhook `/api/webhook`
3. **Stripe CLI** en Docker redirige eventos a `/api/webhook` para actualizar estados.
4. **Base de datos** PostgreSQL guarda usuarios, productos, carritos y pagos.
5. **Uploads**: imágenes de productos se guardan en carpeta `uploads` y se sirven estáticamente en `/api/uploads`.

---

## Estructura del repositorio

```
├── back/                        # Código backend (NestJS)
│   ├── src/
│   ├── uploads/                 # Imágenes seed y subidas runtime
│   ├── .env                     # Variables de entorno
│   └── package.json
├── front/                       # Código frontend (React + Vite)
│   ├── src/
│   ├── nginx.conf               # Config para container estático
│   ├── .env                     # Variables de entorno Vite
│   └── package.json
├── Dockerfile.back              # Dockerfile único en root para back
├── Dockerfile.front             # Dockerfile único en root para front
├── docker-compose.yml
└── README.md                    # Esta documentación
```

---

## Entornos y variables de configuración

Antes de ejecutar la aplicación, debes generar tus archivos de entorno a partir de los ejemplos incluidos:

1. **Backend**

   ```bash
   cd back
   cp .env.example .env
   ```

   Luego abre `back/.env` y ajusta las variables.

2. **Frontend**

   ```bash
   cd front
   cp .env.example .env
   ```

   Abre `front/.env` y define:

   ```env
   # URL base de la API (debe incluir el prefijo /api)
   VITE_BACKEND_URL=http://localhost:3000/api
   ```

3. **Docker Compose (opcional)**

   Si usas variables en el *root* para Docker Compose, crea el archivo:

   ```bash
   cp .env.example .env
   ```

   en la raíz del proyecto (junto a `docker-compose.yml`), y luego agrega:

   ```env
   STRIPE_SECRET_KEY=sk_test_xxx
   STRIPE_WEBHOOK_SECRET=whsec_xxx
   ```

   Docker Compose cargará automáticamente este `.env` de nivel superior.

---

## Instalación y ejecución local

### Backend

```bash
cd back
npm install
npm run start:dev
```

Accede a `http://localhost:3000/api` y Swagger en `/api/docs`.

### Frontend

```bash
cd front
npm install
npm run dev
```

Visita `http://localhost:5173`.

---

## Despliegue con Docker

### Levantar todo con Docker Compose

```bash
docker-compose up --build
```

### Instrucciones Docker

* **Dockerfile.back**: build en 2 etapas, copia seed images (back/uploads) y dist.
* **Dockerfile.front**: build de Vite y nginx para servir `dist/`.
* **docker-compose.yml**: servicios `postgres`, `backend`, `frontend`, `stripe` (CLI).

---

## Detalles de la API

### Productos

* `GET /api/productos`
* `POST /api/productos`
* `GET /api/productos/:id`
* `PATCH /api/productos/:id`
* `DELETE /api/productos/:id`

### Carrito

* `GET /api/carrito/getActiveCart`
* `POST /api/carrito/add`
* `DELETE /api/carrito/remove/:itemId`

### Pagos (Checkout)

* `POST /api/pagos/create-session` → devuelve `url` para redirigir a Stripe Checkout.

### Webhook Stripe

* `POST /api/webhook` (público)

  * Verifica firma con `STRIPE_WEBHOOK_SECRET`.
  * Procesa eventos de pago y actualiza carrito.

---

## Flujo de General de la app

1. **Login y registro de usuario**  
   ![Login](assets/login.gif)

2. **Crear producto**  
   ![Crear producto](assets/create.gif)

3. **Eliminar y actualizar producto**  
   ![Actualizar producto](assets/update.gif)  
   ![Eliminar producto](assets/delete.gif)

4. **Añadir al carrito y crear orden de pago**  
   ![Añadir al carrito](assets/añadircarrito.gif)  
   ![Orden de pago](assets/ordendepago.gif)

5. **Webhook de Stripe y actualización de estado de pago**  
   ![Webhook Stripe](assets/stripe.gif)

6. **Flujo de checkout**  
   1. Usuario confirma compra → `createPaymentSession` → obtiene URL de Stripe.  
   2. Front redirige a Stripe Checkout.  
   3. Stripe emite evento `checkout.session.completed`, etc.  
   4. Stripe CLI (Docker) escucha y reenvía a `/api/webhook`.  
   5. Backend valida firma y actualiza el estado del carrito.

---