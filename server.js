require('dotenv').config({ path: './.env.local' });

const stripe = require('stripe')(process.env.REACT_APP_STRIPE_SECRET_APIKEY);
const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.REACT_APP_NODEMAILER_EMAIL,
		pass: process.env.REACT_APP_NODEMAILER_PASSWORD
	}
});

const mailOptions = (honoreeEmailAddress, honoreeName, donatorFullName) => ({
	from: `Donation | Cultural & Education Center STL <${process.env.REACT_APP_NODEMAILER_EMAIL}>`,
	to: honoreeEmailAddress,
	subject: 'Thank you for donating to Cultural & Education Center - STL!',
	html: `
			<div>
				<p>Dear ${honoreeName},</p>
				<p>
					We want to let you know that ${donatorFullName} made a donation to the 
					<a href="https://edu.hindutemplestlouis.org/" target="blank">Cultural & Education Center</a> 
					in your honor.
				</p>
				<p>
					With your donation, our education center can continue to thrive for years. 
					Thank you for helping us to continue promoting our traditions and culture to carry forward with new generations.
				</p>
				<p>
					The Hindu Temple of St. Louis<br />
					725 Weidman Road<br />
					Ballwin, MO - 63021
				</p>
			</div>
		`
});

const sendReceipt = (honoreeEmailAddress, honoreeName, donatorFullName) => {
	transporter.sendMail(mailOptions(honoreeEmailAddress, honoreeName, donatorFullName), function (err, info) {
		if(err)
			console.log(err)
		else
			console.log(info);
	});
}

const serviceAccount = {
	type: 'service_account',
	project_id: process.env.REACT_APP_FIREBASE_PROJECTID,
	private_key_id: process.env.REACT_APP_FIREBASE_PRIVATE_KEY_ID,
	private_key: process.env.REACT_APP_FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
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
		description: 'Donation for Cultural & Education Center', // receipt emails will include the description of the charge(s)
		receipt_email: request.email,
		customer: customer.id,
		statement_descriptor: 'The Hindu Temple STL' // An arbitrary string to be displayed on our donator's credit card statement. Limit is 22 characters
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

const donationOptions = [50, 75, 100, 150, 250];

app.get('/api/donationOptions', async (req, res) => {
	res.send(donationOptions);
});

app.post('/api/donate', async (req, res) => {
	try {
		const request = JSON.parse(req.body);
		const customer = await createCustomer(request);
		let charge, createSubscriptionResponse, createPlanResponse;
	
		if (request.donationFrequency === 'oneTime') {
			charge = await createCharge(request, customer);
		} else if (donationOptions.includes(Number(request.donationAmount))) {
			// recurring payments - one of suggested amounts
			const plan = {
				50: '50-dollars',
				75: '75-dollars',
				100: '100-dollars',
				150: '150-dollars',
				250: '250-dollars'
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
		if (request.honoreeEmail) {
			sendReceipt(request.honoreeEmail, request.honoreeName, request.fullName);
		}
		
		const body = JSON.parse(req.body);
		res.json(body);
	} catch {
		const error = {error: 'Something went wrong. Please try again later or contact STLTempleEdu@gmail.com'};
		res.status(500).json(error);
	}
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
