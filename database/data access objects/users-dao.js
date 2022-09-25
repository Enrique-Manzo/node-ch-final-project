import database from "../contenedores/contenedorMongoDB.js";

export class UsersDAO {

    // GETS
    async getAllUsers () {

        const allUsers = await database.readAll("ecommerce", "users");
        
        return allUsers;
    }

    async findUserById(userId) {
        const user = await database.readByAlfaNumId("ecommerce", "users", userId);

        return user;
    }

    async getByEmail(email) {
        const user = await database.findByEmail("ecommerce", "users", email)

        return user
    }

    // ADDS

    async addUser(user) {
        
        await database.insertObject("ecommerce", "users", user)

        return
    }

    // UPDATE

    async updateUser(userId, userProperty, value) {
        database.updateOne("ecommerce", "user", {id: userId}, {userProperty: value})
    }
}

const UserManager = new UsersDAO();

export default UserManager;