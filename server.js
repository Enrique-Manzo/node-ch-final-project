import express from "express";
import { Server as SocketServer } from "socket.io";
import routerWeb from "./routers/routerWeb.js";
import routerAPI from "./routers/routerAPI.js";
import {engine} from "express-handlebars";
import { getMessages, addMessage } from "./database/messages.js";
import { getWatches, addWatch } from "./database/watches.js";
import {Server as HttpServer} from "http";
import MongoStore from "connect-mongo";
import cors from "cors";
import dotenv from 'dotenv';
import parseArgs from 'minimist';
import os from 'os';
import compression from "compression";

// PATHS
import * as path from 'path'; //const path = require('path');
import { fileURLToPath } from 'url';

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

// APP SETTINGS
app.use(express.static(publicPath));
app.use(express.json()); // checks whether there's a json object in the req body
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.use('/usercontent/', express.static('./uploads/')); // public path for images

// ROUTES
app.use("/", routerWeb); // handles static files
app.use("/api", routerAPI); // handles api calls
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

app.all('*', (req, res) => {
    const { url, method } = req
    res.send(`Ruta ${method} ${url} no está implementada`)
  })

// CLI COMMAND VARIABLES

const args = parseArgs(process.argv.slice(2), {
    default: {
        PORT: 8080,
    }
})

console.log(args)

// SERVER
const server = httpServer.listen(process.env.PORT || args.PORT, ()=>{
    console.log(`Server listening on port ${server.address().port} | Worker process ${process.pid}`)
});

// ERROR CALLS
server.on("error", error => console.log(`Server error ${error}`));

