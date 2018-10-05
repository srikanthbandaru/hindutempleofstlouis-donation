import React from 'react';
import {
	CardNumberElement,
	CardExpiryElement,
	CardCVCElement,
	PostalCodeElement
} from 'react-stripe-elements';

import { donationRef } from '../../config/firebase';

class CardDetailsForm extends React.Component {
	handleSubmit = event => {
		event.preventDefault();
		const { donateForm } = this.props;

		this.props.stripe.createToken({ name: donateForm.fullName }).then(({ token }) => {
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
		return (
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
	}
}

export default CardDetailsForm;
