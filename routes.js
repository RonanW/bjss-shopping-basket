import express from 'express';
import CheckoutCtrl from './controllers/CheckoutController';

const router = express.Router();

router.route('/checkout')
  // GET /api/checkout
  .get()

  // POST /api/checkout - Create new order
  .post(CheckoutCtrl.create);

module.exports = router;