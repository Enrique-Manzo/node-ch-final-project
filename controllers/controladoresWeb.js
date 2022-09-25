import ProductManager from "../database/data access objects/product-dao.js";
import CartManager from "../database/data access objects/carts-dao.js";
import database from "../database/contenedores/contenedorMongoDB.js";

const controladoresWeb = {
    serverInfo: (req, res) => {
        res.status(200)
    },
    chat: (req, res) => {
        res.render("chat", {layout: "index"})
    }
}

export default controladoresWeb;