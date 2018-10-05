import React from "react";
import { CardElement } from "react-stripe-elements";

import { donationRef } from "../../config/firebase";

class CardDetailsForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleSubmit = event => {
        event.preventDefault();
        const { donateForm } = this.props;

        this.props.stripe.createToken({ name: donateForm.fullName }).then(({ token }) => {
            donateForm.token = token;

            fetch("http://localhost:8000/api/createDonator", {
                method: "post",
                contentType: "application/json",
                body: JSON.stringify(donateForm)
            }).then(response => {
                console.log(response);
                return response.json();
            });

            console.log("Received Stripe token:", donateForm);

            // donationRef.push().set(donateForm);
        });
    };

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <input type="text" className="w-100" value={this.props.donateForm.fullName} />
                <div className="row">
                    <div className="col-md-6">
                        <input
                            type="email"
                            placeHolder="Email"
                            className="w-100"
                            value={this.state.email}
                            name="email"
                        />
                    </div>
                    <div className="col-md-6">
                        <input
                            type="number"
                            placeholder="Phone"
                            className="w-100"
                            value={this.state.phoneNumber}
                            name="phoneNumber"
                        />
                    </div>
                </div>

                <hr />
                <CardElement />
                <button>Pay {this.props.donateForm.donationAmount}</button>
            </form>
        );
    }
}

export default CardDetailsForm;
