const router = require('express').Router();
const root=require('../model/root');

router.get('/', root.root)

module.exports = router