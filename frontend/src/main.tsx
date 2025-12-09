import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import logger from './services/logger';
import './index.css';
import './styles/lovable.css';
import App from './App.tsx';
import ErrorBoundary from './components/ErrorBoundary';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);

// Global error handlers for the frontend to capture unexpected errors
window.addEventListener('error', (event) => {
  logger.error('window_error', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
  });
});

window.addEventListener('unhandledrejection', (event) => {
  logger.error('unhandled_rejection', { reason: event.reason?.toString?.() || event.reason });
});
