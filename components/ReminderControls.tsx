
import React from 'react';
import { ReminderSettings } from '../types';
import { Button } from './common/Button';
import { Card } from './common/Card';

interface ReminderControlsProps {
  settings: ReminderSettings;
  onToggleWaterReminder: () => void;
  onToggleScreenBreakReminder: () => void;
  onRequestNotificationPermission: () => void;
}

const ToggleSwitch: React.FC<{ label: string; enabled: boolean; onToggle: () => void; disabled?: boolean }> = 
  ({ label, enabled, onToggle, disabled = false }) => (
  <div className="flex items-center justify-between py-2">
    <span className={`text-slate-200 ${disabled ? 'opacity-50' : ''}`}>{label}</span>
    <button
      onClick={onToggle}
      disabled={disabled}
      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-slate-800 ${
        disabled ? 'cursor-not-allowed' : ''
      } ${enabled ? 'bg-teal-500' : 'bg-slate-600'}`}
    >
      <span
        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  </div>
);


export const ReminderControls: React.FC<ReminderControlsProps> = ({
  settings,
  onToggleWaterReminder,
  onToggleScreenBreakReminder,
  onRequestNotificationPermission,
}) => {
  const notificationsDisabled = settings.notificationPermission !== 'granted';

  return (
    <Card title="Reminder Settings" className="max-w-md mx-auto">
      {settings.notificationPermission === 'default' && (
        <div className="mb-6 p-4 bg-slate-700 rounded-md text-center">
          <p className="text-slate-300 mb-3">Enable browser notifications to receive reminders.</p>
          <Button onClick={onRequestNotificationPermission} variant="primary">
            Enable Notifications
          </Button>
        </div>
      )}
      {settings.notificationPermission === 'denied' && (
        <div className="mb-6 p-4 bg-red-700/30 border border-red-600 rounded-md text-center">
          <p className="text-red-300">
            Notification permission denied. You need to enable it in your browser settings to receive reminders.
          </p>
        </div>
      )}
      
      <div className="space-y-3">
        <ToggleSwitch
          label="Water Break Reminders"
          enabled={settings.waterBreakEnabled && !notificationsDisabled}
          onToggle={onToggleWaterReminder}
          disabled={notificationsDisabled}
        />
        <ToggleSwitch
          label="Screen Break Reminders"
          enabled={settings.screenBreakEnabled && !notificationsDisabled}
          onToggle={onToggleScreenBreakReminder}
          disabled={notificationsDisabled}
        />
      </div>
      {notificationsDisabled && settings.notificationPermission === 'granted' && (
        <p className="text-xs text-slate-400 mt-4">
            Note: Notifications seem to be globally disabled in your browser or OS, even if permission was granted for this site.
        </p>
      )}
    </Card>
  );
};
