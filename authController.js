const mongoose = require("mongoose")
const {validationResult} = require("express-validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const config = require("config")

const User = require("./models/User")
const Role = require("./models/Role")

const generateAccesToken = (id, roles) => {
    const payload = {
        id,
        roles
    }
    return jwt.sign(payload, config.get("secretKey"), {expiresIn: '1h'})
}

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

            const userRole = await Role.findOne({value: "USER"})

            const newUser = await new User({username, email, password: hashPassword, roles: [userRole.value]})
            await newUser.save()

            return res.json({
                message: "Пользователь успешно создан!",
                user: {
                    username,
                    email,
                    password,
                    roles: [
                        userRole.value
                    ]
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

        const token = generateAccesToken(user._id, user.roles)
        return res.json({
            message: "Успешная авторизация",
            token,
            user
        })
    }

    async getUser(req, res) {
        return res.json({message: "Привет!"})
    }

    async getAll() {

    }

}

module.exports = new AuthController()