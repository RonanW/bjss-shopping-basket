import Product from '../models/Product';
import ShoppingCart from '../models/ShoppingCart';
import CurrencyService from '../services/CurrencyService';

const get = (req, res) => {
	return res.send('order');
}

const create = (req, res) => {
	return new Promise((resolve, reject) => {
		if (!req.body.items) {
			reject('No items passed.');
		}
		const items = req.body.items;
		const curr = req.body.currency || 'GBP';
		const products = [];
		let purchasedItems = items.split(',').map((item) => {
			return new Promise((resolve, reject) => {
				let product = new Product({name: item.trim().toLowerCase()})
					.save()
					.then((item) => resolve(products.push(item)))
					.catch((err) => reject('There was a problem processing one of your items.'));
			});
		});

		Promise.all(purchasedItems).then((resolve, reject) => {
			const order = new ShoppingCart({products: products});
			return order.save().then((order) => {
			  	const completedOrder = { 
					subtotal : order.subTotal,
					discounts : order.discounts,
					discountAmt: order.discountAmt,
					total: order.total,
					currency: curr
				};
				// call currency service
				return CurrencyService.getConversion(curr).then((conversion) => {
					return CurrencyService.convert(completedOrder, conversion);
				});
			});
		}).then((response) => {
			// success
			resolve(res.status(201).send(response));
		})
		.catch((error) => {
			reject(error || 'There was a problem processing this order.');
		});
	}).catch((error) => {
		res.status(500).send(error);
	});
}

module.exports = { create };
