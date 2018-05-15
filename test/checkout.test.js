import chai from 'chai';  
import { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../index.js';
 
chai.use(chaiHttp);
 
describe('API endpoint /api/checkout', () => {

	// GET - List all items
	it('should return all items', () => {

	});

	// POST - Add new order
	it('should add new order', () => {
		return chai.request(app)
			.post('/api/checkout')
			.send({
				items: 'Apples, Apples, Milk, Milk, Milk, Soup, Bread, Milk, Milk, Milk',
				currency: 'USD'
			})
			.then((res) => {
				expect(res).to.have.status(201);
				expect(res).to.be.json;
				expect(res.body).to.be.an('object');
				expect(res.body.subtotal).to.equal(10.35);
				expect(res.body.discounts).to.be.an('array').that.includes('10% off Apples');
				expect(res.body.discounts).to.be.an('array').that.includes('Buy 3 bottles of Milk, 50p off');
				expect(res.body.discountAmt).to.equal(1.2);
				expect(res.body.total).to.equal(9.15);
				expect(res.body.currency).to.equal('USD');
			});
	});

	// POST - Bad Request
	it('should return \'No items passed.\'', () => {
		return chai.request(app)
			.post('/api/checkout')
			.send({
				items: ''
			})
			.then((res) => {
				expect(res).to.have.status(500);
				expect(res.text).to.equal('No items passed.');
			})
	});

	// POST - Bad Request
	it('should return \'There was a problem processing one of your items.\'', () => {
		return chai.request(app)
			.post('/api/checkout')
			.send({
				items: 'invalid product'
			})
			.then((res) => {
				expect(res).to.have.status(500);
				expect(res.text).to.equal('There was a problem processing one of your items.');
			})
	});

});