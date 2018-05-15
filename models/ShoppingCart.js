import mongoose from 'mongoose';
import roundTo from 'round-to';
import config from '../config';

const ShoppingCart = mongoose.Schema({
    _id: {
    	type: mongoose.Schema.ObjectId,
    	required: true,
    	auto: true
    },
    products: [{
    	type: mongoose.Schema.ObjectId,
    	ref: 'Product'
    }],
    discounts: [{
    	type: String,
    }],
	discountAmt: {
		type: Number,
		default: 0
	},
	subTotal: {
		type: Number,
		default: 0
	},
	total: {
		type: Number,
		default: 0
	}
});

// getTotal
ShoppingCart.pre('save', function (next) {
	const self = this;
	this.products.forEach(function(product) {
		self.subTotal = roundTo(self.subTotal + product.price, 2);
		self.discountAmt = roundTo(self.discountAmt + product.discountAmt, 2);
		self.total = roundTo(self.total + product.subTotal, 2);
		if (!self.discounts.includes(product.discountApplied) && product.discountApplied !== undefined) {
			self.discounts.push(product.discountApplied);
		};
	});
	next();
});

// ApplyQuantityDiscount
ShoppingCart.pre('save', function (next) {
	const self = this;
	Object.getOwnPropertyNames(config.quantityDiscount).forEach(function (product) {
		let countProducts = 0;
		self.products.forEach((item) => {
			if (item.name.toLowerCase() === product.toLowerCase()) {
				countProducts++;
			};
		});
		let numReductions = roundTo.down((countProducts / config.quantityDiscount[product].quantity), 0);
		let discountAmt = (numReductions * config.quantityDiscount[product].reduction);
		self.discountAmt = roundTo(self.discountAmt + discountAmt, 2);
		self.total = roundTo(self.total - discountAmt, 2);
		if ((!self.discounts.includes(config.quantityDiscount[product].description)
			&& config.quantityDiscount[product].description !== undefined)) {
				self.discounts.push(config.quantityDiscount[product].description);
		};
	});
	next();
});

export default mongoose.model('ShoppingCart', ShoppingCart);
