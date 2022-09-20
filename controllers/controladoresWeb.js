import ProductManager from "../database/data access objects/product-dao.js";
import CartManager from "../database/data access objects/carts-dao.js";
import database from "../database/contenedores/contenedorMongoDB.js";

const controladoresWeb = {
    index: async (req, res) => {
        const isWatches = req.path == "/watches"
        
        res.render("main", {layout: "index", name: req.session.passport?.user?.fname, watches: await ProductManager.getAllProducts(), isWatches: isWatches})
    },
    watches: async (req, res) => {
        const isWatches = req.path == "/watches"

        res.render("watches", {layout: "index", name: req.session.passport?.user?.fname, watches: await ProductManager.getAllProducts(), isWatches: isWatches})},
    about: (req, res) => {res.render("about", {layout: "index", name: req.session.passport?.user?.fname})},
    contact: (req, res) => {res.render("chat", {layout: "index", name: req.session.passport?.user?.fname})},
    login: (req, res) => {res.render("login", {layout: "index", name: req.session.passport?.user?.fname})},
    signup: (req, res) => {res.render("signup", {layout: "index", name: req.session.passport?.user?.fname})},
    logout: async (req, res) => {
        req.session.destroy()

        res.render("main", {layout: "index", watches: await database.readAll("ecommerce", "productos")})
    },
    profile: async (req, res) => {
        
        if (req.session.passport?.user?.id) {
            const userID = req.session?.passport?.user?.id;
            const user = await database.readById("ecommerce", "users", userID)
            let activeCarts = await CartManager.findActiveCartsByUserId(userID);
            
            if (activeCarts == null) {
                activeCarts = {};
                activeCarts.id = "";
            }

            if (activeCarts.products == null) {
                activeCarts.products = "";
            }

            res.render("profile", {
                layout: "index",
                name:req.session.passport?.user?.fname,
                surname:req.session.passport?.user?.lname,
                image:req.session.passport?.user?.profile_picture,
                cartId: activeCarts.id,
                products: activeCarts?.products,
                userObj: user,
            })

        } else {
            res.redirect("/");
        }
    }
}

export default controladoresWeb;