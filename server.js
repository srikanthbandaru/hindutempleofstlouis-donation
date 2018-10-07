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
const createCustomer = request => {
	return stripe.customers.create({
		email: request.email,
		source: request.token.id
	});
};

const createCharge = (request, customer) => {
	return stripe.charges.create({
		amount: Number(`${request.donationAmount}00`),
		currency: 'usd',
		description: 'One time donation',
		// source: request.token.id,
		customer: customer.id,
		statement_descriptor: 'Custom descriptor'
	});
};

const createSubscription = (customer, plan) => {
	return stripe.subscriptions.create({
		customer: customer.id,
		items: [
			{
				plan
			}
		]
	});
};

const createPlan = request => {
	return stripe.plans.create({
		amount: Number(`${request.donationAmount}00`),
		interval: 'month',
		product: {
			name: 'Custom amount'
		},
		currency: 'usd'
	});
};

const donationOptions = [10, 35, 50, 100, 250];

app.get('/api/donationOptions', async (req, res) => {
	res.send(donationOptions);
});

app.post('/api/createDonator', async (req, res) => {
	const request = JSON.parse(req.body);
	const customer = await createCustomer(request);
	let charge, createSubscriptionResponse, createPlanResponse;

	console.log(Number(request.donationAmount));

	console.log(donationOptions.includes(Number(request.donationAmount)));

	if (request.donationFrequency === 'oneTime') {
		charge = await createCharge(request, customer);
	} else if (donationOptions.includes(Number(request.donationAmount))) {
		// recurring payments - one of suggested amounts
		const plan = {
			10: 'plan_DjzM6a0mah4M41',
			35: 'plan_DjzMMq1zsUpDqo',
			50: 'plan_DjzN5knl2Vg3qM',
			100: 'plan_DjzNrTvqAOKGfC',
			250: 'plan_DjzQTPdkvy79h8'
		}[Number(request.donationAmount)];
		createSubscriptionResponse = await createSubscription(customer, plan);
	} else {
		// recurring payments - custom amount
		createPlanResponse = await createPlan(request);
		createSubscriptionResponse = await createSubscription(customer, createPlanResponse.id);
	}

	console.log('111111111111111');
	console.log(customer);
	console.log('222222222222222');
	console.log(charge);
	console.log('333333333333333');
	console.log(createSubscriptionResponse);
	console.log('444444444444444');
	console.log(createPlanResponse);

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
