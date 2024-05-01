import styles from "./App.module.css";
import NavBar from "./components/NavBar";
import BottomNavBar from "./components/BottomNavBar";
import Container from "react-bootstrap/Container"
import {Route, Routes} from "react-router-dom";
import "./api/axiosDefaults"
import SignUpForm from "./pages/auth/SignUpForm";
import SignInForm from "./pages/auth/SignInForm";
import PostsPage from "./pages/posts/PostsPage";
import {useCurrentUser} from "./contexts/CurrentUserContext";

function App() {
    const currentUser = useCurrentUser();
    const profile_id = currentUser?.profile_id || '';

      return (
        <div className={styles.App}>
            <NavBar />
            <main className={styles.Main}>
                <Routes>
                    <Route exact={true} path="/" element={<h1>Home page</h1>}/>
                    <Route exact={true} path="/feed" element={<PostsPage/>}/>
                    <Route exact={true} path="/following" element={<PostsPage
                        filter={`owner__followed__owner__profile=${profile_id}&`}
                    />}/>
                    <Route exact={true} path="/matches" element={<PostsPage
                        filter="has_dogs=true&"
                    />}/>
                    <Route path="/signin" element={<SignInForm/>}/>
                    <Route path="/signup" element={<SignUpForm/>}/>
                    <Route path="*" element={<p>Page not found!</p>}/>
                </Routes>
            </main>
            <BottomNavBar />
        </div>
      );
}

export default App;
