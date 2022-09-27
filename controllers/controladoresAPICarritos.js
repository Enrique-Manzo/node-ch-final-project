import CartManager from "../database/data access objects/carts-dao.js";
import ProductManager from "../database/data access objects/product-dao.js";
import { Cart } from "../business/business.js";

const controladoresAPICarrito = {

    // GET
    getCarts: async (req, res) => {
        try {
            const userId = req.userData.user.id;

            const userCart = await CartManager.findCartById(userId)

            if (!userCart) {
                res.status(404).json({"message": "You haven't added any products to your cart yet."})
            }

            res.status(200).json({"cart": userCart})

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
        
            const cart = new Cart(userId)
           
            cart.addProductToCart(userId, product)

            res.json({"message": "success"})
            
        } catch(err) {
            res.json({"error": err.message})
        }
    },

    // DELETE

    deleteCartProduct: async (req, res) => {
        const userId = req.userData.user.id;
        const productId = req.params.id;

        try {
            await CartManager.deteleProductFromCart(userId, productId)

            res.status(200).json({"success": "Product removed"})

        }catch(error) {
            res.json({"error": err.message})
        }
        return
    }
};

export default controladoresAPICarrito;