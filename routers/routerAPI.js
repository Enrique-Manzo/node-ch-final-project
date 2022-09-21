import { Router } from "express";
import controladoresAPIProducts from "../controllers/controladoresAPIProducts.js";
import controladoresAPICarrito from "../controllers/controladoresAPICarritos.js";
import multer from "multer";

// MULTER

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        const nombreFinal = `${Date.now()}-profile-${file.originalname}`
        cb(null, nombreFinal)
    }
})

const upload = multer({ storage })

const middlewareDeUnArchivo = upload.single('profile')
const middlewareDeVariosArchivos = upload.array('myFiles')

// ROUTERS

const routerAPI = new Router();

let admin = false;

routerAPI.get("/prod_login", (req, res)=>{admin=true; res.status(200).json({"message": "login successful"});})
routerAPI.get("/prod_logout", (req, res)=>{admin=false; res.status(200).json({"message": "logout successful"});})

function adminCheck(req, res, next) {
    if (admin) {
        next()
    } else {
        res.status(401).json({"error":"You are not authorized to make this request"})
    }
};

// PRODUCTOS

routerAPI.get("/products", controladoresAPI.getAllProducts);
routerAPI.get("/products/:id", controladoresAPI.getProductById);
routerAPI.post("/products", adminCheck, controladoresAPI.postProduct);
routerAPI.delete("/products/:id", adminCheck, controladoresAPI.deleteProduct);
routerAPI.put("/products/:id", adminCheck, controladoresAPI.updateProduct);

// CARRITO

routerAPI.get("/user_id", controladoresAPICarrito.getUserId);
routerAPI.post("/add_to_cart", controladoresAPICarrito.postProductToCart);
routerAPI.post("/finish_purchase", controladoresAPICarrito.postFinishPurchase);
routerAPI.get("/shoppingcartproducts")
routerAPI.post("/shoppingcartproducts")
routerAPI.delete("/shoppingcartproducts/:id")

// CHILD PROCESSES

routerAPI.get("/randoms", controladoresAPI.getRandoms);

// AUTHENTICATION

routerAPI.post("/login", controladoresAPI.postLogin)


// TESTS

function auth(req, res, next) {
    console.log(req.session.user)
    if (req.session?.user == "usuario") {
        return next()
    }
    return res.status(401).send("Authentication error - user not found.")
}



routerAPI.get("/test/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) {
            res.json({status: "Logout error", body: err})
        } else {
            res.send("Logout ok!")
        }
    })
})

routerAPI.get("/test/privado", auth, (req, res) => {
    res.send("estás viendo esto como privado")
})

routerAPI.post("/test/cookiesRequest", (req, res) => {
    const options = {}
    
    if (req.body.miliseconds) {
        options.maxAge = req.body.miliseconds;
    };

    if (req.body.safe) {
        options.signed = true;
    };

    res.cookie("nombre", req.body.nombre, options)

    res.send("Cookies enviadas")
})

routerAPI.get("/test/seeCookies", (req, res) => {
    console.log(req.session)
    res.json({all: req.session.user, signed: req.signedCookies})
})

routerAPI.get("/test/con-session", (req, res) => {
    if (req.session.contador) {
        req.session.contador++
        res.send(`Ud ha visitado el sitio ${req.session.contador} veces.`)
    }
    else {
        req.session.contador = 1
        res.send('Bienvenido!')
    }
})

export default routerAPI;