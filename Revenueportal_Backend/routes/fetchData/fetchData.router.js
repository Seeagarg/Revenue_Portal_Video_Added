const { fetchItem } = require("./fetcData.controller.js");

const router = require("express").Router();

router.post("/", fetchItem);

module.exports = router;
