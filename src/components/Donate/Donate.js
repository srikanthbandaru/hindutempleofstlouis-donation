import React from 'react';
import templeVector from '../../assets/images/hindu-temple.png';

export default function Donate() {
	return (
		<div className="row my-5">
			<div className="col-md-2 px-4 d-sm-none d-lg-block">
				<img src={templeVector} className="img-fluid" />
			</div>
			<div className="col-md-4 px-4">
                <h1>Help us do more</h1>
				<p>
					We'll get right to the point: we're asking you to help support Khan Academy. We're a nonprofit that
					relies on support from people like you. If everyone reading this gives $10 monthly, Khan Academy can
					continue to thrive for years. Please help keep Khan Academy free, for anyone, anywhere forever.
				</p>
			</div>
			<div className="col-md-6 px-4" style={{ background: 'gray' }} />
		</div>
	);
}
