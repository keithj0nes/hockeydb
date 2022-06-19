import React from 'react';
// import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { unstable_HistoryRouter as HistoryRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';

import PropTypes from 'prop-types';
// import { Link, Routes, Route, Outlet } from 'react-router-dom';

import { useSelector } from 'react-redux';
// import { decrement, increment } from './redux/slices/counter';

import { Header } from './components/guest';

import News from './pages/guest/news/News';
import Schedule from './pages/guest/Schedule';
import Login from './components/auth/Login';
import Standings from './pages/guest/Standings';
import { history } from './utils';

import Players from './pages/guest/Players';

import DashboardRouter from './pages/dashboard/Router';

function App() {
    // const count = useSelector((state) => state.counter.value)
    // const dispatch = useDispatch()

    return (
        <HistoryRouter history={history}>
            <Routes>
                <Route path="/" element={<Guest />}>
                    <Route path="" element={<Home />} />
                    <Route path="expense" element={<Expenses />} />
                    <Route path="expenses" element={<Expenses />} />
                    <Route path="invoices" element={<Invoices />} />
                    <Route path="schedule" element={<Schedule />} />
                    <Route path="login" element={<Login />} />
                    <Route path="standings" element={<Standings />} />
                    <Route path="players" element={<Players />} />

                    <Route
                        path="*"
                        element={(
                            <main style={{ padding: '1rem' }}>
                                <p>404 - There is nothing here!</p>
                            </main>
                        )}
                    />

                </Route>

                <Route
                    path="/dashboard/*"
                    element={(
                        <PrivateRoute>
                            <DashboardRouter />
                        </PrivateRoute>
                    )}
                />
                {/* <Route
                    path="*"
                    element={(
                        <main style={{ padding: '1rem' }}>
                            <p>404 - There is nothing here!</p>
                        </main>
                    )}
                /> */}
            </Routes>
        </HistoryRouter>
    );
}

function PrivateRoute({ children }) {
    const auth = useSelector(state => state.auth);
    const location = useLocation();
    return auth.isAuthenticated ? children : <Navigate to="/login" state={{ from: location.pathname, state: location.state, search: location.search }} />;
}

PrivateRoute.propTypes = {
    children: PropTypes.any,
};

export default App;


function Guest() {
    return (
        <main className="bg-gray-100 h-screen">
            <Header />

            <div className="p-2 max-w-6xl m-auto">
                <Outlet />
            </div>
        </main>
    );
}

function Home() {
    return (
        <main className="">
            <News />
        </main>
    );
}

function Invoices() {
    return (
        <main style={{ padding: '1rem 0' }}>
            <h2>Invoices</h2>
        </main>
    );
}

function Expenses() {
    return (
        <main style={{ padding: '1rem 0' }}>
            <h2>Expenses</h2>
        </main>
    );
}
