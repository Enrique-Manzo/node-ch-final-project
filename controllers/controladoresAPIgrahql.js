import ProductManager from "../database/data access objects/product-dao.js";
import { v4 } from "uuid";

    
export async function getAllProducts() {
    const products = await ProductManager.getAllProducts();
    return products
}

export async function getRandomProduct() {
    try {
        const randomProduct = await ProductManager.getRandomProduct();
        return randomProduct
    } catch(err) {
        return {"error": err.message}
    }   
}

export async function getProductById({id}) {
        
    const product = await ProductManager.findProductById(parseInt(id));
    
    if (!product) {
        return {"message": "item not found"}
    } else {
        return product
    }
}

export async function postProduct({data}) {
    
    try {
        data.id = v4();
        const result = await ProductManager.addProduct(data);
        return data
    } catch (err) {
        return {"error": err.message}
    }
    
}

export async function deleteProduct({id}) {;
    try {
        await ProductManager.deleteById(parseInt(id))
    
        return {"description": "product deletion successful."}
    } catch (err) {
        return{"description": err.message}
    }
}


export async function updateProduct({id, data}) {
    const productId = parseInt(id);

    try {
        await ProductManager.updateById(productId, data);

        return {"description": "Update successful."}
    } catch (err) {
        return {"description": err.message}
    }
    
    
}
/*
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
*/