const router = require('express').Router();
const login=require('../model/login');

router.get('/', login.loginget);
router.post('/',login.loginpost);
router.get('/logout', login.logout); //๋ก๊ทธ์์

module.exports = router