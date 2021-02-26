const mongoose = require("mongoose")
const {validationResult} = require("express-validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const User = require("./models/User")

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

    async login(req, res) {
        const {username, password} = req.body

        const user = await User.findOne({username})
        if(!user) {
            return res.status(400).json({message: "Логин не найден"})
        }

        const hashPassword = bcrypt.compareSync(password, user.password)
        if(!hashPassword) {
            return res.status(400).json({message: "Неверный пароль"})
        }

        const token = jwt.sign(user, config.get("secretKey", {expiresIn: '1h'}))
        return res.json({
            message: "Успешная авторизация",
            token,
            user
        })
    }

    async getUser() {

    }

    async getAll() {

    }

}

module.exports = new AuthController()