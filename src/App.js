import styles from "./App.module.css";
import NavBar from "./components/NavBar";
import BottomNavBar from "./components/BottomNavBar";
import {Route, Routes, useNavigate} from "react-router-dom";
import "./api/axiosDefaults"
import SignUpForm from "./pages/auth/SignUpForm";
import SignInForm from "./pages/auth/SignInForm";
import PostsPage from "./pages/posts/PostsPage";
import {useCurrentUser} from "./contexts/CurrentUserContext";
import PrivateRoute from "./components/PrivateRoute";
import PostCreateForm from "./pages/posts/PostCreateForm";
import PostPage from "./pages/posts/PostPage";
import PostEditForm from "./pages/posts/PostEditForm";
import ProfilePage from "./pages/profiles/ProfilePage";
import ProfileEditForm from "./pages/profiles/ProfileEditForm";

function App() {
    const currentUser = useCurrentUser();
    const profile_id = currentUser?.profile_id || '';

    return (
        <div className={styles.App}>
            <NavBar />
            <main className={styles.Main}>
                <Routes>
                    <Route exact={true} path="/" element={<h1>Home page</h1>}/>
                    <Route path="/signin" element={<SignInForm/>}/>
                    <Route path="/signup" element={<SignUpForm/>}/>
                    <Route path="*" element={<p>Page not found!</p>}/>

                    <Route exact={true} path="/feed" element={<PostsPage/>}/>
                    <Route exact={true} path="/posts/:id" element={<PostPage/>}/>
                    <Route exact={true} path="/profiles/:id" element={<ProfilePage/>}/>

                    <Route exact={true} path="/following" element={
                        <PrivateRoute>
                            <PostsPage filter={`owner__followed__owner__profile=${profile_id}&`} />
                        </PrivateRoute>
                    }/>
                    <Route exact={true} path="/matches" element={
                        <PrivateRoute>
                            <PostsPage filter="has_dogs=true&" />
                        </PrivateRoute>
                    }/>
                    <Route exact={true} path="/posts/create" element={
                        <PrivateRoute>
                            <PostCreateForm />
                        </PrivateRoute>
                    }/>
                    <Route exact={true} path="/posts/:id/edit" element={
                        <PrivateRoute>
                            <PostEditForm />
                        </PrivateRoute>
                    }/>
                    <Route exact={true} path="/profiles/:id/edit" element={
                        <PrivateRoute>
                            <ProfileEditForm />
                        </PrivateRoute>
                    }/>
                </Routes>
            </main>
            <BottomNavBar />
        </div>
    );
}

export default App;
