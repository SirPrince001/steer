const router = require("express").Router();
router.use(require("../routes/userAuth"));
router.use(require("../routes/driverRoute"));

module.exports = router;
