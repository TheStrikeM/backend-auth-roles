const Router = require("express")
const {check} = require("express-validator")

const AuthController = require("./authController")
const authMiddleware = require("./middleware/authMiddleware")


const router = new Router()

router.post(
    '/reg',
    [
        check("username", "Логин должен состоять из 3 и не больше 15 символов").isLength({min: 3, max: 15}),
        check("email", "Эмейл некорректный").isEmail(),
        check("password", "Пароль должен состоять из 3 и не больше 15 символов").isLength({min: 3, max: 15})
    ],
    AuthController.register)
router.post('/login', AuthController.login)
router.get('/user', authMiddleware, AuthController.getUser)
router.get('/users', )

module.exports = router