import { CartDAO } from "../data access objects/carts-dao.js";
import { UsersDAO } from "../data access objects/users-dao.js";
import { OrderDAO } from "../data access objects/orders-dao.js";

export default class DataAccessObject {
    
    constructor(type) {
        this.type = type;

        if (this.type === "cart") {
            this.dto = new CartDAO()
        } else if (this.type === "user") {
            this.dto = new UsersDAO()
        } else if (this.type === "order") {
            this.dto = new OrderDAO()
        }

    }

}
