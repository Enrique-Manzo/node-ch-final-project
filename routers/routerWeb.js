import Router from "express";
import controladoresWeb from "../controllers/controladoresWeb.js";

const routerWeb = new Router()

routerWeb.get("/server-info", controladoresWeb.index)
routerWeb.get("/chat", controladoresWeb.contact)

export default routerWeb