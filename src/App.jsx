import { HashRouter, Routes, Route } from 'react-router-dom'
import SurveyForm from './pages/SurveyForm.jsx'
import Dashboard from './pages/Dashboard.jsx'
import PasswordGate from './components/PasswordGate.jsx'

export default function App() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<SurveyForm />} />
                <Route
                    path="/dashboard"
                    element={
                        <PasswordGate password="CloudDashboardNPSNBS2026">
                            <Dashboard />
                        </PasswordGate>
                    }
                />
            </Routes>
        </HashRouter>
    )
}
