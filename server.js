require('dotenv').config({ path: './.env.local' });

const stripe = require('stripe')(process.env.REACT_APP_STRIPE_SECRET_APIKEY);
const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');

const port = process.env.PORT || 8000;

app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.text({ extended: true }));

app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});

// API calls
app.post('/api/createDonator', async (req, res) => {
	const request = JSON.parse(req.body);

	var customer = await stripe.customers
		.create({
			email: request.email,
			source: request.token.id
		})
		.then(customer => {
			console.log(customer);

			request.customer = customer;
			if (request.donationFrequency === 'oneTime') {
				return stripe.charges.create({
					amount: 5500,
					currency: 'usd',
					description: 'Donation',
					// source: request.token.id,
					customer: customer.id,
					statement_descriptor: 'Custom descriptor'
				});
			}
		})
		.then(charges => {
			request.charges = charges;
			console.log(charges);
		});

	// create customer
	// if one time, create charge
	// else
	//

	console.log(customer);

	res.send(req.body);
});

if (process.env.NODE_ENV === 'production') {
	// Serve any static files
	app.use(express.static(path.join(__dirname, 'build')));
	// Handle React routing, return all requests to React app
	app.get('*', function(req, res) {
		res.sendFile(path.join(__dirname, 'build', 'index.html'));
	});
}

app.listen(port, () => console.log(`Listening on port ${port}`));
