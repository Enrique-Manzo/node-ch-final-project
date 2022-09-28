import { MongoClient } from "mongodb";
import dotenv from 'dotenv'
import * as path from 'path';
import parseArgs from 'minimist';


dotenv.config({
    path: path.resolve(process.cwd(), 'one.env'),
})


const args = parseArgs(process.argv.slice(2))

const mongoClientFunction = () => {
    if (args.PERSISTENCE === 'local') {
        const connectionURL = args.mongoLocal || 'mongodb://127.0.0.1:27017'; // local
        const client = new MongoClient(connectionURL);
        return client
    } else if (args.PERSISTENCE === 'production') {
    
        const uri = `mongodb+srv://${process.env.MONGO_USER_ADMIN}:${process.env.MONGO_USER_PASS}@cluster0.sjio4.mongodb.net/?retryWrites=true&w=majority`;
    
        const client = new MongoClient(uri,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        )
        return client
    }
}

const mongoClient = mongoClientFunction();

export default mongoClient;

