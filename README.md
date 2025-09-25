
# Usof backend

## Description

This repository is the backend part of the bigger project called usof - Q&A service for professional and enthusiast programmers.

It is REST API which provides CRUD operations with the database entities: Comment, Post, Category, Like, etc.

If you are interested in frontend part of the project, please, check this repository - [usof-frontend](https://github.com/Eug4n4/usof-frontend)

## Examples

Below you can find API request/response examples.

* POST /api/auth/register/

```json
POST http://localhost:3000/api/auth/register
Request body:
{
    "email": "yourmail@example.com",
    "login": "yourLogin",
    "password": "123456789",
    "password_confirm": "123456789",
    "full_name": "Your Full Name"
}

Response body: 
{
    "id": 8,
    "email": "yourmail@example.com",
    "login": "yourLogin",
    "photo": "uploads/avatars/user.png",
    "rating": 0,
    "full_name": "Your Full Name",
    "role": "user"
}
```

* POST /api/posts/

```json
POST http://localhost:3000/api/posts/
Request body:
{
    "title": "Post title",
    "content": "Here comes the description of your problem. Write something here",
    "categories":["java script", "asp.net", "CSS"]
}
Response body:
{
    "author": 2,
    "title": "Post title",
    "content": "Here comes the description of your problem. Write something here"
}
```

## Documentation

Refer to `DOCS.md` in order to find information about developing stages and algorithm of the whole program

## How to run?

> **Important!** In order to run this project make sure you already have Node.js >= 22.0.0 and Mysql >= 8.0.29

1. Clone this repository using this command `git clone https://github.com/Eug4n4/usof-backend.git`.
2. Change your working directory with `cd usof-backend/`.
3. Create .env file and copy paste constants from .env.example file. Please, replace placeholders with real values. Please, provide your mysql root credentials under `DB_USER` and `DB_PASSWORD`.
4. Run `npm install` in order to get all project's dependencies.
5. Run `npm run db:create` to create database and fill it with some test data (In case of recreation, please, run `npm run db:drop` and then `npm run db:create`).
6. Finally, run `npm start` to launch the program.
