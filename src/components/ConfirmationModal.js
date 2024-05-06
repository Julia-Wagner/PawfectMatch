import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import btnStyles from "../styles/Button.module.css";

const ConfirmationModal = ({ title, text, show, onHide, onConfirm }) => {
    return (
        <Modal centered show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {text}
            </Modal.Body>
            <Modal.Footer>
                <Button className={`${btnStyles.ReverseButton} ${btnStyles.Button}`}
                        onClick={onHide}>
                    Cancel
                </Button>
                <Button className={`${btnStyles.Button}`} onClick={onConfirm}>
                    Confirm
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ConfirmationModal;