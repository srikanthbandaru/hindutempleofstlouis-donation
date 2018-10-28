import React from 'react';
import { CardElement } from 'react-stripe-elements';
import ReactLoading from 'react-loading';

import { donationRef } from '../../config/firebase';

class CardDetailsForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
			donateResponse: {},
			error: ''
		};
	}

	handleSubmit = event => {
		event.preventDefault();
		this.setState({
			isLoading: true
		});

		const { donateForm } = this.props;

		this.props.stripe.createToken({ name: donateForm.fullName }).then(({ token }) => {
			donateForm.token = token;

			fetch('/api/donate', {
				method: 'post',
				contentType: 'application/json',
				body: JSON.stringify(donateForm)
			})
				.then(response => response.json())
				.then(body => {
					this.setState({
						donateResponse: body,
						error: body.error,
						isLoading: false
					});
				})
				.catch(error => {
					this.setState({
						error: 'Something went wrong. Please try again later or contact STLTempleEdu@gmail.com',
						isLoading: false
					});
				});

			// console.log('donateResponse', donateResponse);
		});
	};

	render() {
		const { donateResponse } = this.state;

		if (donateResponse && donateResponse.token) {
			return (
				<div className="donation-success">
					<p className="thank-you">Thank you!</p>
					<p>
						Your {donateResponse.donationFrequency} donation of ${donateResponse.donationAmount} has been
						succesfully processed.
					</p>
				</div>
			);
		}

		return (
			<form onSubmit={this.handleSubmit}>
				{this.state.isLoading && (
					<div className="processing-donation">
						<ReactLoading type="bars" color="white" height={67} width={67} />
						<p className="align-middle">Processing Donation</p>
					</div>
				)}
				<div className="input-group">
					<span className="username" />
					<input type="text" className="w-100" value={this.props.donateForm.fullName} />
				</div>
				<div className="row">
					<div className="col-md-6 input-group email-group">
						<span className="email" />
						<input
							type="email"
							placeHolder="Email"
							className="w-100"
							value={this.props.donateForm.email}
							name="email"
							onChange={this.props.handleInputChange}
						/>
					</div>
					<div className="col-md-6 input-group phone-group">
						<span className="phone" />
						<input
							type="number"
							placeholder="Phone"
							className="w-100"
							value={this.props.donateForm.phoneNumber}
							name="phoneNumber"
							onChange={this.props.handleInputChange}
						/>
					</div>
				</div>

				<br />
				<CardElement />
				<br />

				{this.state.error && <p className="text-danger">{this.state.error}</p>}
				<button type="submit" className="btn btn-success">
					Donate ${this.props.donateForm.donationAmount}
				</button>
			</form>
		);
	}
}

export default CardDetailsForm;
