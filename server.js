require('dotenv').config({ path: './.env.local' });

const stripe = require('stripe')(process.env.REACT_APP_STRIPE_SECRET_APIKEY);
const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const admin = require('firebase-admin');

const serviceAccount = {
	type: 'service_account',
	project_id: process.env.REACT_APP_FIREBASE_PROJECTID,
	private_key_id: process.env.REACT_APP_FIREBASE_PRIVATE_KEY_ID,
	private_key: process.env.REACT_APP_FIREBASE_PRIVATE_KEY,
	client_email: process.env.REACT_APP_FIREBASE_CLIENT_EMAIL,
	client_id: process.env.REACT_APP_FIREBASE_CLIENT_ID,
	auth_uri: process.env.REACT_APP_FIREBASE_AUTH_URI,
	token_uri: process.env.REACT_APP_FIREBASE_TOKEN_URI,
	auth_provider_x509_cert_url: process.env.REACT_APP_FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
	client_x509_cert_url: process.env.REACT_APP_FIREBASE_CLIENT_X509_CERT_URL
};

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: 'https://hindutempleofstlouis-donation.firebaseio.com'
});

const databaseRef = admin.database().ref();
const donationRef = databaseRef.child('donationDetails');
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
		receipt_email: request.email,
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

app.post('/api/donate', async (req, res) => {
	const request = JSON.parse(req.body);
	const customer = await createCustomer(request);
	let charge, createSubscriptionResponse, createPlanResponse;

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

	request.customer = customer || {};
	request.charge = charge || {};
	request.createSubscriptionResponse = createSubscriptionResponse || {};
	request.createPlanResponse = createPlanResponse || {};

	donationRef.push().set(request);

	console.log(JSON.parse(req.body));

	const body = JSON.parse(req.body);
	res.json(body);
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
