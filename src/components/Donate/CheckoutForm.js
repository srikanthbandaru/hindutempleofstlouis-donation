import React from 'react';
import {
	CardNumberElement,
	CardExpiryElement,
	CardCVCElement,
	PostalCodeElement,
	injectStripe
} from 'react-stripe-elements';
import Modal from '../shared/Modal';

class CheckoutForm extends React.Component {
	state = {
		shouldShowStripeCheckoutModal: false
	};

	toggleStripeCheckoutModal = event => {
		event.preventDefault();
		this.setState({
			shouldShowStripeCheckoutModal: !this.state.shouldShowStripeCheckoutModal
		});
	};

	handleSubmit = event => {
		event.preventDefault();
		this.props.stripe.createToken({ name: 'Jenny Rosen' }).then(({ token }) => {
			console.log('Received Stripe token:', token);
		});
	};

	render() {
		const cardElement = (
			<form onSubmit={this.handleSubmit}>
				<label>
					Card number
					<CardNumberElement />
				</label>
				<div className="row">
					<div className="col-md-6">
						<label>
							Expiration date
							<CardExpiryElement />
						</label>
					</div>
					<div className="col-md-6">
						<label>
							CVC
							<CardCVCElement />
						</label>
					</div>
				</div>
				<button>Pay</button>
			</form>
		);
		return (
			<React.Fragment>
				{this.state.shouldShowStripeCheckoutModal && (
					<Modal modalBody={cardElement} subTitle="Donation" handleClose={this.toggleStripeCheckoutModal} />
				)}

				<form className="mt-1" id="donate-form">
					<div className="form-group frequency">
						<label className="col-form-label pt-0">Select your support</label>
						<div className="form-check">
							<label for="gridRadios1">Monthly</label>
							<input
								className="form-check-input"
								type="radio"
								name="gridRadios"
								id="gridRadios1"
								value="option1"
								checked
							/>
						</div>
						<div className="form-check">
							<label for="gridRadios2">One time</label>
							<input
								className="form-check-input"
								type="radio"
								name="gridRadios"
								id="gridRadios2"
								value="option2"
							/>
						</div>
					</div>
					<div className="form-group">
						<label for="fullName">Select your amount</label>
						<ul className="horizontal-chooser">
							<li className="choice-amount">
								<label>$10</label>
							</li>
							<li className="choice-amount">
								<label>$35</label>
							</li>
							<li className="choice-amount">
								<label>$50</label>
							</li>
							<li className="choice-amount">
								<label>$100</label>
							</li>
							<li className="choice-amount">
								<label>$250</label>
							</li>
							<li className="choice-amount">
								<label>Other</label>
							</li>
						</ul>
					</div>
					<div className="form-group">
						<label for="fullName">Your name</label>
						<input type="text" className="form-control" id="fullName" placeholder="" />
					</div>
					<button className="btn btn-link p-0" onClick={this.props.toggleHonoreeFields}>
						{!this.props.shouldShowHonoreeFields
							? 'Click here to donate in honor of another person'
							: "Never mind — this gift isn't in honor of another person"}
					</button>
					<div className={this.props.honoreeFieldsClassName}>
						<div className="honoree-details my-2">
							<div className="form-group">
								<label for="honoreeName">Honoree's name</label>
								<input type="text" className="form-control" id="honoreeName" placeholder="" />
							</div>
							<div className="form-group">
								<label for="honoreeEmail">Honoree's email</label>
								<input type="email" className="form-control" id="honoreeEmail" placeholder="" />
								<small>We will notify your honoree of your gift</small>
							</div>
						</div>
					</div>
					<div className="donate-button-group">
						<button className="btn btn-primary donate-using-cc" onClick={this.toggleStripeCheckoutModal}>
							Use credit card
						</button>
						<button className="btn btn-primary">Use Paypal</button>
					</div>
				</form>
			</React.Fragment>
		);
	}
}

export default injectStripe(CheckoutForm);
