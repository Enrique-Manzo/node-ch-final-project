import express from "express";
import { Server as SocketServer } from "socket.io";
import {controladoresForm} from "./controllers/controladoresForm.js"
import routerWeb from "./routers/routerWeb.js";
import routerAPI from "./routers/routerAPI.js";
import routerAuth from "./routers/routerAuth.js";
import {engine} from "express-handlebars";
import { getMessages, addMessage } from "./database/messages.js";
import { getWatches, addWatch } from "./database/watches.js";
import {Server as HttpServer} from "http";
import session from "express-session";
import MongoStore from "connect-mongo";
import sfs from "session-file-store";
import cors from "cors";
import { passportMiddleware, passportSessionHandler } from "./middlewares/authentication/passport.js";
import dotenv from 'dotenv';
import parseArgs from 'minimist';
import cluster from 'cluster';
import os from 'os';
import compression from "compression";
import logger from "./loggers/logger.js";
import { graphqlMiddleware } from "./middlewares/graphql/graphqlMiddleware.js";

// PATHS
import * as path from 'path'; //const path = require('path');
import { fileURLToPath } from 'url';
import { nextTick } from "process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.resolve(__dirname, 'public');

// SECURE INFO

dotenv.config({
    path: path.resolve(process.cwd(), 'one.env'),
})

// APP
const app = express();

// SOCKET

const httpServer = new HttpServer(app);
const io = new SocketServer(httpServer);

io.on("connection", (socket)=> {
    console.log("Socket connected");
    
    socket.on("requestMessages", ()=>{
        getMessages()
        .then((messages)=>{
            socket.emit("conexionOK", {messages: messages})
        })
    })
    
    socket.on("message", async (message)=>{
        await addMessage(message)
        getMessages()
        .then((messages)=>{
            io.sockets.emit("conexionOK", { messages: messages })
        })
    })
    
    socket.on("pushWatchAndRetrieve", async (data)=>{
        
        await addWatch(data);
        getWatches()
        .then((watches)=>{
            socket.emit("watchesData", {watches: watches})
        })
    })

    socket.on("retrieveWatches", ()=>{
        
        getWatches()
        .then((watches)=>{
            socket.emit("watchesData", {watches: watches})
        })

    })
    
})

// CORS OPTIONS

const whitelist = ['http://localhost:3030', 'http://localhost:8080']; //white list consumers
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  credentials: true, //Credentials are cookies, authorization headers or TLS client certificates.
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'device-remember-token', 'Access-Control-Allow-Origin', 'Origin', 'Accept']
};

// SESSION FILE STORE

const FileStore = sfs(session)
const mongoStoreUri = `mongodb+srv://${process.env.MONGO_USER_ADMIN}:${process.env.MONGO_USER_PASS}@cluster0.sjio4.mongodb.net/?retryWrites=true&w=majority`;

// APP SETTINGS
app.use(express.static(publicPath));
app.use(express.json()); // checks whether there's a json object in the req body
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(session({
    secret: "CbFh!M,;e3vm?hz:", // SESSION_SECRET="CbFh!M,;e3vm?hz:"
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: mongoStoreUri, ttl:600 }),
}));
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.use(passportMiddleware);
app.use(passportSessionHandler);
app.use(function (req, res, next) {logger.info(`${req.url} | ${req.method}`); next()})
app.use('/usercontent/', express.static('./uploads/')); // public path for images

// ROUTES
app.use("/", routerWeb); // handles static files
app.use("/api", routerAPI); // handles api calls
app.use("/auth", routerAuth); // handles authentication requests
app.use("/info", compression(), (req, res)=> {
    
    const info = {
        arguments: process.argv,
        operatingSystem: process.platform,
        nodeVersion: process.version,
        reservedMemory: process.memoryUsage(),
        executionPath: process.execPath,
        processID: process.pid,
        projectFolder: process.cwd(),
        numberOfProcessors: os.cpus().length
    }
     
    res.json(info)
})

app.use("/graphql", graphqlMiddleware)

app.all('*', (req, res) => {
    const { url, method } = req
    logger.warn(`Ruta ${method} ${url} no implementada`)
    res.send(`Ruta ${method} ${url} no está implementada`)
  })

app.post("/product-form", controladoresForm.postProduct) // handled by Express - receives form posts

// CLI COMMAND VARIABLES

const args = parseArgs(process.argv.slice(2), {
    default: {
        PORT: 8080,
    }
})

// CLUSTER
/*
if (cluster.isPrimary) {
    const numCPUs = os.cpus().length
    console.log(`PID PRIMARIO ${process.pid}`)

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork()
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`)
        for (let id in cluster.workers) {
            cluster.workers[id].kill();
            }
            // exit the master process
            process.exit(0);
    })
} else {
    // SERVER
    const server = httpServer.listen(args.PORT, ()=>{
        console.log(`Server listening on port ${server.address().port} | Worker process ${process.pid}`)
    });

    // ERROR CALLS
    server.on("error", error => console.log(`Server error ${error}`));
}
*/

// SERVER
const server = httpServer.listen(process.env.PORT || args.PORT, ()=>{
    console.log(`Server listening on port ${server.address().port} | Worker process ${process.pid}`)
});

// ERROR CALLS
server.on("error", error => console.log(`Server error ${error}`));

