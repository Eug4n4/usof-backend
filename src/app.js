import express from "express"
import Adapter, { Database, Resource } from '@adminjs/sql'
import AdminJS from 'adminjs'
import AdminJSExpress from '@adminjs/express'
import router from './router.js'
import { config } from "./db/db.js"
import cookieParser from "cookie-parser"


const PORT = 8080;
AdminJS.registerAdapter({
    Database,
    Resource
})
const start = async () => {
    const app = express();
    app.use(cookieParser())
    app.use(express.raw())
    app.use(express.json());
    app.use(express.urlencoded())
    app.use('/api', router);
    const db = await new Adapter("mysql2", config).init();
    const admin = new AdminJS({
        databases: [db]
    })
    admin.watch();
    const adminRouter = AdminJSExpress.buildRouter(admin);
    app.use(admin.options.rootPath, adminRouter);
    app.listen(PORT, () => {
        console.log(`AdminJS started on http://localhost:${PORT}${admin.options.rootPath}`)
    })

}
start();
