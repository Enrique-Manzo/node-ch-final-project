import database from "../contenedores/contenedorMongoDB.js";

export class ProductDAO {

    // GETS
    async getAllProducts () {

        const allProducts = await database.readAll("ecommerce", "products");
        
        return allProducts;
    }

    async getRandomProduct() {
        
        const randomProduct = await database.findRandom("ecommerce", "products");

        return randomProduct        

    }

    async findProductById(productId) {
        const product = await database.readById("ecommerce", "products", productId);

        return product;
    }

    // ADDS

    async addProduct(product) {
        await database.insertObject("ecommerce", "products", product)

        return
    }

    // UPDATE

    async updateStock(productId) {
        database.updateOne("ecommerce", "products", {id: productId}, {stock: {$subtract: ["stock", 1]}})
    }
    
    async updateById(productId, data) {
        try {
            database.updateOne("ecommerce", "products", {id: productId}, data)
        } catch (err) {
           return {"error": err.message}
        }

    }

    // DELETE
    async deleteById(productId) {
        try {
            await database.deleteOne("ecommerce", "products", {id: productId})
        } catch (err) {
            return err
        }
        
        
    }
}

const ProductManager = new ProductDAO();

export default ProductManager;