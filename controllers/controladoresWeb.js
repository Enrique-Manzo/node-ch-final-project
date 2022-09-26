import os from 'os';

const controladoresWeb = {
    serverInfo: (req, res) => {
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

        res.render("serverInfo", {layout: "index", info: info})
    },
    chat: (req, res) => {
        res.render("chat", {layout: "index"})
    }
}

export default controladoresWeb;