
import React, { useState } from 'react';
import { JournalEntry } from '../types';
import { Button } from './common/Button';
import { Card } from './common/Card';

interface JournalInputProps {
  onSave: (text: string) => void;
  recentEntries: JournalEntry[];
}

export const JournalInput: React.FC<JournalInputProps> = ({ onSave, recentEntries }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSave(text.trim());
      setText('');
    }
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <Card title="Mind Dump / Journal">
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What's on your mind?"
            rows={5}
            className="w-full p-3 bg-slate-700 border border-slate-600 rounded-md text-slate-100 focus:ring-teal-500 focus:border-teal-500 placeholder-slate-400"
          />
          <Button type="submit" variant="primary" className="w-full" disabled={!text.trim()}>
            Save Entry
          </Button>
        </form>
      </Card>

      {recentEntries.length > 0 && (
        <Card title="Recent Entries" titleClassName="text-xl">
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {recentEntries.slice(0, 5).map(entry => (
              <div key={entry.id} className="p-3 bg-slate-700 rounded-md">
                <p className="text-xs text-slate-400 mb-1">
                  {new Date(entry.timestamp).toLocaleDateString()} - {new Date(entry.timestamp).toLocaleTimeString()}
                </p>
                <p className="text-slate-200 whitespace-pre-wrap">{entry.text}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
