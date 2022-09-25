import database from "../contenedores/contenedorMongoDB.js";

export class OrderDAO {

    // READ

    async getAllOrdersByClientId(clientId) {
        try {
            const orders = await database.readByProperty("ecommerce", "orders", {clientId: clientId})

            return orders
        } catch(err) {
            return {"error": err.message}
        }
    }

    // WRITE
    async insertNewOrder(newOrder) {
        try {
            await database.insertObject("ecommerce", "orders", newOrder)

        } catch(err) {
            return {"error": err.message}
        }
    }



}

const OrderManager = new OrderDAO();

export default OrderManager;