const router = require("express").Router();
const pedidoController = require("../controllers/Controller.js");

router.get('/v1/orders/', pedidoController.getAll);
router.post('/v1/orders/', pedidoController.insert);
router.get('/v1/orders/cashflow', pedidoController.getCashflow);

module.exports = router;
