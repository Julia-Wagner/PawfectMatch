import {Container, Nav, Navbar} from "react-bootstrap";
import logo from "../assets/logo.webp";
import styles from "../styles/NavBar.module.css"
import { NavLink } from "react-router-dom";
import {useCurrentUser, useSetCurrentUser} from "../contexts/CurrentUserContext";
import axios from "axios";
import useClickOutsideToggle from "../hooks/useClickOutsideToggle";

const NavBar = () => {
    const currentUser = useCurrentUser();
    const setCurrentUser = useSetCurrentUser();

    const {expanded, setExpanded, ref} = useClickOutsideToggle();

    const handleSignOut = async () => {
        try {
            await axios.post("dj-rest-auth/logout/");
            setCurrentUser(null);
        } catch (err) {
            console.log(err);
        }
    }

    const loggedInIcons = <>
        <NavLink to="/feed" className={({ isActive }) => isActive ? styles.Active : styles.NavLink}>Feed</NavLink>
        <NavLink to="/following" className={({ isActive }) => isActive ? styles.Active : styles.NavLink}>Following</NavLink>
        <NavLink to="/" className={styles.NavLink} onClick={handleSignOut}>Sign out</NavLink>
    </>

    const loggedOutIcons = (
        <>
            <NavLink to="/feed" className={({ isActive }) => isActive ? styles.Active : styles.NavLink}>Feed</NavLink>
            <NavLink to="/signin" className={({ isActive }) => isActive ? styles.Active : styles.NavLink}>Sign in</NavLink>
            <NavLink to="/signup" className={({ isActive }) => isActive ? styles.Active : styles.NavLink}>Sign up</NavLink>
        </>
    )

    return (
        <header>
            <Navbar expanded={expanded} className={styles.NavBar} expand="md" sticky="top">
                <Container>
                    <NavLink to="/">
                        <h1>
                            <span className="sr-only">PawfectMatch</span>
                            <img className={styles.Logo} src={logo} alt="logo" height="45" />
                        </h1>
                    </NavLink>
                    <Navbar.Toggle
                        ref={ref}
                        onClick={() => setExpanded(!expanded)}
                        aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto text-center">
                            {currentUser ? loggedInIcons : loggedOutIcons}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    )
}

export default NavBar;