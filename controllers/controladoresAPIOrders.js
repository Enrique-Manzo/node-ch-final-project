import { Order } from "../business/business.js";
import DataAccessObject from "../database/factories/daoFactory.js";
import CartManager from "../database/data access objects/carts-dao.js";

const controladoresAPIOrders = {

    // GET

    getOrders: async (req, res) => {
        res.status(200).json({"message": "here's your order"})
    },

    // POST

    postOrder: async (req, res) => {
        const clientId = req.userData.user.id;

        try {

            const clientCart = await CartManager.findCartById(clientId)
            
            const order = new Order(clientId, clientCart);
            
            await order.submitOrder(order.data())

            order.notifyUserAndAdmin()

            res.status(200).json({"success": "Order created successfully"})

        } catch(err) {
            res.json({"error": err.message})
        }
    }

}

export default controladoresAPIOrders;