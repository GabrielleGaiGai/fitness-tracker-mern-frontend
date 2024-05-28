import { Routes, Route } from 'react-router-dom'
import Landing from './components/landing/Landing';
import SignIn from './features/auth/SignIn';
import SignUp from './features/auth/SignUp';
import DashHeader from './components/dash/DashHeader'
import WorkoutList from './features/workouts/WorkoutList';
import WorkoutPage from './features/workouts/WorkoutPage';
import UserList from './features/users/UserList';
import UserPage from './features/users/UserPage';
import PersistLogin from './features/auth/PersistLogin';
import RequireAuth from './features/auth/RequireAuth';


function App() {
  return (
    <Routes>
      <Route path="/" >
        <Route index element={<Landing />}></Route>

        <Route path="signin" element={<SignIn />}></Route>
        <Route path="signup" element={<SignUp />}></Route>

        <Route element={<PersistLogin />}>
          <Route path="workouts" element={<DashHeader />}>
            <Route index element={<WorkoutList />}></Route>
            <Route path=":id" element={<WorkoutPage />}></Route>
            <Route path="new" element={<WorkoutPage />}></Route>
          </Route>

          <Route element={<RequireAuth />}>
            <Route path="users" element={<DashHeader />}>
              <Route index element={<UserList />}></Route>
              <Route path=":id" element={<UserPage />}></Route>
              <Route path="new" element={<UserPage />}></Route>
            </Route>

          </Route>
        </Route>

      </Route>
    </Routes>
  );
}

export default App;
