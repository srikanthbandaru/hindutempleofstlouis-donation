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

	render() {
		const cardElement = (
			<form>
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

				<form className="mt-1">
					<div className="form-group frequency">
						<legend className="col-form-label pt-0">Select your support</legend>
						<div className="form-check">
							<input
								className="form-check-input"
								type="radio"
								name="gridRadios"
								id="gridRadios1"
								value="option1"
								checked
							/>
							<label className="form-check-label" for="gridRadios1">
								Monthly
							</label>
						</div>
						<div className="form-check">
							<input
								className="form-check-input"
								type="radio"
								name="gridRadios"
								id="gridRadios2"
								value="option2"
							/>
							<label className="form-check-label" for="gridRadios2">
								One time
							</label>
						</div>
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
						<div className="honoree-details">
							<div className="form-group">
								<label for="honoreeName">Honoree's name</label>
								<input type="text" className="form-control" id="honoreeName" placeholder="" />
							</div>
							<div className="form-group">
								<label for="honoreeEmail">Honoree's email</label>
								<input type="email" className="form-control" id="honoreeEmail" placeholder="" />
							</div>
						</div>
					</div>
					<div className="donate-button-group">
						<button className="btn btn-primary donate-using-cc" onClick={this.toggleStripeCheckoutModal}>
							Use credit card
						</button>
						<button className="btn btn-primary">Use Paypal</button>
					</div>
					<p className="disclaimer">By donating, you agree to our terms of service and privacy policy.</p>
				</form>
			</React.Fragment>
		);
	}
}

export default injectStripe(CheckoutForm);
