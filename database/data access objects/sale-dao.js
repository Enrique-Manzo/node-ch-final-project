import database from "../contenedores/contenedorMongoDB.js";

export class SaleDAO {

    // POST

    async postSale(sale) {
        await database.insertObject("ecommerce", "sales", sale);

        return
    }
}

const SaleManager = new SaleDAO();

export default SaleManager;