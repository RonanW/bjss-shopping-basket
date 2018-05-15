export default {
	product: {
		soup: {
			unit: 'tin',
			price: 0.65
		},
		bread: {
			unit: 'loaf',
			price: 0.80
		},
		milk: {
			unit: 'bottle',
			price: 1.15
		},
		apples: {
			unit: 'bag',
			price: 1,
			discount: {
				percent: 0.1,
				description: '10% off Apples'
			}
		}
	},
	quantityDiscount: {
		milk: {
			quantity: 3,
			reduction: 0.5,
			description: 'Buy 3 bottles of Milk, 50p off'
		}
	}
}