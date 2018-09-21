import React from 'react';

export default function Modal(props) {
	return (
		<div
			class="modal fade show"
            role="dialog"
            style={{display: "block"}}
		>
			<div class="modal-dialog" role="document">
				<div class="modal-content">
					<div class="modal-header">
						{props.modalHeader}
					</div>
					<div class="modal-body">
						{props.modalBody}
					</div>
					<div class="modal-footer">
						{props.modalFooter}
					</div>
				</div>
			</div>
		</div>
	);
}
