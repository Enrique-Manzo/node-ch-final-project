import Router from "express";
import controladoresWeb from "../controllers/controladoresWeb.js";

const routerWeb = new Router()

routerWeb.get("/server-info", controladoresWeb.serverInfo)
routerWeb.get("/chat", controladoresWeb.chat)

export default routerWeb