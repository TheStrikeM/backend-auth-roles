const express = require("express")
const config = require("config")


const PORT = config.get("serverPort") || 5000
const app = express()

app.use(express.json())