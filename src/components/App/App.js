import React, { Component } from 'react';
import Donate from '../Donate';

class App extends Component {
	render() {
		return (
			<div className="container">
					<h1 className="text-center">Donate Page</h1>
				  <Donate />
			</div>
		);
	}
}

export default App;
