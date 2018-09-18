import React from 'react';
import templeVector from '../../assets/images/hindu-temple.png';

export default function Donate() {
	return (
		<div className="row my-5">
			<div className="col-md-3">
				<img src={templeVector} height="300" />
			</div>
			<div className="col-md-3">
				<p>
					We'll get right to the point: we're asking you to help support Khan Academy. We're a nonprofit that
					relies on support from people like you. If everyone reading this gives $10 monthly, Khan Academy can
					continue to thrive for years. Please help keep Khan Academy free, for anyone, anywhere forever.
				</p>
			</div>
			<div className="col-md-6" style={{ background: 'gray' }} />
		</div>
	);
}
