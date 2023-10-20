const express = require("express");
const router = express.Router();
const upload = require("./upload");
const indexPage = require("./index")

let routes = (app) => {
    router.post("/upload", upload);
    router.get("/", indexPage);
    app.use(router);
};


module.exports = routes;