import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { DEMO_USER } from '../../constants'; // Import DEMO_USER for display

interface LoginViewProps {
  // setActiveSection is not strictly needed if App.tsx handles navigation based on auth state
}

export const LoginView: React.FC<LoginViewProps> = () => {
  const { login, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setError(null);
    const result = await login(); // No arguments needed
    if (!result.success && result.error) {
        setError(result.error);
    }
    // App.tsx will handle redirecting based on auth state change
  };

  return (
    <Card title="Welcome to DevVitals" className="max-w-md mx-auto mt-10 text-center">
      <p className="text-slate-300 mb-2">This is a demo application.</p>
      <p className="text-slate-400 mb-6">
        Click the button below to log in as <code className="bg-slate-700 px-1 py-0.5 rounded text-teal-400">{DEMO_USER.email}</code>.
      </p>
      {error && <p className="text-red-400 text-sm bg-red-900/50 p-3 rounded-md mb-4">{error}</p>}
      <Button 
        onClick={handleLogin} 
        variant="primary" 
        size="lg" 
        className="w-full" 
        disabled={isLoading}
      >
        {isLoading ? 'Logging in...' : 'Login as Demo User'}
      </Button>
    </Card>
  );
};
