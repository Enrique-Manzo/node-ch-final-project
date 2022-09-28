import database from "../contenedores/contenedorMongoDB.js";

export class CartDAO {

    // GET

    async findCartById(id) {
        try {
            const cart = await database.readByAlfaNumId("ecommerce", "carts", id)
    
            return cart;
        } catch(err) {
            return {"error": err.message}
        }
    }

    async findProductById(userId, id) {
        try {
            const cart = await database.readByAlfaNumId("ecommerce", "carts", userId)
         
            const queriedProduct = cart.products.find(product => product.id == id);
           
            if (!queriedProduct) {
                return undefined
            }

            return queriedProduct

        } catch(err) {
            return {"error": err.message}
        }
    }

    // POST

    async postNewCart(newCart) {
        try {
            await database.insertObject("ecommerce", "carts", newCart);
        } catch(err) {
            return {"error": err.message}
        }        
    }

    // UPDATE

    async updateCartProductList(cartID, products) {
        try {
            await database.addOneItemToArray("ecommerce", "carts", cartID, {products: products})
            return {"success": "cart product list updated"}
        } catch(err) {
            return {"error": err.message}
        }
        
    }

    async increaseProductAmount(cartId, productID) {
        try {
            await database.updateOneValue("ecommerce", "carts", {id: cartId, "products.id": productID}, {$inc: {"products.$.amount": 1}})
            return {"success": "Product amount increased by 1"}
        } catch(err) {
            return {"error": err.message}
        }
    }

    // DELETE

    async deteleProductFromCart(cartId, productId) {
        try {
            const response = await database.deleteOneItemFromArray("ecommerce", "carts", cartId, {products: {id: productId}})
            
            if (response.modifiedCount === 0) {
                return {"error": "No products have been removed from the cart.", "code": 0}
            } else if (response.modifiedCount > 0) {
                return {"success": "A product has been removed from the cart.", "code": 1}
            }
            
        } catch(err) {
            return {"error": err.message}
        }
    }

    async deleteAllProductsFromCart(cartId) {
        try {
            await database.deleteOneItemFromArray("ecommerce", "carts", cartId, {products: {$exists: true}})
            return {"success": "Products removed from cart"}
        } catch(err) {
            return {"error": err.message}
        }
    }
}

const CartManager = new CartDAO();

export default CartManager;