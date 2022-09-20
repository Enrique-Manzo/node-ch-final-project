import { messagesDAO } from "../data access objects/messages-dao";

export class MessagesRepository extends messagesDAO {

    async addMessageAndCheck(message) {
        // returns true if the message can be found in the DB
        const messageDTO = await this.addMessage(message)
        const messageDB = await this.findMessageById(messageDTO.id)

        if (messageDB) {
            return true
        }

    }

}