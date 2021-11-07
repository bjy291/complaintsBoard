const router = require('express').Router();
const login=require('../model/login');

router.get('/', login.loginget);
router.post('/',login.loginpost);
router.get('/logout', login.logout); //로그아웃

module.exports = router