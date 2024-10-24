// Modal.js
import React from 'react';

const PriceModal = ({ show, handleClose, children }) => {
    const showHideClassName = show ? "modal display-block" : "modal display-none";

    return (
        <div className={showHideClassName}>
            <section className="modal-main">
            <a className='close' onClick={handleClose}>x</a>

                {children}


            </section>
        </div>
    );
};

export default PriceModal;
