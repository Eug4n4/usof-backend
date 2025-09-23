
# Usof backend

## Description

This repository is the backend part of the bigger project called usof - Q/A service for professional and enthusiast programmers.

It is REST API which provides CRUD operations with the database entities: Comment, Post, Category, Like, etc.

If you are interested in frontend part of the project, please, check this repository - [usof-frontend](https://github.com/Eug4n4/usof-frontend)

## How to run?

> **Important!** In order to run this project make sure you already have Node.js >= 22.0.0 and Mysql >= 8.0.0

1. Clone this repository using this command `git clone https://github.com/Eug4n4/usof-backend.git`.
2. Change your working directory with `cd usof-backend/`.
3. Create .env file and copy paste constants from .env.example file. Please, replace placeholders to real values.
4. Log into your mysql root and run .sql scripts under `src/db` directory.
5. Run `npm install` in order to get all project's dependencies.
6. Finally, run `npm start` to launch the program.
