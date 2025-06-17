
import React, { useState, useEffect } from 'react';
import { HealthLog } from '../types';
import { Mood, EyeStrainSeverity, MOOD_OPTIONS, EYE_STRAIN_OPTIONS } from '../constants';
import { Button } from './common/Button';
import { Card } from './common/Card';

interface LogEntryFormProps {
  onSave: (log: Omit<HealthLog, 'id' | 'date'>) => void;
  existingLogForToday?: Omit<HealthLog, 'id' | 'date'>;
  previousDayLog?: Omit<HealthLog, 'id' | 'date'>; // For pre-filling
}

const getDefaultValues = (
  existingLogForToday?: Omit<HealthLog, 'id' | 'date'>,
  previousDayLog?: Omit<HealthLog, 'id' | 'date'>
) => {
  const source = existingLogForToday || previousDayLog;
  return {
    hydration: source?.hydration ?? 0,
    eyeStrain: source?.eyeStrain ?? EyeStrainSeverity.NONE,
    sleep: source?.sleep ?? 0,
    mood: source?.mood ?? Mood.OKAY,
  };
};

export const LogEntryForm: React.FC<LogEntryFormProps> = ({ onSave, existingLogForToday, previousDayLog }) => {
  const initialValues = getDefaultValues(existingLogForToday, previousDayLog);

  const [hydration, setHydration] = useState<number>(initialValues.hydration);
  const [eyeStrain, setEyeStrain] = useState<EyeStrainSeverity>(initialValues.eyeStrain);
  const [sleep, setSleep] = useState<number>(initialValues.sleep);
  const [mood, setMood] = useState<Mood>(initialValues.mood);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const newDefaults = getDefaultValues(existingLogForToday, previousDayLog);
    setHydration(newDefaults.hydration);
    setEyeStrain(newDefaults.eyeStrain);
    setSleep(newDefaults.sleep);
    setMood(newDefaults.mood);
  }, [existingLogForToday, previousDayLog]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ hydration, eyeStrain, sleep, mood });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const labelClass = "block mb-2 text-sm font-medium text-slate-300";
  const stepperButtonClass = "px-4 py-2 bg-slate-600 hover:bg-slate-500 text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:ring-offset-slate-800 transition-colors";
  const numberInputClass = "w-20 text-center p-2.5 bg-slate-700 border-y border-slate-600 text-slate-100 focus:ring-teal-500 focus:border-teal-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

  return (
    <Card title="Log Today's Vitals" className="max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Mood Selection */}
        <div>
          <label className={labelClass}>Mood</label>
          <div className="flex flex-wrap gap-2">
            {MOOD_OPTIONS.map(option => (
              <button
                key={option}
                type="button"
                onClick={() => setMood(option)}
                aria-pressed={mood === option}
                className={`p-2.5 rounded-lg text-xl sm:text-2xl min-w-[50px] sm:min-w-[60px] flex-grow sm:flex-grow-0 justify-center items-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all duration-150 ease-in-out
                  ${mood === option ? 'bg-teal-500 text-white ring-teal-400 scale-105 shadow-lg' : 'bg-slate-700 hover:bg-slate-600 text-slate-200 ring-transparent'}`}
              >
                {option.split(' ')[0]} <span className="text-xs hidden sm:inline">{option.split(' ')[1]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Eye Strain Selection */}
        <div>
          <label className={labelClass}>Eye Strain</label>
          <div className="flex flex-wrap gap-2">
            {EYE_STRAIN_OPTIONS.map(option => (
              <button
                key={option}
                type="button"
                onClick={() => setEyeStrain(option)}
                aria-pressed={eyeStrain === option}
                className={`px-3 py-1.5 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 transition-colors duration-150 ease-in-out
                  ${eyeStrain === option ? 'bg-teal-500 text-white ring-teal-400 shadow-md' : 'bg-slate-600 hover:bg-slate-500 text-slate-300 ring-transparent'}`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Hydration Input */}
        <div>
          <label htmlFor="hydration" className={labelClass}>Hydration (glasses)</label>
          <div className="flex items-center">
            <button type="button" onClick={() => setHydration(h => Math.max(0, h - 1))} className={`${stepperButtonClass} rounded-l-md`} aria-label="Decrease hydration">-</button>
            <input
              type="number"
              id="hydration"
              min="0"
              value={hydration}
              onChange={(e) => setHydration(parseInt(e.target.value, 10) || 0)}
              className={numberInputClass}
              required
            />
            <button type="button" onClick={() => setHydration(h => h + 1)} className={`${stepperButtonClass} rounded-r-md`} aria-label="Increase hydration">+</button>
          </div>
        </div>

        {/* Sleep Input */}
        <div>
          <label htmlFor="sleep" className={labelClass}>Sleep (hours)</label>
          <div className="flex items-center">
            <button type="button" onClick={() => setSleep(s => Math.max(0, s - 0.5))} className={`${stepperButtonClass} rounded-l-md`} aria-label="Decrease sleep">-</button>
            <input
              type="number"
              id="sleep"
              min="0"
              step="0.5"
              value={sleep}
              onChange={(e) => setSleep(parseFloat(e.target.value) || 0)}
              className={numberInputClass}
              required
            />
            <button type="button" onClick={() => setSleep(s => s + 0.5)} className={`${stepperButtonClass} rounded-r-md`} aria-label="Increase sleep">+</button>
          </div>
        </div>
        
        <Button type="submit" variant="primary" size="lg" className="w-full">
          {existingLogForToday ? 'Update Log' : 'Save Log'}
        </Button>
        {showSuccess && (
          <p className="text-green-400 text-center mt-3">Log saved successfully!</p>
        )}
      </form>
    </Card>
  );
};
