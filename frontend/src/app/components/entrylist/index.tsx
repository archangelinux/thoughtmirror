"use client";
import React, { useState, useEffect } from 'react';
import JournalEntryButton from '@/app/components/entrybutton';

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  distortions: string[];
}

interface EntryListProps {
  entries: JournalEntry[];
  onEntrySelect: (entry: JournalEntry) => void;
  onEntryDelete: (id: string) => void;
  maxTitleLength?: number;
}

//if title is too long
const truncateTitle = (title: string, maxLength: number): string => {
  return title.length > maxLength ? `${title.substring(0, maxLength)}...` : title;
};

const EntryList: React.FC<EntryListProps> = ({ 
  entries, 
  onEntrySelect,
  onEntryDelete,
  maxTitleLength = 30
}) => {
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(
    entries.length > 0 ? entries[0].id : null
  );

  // Check for selected entry from calendar on initial load
  useEffect(() => {
    const selectedEntryId = localStorage.getItem("selectedEntryId");
    if (selectedEntryId && entries.length > 0) {
      const entryToSelect = entries.find(entry => entry.id === selectedEntryId);
      if (entryToSelect) {
        setSelectedEntryId(entryToSelect.id);
        onEntrySelect(entryToSelect);
        // Clear the stored ID after using it
        localStorage.removeItem("selectedEntryId");
      }
    }
  }, [entries, onEntrySelect]);

  const handleEntryClick = (entry: JournalEntry) => {
    setSelectedEntryId(entry.id);
    onEntrySelect(entry);
  };

  return (
    <div className="w-full overflow-y-auto max-h-full pr-2" style={{ minWidth: "200px" }}>
      {entries.length === 0 ? (
        <div className="text-gray-500 text-center text-[14px] p-4">
          Create your first entry here. 
        </div>
      ) : (
        entries.map((entry) => (
          <div key={entry.id} className="w-full" style={{ minWidth: "100%" }}>
            <JournalEntryButton
              id={entry.id}
              title={truncateTitle(entry.title, maxTitleLength)}
              fullTitle={entry.title}
              createdAt={entry.createdAt}
              updatedAt={entry.updatedAt}
              isSelected={selectedEntryId === entry.id}
              onClick={() => handleEntryClick(entry)}
              onDelete={() => onEntryDelete(entry.id)}
            />
          </div>
        ))
      )}
    </div>
  );
};

export default EntryList;