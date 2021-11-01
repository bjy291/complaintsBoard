const router = require('express').Router();
const register=require('../model/regi');

router.post('/',register.regipost); //회원가입
router.post('/idcheck',register.idcheck); //아이디중복확인

module.exports = router