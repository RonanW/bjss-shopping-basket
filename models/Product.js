import mongoose from 'mongoose';
import config from '../config';
import roundTo from 'round-to'

const Product = mongoose.Schema({
	_id: {
		type: mongoose.Schema.ObjectId,
		retuired: true,
		auto: true
	},
	name: {
		type: String,
		enum: ['soup', 'bread', 'milk', 'apples'],
		required: true
	},
	unit: {
		type:String
	},
	price: {
		type: Number
	},
	discount: {
		type: String
	},
	discountApplied: {
		type: String
	},
	discountAmt: {
		type: Number,
		default: 0
	},
	subTotal: {
		type: Number,
		default: 0
	}
});

// SetUnitPrice
Product.pre('save', function (next) {
	this.unit = config.product[this.name].unit;
	this.price = roundTo(config.product[this.name].price, 2);
	next();
});

// ApplyDiscount & SetSubtotal
Product.pre('save', function (next) {
	if (config.product[this.name].discount) {
		this.discountApplied = config.product[this.name].discount.description;
		this.discountAmt = roundTo((this.price * config.product[this.name].discount.percent), 2);
	};
	this.subTotal = roundTo(this.price - this.discountAmt, 2);
	next();
});

export default mongoose.model('Product', Product);
