const express = require("express");
const searchConteroller = require("./../../controllers/v1/search");

const router = express.Router();

router.route("/:keyword").get(searchConteroller.get);

module.exports = router;
