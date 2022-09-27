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
        
            const collectionObject = await userCollection.findOne({id: parseInt(objectID)});
        
            return collectionObject
        
        } catch(error) {
            console.log(error)
        } finally {
            await mongoClient.close();
        }
    }

    async readByAlfaNumId(database, collection, objectID) {
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

    async readByProperty(database, collection, query) {
        try {
            await mongoClient.connect();
        
            const userDatabase = mongoClient.db(database);
        
            const userCollection = userDatabase.collection(collection);
        
            const collectionObjects = await userCollection.find(query).toArray();
            
            return collectionObjects
        
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

    async findByEmail(database, collection, email) {
        try {
            await mongoClient.connect();

            const userDatabase = mongoClient.db(database);

            const userCollection = userDatabase.collection(collection);
        
            const user = await userCollection.findOne({email: email});

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
        
            const userCollection = userDatabase.collection("carts");
           
            const collectionObject = await userCollection.findOne(conditions);
          
            return collectionObject
        
        } catch(error) {
            console.log(error)
        } finally {
            await mongoClient.close();
        }
    }

    // UPDATE

    async addOneItemToArray(database, collection, objectId, objectPush) {
        try {
            await mongoClient.connect();
        
            const userDatabase = mongoClient.db(database);
        
            const userCollection = userDatabase.collection(collection);
           
            const collectionObject = await userCollection.updateOne({id: objectId}, {$push: objectPush})
        
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
        
            await userCollection.updateOne(query, {$set: newValues});
        
        } catch(error) {
            console.log(error)
        } finally {
            await mongoClient.close();
        }
    }

    async updateOneValue(database, collection, query, newValues) {
        try {
            await mongoClient.connect();
        
            const userDatabase = mongoClient.db(database);
        
            const userCollection = userDatabase.collection(collection);
        
            await userCollection.findOneAndUpdate(query, newValues);
        
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
        
            await userCollection.deleteOne(query);
    
        } catch(error) {
            console.log(error)
        } finally {
            await mongoClient.close();
        }

    }

    async deleteOneItemFromArray(database, collection, objectId, query) {
        try {

            await mongoClient.connect();
        
            const userDatabase = mongoClient.db(database);
        
            const userCollection = userDatabase.collection(collection);
        
            await userCollection.updateOne({id: objectId}, {$pull: query}, false, true);
    
        } catch(error) {
            console.log(error)
        } finally {
            await mongoClient.close();
        }

    }

}

const database = new ContenedorMongoDB();

export default database;