// components/JournalEntryList.tsx
import React, { useState } from 'react';
import JournalEntryButton from '@/app/components/entrybutton';

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface EntryListProps {
  entries: JournalEntry[];
  onEntrySelect: (entry: JournalEntry) => void;
  onEntryDelete: (id: string) => void;
  maxTitleLength?: number; // Optional prop with default value
}

// Function to truncate text with ellipsis
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

  const handleEntryClick = (entry: JournalEntry) => {
    setSelectedEntryId(entry.id);
    onEntrySelect(entry);
  };

// In EntryList.tsx, modify the return statement to:
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