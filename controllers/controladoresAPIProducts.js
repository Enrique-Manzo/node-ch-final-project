import { Product } from "../business/business.js";
import ProductManager from "../database/data access objects/product-dao.js";
import DataTransferObject from "../database/data transfer objects/dtos.js";

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
            // Uso de Data Transfer Object para determinar los datos que se envían
            const productDTO = new DataTransferObject("product", product)
            res.status(200).json(productDTO.dto)
        }
    },

    postProduct: async (req, res) => {
        
        const productFields = req.body;
        try {
            const product = new Product(productFields); // valida que todos los campos sean correctos

            const productData = product.data(); // extrae los datos del objecto

            const result = await ProductManager.addProduct(productData);
           
            if (result.code === 1) {
                res.status(200).json({"success": "product added successfully", "productID": product.id})
            } else {
                res.status(400).json({"error": "No products were added. Please review your parameters."})
            }
            
        } catch (err) {
            res.json({"error": err.message})
        }
        
    },

    deleteProduct: async (req, res) => {

        const id = req.params.id;
        
        try {
            const response = await ProductManager.deleteById(id)
            
            if (response.deletedDocs > 0) {
                res.status(200).json({"message": "product deletion successful."})
            } else {
                res.status(400).json({"error": "No files deleted. Please check the parameters provided."})
            }
            
        } catch (err) {
            res.json({"error": err.message})
        }
    },
    
    updateProduct: async (req, res) => {
        const id = req.params.id;
        const data = req.body;

        try {
            const response = await ProductManager.updateById(id, data);

            if (response.modifiedCount != 0) {
                res.status(200).json({"message": "Update successful."})
            } else {
                res.status(400).json({"error": "No files modified. Please check the parameters provided."})
            }

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

};

export default controladoresAPIProducts;