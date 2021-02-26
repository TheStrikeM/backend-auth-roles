const Router = require("express")
const AuthController = require("./authController")

const router = new Router()

router.post('/reg', AuthController.register)
router.post('/login', )
router.get('/user', )
router.get('/users', )

module.exports = router