const mongoose = require("mongoose")
const {validationResult} = require("express-validator")
const User = require("./models/User")
const bcrypt = require("bcryptjs")

class AuthController {

    async register(req, res) {
        try {
            const {username, email, password} = req.body

            const errors = validationResult(req)
            if(!errors.isEmpty()) {
                return res.status(400).json({message: "Некорректные поля"})
            }

            const isBusyUsername = await User.findOne({username})
            if(isBusyUsername) {
                return res.status(400).json({message: "Логин занят"})
            }
            const isBusyEmail = await User.findOne({email})
            if(isBusyEmail) {
                return res.status(400).json({message: "Эмейл занят"})
            }

            const hashPassword = await bcrypt.hash(password, 4)

            const newUser = await new User({username, email, password: hashPassword})
            await newUser.save()

            return res.json({
                message: "Пользователь успешно создан!",
                user: {
                    username,
                    email,
                    password
                }
            })
        } catch (e) {
            console.log('Error:', e)
        }
    }

    async login() {

    }

    async getUser() {

    }

    async getAll() {

    }

}

module.exports = new AuthController()