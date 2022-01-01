import React from 'react'

import { Routes, Route } from 'react-router'

import LoadingFallback from 'components/LoadingFallback'

const Dashboard = React.lazy(
    () => import('containers/Dashboard' /* webpackChunkName: "Dashboard" */)
)
const Login = React.lazy(
    () => import('pages/Auth/Login' /* webpackChunkName: "Login" */)
)
const Register = React.lazy(
    () => import('pages/Auth/Register' /* webpackChunkName: "Register" */)
)
const ForgotPassword = React.lazy(
    () =>
        import(
            'pages/Auth/ForgotPassword' /* webpackChunkName: "ForgotPassword" */
        )
)
const ResetPassword = React.lazy(
    () =>
        import(
            'pages/Auth/ResetPassword' /* webpackChunkName: "ResetPassword" */
        )
)
const VerifyEmail = React.lazy(
    () => import('pages/Auth/VerifyEmail' /* webpackChunkName: "VerifyEmail" */)
)
const Projects = React.lazy(
    () => import('pages/Projects' /* webpackChunkName: "Projects" */)
)
const NotFound = React.lazy(
    () => import('pages/NotFound' /* webpackChunkName: "NotFound" */)
)
const Profile = React.lazy(
    () => import('pages/Profile' /* webpackChunkName: "Profile" */)
)
const PayoutAddress = React.lazy(
    () => import('pages/PayoutAddress' /* webpackChunkName: "PayoutAddress" */)
)
const ProjectPayments = React.lazy(
    () =>
        import(
            'pages/ProjectPayments' /* webpackChunkName: "ProjectPayments" */
        )
)
const Payouts = React.lazy(
    () => import('pages/Payouts' /* webpackChunkName: "Payouts" */)
)

const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
    <React.Suspense fallback={<LoadingFallback />}>{children}</React.Suspense>
)

const AppRoutes = () => {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <SuspenseWrapper>
                        <Dashboard />
                    </SuspenseWrapper>
                }>
                <Route
                    path="projects"
                    element={
                        <SuspenseWrapper>
                            <Projects />
                        </SuspenseWrapper>
                    }
                />
                <Route
                    path="profile"
                    element={
                        <SuspenseWrapper>
                            <Profile />
                        </SuspenseWrapper>
                    }
                />
                <Route
                    path="payout-addresses"
                    element={
                        <SuspenseWrapper>
                            <PayoutAddress />
                        </SuspenseWrapper>
                    }
                />
                <Route
                    path="project-payments"
                    element={
                        <SuspenseWrapper>
                            <ProjectPayments />
                        </SuspenseWrapper>
                    }
                />
                <Route
                    path="payouts"
                    element={
                        <SuspenseWrapper>
                            <Payouts />
                        </SuspenseWrapper>
                    }
                />
            </Route>
            <Route
                path="login"
                element={
                    <SuspenseWrapper>
                        <Login />
                    </SuspenseWrapper>
                }
            />
            <Route
                path="register"
                element={
                    <SuspenseWrapper>
                        <Register />
                    </SuspenseWrapper>
                }
            />
            <Route
                path="forgot-password"
                element={
                    <SuspenseWrapper>
                        <ForgotPassword />
                    </SuspenseWrapper>
                }
            />
            <Route
                path="reset-password/:token"
                element={
                    <SuspenseWrapper>
                        <ResetPassword />
                    </SuspenseWrapper>
                }
            />
            <Route
                path="verify-email/:token"
                element={
                    <SuspenseWrapper>
                        <VerifyEmail />
                    </SuspenseWrapper>
                }
            />
            <Route
                path="*"
                element={
                    <SuspenseWrapper>
                        <NotFound />
                    </SuspenseWrapper>
                }
            />
        </Routes>
    )
}

export default AppRoutes
