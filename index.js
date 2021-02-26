const express = require("express")
const config = require("config")
const mongoose = require("mongoose")


const PORT = config.get("serverPort") || 5000
const app = express()

app.use(express.json())

const start = async () => {

    await mongoose.connect(config.get("dbUrl"))
    app.listen(PORT, () => {
        console.log(`* Сервер успешно запущен на порту ${PORT}`)
        console.log(`* Совершенно успешное подключение к MongoDB`)
        console.log(`* URL DB: ${config.get("dbUrl")}`)
        console.log(`* Доступно по 127.0.0.1:${PORT}`)
    })
}