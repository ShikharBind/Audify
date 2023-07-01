const router = require("express").Router();
const userController = require("../controllers/userController");


router.post("/login", async (req, res) => {
    userController.checkAndUpdateUser(req, res);
});

module.exports = router;
