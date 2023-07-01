
const router = require('express').Router();

const { createNode } = require("../helper/helper");

// post route using the createNode function
router.post('/test', createNode);

module.exports = router


