import React, { useState, useEffect, useCallback } from 'react';
import { HealthLog, JournalEntry, ReminderSettings, ActiveSection } from './types';
import { LOCAL_STORAGE_KEYS, REMINDER_INTERVAL_WATER_MS, REMINDER_INTERVAL_SCREEN_BREAK_MS } from './constants';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useAuth } from './contexts/AuthContext';
import { Header } from './components/Header';
import { LogEntryForm } from './components/LogEntryForm';
import { JournalInput } from './components/JournalInput';
import { DashboardView } from './components/DashboardView';
import { ReminderControls } from './components/ReminderControls';
import { LoginView } from './components/auth/LoginView';

const App: React.FC = () => {
  const { currentUser, isAuthenticated, isLoading: isLoadingAuth, logout } = useAuth();
  
  const [activeSection, setActiveSectionInternal] = useState<ActiveSection>('log');

  useEffect(() => {
    if (!isLoadingAuth) {
      if (!isAuthenticated) {
        setActiveSectionInternal('login'); 
      } else { // Authenticated (and verified by default for demo user)
        if (activeSection === 'login') { // If previously on login, switch to log
            setActiveSectionInternal('log');
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isLoadingAuth]);


  const [healthLogs, setHealthLogs] = useLocalStorage<HealthLog[]>(LOCAL_STORAGE_KEYS.HEALTH_LOGS, []);
  const [journalEntries, setJournalEntries] = useLocalStorage<JournalEntry[]>(LOCAL_STORAGE_KEYS.JOURNAL_ENTRIES, []);
  const [reminderSettings, setReminderSettings] = useLocalStorage<ReminderSettings>(LOCAL_STORAGE_KEYS.REMINDER_SETTINGS, {
    waterBreakEnabled: false,
    screenBreakEnabled: false,
    notificationPermission: typeof Notification !== 'undefined' ? Notification.permission : 'default',
  });

  const waterIntervalRef = React.useRef<number | null>(null);
  const screenBreakIntervalRef = React.useRef<number | null>(null);

  const showNotification = useCallback((title: string, body: string) => {
    if (reminderSettings.notificationPermission === 'granted') {
      new Notification(title, { body });
    }
  }, [reminderSettings.notificationPermission]);
  
  useEffect(() => {
    if (isAuthenticated && reminderSettings.waterBreakEnabled && reminderSettings.notificationPermission === 'granted') {
      showNotification('DevVitals', 'Water break reminders enabled!');
      waterIntervalRef.current = window.setInterval(() => {
        showNotification('DevVitals: Hydration Reminder', 'Time for a water break! 💧');
      }, REMINDER_INTERVAL_WATER_MS);
    }
    return () => {
      if (waterIntervalRef.current) clearInterval(waterIntervalRef.current);
    };
  }, [isAuthenticated, reminderSettings.waterBreakEnabled, reminderSettings.notificationPermission, showNotification]);

  useEffect(() => {
    if (isAuthenticated && reminderSettings.screenBreakEnabled && reminderSettings.notificationPermission === 'granted') {
      showNotification('DevVitals', 'Screen break reminders enabled!');
      screenBreakIntervalRef.current = window.setInterval(() => {
        showNotification('DevVitals: Screen Break Reminder', 'Time to rest your eyes and stretch! 🧘');
      }, REMINDER_INTERVAL_SCREEN_BREAK_MS);
    }
    return () => {
      if (screenBreakIntervalRef.current) clearInterval(screenBreakIntervalRef.current);
    };
  }, [isAuthenticated, reminderSettings.screenBreakEnabled, reminderSettings.notificationPermission, showNotification]);

  const handleAddHealthLog = useCallback((logData: Omit<HealthLog, 'id' | 'date'>) => {
    const todayDate = new Date().toISOString().split('T')[0];
    const newLog: HealthLog = { ...logData, id: todayDate, date: todayDate };
    setHealthLogs(prevLogs => {
      const existingLogIndex = prevLogs.findIndex(l => l.date === todayDate);
      if (existingLogIndex > -1) {
        const updatedLogs = [...prevLogs];
        updatedLogs[existingLogIndex] = newLog;
        return updatedLogs;
      }
      return [...prevLogs, newLog].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    });
  }, [setHealthLogs]);

  const handleAddJournalEntry = useCallback((text: string) => {
    const now = Date.now();
    const newEntry: JournalEntry = {
      id: now.toString(),
      date: new Date(now).toISOString().split('T')[0],
      timestamp: now,
      text,
    };
    setJournalEntries(prevEntries => [newEntry, ...prevEntries]);
  }, [setJournalEntries]);
  
  const requestNotificationPermission = useCallback(() => {
    if (typeof Notification !== 'undefined' && Notification.permission !== 'granted') {
      Notification.requestPermission().then(permission => {
        setReminderSettings(prev => ({ ...prev, notificationPermission: permission }));
        if (permission === 'granted') {
          showNotification('DevVitals', 'Notifications enabled! You can now set reminders.');
        }
      });
    }
  }, [setReminderSettings, showNotification]);
  
  useEffect(() => {
    const updateNotificationPermissionStatus = () => {
      if (typeof Notification !== 'undefined' && Notification.permission !== reminderSettings.notificationPermission) {
         setReminderSettings(prev => ({ ...prev, notificationPermission: Notification.permission }));
      }
    };
    updateNotificationPermissionStatus(); // Check on mount
    // Periodically check if permission changed externally (e.g., in browser settings)
    const permissionCheckInterval = setInterval(updateNotificationPermissionStatus, 60000); 
    // Also check on window focus, as user might change settings and come back
    window.addEventListener('focus', updateNotificationPermissionStatus);

    return () => {
      clearInterval(permissionCheckInterval);
      window.removeEventListener('focus', updateNotificationPermissionStatus);
    };
  }, [reminderSettings.notificationPermission, setReminderSettings]);


  const toggleWaterReminder = () => setReminderSettings(prev => ({ ...prev, waterBreakEnabled: !prev.waterBreakEnabled }));
  const toggleScreenBreakReminder = () => setReminderSettings(prev => ({ ...prev, screenBreakEnabled: !prev.screenBreakEnabled }));

  const todayDateStr = new Date().toISOString().split('T')[0];
  const todayLog = healthLogs.find(log => log.date === todayDateStr);
  const getPreviousDayLog = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayDateStr = yesterday.toISOString().split('T')[0];
    return healthLogs.find(log => log.date === yesterdayDateStr);
  };
  const previousDayLog = todayLog ? undefined : getPreviousDayLog();

  const handleLogout = () => {
    logout();
    setActiveSectionInternal('login'); // Navigate to login after logout
  };
  
  const handleNavigateToLogin = () => {
    setActiveSectionInternal('login');
  };
  
  if (isLoadingAuth) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">Loading Auth...</div>;
  }

  const renderContent = () => {
    if (!isAuthenticated) {
      return <LoginView />;
    }
    // Authenticated and verified demo user
    switch (activeSection) {
      case 'log':
        return <LogEntryForm onSave={handleAddHealthLog} existingLogForToday={todayLog} previousDayLog={previousDayLog} />;
      case 'journal':
        return <JournalInput onSave={handleAddJournalEntry} recentEntries={journalEntries} />;
      case 'dashboard':
        return <DashboardView healthLogs={healthLogs} />;
      case 'settings':
        return <ReminderControls settings={reminderSettings} onToggleWaterReminder={toggleWaterReminder} onToggleScreenBreakReminder={toggleScreenBreakReminder} onRequestNotificationPermission={requestNotificationPermission} />;
      case 'login': // Should not typically be reached if isAuthenticated is true, but as a fallback
        return <LoginView />;
      default:
        return <LogEntryForm onSave={handleAddHealthLog} existingLogForToday={todayLog} previousDayLog={previousDayLog} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        activeSection={activeSection} 
        setActiveSection={setActiveSectionInternal} 
        isAuthenticated={isAuthenticated}
        user={currentUser}
        onLogout={handleLogout}
        onNavigateToLogin={handleNavigateToLogin}
      />
      <main className="flex-grow container mx-auto p-4 md:p-8 space-y-8">
        {renderContent()}
      </main>
      <footer className="text-center p-4 text-sm text-slate-500 border-t border-slate-700 mt-8">
        DevVitals &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default App;
