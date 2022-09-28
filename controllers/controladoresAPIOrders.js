import { Order } from "../business/business.js";
import OrderManager from "../database/data access objects/orders-dao.js";
import CartManager from "../database/data access objects/carts-dao.js";
import DataTransferObject from "../database/data transfer objects/dtos.js";

const controladoresAPIOrders = {

    // GET

    getOrders: async (req, res) => {
        const clientId = req.userData.user.id;

        try {
            const orders = await OrderManager.getAllOrdersByClientId(clientId)
            const ordersDTO = []
            for (let order of orders) {
                const orderDTO = new DataTransferObject("order", order)
                ordersDTO.push(orderDTO.dto)
            }

            res.status(200).json({"client orders": ordersDTO})

        } catch(err) {
            res.json({"error": err.message})
        }

    },

    // POST

    postOrder: async (req, res) => {
        const clientId = req.userData.user.id;

        try {

            const clientCart = await CartManager.findCartById(clientId)
            
            const order = new Order(clientId, clientCart);
            
            await order.submitOrder(order.data())

            order.notifyUserAndAdmin(order.data())

            res.status(200).json({"success": "Order created successfully"})

        } catch(err) {
            res.json({"error": err.message})
        }
    }

}

export default controladoresAPIOrders;