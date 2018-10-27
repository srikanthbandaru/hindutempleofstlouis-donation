import React from 'react';
import { injectStripe } from 'react-stripe-elements';

import Modal from '../shared/Modal';
import CardDetailsForm from './CardDetailsForm';

class CheckoutForm extends React.Component {
	state = {
		shouldShowStripeCheckoutModal: false,
		donateForm: {
			donationFrequency: 'monthly',
			donationAmount: 50,
			fullName: '',
			honoreeName: '',
			honoreeEmail: '',
			email: '',
			phone: ''
		},
		donationChoice: []
	};

	componentDidMount() {
		fetch('/api/donationOptions', {
			method: 'get',
			contentType: 'application/json'
		})
			.then(response => response.json())
			.then(donationOptions => {
				this.setState({
					donationChoice: donationOptions
				});
			})
			.catch(error => {
				this.setState({
					error: 'Something went wrong. Please try again.',
					isLoading: false
				});
			});
	}

	toggleStripeCheckoutModal = event => {
		event.preventDefault();
		if (this.state.donateForm.fullName.length > 3) {
			this.setState({
				shouldShowStripeCheckoutModal: !this.state.shouldShowStripeCheckoutModal
			});
		}
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

	render() {
		const { donationChoice } = this.state;
		const renderDonationChoice = amount => (
			<li
				className={`choice-amount p-0 ${Number(this.state.donateForm.donationAmount) === amount ? 'selected' : ''}`}
				style={{
					width: `${100 / (donationChoice.length + 1 - ((window.innerWidth < 736 && 3) || 0))}%`,
					minWidth: `${100 / (donationChoice.length + 1 - ((window.innerWidth < 736 && 3) || 0))}%`
				}}
				onClick={this.handleInputChange}
			>
				<label>
					${amount}
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
					<Modal
						modalBody={
							<CardDetailsForm
								donateForm={this.state.donateForm}
								stripe={this.props.stripe}
								handleInputChange={this.handleInputChange}
							/>
						}
						subTitle="Donation"
						handleClose={this.toggleStripeCheckoutModal}
					/>
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
						<ul className="horizontal-chooser row">
							{donationChoice.map(amount => renderDonationChoice(amount))}
							<li
								className="choice-amount p-0"
								onClick={this.handleInputChange}
								style={{
									width: `${100 / (donationChoice.length + 1 - ((window.innerWidth < 736 && 3) || 0))}%`,
									minWidth: `${100 / (donationChoice.length + 1 - ((window.innerWidth < 736 && 3) || 0))}%`
								}}
							>
								<label>
									Other
									<div className="input-group select-amount">
										<span>$</span>
										<input
											type="number"
											onChange={this.handleInputChange}
											name="donationAmount"
											id="other-amount"
											value={this.state.donateForm.donationAmount}
										/>
									</div>
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
						<form
							className="btn p-0"
							action="https://www.paypal.com/cgi-bin/webscr"
							method="post"
							target="_top"
						>
							<input type="hidden" name="cmd" value="_s-xclick" />
							<input type="hidden" name="hosted_button_id" value="NCJ8XSP6FBEGU" />
							<button className="btn btn-primary w-100">Use Paypal</button>
						</form>

						{/* <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
							<input type="hidden" name="business"
								value="bsrikanth602@gmail.com" />

							<input type="hidden" name="cmd" value="_donations" />

							<input type="hidden" name="item_name" value="Friends of the Park" />
							<input type="hidden" name="item_number" value="Fall Cleanup Campaign" />
							<input type="hidden" name="amount" value="25.00" />
							<input type="hidden" name="currency_code" value="USD" />

							<input type="image" name="submit"
							src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif"
							alt="Donate" />
							<img alt="" width="1" height="1"
							src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" />
						</form> */}
					</div>
				</form>
			</React.Fragment>
		);
	}
}

export default injectStripe(CheckoutForm);
