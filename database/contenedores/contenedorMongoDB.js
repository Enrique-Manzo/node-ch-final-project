import mongoClient from "../MongoDB/mongo.js";

class ContenedorMongoDB {

    // CREATE

    async insertObject(database, collection, object) {
        try {
            await mongoClient.connect();
        
            const userDatabase = mongoClient.db(database);
        
            const userCollection = userDatabase.collection(collection);
        
            await userCollection.insertOne(object)
        
        } catch(error) {
            console.log(error)
        } finally {
            await mongoClient.close();
        }
    }

    async insertManyObjects(database, collection, objectArray) {
        try {
            await mongoClient.connect();
        
            const userDatabase = mongoClient.db(database);
        
            const userCollection = userDatabase.collection(collection);
        
            await userCollection.insertMany(objectArray)
        
        } catch(error) {
            console.log(error)
        } finally {
            await mongoClient.close();
        }
    }

    // READ

    async readAll(database, collection, update_id) {
        try {
            
            await mongoClient.connect();
            
            const userDatabase = mongoClient.db(database);
        
            const userCollection = userDatabase.collection(collection);
            
            const collectionObjects = await userCollection.find().toArray();
        
            if (update_id) {
                for (let message of collectionObjects) {
                    message._id = message._id.toString()
                }
            }

            return collectionObjects
        
        } catch(error) {
            console.log(error)
        } finally {
            await mongoClient.close();
        }

    }

    async readById(database, collection, objectID) {
        try {
            await mongoClient.connect();
        
            const userDatabase = mongoClient.db(database);
        
            const userCollection = userDatabase.collection(collection);
        
            const collectionObject = await userCollection.findOne({id: objectID});
        
            return collectionObject
        
        } catch(error) {
            console.log(error)
        } finally {
            await mongoClient.close();
        }
    }

    async findRandom(database, collection) {
        try {
            await mongoClient.connect();
        
            const userDatabase = mongoClient.db(database);
        
            const userCollection = userDatabase.collection(collection);
        
            const collectionObject = await userCollection.aggregate([{$sample: {size: 1}}]);
            
            return collectionObject
        
        } catch(error) {
            console.log(error)
        } finally {
            await mongoClient.close();
        }
    }

    async findByUsername(database, collection, username) {
        try {
            await mongoClient.connect();

            const userDatabase = mongoClient.db(database);

            const userCollection = userDatabase.collection(collection);
        
            const user = await userCollection.findOne({username: username});

            if (user) {
                return user
            } else {
                return "No user found"
            }

        } catch(error) {
            console.log(error)
        } finally {
            await mongoClient.close();
        }
    }

    async findCartsOnConditions (conditions) {
        try {
            await mongoClient.connect();
        
            const userDatabase = mongoClient.db("ecommerce");
        
            const userCollection = userDatabase.collection("carritos");
           
            const collectionObject = await userCollection.findOne(conditions);
          
            return collectionObject
        
        } catch(error) {
            console.log(error)
        } finally {
            await mongoClient.close();
        }
    }

    // UPDATE

    async updateProductList(cartID, products) {
        try {
            await mongoClient.connect();
        
            const userDatabase = mongoClient.db("ecommerce");
        
            const userCollection = userDatabase.collection("carritos");
           
            const collectionObject = await userCollection.updateOne({id: cartID}, {$set: {products: products}})
        
            return collectionObject
        
        } catch(error) {
            console.log(error)
        } finally {
            await mongoClient.close();
        }

    }

    async updateOne(database, collection, query, newValues) {
        try {
            await mongoClient.connect();
        
            const userDatabase = mongoClient.db(database);
        
            const userCollection = userDatabase.collection(collection);
        
            await userCollection.updateOne(query, newValues);
        
        } catch(error) {
            console.log(error)
        } finally {
            await mongoClient.close();
        }
    }

    // DELETE

    async deleteOne(database, collection, query) {
        try {

            await mongoClient.connect();
        
            const userDatabase = mongoClient.db(database);
        
            const userCollection = userDatabase.collection(collection);
        
            await userCollection.deleteOne(query, query);
    
        } catch(error) {
            console.log(error)
        } finally {
            await mongoClient.close();
        }

    }

}

const database = new ContenedorMongoDB();

export default database;