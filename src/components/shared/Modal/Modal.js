import React from 'react';
import templeVector from '../../../assets/images/hindu-temple.png';

export default function Modal(props) {
	return (
		<React.Fragment>
			<div className="modal-backdrop" />
			<div class="modal fade show" role="dialog" style={{ display: 'block' }}>
				<div class="modal-dialog" role="document">
					<div class="modal-content">
						<div class="modal-header">
							{props.modalHeader}
							<header class="Header" role="banner" style={{ width: '100%' }}>
								<div>
									<button
										onClick={props.handleClose}
										type="button"
										class="close"
										data-dismiss="modal"
										aria-label="Close"
										style={{fontSize: '1em', width: '100px'}}
									>
										close
									</button>
								</div>
								<div class="text-center">
									<div class="header-logo-wrap">
										<div class="Header-logoBevel" />
										<div class="Header-logoBorder" />
										<img class="img-fluid text-center modal-logo" src={templeVector} width="120" />
										<div class="Header-logoImage" alt="Logo" />
									</div>
								</div>
								<h4 class="title text-center m-0" style={{ fontSize: '1.5em' }}>
									The Hindu Temple of Saint Louis
								</h4>
								<h5 class="sub-title text-center">{props.subTitle}</h5>
								<div class="Header-account" />
							</header>
						</div>
						<div class="modal-body text-center">{props.modalBody}</div>
						{/* <div class="modal-footer">{props.modalFooter}</div> */}
					</div>
				</div>
			</div>
		</React.Fragment>
	);
}
