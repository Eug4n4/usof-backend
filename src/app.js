import express from "express"
import Adapter, { Database, Resource } from '@adminjs/sql'
import AdminJS from 'adminjs'
import AdminJSExpress from '@adminjs/express'
import router from './router.js'
import { config } from "./db/db.js"
import cookieParser from "cookie-parser"
import { adminHashPassword, hideToken } from "./utils/admin.js"
import authMiddleware from "./auth/authMiddleware.js"
import { mustBeAdmin } from "./utils/permissionCheck.js"
import cors from "cors"

const HOST = process.env.BACKEND_HOST || 'http://localhost'
const PORT = Number(process.env.BACKEND_PORT) || 3000;
AdminJS.registerAdapter({
    Database,
    Resource
})
const start = async () => {
    const app = express();
    app.use(cookieParser())
    app.use(cors({ origin: `${process.env.FRONTEND_HOST}:${process.env.FRONTEND_PORT}`, credentials: true }))
    app.use(express.raw())
    app.use(express.json());
    app.use(express.urlencoded())
    app.use('/api', router);
    const db = await new Adapter("mysql2", config).init();
    const admin = new AdminJS({
        databases: [db],
        resources: [adminHashPassword(db), hideToken(db)]
    })
    admin.watch();
    const adminRouter = AdminJSExpress.buildRouter(admin);
    app.use(admin.options.rootPath, authMiddleware, mustBeAdmin, adminRouter);
    app.listen(PORT, () => {
        console.log(`Started on ${HOST}:${PORT}`)
    })

}
start();
