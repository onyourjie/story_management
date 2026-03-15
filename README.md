# Story Management System

## <a name="introduction"></a> Introduction :
This is a full-stack web application to manage stories and chapters. The project uses React 19 + TypeScript on frontend, and Express 5 + Prisma + PostgreSQL on backend.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Libraries](#libraries)
- [Project Structure](#project-structures)
- [APK Link](#apk-link)

## <a name="features"></a> Features :
- Story List (search by title/writer, filter by category/status, pagination)
- Add Story (title, author, synopsis, category, tags, status, cover image)
- Story Detail (read-only mode)
- Edit Story
- Delete Story
- Add Chapter (rich text editor)
- Edit Chapter (rich text editor)
- Delete Chapter
- Dashboard statistics (total stories, published stories, draft stories, total chapters)
- Backend API testing with Jest + Supertest (21 tests)
- Frontend component/unit testing with Vitest + Testing Library (25 tests)

## <a name="libraries"></a> Libraries :
Frontend
- React
- TypeScript
- Vite
- React Router DOM
- Axios
- Tailwind CSS
- Lucide React
- SweetAlert2
- react-quill-new
- Vitest
- React Testing Library

Backend
- Express
- Prisma
- PostgreSQL
- Multer
- Cloudinary
- Express Validator
- CORS
- Jest
- Supertest

## <a name="project-structures"></a> Project Structure :
Root
- `backend`
- `frontend`
- `README.md`

Frontend (`frontend/src`)
- `assets`
- `components`
- `hooks`
- `pages`
- `services`
- `test`
- `types`
- `utils`

Backend (`backend/src`)
- `__tests__`
- `config`
- `controllers`
- `middleware`
- `prisma`
- `routes`
- `services`
- `types`
- `utils`

## <a name="apk-link"></a> Website URL :
- Frontend:https://story-management-gohg.vercel.app/
- Backend: https://story-management-psi.vercel.app/api/stories

## Testing (Important)
- Backend tests (`backend/src/__tests__`) run `deleteMany()` to clean tables before/after tests.
- Configure a separate test database by creating `backend/.env.test` with `DATABASE_URL_TEST` (see `backend/.env.test.example`), so running `npm test` in `backend/` doesn’t wipe your main data.
