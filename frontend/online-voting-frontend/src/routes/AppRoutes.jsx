import { Route, Routes } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import RoleRoute from './RoleRoute'
import GuestRoute from './GuestRoute'
import AuthLayout from '../layouts/AuthLayout'
import DashboardLayout from '../layouts/DashboardLayout'
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage'
import ResetPasswordPage from '../pages/auth/ResetPasswordPage'
import AdminDashboard from '../pages/admin/AdminDashboard'
import AdminElections from '../pages/admin/AdminElections'
import AdminVoters from '../pages/admin/AdminVoters'
import AdminCandidates from '../pages/admin/AdminCandidates'
import AdminApplications from '../pages/admin/AdminApplications'
import AdminResults from '../pages/admin/AdminResults'
import AdminAuditLogs from '../pages/admin/AdminAuditLogs'
import VoterDashboard from '../pages/voter/VoterDashboard'
import ElectionList from '../pages/voter/ElectionList'
import ElectionDetails from '../pages/voter/ElectionDetails'
import VotingHistory from '../pages/voter/VotingHistory'
import ResultsPage from '../pages/voter/ResultsPage'
import VoterProfilePage from '../pages/voter/VoterProfilePage'
import CandidateDashboard from '../pages/candidate/CandidateDashboard'
import CandidateProfilePage from '../pages/candidate/CandidateProfilePage'
import ApplyForElection from '../pages/candidate/ApplyForElection'
import MyApplications from '../pages/candidate/MyApplications'
import CandidateResults from '../pages/candidate/CandidateResults'
import LandingPage from '../pages/public/LandingPage'
import NotFoundPage from '../pages/public/NotFoundPage'
import UiKit from '../UiKit'
import { ROLES } from '../utils/constants'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/ui-kit" element={<UiKit />} />

      <Route element={<GuestRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route element={<RoleRoute allowedRoles={[ROLES.ADMIN]} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/elections" element={<AdminElections />} />
            <Route path="/admin/voters" element={<AdminVoters />} />
            <Route path="/admin/candidates" element={<AdminCandidates />} />
            <Route path="/admin/applications" element={<AdminApplications />} />
            <Route path="/admin/results" element={<AdminResults />} />
            <Route path="/admin/audit-logs" element={<AdminAuditLogs />} />
          </Route>

          <Route element={<RoleRoute allowedRoles={[ROLES.VOTER]} />}>
            <Route path="/voter/dashboard" element={<VoterDashboard />} />
            <Route path="/voter/elections" element={<ElectionList />} />
            <Route path="/voter/elections/:id" element={<ElectionDetails />} />
            <Route path="/voter/history" element={<VotingHistory />} />
            <Route path="/voter/results" element={<ElectionList />} />
            <Route path="/voter/results/:electionId" element={<ResultsPage />} />
            <Route path="/voter/profile" element={<VoterProfilePage />} />
          </Route>

          <Route element={<RoleRoute allowedRoles={[ROLES.CANDIDATE]} />}>
            <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
            <Route path="/candidate/profile" element={<CandidateProfilePage />} />
            <Route path="/candidate/apply" element={<ApplyForElection />} />
            <Route path="/candidate/applications" element={<MyApplications />} />
            <Route path="/candidate/results" element={<CandidateResults />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default AppRoutes