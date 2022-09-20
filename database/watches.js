import ProductManager from "./data access objects/product-dao.js";

export async function addWatch(watch) {
    await ProductManager.addProduct(watch);
}

export async function getWatches() {
    const data = await ProductManager.getAllProducts();

    return data
}
