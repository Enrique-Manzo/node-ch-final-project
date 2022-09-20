import { MongoClient } from "mongodb";
import dotenv from 'dotenv'
import * as path from 'path';

dotenv.config({
    path: path.resolve(process.cwd(), 'one.env'),
})

const uri = `mongodb+srv://${process.env.MONGO_USER_ADMIN}:${process.env.MONGO_USER_PASS}@cluster0.sjio4.mongodb.net/?retryWrites=true&w=majority`;

const mongoClient = new MongoClient(uri,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        /*
        authSource: "admin",
        auth: {
            username,
            password
        }
        */
    }
)

export default mongoClient