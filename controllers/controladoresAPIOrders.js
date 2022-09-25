import { Order } from "../business/business.js";
import OrderManager from "../database/data access objects/orders-dao.js";
import CartManager from "../database/data access objects/carts-dao.js";

const controladoresAPIOrders = {

    // GET

    getOrders: async (req, res) => {
        const clientId = req.userData.user.id;

        try {
            const orders = await OrderManager.getAllOrdersByClientId(clientId)

            res.status(200).json({"client orders": orders})

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