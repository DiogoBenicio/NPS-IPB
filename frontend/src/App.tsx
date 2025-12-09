import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import NpsCampaign from './pages/NpsCampaign';
import AdminDashboard from './pages/AdminDashboard';
import Analytics from './pages/Analytics';
import CampaignDetails from './pages/CampaignDetails';
import Contacts from './pages/Contacts';
import NotFound from './pages/NotFound';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/campaign/:campaignId" element={<NpsCampaign />} />
          <Route path="/survey/:campaignId" element={<NpsCampaign />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/campaign-details/:id" element={<CampaignDetails />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
