// components/entrybutton.tsx
import React from 'react';

interface EntryButtonProps {
  id: string;
  title: string;
  fullTitle?: string; // Added prop for the full title (for tooltip)
  createdAt: string;
  updatedAt: string;
  isSelected: boolean;
  onClick: () => void;
  onDelete: () => void;
}

const EntryButton: React.FC<EntryButtonProps> = ({
  id,
  title,
  fullTitle,
  createdAt,
  updatedAt,
  isSelected,
  onClick,
  onDelete
}) => {
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div
      className={`flex justify-between items-center p-2 my-1 rounded-lg cursor-pointer w-full ${
        isSelected ? 'bg-blue-100' : 'hover:bg-gray-100'
      }`}
      onClick={onClick}
      style={{ minWidth: 0 }}
    >
      <div className="flex flex-col overflow-hidden flex-grow min-w-0" style={{ width: "calc(100% - 30px)" }}>
        <span 
          className="font-medium text-[14px] truncate block w-full"
          title={fullTitle || title}
        >
          {title}
        </span>
        <span className="text-gray-500 text-xs">
          {formatDate(createdAt)}
        </span>
      </div>
      <div className="flex-shrink-0">
        <button
          className="text-gray-500 hover:text-red-500 p-1"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          aria-label="Delete entry"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default EntryButton;