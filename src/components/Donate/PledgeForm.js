import React from 'react';
import ReactLoading from 'react-loading';

import { donationRef } from '../../config/firebase';

class PledgeForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
			isSuccessfullySaved: false,
			error: ''
		};
	}

	handleSubmit = event => {
		event.preventDefault();
		this.setState({
			isLoading: true
		});
		const { donateForm } = this.props;
		donateForm.isPledged = true;

		donationRef.push().set(donateForm);
		this.setState({
			isSuccessfullySaved: true
		});
	};

	render() {
		const { isSuccessfullySaved } = this.state;

		if (isSuccessfullySaved) {
			return (
				<div className="donation-success">
					<p className="thank-you">Thank you!</p>
					<p>
						Your pledge for {this.props.donateForm.donationFrequency} donation of ${this.props.donateForm.donationAmount} has been
						succesfully saved.
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
				{this.state.error && <p className="text-danger">{this.state.error}</p>}
				<br />
				<button type="submit" className="btn btn-success">
					Pledge ${this.props.donateForm.donationAmount} {this.props.donateForm.donationFrequency === 'monthly' ? 'monthly for 36 months' : 'one time'}
				</button>
			</form>
		);
	}
}

export default PledgeForm;
