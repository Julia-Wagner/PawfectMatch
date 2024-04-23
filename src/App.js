import styles from "./App.module.css";
import NavBar from "./components/NavBar";
import BottomNavBar from "./components/BottomNavBar";
import Container from "react-bootstrap/Container"
import {Route, Routes} from "react-router-dom";
import "./api/axiosDefaults"
import SignUpForm from "./pages/auth/SignUpForm";
import SignInForm from "./pages/auth/SignInForm";

function App() {
  return (
    <div className={styles.App}>
        <NavBar />
        <Container className={styles.Main}>
            <Routes>
                <Route exact={true} path="/" element={<h1>Home page</h1>}/>
                <Route exact={true} path="/feed" element={<h1>Feed</h1>}/>
                <Route path="/signin" element={<SignInForm/>}/>
                <Route path="/signup" element={<SignUpForm/>}/>
                <Route path="*" element={<p>Page not found!</p>}/>
            </Routes>
        </Container>
        <BottomNavBar />
    </div>
  );
}

export default App;
