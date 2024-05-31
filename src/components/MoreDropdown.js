import React from "react";
import PropTypes from 'prop-types';
import Dropdown from "react-bootstrap/Dropdown";
import styles from "../styles/MoreDropdown.module.css";

const ThreeDots = React.forwardRef(({ onClick }, ref) => (
    <i
        className="fa-solid fa-caret-down"
        ref={ref}
        onClick={(e) => {
            e.preventDefault();
            onClick(e);
        }}
    />
));

ThreeDots.displayName = "ThreeDots";

export const MoreDropdown = ({ handleEdit, handleDelete }) => {
    return (
        <Dropdown className="ml-auto" drop="left">
            <Dropdown.Toggle as={ThreeDots} />

            <Dropdown.Menu className="text-center">
                <Dropdown.Item
                    className={styles.DropdownItem} onClick={handleEdit} aria-label="edit">
                    <i className="fas fa-edit" />
                </Dropdown.Item>
                <Dropdown.Item
                    className={styles.DropdownItem} onClick={handleDelete} aria-label="delete">
                    <i className="fas fa-trash-alt" />
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
};

MoreDropdown.propTypes = {
    handleEdit: PropTypes.func,
    handleDelete: PropTypes.func,
};

ThreeDots.propTypes = {
    onClick: PropTypes.func,
};