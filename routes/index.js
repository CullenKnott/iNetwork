const router = require("express").Router();
const apiRoutes = require("./api");

router.use("/api", apiRoutes);

router.use((req, res) =>
  res.send("Fancy seeing you here. Did you take a wrong route?")
);

module.exports = router;
