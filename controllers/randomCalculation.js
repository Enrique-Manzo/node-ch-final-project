const calculation = (limit) => {
    const result = {}
    if (limit) {
        for (let i = 0; i < limit; i++) {
            const number = Math.floor(Math.random() * 1000);
        
            if (result[number.toString()]) {
                result[number.toString()] ++
            } else {
                result[number.toString()] = 1
            }
        }
    } else {
        for (let i = 0; i < 100000000; i++) {
            const number = Math.floor(Math.random() * 1000);
    
            if (result[number.toString()]) {
                result[number.toString()]++
            } else {
                result[number.toString()] = 1
            }
        }
    }

    return result

}

process.on("message", (limit) => {
    const result = calculation(limit=limit);
    process.send(result)
})

process.send("start")

