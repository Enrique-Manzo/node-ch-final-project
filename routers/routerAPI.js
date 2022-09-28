import { Router } from "express";
import controladoresAPIProducts from "../controllers/controladoresAPIProducts.js";
import controladoresAPICarrito from "../controllers/controladoresAPICarritos.js";
import ControladorAutorizacion from "../controllers/controladoresAuthentication.js";
import adminChecker from "../middlewares/administrators/isAdmin.js";
import ControladorImages from "../controllers/controladoresAPIImages.js";
import multer from "multer";
import { v4 } from "uuid";
import controladoresAPIOrders from "../controllers/controladoresAPIOrders.js";

// MULTER

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../public/images')
    },
    filename: function (req, file, cb) {
        const finalName = `${v4()}-image-${file.originalname.replaceAll(" ", "")}`
        req.url = `${req.protocol}://${req.get('host')}/images/${finalName}`;
        cb(null, finalName)
    }
})

const upload = multer({ storage })

const middlewareSingle = upload.single('image')

// ROUTERS

const routerAPI = new Router();

// PRODUCTOS

routerAPI.get("/products", controladoresAPIProducts.getAllProducts);
routerAPI.get("/products/:id", controladoresAPIProducts.getProductById);
routerAPI.post("/products", ControladorAutorizacion.auth, adminChecker.idAdmin, controladoresAPIProducts.postProduct); // admin@admin.com enrique123
routerAPI.delete("/products/:id", ControladorAutorizacion.auth, adminChecker.idAdmin, controladoresAPIProducts.deleteProduct);
routerAPI.put("/products/:id", ControladorAutorizacion.auth, adminChecker.idAdmin, controladoresAPIProducts.updateProduct);

// IMAGES

routerAPI.post("/images", middlewareSingle, ControladorImages.postImage)

// CARRITO

routerAPI.get("/shoppingcartproducts", ControladorAutorizacion.auth, controladoresAPICarrito.getCarts)
routerAPI.post("/shoppingcartproducts/:id", ControladorAutorizacion.auth, controladoresAPICarrito.postProductToCart)
routerAPI.delete("/shoppingcartproducts/:id", ControladorAutorizacion.auth, controladoresAPICarrito.deleteCartProduct)

// ÓRDENES

routerAPI.post("/orders", ControladorAutorizacion.auth, controladoresAPIOrders.postOrder)
routerAPI.get("/orders", ControladorAutorizacion.auth, controladoresAPIOrders.getOrders)

// AUTHENTICATION

routerAPI.post("/login", ControladorAutorizacion.loginUser)
routerAPI.post("/users", ControladorAutorizacion.registerUser)

export default routerAPI;