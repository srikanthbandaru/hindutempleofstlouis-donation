import React, { Component } from 'react';
import Donate from '../Donate';
import templeText from '../../assets/images/hindu-temple-text.PNG';

class App extends Component {
	render() {
		return (
			<div className="container">
				<img
					src={templeText}
					className="img-fluid mx-auto my-3 d-block"
					alt="the hindu temple of saint louis"
					width="274"
				/>
				<Donate />
			</div>
		);
	}
}

export default App;
