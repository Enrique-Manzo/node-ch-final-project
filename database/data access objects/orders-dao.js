import database from "../contenedores/contenedorMongoDB.js";
import { Order } from "../../business/business.js";

export class OrderDAO {

    // WRITE
    async insertNewOrder(newOrder) {
        try {
            console.log(newOrder)
            await database.insertObject("ecommerce", "orders", newOrder)

        } catch(err) {
            return {"error": err.message}
        }
    }



}

const OrderManager = new OrderDAO();

export default OrderManager;