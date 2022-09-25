export default class DataTransferObject {
    
    constructor(type, dataObject) {
        this.type = type;
        this.dataObject = dataObject;

        if (this.type === "user") {
            this.dto = new UserDTO(this.dataObject)
        } else if (this.type === "userAuthentication") {
            this.dto = new UserAuthenticationDTO(this.dataObject)
        } else if (this.type === "product") {
            this.dto = new ProductDTO(this.dataObject)
        } else if (this.type === "message") {
            this.dto = new MessageDTO(this.dataObject)
        } else if (this.type === "chat") {
            this.dto = new ChatDTO(this.dataObject)
        } else if (this.type === "cart") {
            this.dto = new CartDTO(this.dataObject)
        }

        this.dto.id = this.dataObject.id

    }

}

class UserDTO {
    constructor(object) {
        this.username = object.username
        this.fname = object.fname
        this.lname = object.lname
        this.address = object.address
        this.phoneNo = object.phoneNo
        this.age = object.age
        this.profile_picture = object.profile_picture
        this.id = object.id
    }
}

class UserAuthenticationDTO {
    constructor(object) {
        this.username = object.username
        this.password = object.password
    }
}

class ProductDTO {
    constructor(object) {
        this.id = object.id
        this.name = object.name
        this.price = object.price
        this.tag = object.tag
        this.image = object.image
        this.featured = object.featured
        this.stock = object.stock
        this.description = object.description
    }
}

class CartDTO {
    constructor(object) {
        this.id = object.id
        this.owner_id = object.owner_id
        this.date = object.date
        this.products = object.products
        this.status = object.status
    }
}

class MessageDTO {
    constructor(object) {
        this.email = object.email
        this.date = object.date
        this.text = object.text
    }
}

class ChatDTO {
    constructor(object) {
        this.id = object.id
        this.messages_ids = object.messages_ids
        this.participants = object.participants
        this.date = object.timeStamp
    }
}