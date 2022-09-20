import database from "../contenedores/contenedorMongoDB.js";

export class CartDAO {

    // GETS

    async findActiveCartsByUserId(userId) {
        const activeCart = await database.findCartsOnConditions({owner_id: userId.toString(), status: "open"})
        
        return activeCart;
    }


    // UPDATES

    async closeOpenCartByCartId(cartId) {
        const query = {id: cartId};
        const update = {$set: {status: "closed"}}

        await database.updateOne("ecommerce", "carritos", query, update)
        
    }

    // POSTS

    postNewCartToUser(newCart) {

        database.insertObject("ecommerce", "carritos", newCart);

    }

    // UPDATE

    updateCartProductList(cartID, products) {
        database.updateProductList(cartID, products)
    }

}

const CartManager = new CartDAO();

export default CartManager;