import React from 'react';
import { Elements, StripeProvider } from 'react-stripe-elements';
import templeVector from '../../assets/images/hindu-temple.png';
import CheckoutForm from './CheckoutForm';

export default class Donate extends React.Component {
	state = {
		shouldShowHonoreeFields: false
	};

	toggleHonoreeFields = event => {
		event.preventDefault();
		this.setState({
			shouldShowHonoreeFields: !this.state.shouldShowHonoreeFields
		});
	};

	render() {
		const honoreeFieldsClassName = `collapse ${this.state.shouldShowHonoreeFields ? ' show' : ''}`;

		return (
			<StripeProvider apiKey={process.env.REACT_APP_STRIPE_APIKEY}>
				<div className="row my-5" style={{ color: 'black', fontWeight: '600' }}>
					<div className="col-md-2 px-3 d-md-none d-lg-block">
						<img src={templeVector} className="img-fluid temple-logo mx-auto my-3 d-block" alt="logo" />
					</div>
					<div className="col-md-4 px-3">
						<h1 className="font-weight-bold" style={{ fontSize: '2em' }}>
							Help us do more
						</h1>
						<p>
							We're asking you to help support OUR Hindu Temple Education & Cultural Center. This is a
							nonprofit organization that relies on support from people like you. With your donation, our
							education center can continue to thrive for years. Please help us to continue promoting our
							traditions and culture to carry forward with new generations.
						</p>
					</div>
					<div className="col-md-6 px-3">
						<Elements>
							<CheckoutForm
								honoreeFieldsClassName={honoreeFieldsClassName}
								toggleHonoreeFields={this.toggleHonoreeFields}
								shouldShowHonoreeFields={this.state.shouldShowHonoreeFields}
							/>
						</Elements>
						<p className="disclaimer">By donating, you agree to our terms of service and privacy policy.</p>
					</div>
				</div>
			</StripeProvider>
		);
	}
}
