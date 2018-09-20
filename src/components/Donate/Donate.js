import React from 'react';
import templeVector from '../../assets/images/hindu-temple.png';

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
			<div className="row my-5">
				<div className="col-md-2 px-3 d-md-none d-lg-block">
					<img src={templeVector} className="img-fluid temple-logo mx-auto my-3 d-block" alt="logo" />
				</div>
				<div className="col-md-4 px-3">
					<h1>Help us do more</h1>
					<p>
						We'll get right to the point: we're asking you to help support Khan Academy. We're a nonprofit
						that relies on support from people like you. If everyone reading this gives $10 monthly, Khan
						Academy can continue to thrive for years. Please help keep Khan Academy free, for anyone,
						anywhere forever.
					</p>
				</div>
				<div className="col-md-6 px-3">
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
						<button className="btn btn-link p-0" onClick={this.toggleHonoreeFields}>
							{!this.state.shouldShowHonoreeFields
								? 'Click here to donate in honor of another person'
								: "Never mind — this gift isn't in honor of another person"}
						</button>
						<div className={honoreeFieldsClassName}>
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
							<button className="btn btn-primary donate-using-cc">Use credit card</button>
							<button className="btn btn-primary">Use Paypal</button>
						</div>
						<p className="disclaimer">By donating, you agree to our terms of service and privacy policy.</p>
					</form>
				</div>
			</div>
		);
	}
}
