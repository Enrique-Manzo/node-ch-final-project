import { Product } from "../business/business.js";
import ProductManager from "../database/data access objects/product-dao.js";

const controladoresAPIProducts = {
    
    getAllProducts: async (req, res) => {
        const products = await ProductManager.getAllProducts();
        res.json(products)
        },
    
    getRandomProduct: async (req, res)=>{
        try {
            const randomProduct = await ProductManager.getRandomProduct();
            console.log(randomProduct)
            res.status(200).json(randomProduct)
        } catch(err) {
            res.json({"error": err.message})
        }
        
    },

    getProductById: async (req, res) => {
        
        const id = req.params.id;
        
        const product = await ProductManager.findProductById(id);

        if (!product) {
            res.status(404).json({"message": "item not found"})
        } else {
            res.status(200).json(product)
        }
    },

    postProduct: async (req, res) => {
        
        const productFields = req.body;
        try {
            const product = new Product(productFields); // valida que todos los campos sean correctos

            const productData = product.data(); // extrae los datos del objecto

            const result = await ProductManager.addProduct(productData);

            res.status(200).json({"success": "product added successfully", "result": result})
        } catch (err) {
            res.json({"error": err.message})
        }
        
    },

    deleteProduct: async (req, res) => {

        const id = parseInt(req.params.id);
        
        try {
            await ProductManager.deleteById(id)
       
            res.status(200).json({"message": "product deletion successful."})
        } catch (err) {
            res.json({"error": err.message})
        }
    },
    
    updateProduct: async (req, res) => {
        const id = parseInt(req.params.id);
        const data = req.body;

        try {
            await ProductManager.updateById(id, data);

            res.status(200).json({"message": "Update successful."})
        } catch (err) {
            res.json({"error": err.message})
        }
        
        
    },

    getTestProducts: async (req, res) => {
        console.log("test")
        const productArray = [];

        for (let i = 0; i < 5; i++) {
            const testProduct = {};

            testProduct.name = await faker.commerce.productName();
            testProduct.price = await faker.commerce.price(100,1000);
            testProduct.image = await faker.image.food();

            productArray.push(testProduct)
        }
        

        res.json(productArray);
    },

    postLogin: async (req, res) => {
        const username_ = req.body.username;
        const password = req.body.password;
        
        const user = await mongo.findByUsername("ecommerce", "users", username_)
        
        if (user) {
            if (username_ == user.username && password == user.password) {
                req.session.user = username_;
                req.session.admin = true;
                res.status(200).json({"message": "login successful"})
            } else {
                return res.status(401).send("Authentication error")
            }
    
        }
    
    },

    getRandoms: (req, res) => {
        const limit = parseInt(req.query.cant);       
 
        const calculation = fork("./controllers/randomCalculation.js");
        calculation.on("message", msg => {
            if (msg == "start") {
                calculation.send(limit)
            } else {
                res.json(msg)
            }
        })

    }
};

export default controladoresAPIProducts;