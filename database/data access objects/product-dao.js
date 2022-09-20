import database from "../contenedores/contenedorMongoDB.js";

export class ProductDAO {

    // GETS
    async getAllProducts () {

        const allProducts = await database.readAll("ecommerce", "productos");
        
        return allProducts;
    }

    async getRandomProduct() {
        
        const randomProduct = await database.findRandom("ecommerce", "productos");

        return randomProduct        

    }

    async findProductById(productId) {
        const product = await database.readById("ecommerce", "productos", productId);

        return product;
    }

    // ADDS

    async addProduct(product) {
        await database.insertObject("ecommerce", "productos", product)

        return
    }

    // UPDATE

    async updateStock(productId) {
        database.updateOne("ecommerce", "productos", {id: productId}, {stock: {$subtract: ["stock", 1]}})
    }
    
    async updateById(productId, data) {
        try {
            database.updateOne("ecommerce", "productos", {id: productId}, data)
        } catch (err) {
           return {"error": err.message}
        }

    }

    // DELETE
    async deleteById(productId) {
        try {
            await database.deleteOne("ecommerce", "productos", {id: productId})
        } catch (err) {
            return err
        }
        
        
    }
}

const ProductManager = new ProductDAO();

export default ProductManager;