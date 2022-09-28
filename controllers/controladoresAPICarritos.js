import CartManager from "../database/data access objects/carts-dao.js";
import ProductManager from "../database/data access objects/product-dao.js";
import { Cart } from "../business/business.js";
import DataTransferObject from "../database/data transfer objects/dtos.js";

const controladoresAPICarrito = {

    // GET
    getCarts: async (req, res) => {
        try {
            const userId = req.userData.user.id;

            const userCart = await CartManager.findCartById(userId)

            if (!userCart) {
                res.status(404).json({"message": "You haven't added any products to your cart yet."})
            } else {
                // Uso de Data Transfer Object para determinar los datos que se envían
                const cartDTO = new DataTransferObject("cart", userCart)
                res.status(200).json({"cart": cartDTO.dto})
            }

        } catch(err) {
            res.json({"error": err.message})
        }
    },

    // POST
    
    postProductToCart: async (req, res) => {
        const userId = req.userData.user.id;
        const productId = req.params.id;

        try {
            const product = await ProductManager.findProductById(productId);
            
            if (!product) {
                res.status(400).json({"error": "No product with that ID was found"})
            } else {
                const cart = new Cart(userId)
           
                await cart.addProductToCart(userId, product)
         
                res.status(200).json({"message": "success"})
            }
            
        } catch(err) {
            res.json({"error": await err.message})
        }
    },

    // DELETE

    deleteCartProduct: async (req, res) => {
        const userId = req.userData.user.id;
        const productId = req.params.id;

        try {
            const response = await CartManager.deteleProductFromCart(userId, productId)
            
            if (response.code === 0) {
                res.status(200).json({"error": "No products removed. Please check your parameters."})
            } else if (response.code === 1) {
                res.status(200).json({"success": "Product removed"})
            }
            
        }catch(error) {
            res.json({"error": err.message})
        }
        return
    }
};

export default controladoresAPICarrito;