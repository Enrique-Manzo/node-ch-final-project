import database from "./contenedores/contenedorMongoDB.js";

export async function addMessage(message) {
    await database.insertObject("ecommerce", "mensajes", message)
}

export async function getMessages() {   
    const messages = await database.readAll("ecommerce", "mensajes", true);

    return messages
}