import React from 'react';
import {
	CardNumberElement,
	CardExpiryElement,
	CardCVCElement,
	PostalCodeElement,
	injectStripe
} from 'react-stripe-elements';

import { donationRef } from '../../config/firebase';
import Modal from '../shared/Modal';

class CheckoutForm extends React.Component {
	state = {
		shouldShowStripeCheckoutModal: false,
		donateForm: {
			donationFrequency: 'monthly',
			donationAmount: '$10',
			fullName: '',
			honoreeName: '',
			honoreeEmail: ''
		}
	};

	toggleStripeCheckoutModal = event => {
		event.preventDefault();
		this.setState({
			shouldShowStripeCheckoutModal: !this.state.shouldShowStripeCheckoutModal
		});
	};

	handleInputChange = event => {
		const { donateForm } = this.state;

		if (!event.target.name) {
			const name = event.target.querySelector('input').name;
			const value = event.target.querySelector('input').value;

			donateForm[name] = value;
		} else {
			donateForm[event.target.name] = event.target.value;
		}

		this.setState({
			donateForm
		});
	};

	handleSubmit = event => {
		event.preventDefault();
		const { donateForm } = this.state;

		this.props.stripe.createToken({ name: this.state.donateForm.fullName }).then(({ token }) => {
			donateForm.token = token;

			fetch('http://localhost:8000/api/createDonator', {
				method: 'post',
				contentType: 'application/json',
				body: JSON.stringify(donateForm)
			}).then((response) => {
				console.log(response);
				return response.json();
			})

			console.log('Received Stripe token:', donateForm);

			// donationRef.push().set(donateForm);
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
		const donationChoice = ['$10', '$35', '$50', '$100', '$250'];
		const renderDonationChoice = amount => (
			<li
				className={`choice-amount ${this.state.donateForm.donationAmount === amount ? 'selected' : ''}`}
				style={{
					width: `${100 / (donationChoice.length + 1)}%`,
					minWidth: `${100 / (donationChoice.length + 1)}%`
				}}
				onClick={this.handleInputChange}
			>
				<label>
					{amount}
					<input
						className="hidden-radio"
						type="radio"
						name="donationAmount"
						id="donationAmount1"
						value={amount}
						checked={this.state.donateForm.donationAmount === amount}
					/>
				</label>
			</li>
		);
		return (
			<React.Fragment>
				{this.state.shouldShowStripeCheckoutModal && (
					<Modal modalBody={cardElement} subTitle="Donation" handleClose={this.toggleStripeCheckoutModal} />
				)}

				<form className="mt-1" id="donate-form">
					<div className="form-group frequency">
						<label className="col-form-label pt-0">Select your support</label>
						<div className="form-check" onClick={this.handleInputChange}>
							<label htmlFor="gridRadios1">
								Monthly
								<input
									className="form-check-input"
									type="radio"
									name="donationFrequency"
									id="donationFrequency1"
									value="monthly"
									checked={this.state.donateForm.donationFrequency === 'monthly'}
								/>
							</label>
						</div>
						<div className="form-check" onClick={this.handleInputChange}>
							<label htmlFor="gridRadios2">
								One time
								<input
									className="form-check-input"
									type="radio"
									name="donationFrequency"
									id="donationFrequency2"
									value="oneTime"
									checked={this.state.donateForm.donationFrequency === 'oneTime'}
								/>
							</label>
						</div>
					</div>
					<div className="form-group">
						<label htmlFor="fullName">Select your amount</label>
						<ul className="horizontal-chooser">
							{donationChoice.map(amount => renderDonationChoice(amount))}
							<li
								className="choice-amount"
								onClick={this.handleInputChange}
								style={{
									width: `${100 / (donationChoice.length + 1)}%`,
									minWidth: `${100 / (donationChoice.length + 1)}%`
								}}
							>
								<label>
									Other
									<input
										type="number"
										onChange={this.handleInputChange}
										name="donationAmount"
										id="other-amount"
										value={this.state.donateForm.donationAmount}
									/>
								</label>
							</li>
						</ul>
					</div>
					<div className="form-group">
						<label htmlFor="fullName">Your name</label>
						<input
							type="text"
							className="form-control"
							name="fullName"
							value={this.state.donateForm.fullName}
							onChange={this.handleInputChange}
						/>
					</div>
					<button className="btn btn-link p-0" onClick={this.props.toggleHonoreeFields}>
						{!this.props.shouldShowHonoreeFields
							? 'Click here to donate in honor of another person'
							: "Never mind — this gift isn't in honor of another person"}
					</button>
					<div className={this.props.honoreeFieldsClassName}>
						<div className="honoree-details my-2">
							<div className="form-group">
								<label htmlFor="honoreeName">Honoree's name</label>
								<input
									type="text"
									className="form-control"
									name="honoreeName"
									value={this.state.donateForm.honoreeName}
									onChange={this.handleInputChange}
								/>
							</div>
							<div className="form-group">
								<label htmlFor="honoreeEmail">Honoree's email</label>
								<input
									type="email"
									className="form-control"
									name="honoreeEmail"
									value={this.state.donateForm.honoreeEmail}
									onChange={this.handleInputChange}
								/>
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
