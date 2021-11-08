const router = require('express').Router();
const root=require('../model/root');

router.get('/', root.root)
router.post('/', root.rootpost)

module.exports = router