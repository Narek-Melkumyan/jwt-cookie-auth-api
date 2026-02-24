```md
# JWT Cookie Auth API (Node.js)

A simple authentication API built with Node.js and Express using JWT stored in HttpOnly cookies.  
Includes user registration, login, protected profile, admin-only route, logout, and account updates.

---

## Features
- Register users with hashed passwords (bcrypt)
- Login and issue JWT token (HttpOnly cookie)
- Protected routes with middleware (`auth`)
- Admin-only access to `/users`
- View profile (`/profile`)
- Logout (clears cookie)
- Edit user info (`/edit`)
- Change password (`/cpassword`)
- JSON file storage (`users.json`) for learning/demo purposes

---

## Tech Stack
- Node.js
- Express
- JSON Web Token (jsonwebtoken)
- bcrypt
- cookie-parser
- express-session
- cors
- dotenv

---

## Project Structure

```

    jwt-cookie-auth-api/
    ├── server.js
    ├── users.json
    ├── package.json
    ├── package-lock.json
    ├── .env.example
    ├── .gitignore
    └── README.md

````

---

## Setup Instructions

### 1. Clone the repository
```bash
git clone <repository-url>
cd jwt-cookie-auth-api
````

### 2. Install dependencies

```bash
npm install
```

### 3. Environment variables

Create a `.env` file based on `.env.example`.

Example:

```env
PORT=3000
SECRET=your_jwt_secret
```

---

## Run the server

```bash
npm start
```

Server runs on:

```
http://localhost:3000
```

---

## CORS Configuration

This API is configured for a local frontend origin:

* `http://localhost:63342`

If your frontend runs on a different port, update the `origin` value in the CORS setup.

---

## API Endpoints

### POST `/register`

Registers a new user.

Body:

```json
{
  "name": "Narek",
  "email": "narek@mail.com",
  "password": "123456",
  "role": true
}
```

Notes:

* `role` is used as `isAdmin` in the token payload.

---

### POST `/login`

Logs in a user and sets a JWT cookie named `token`.

Body:

```json
{
  "email": "narek@mail.com",
  "password": "123456"
}
```

---

### GET `/profile`

Protected route. Returns decoded token user data.

Requires:

* Cookie: `token`

---

### GET `/users`

Admin-only protected route. Returns all users from `users.json`.

Requires:

* Cookie: `token`
* `isAdmin: true` inside JWT payload

---

### GET `/logout`

Protected route. Clears the `token` cookie.

Requires:

* Cookie: `token`

---

### POST `/edit`

Updates a user's name/email by id.

Body:

```json
{
  "id": 123,
  "name": "New Name",
  "email": "new@mail.com"
}
```

---

### POST `/cpassword`

Protected route. Changes the logged-in user's password.

Body:

```json
{
  "password": "oldPassword",
  "newPassword": "newPassword"
}
```

Requires:

* Cookie: `token`

---


## Author

**Narek Melkumyan**

* LinkedIn: [https://www.linkedin.com/in/narek-melkumyan-60164a374/](https://www.linkedin.com/in/narek-melkumyan-60164a374/)

```
```
