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
import SavedPostsPage from "./pages/posts/SavedPostsPage";
import AboutPage from "./pages/AboutPage";
import DogsPage from "./pages/dogs/DogsPage";
import DogCreateForm from "./pages/dogs/DogCreateForm";
import DogPage from "./pages/dogs/DogPage";
import DogEditForm from "./pages/dogs/DogEditForm";
import MatchesPage from "./pages/dogs/MatchesPage";

function App() {
    const currentUser = useCurrentUser();
    const profile_id = currentUser?.profile_id || '';

    return (
        <div className={styles.App}>
            <NavBar />
            <main className={styles.Main}>
                <Routes>
                    <Route exact={true} path="/" element={<AboutPage/>}/>
                    <Route path="/signin" element={<SignInForm/>}/>
                    <Route path="/signup" element={<SignUpForm/>}/>
                    <Route path="*" element={<p>Page not found!</p>}/>

                    <Route exact={true} path="/feed" element={<PostsPage/>}/>
                    <Route exact={true} path="/posts/:id" element={<PostPage/>}/>
                    <Route exact={true} path="/dogs/:id" element={<DogPage/>}/>
                    <Route exact={true} path="/profiles/:id" element={<ProfilePage/>}/>

                    <Route exact={true} path="/following" element={
                        <PrivateRoute>
                            <PostsPage filter={`owner__followed__owner__profile=${profile_id}&`} />
                        </PrivateRoute>
                    }/>
                    <Route exact={true} path="/matches" element={
                        <PrivateRoute>
                            <MatchesPage />
                        </PrivateRoute>
                    }/>
                    <Route exact={true} path="/dogs" element={
                        <PrivateRoute>
                            <DogsPage />
                        </PrivateRoute>
                    }/>
                    <Route exact={true} path="/dogs/create" element={
                        <PrivateRoute>
                            <DogCreateForm />
                        </PrivateRoute>
                    }/>
                    <Route exact={true} path="/dogs/:id/edit" element={
                        <PrivateRoute>
                            <DogEditForm />
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
                    <Route exact={true} path="/posts/profile/:id" element={
                        <PrivateRoute>
                            <PostsPage />
                        </PrivateRoute>
                    }/>
                    <Route exact={true} path="/profiles/:id/edit" element={
                        <PrivateRoute>
                            <ProfileEditForm />
                        </PrivateRoute>
                    }/>
                    <Route exact={true} path="/saves" element={
                        <PrivateRoute>
                            <SavedPostsPage />
                        </PrivateRoute>
                    }/>
                </Routes>
            </main>
            <BottomNavBar />
        </div>
    );
}

export default App;
