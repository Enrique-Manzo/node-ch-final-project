import Router from "express";
import controladoresWeb from "../controllers/controladoresWeb.js";

const routerWeb = new Router()

routerWeb.get("/", controladoresWeb.index)
routerWeb.get("/watches", controladoresWeb.watches)
routerWeb.get("/about", controladoresWeb.about)
routerWeb.get("/chat", controladoresWeb.contact)
routerWeb.get("/login", controladoresWeb.login)
routerWeb.get("/signup", controladoresWeb.signup)
routerWeb.get("/logout", controladoresWeb.logout)
routerWeb.get("/profile", controladoresWeb.profile)

export default routerWeb