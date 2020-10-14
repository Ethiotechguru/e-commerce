const express = require('express');

const router = express.Router();
const errorController = require('../controller/404');

router.use(errorController.getErrorPage);

module.exports = router;