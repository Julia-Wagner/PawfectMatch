import React from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import appStyles from "../App.module.css";
import styles from "../styles/About.module.css";
import Image from "react-bootstrap/Image";
import playground from "../assets/playground.svg";

function AboutPage() {

    return (
        <Container>
            <Row className="h-100 mt-4">
                <Col className="py-2 p-0 p-lg-2">
                    <Container className={`p-4 ${appStyles.Content}`}>
                        <h2 className="text-center">About PawfectMatch</h2>
                        <p className="text-center">Welcome to PawfectMatch, your trusted companion in finding the perfect pet!
                            Our mission is to connect loving animals with compassionate people, creating happy homes and lifelong friendships.
                            Whether you're looking to adopt a pet, foster or support shelters.</p>
                        <h3 className="text-center mt-4">How to Use PawfectMatch</h3>
                        <ol>
                            <li className={styles.StepItem}>
                                <strong>Sign Up:</strong> Create a free account to get started.
                            </li>
                            <li className={styles.StepItem}>
                                <strong>Create a Profile:</strong> Complete your profile with details about yourself and what you're looking for in a pet. This helps us suggest pets that are a good match for you.
                            </li>
                            <li className={styles.StepItem}>
                                <strong>Search for Dogs:</strong> Use our search filters to browse dogs by breed, age, size and characteristics. Each dog's profile includes photos, a description, and important information about their personality and needs.
                            </li>
                            <li className={styles.StepItem}>
                                <strong>Save Your Favorites:</strong> If you find dogs or shelters that interest you, save or follow them for easy access later.
                            </li>
                            <li className={styles.StepItem}>
                                <strong>Contact Shelters:</strong> Once you've found a dog you'd like to meet, contact the shelter or rescue organization directly. They can provide more information and guide you through the adoption process.
                            </li>
                        </ol>
                        <h3 className="text-center mt-4">Contact us</h3>
                        <p className="text-center">We'd love to hear from you! If you have any questions, suggestions, or need assistance,
                            feel free to reach out to us at <span className={appStyles.SidebarLink}>pawfect-match@email.com</span> or follow us on our social media channels for the latest updates.</p>
                        <ul className={styles.UnorderedList}>
                            <li className={styles.ListItem}>
                                <a href="https://github.com/Julia-Wagner" className="footer-icon" target="_blank" rel="noopener" aria-label="open my GitHub profile in a new tab">
                                    <svg className={styles.SocialIcon} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-4.466 19.59c-.405.078-.534-.171-.534-.384v-2.195c0-.747-.262-1.233-.55-1.481 1.782-.198 3.654-.875 3.654-3.947 0-.874-.312-1.588-.823-2.147.082-.202.356-1.016-.079-2.117 0 0-.671-.215-2.198.82-.64-.18-1.324-.267-2.004-.271-.68.003-1.364.091-2.003.269-1.528-1.035-2.2-.82-2.2-.82-.434 1.102-.16 1.915-.077 2.118-.512.56-.824 1.273-.824 2.147 0 3.064 1.867 3.751 3.645 3.954-.229.2-.436.552-.508 1.07-.457.204-1.614.557-2.328-.666 0 0-.423-.768-1.227-.825 0 0-.78-.01-.055.487 0 0 .525.246.889 1.17 0 0 .463 1.428 2.688.944v1.489c0 .211-.129.459-.528.385-3.18-1.057-5.472-4.056-5.472-7.59 0-4.419 3.582-8 8-8s8 3.581 8 8c0 3.533-2.289 6.531-5.466 7.59z"></path>
                                    </svg>
                                </a>
                            </li>
                            <li className={styles.ListItem}>
                                <a href="https://www.linkedin.com/in/julia-wagner-0ba4461a8" className="footer-icon" target="_blank" rel="noopener" aria-label="open my LinkedIn profile in a new tab">
                                    <svg className={styles.SocialIcon} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                                    </svg>
                                </a>
                            </li>
                        </ul>
                    </Container>
                </Col>
            </Row>
            <Row>
                <Col className={`my-auto p-2`}>
                    <Image className={`${appStyles.FillerImage}`} src={playground} />
                </Col>
            </Row>
        </Container>
    );
}

export default AboutPage;