import React, { lazy, Suspense } from "react";
import styles from "./App.module.css";
import NavBar from "./components/NavBar";
import BottomNavBar from "./components/BottomNavBar";
import { Route, Routes } from "react-router-dom";
import { useCurrentUser } from "./contexts/CurrentUserContext";
import PrivateRoute from "./components/PrivateRoute";
import Asset from "./components/Asset";
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignUpForm = lazy(() => import("./pages/auth/SignUpForm"));
const SignInForm = lazy(() => import("./pages/auth/SignInForm"));
const PostsPage = lazy(() => import("./pages/posts/PostsPage"));
const PostCreateForm = lazy(() => import("./pages/posts/PostCreateForm"));
const PostPage = lazy(() => import("./pages/posts/PostPage"));
const PostEditForm = lazy(() => import("./pages/posts/PostEditForm"));
const ProfilePage = lazy(() => import("./pages/profiles/ProfilePage"));
const ProfileEditForm = lazy(() => import("./pages/profiles/ProfileEditForm"));
const SavedPostsPage = lazy(() => import("./pages/posts/SavedPostsPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const DogsPage = lazy(() => import("./pages/dogs/DogsPage"));
const DogCreateForm = lazy(() => import("./pages/dogs/DogCreateForm"));
const DogPage = lazy(() => import("./pages/dogs/DogPage"));
const DogEditForm = lazy(() => import("./pages/dogs/DogEditForm"));
const MatchesPage = lazy(() => import("./pages/dogs/MatchesPage"));
const NotFound = lazy(() => import("./components/NotFound"));

function App() {
    const currentUser = useCurrentUser();
    const profile_id = currentUser?.profile_id || '';

    return (
        <div className={styles.App}>
            <NavBar />
            <ToastContainer position="top-center" theme="dark" />
            <main className={styles.Main}>
                <Suspense fallback={<Asset spinner />}>
                    <Routes>
                        <Route exact={true} path="/" element={<AboutPage />} />
                        <Route path="/signin" element={<SignInForm />} />
                        <Route path="/signup" element={<SignUpForm />} />
                        <Route path="*" element={<NotFound />} />
                        <Route exact={true} path="/feed" element={<PostsPage />} />
                        <Route exact={true} path="/posts/:id" element={<PostPage />} />
                        <Route exact={true} path="/dogs/:id" element={<DogPage />} />
                        <Route exact={true} path="/profiles/:id" element={<ProfilePage />} />
                        <Route exact={true} path="/adopted" element={<DogsPage filter="is_adopted=true" />} />
                        <Route exact={true} path="/following" element={
                            <PrivateRoute>
                                <PostsPage filter={`owner__followed__owner__profile=${profile_id}&`} />
                            </PrivateRoute>
                        } />
                        <Route exact={true} path="/matches" element={
                            <PrivateRoute>
                                <MatchesPage />
                            </PrivateRoute>
                        } />
                        <Route exact={true} path="/dogs" element={
                            <PrivateRoute>
                                <DogsPage />
                            </PrivateRoute>
                        } />
                        <Route exact={true} path="/dogs/create" element={
                            <PrivateRoute>
                                <DogCreateForm />
                            </PrivateRoute>
                        } />
                        <Route exact={true} path="/dogs/:id/edit" element={
                            <PrivateRoute>
                                <DogEditForm />
                            </PrivateRoute>
                        } />
                        <Route exact={true} path="/posts/create" element={
                            <PrivateRoute>
                                <PostCreateForm />
                            </PrivateRoute>
                        } />
                        <Route exact={true} path="/posts/:id/edit" element={
                            <PrivateRoute>
                                <PostEditForm />
                            </PrivateRoute>
                        } />
                        <Route exact={true} path="/posts/profile/:id" element={
                            <PrivateRoute>
                                <PostsPage />
                            </PrivateRoute>
                        } />
                        <Route exact={true} path="/profiles/:id/edit" element={
                            <PrivateRoute>
                                <ProfileEditForm />
                            </PrivateRoute>
                        } />
                        <Route exact={true} path="/saves" element={
                            <PrivateRoute>
                                <SavedPostsPage />
                            </PrivateRoute>
                        } />
                    </Routes>
                </Suspense>
            </main>
            <BottomNavBar />
        </div>
    );
}

export default App;
