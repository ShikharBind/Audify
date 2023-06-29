const router = require("express").Router();
const authController = require("../controllers/authController");


router.post("/login", async (req, res) => {
 authController.verifyIdToken(req,res);
});

module.exports = router;
