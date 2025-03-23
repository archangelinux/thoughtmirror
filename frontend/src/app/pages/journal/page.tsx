"use client";
import React, { useState, useEffect, useRef } from "react";
import JournalEntryList, { JournalEntry } from "@/app/components/entrylist";
import Image from "next/image";
import { v4 as uuidv4 } from 'uuid';

interface HighlightedJournalContentProps {
    content: string;
    highlightRange: { start: number; end: number } | null;
    explanation: string;
    highlightColor: string;
}

export default function Journal() {
    const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
    const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
    const [newEntryTitle, setNewEntryTitle] = useState("");
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [editedTitle, setEditedTitle] = useState("");
    const [prediction, setPrediction] = useState<string>("");
    const [explanation, setExplanation] = useState<string>("");
    const [highlightRange, setHighlightRange] = useState<{start: number, end: number} | null>(null);
    const titleInputRef = useRef<HTMLInputElement>(null);
    const [dominantDistortion, setDominantDistortion] = useState<string>("");

    const distortionColors: Record<string, string> = {
        "Personalization": "#D3CEFF",
        "Labeling": "#ACC5F4",
        "Fortune-telling": "#96E0E4",
        "Magnification": "#AEC8B2",
        "Mind Reading": "#C8DC77",
        "All-or-nothing thinking": "#FDB745",
        "Overgeneralization": "#FFD1A0",
        "Mental filter": "#FF8747",
        "Emotional Reasoning": "#FF6B5B",
        "Should statements": "#FF8190"
      };

    //component for highlighted mirror mode
    const HighlightedJournalContent: React.FC<HighlightedJournalContentProps> = ({
        content,
        highlightRange,
        explanation,
        highlightColor
      }) => {
        if (!content) return null;
        if (!highlightRange) {
          return (
            <div className="text-[13px] flex-grow w-full p-4 border border-gray-200 rounded-lg overflow-auto whitespace-pre-wrap">
              {content}
            </div>
          );
        }
      
        const beforeHighlight = content.substring(0, highlightRange.start);
        const highlightedText = content.substring(highlightRange.start, highlightRange.end);
        const afterHighlight = content.substring(highlightRange.end);
      
        return (
          <div className="text-[13px] flex-grow w-full p-4 border border-gray-200 rounded-lg overflow-auto whitespace-pre-wrap">
            {beforeHighlight}
            <span 
              className="relative group cursor-help"
              title={explanation}
              style={{ backgroundColor: highlightColor }}
            >
              {highlightedText}
              <div className="absolute z-50 invisible group-hover:visible bg-blue-200 text-black p-2 rounded-md text-sm max-w-xs w-max 
        bottom-auto top-full left-1/2 transform -translate-x-1/2 mt-2">
                        {explanation}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-blue-200"></div>
                    </div>
                </span>
            {afterHighlight}
          </div>
        );
    };

    // Fetch entries from backend on mount
    useEffect(() => {
        const fetchEntries = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/get_all_entries');
                const data = await response.json();
                const formattedEntries: JournalEntry[] = data.map((entry: any) => ({
                    id: entry.post_id,
                    title: entry.title,
                    content: entry.post_content,
                    createdAt: entry.time_created,
                    updatedAt: entry.time_last_edited,
                    distortions: entry.distortions
                }));
                setJournalEntries(formattedEntries);
                if (formattedEntries.length > 0) setSelectedEntry(formattedEntries[0]);
            } catch (error) {
                console.error("Failed to fetch journal entries:", error);
            }
        };
        fetchEntries();
    }, []);

    // Local storage save (optional, can remove if relying only on backend)
    useEffect(() => {
        localStorage.setItem('journalEntries', JSON.stringify(journalEntries));
    }, [journalEntries]);

    useEffect(() => {
        if (isEditingTitle && titleInputRef.current) {
            titleInputRef.current.focus();
        }
    }, [isEditingTitle]);

    const handleCreateNewEntry = () => {
        const title = newEntryTitle.trim() || "Untitled Entry";
        const currentTime = new Date().toISOString();

        const newEntry: JournalEntry = {
            id: uuidv4(),
            title,
            content: "",
            createdAt: currentTime,
            updatedAt: currentTime,
            distortions: []
        };
        //reset states
        const updatedEntries = [newEntry, ...journalEntries];
        setJournalEntries(updatedEntries);
        setSelectedEntry(newEntry);
        setNewEntryTitle("");
        setPrediction("");
        setExplanation("");
        setHighlightRange(null);
    };

    const handleDeleteEntry = async (id: string) => {
        if (!selectedEntry) return;
      
        if (confirm("Are you sure you want to delete this journal entry? This action cannot be undone.")) {
            const updatedEntries = journalEntries.filter(entry => entry.id !== id);
            setJournalEntries(updatedEntries);
            if (selectedEntry && selectedEntry.id === id) {
                setSelectedEntry(updatedEntries.length > 0 ? updatedEntries[0] : null);
                //clear active highlights for new selection
                setPrediction("");
                setExplanation("");
                setHighlightRange(null);
            }
            
            //calls endpoint to delete entry from Firebase
            try {
                const response = await fetch("http://127.0.0.1:8000/delete_entry", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        title: selectedEntry.title,
                        creation_date: selectedEntry.createdAt,
                    }),
                });
                console.log(selectedEntry.title, selectedEntry.createdAt)
                const data = await response.json();
                if (response.ok) {
                    console.log("Journal entry deleted successfully:", data);
                } else {
                    console.error("Failed to delete journal entry:", data);
                }
            } catch (error) {
                console.error("Error while deleting journal entry:", error);
            }
        }
    };

    const handleEntryContentChange = (content: string) => {
        if (!selectedEntry) return;
        const updatedEntry = {
            ...selectedEntry,
            content,
            updatedAt: new Date().toISOString()
        };
        setSelectedEntry(updatedEntry);
        setJournalEntries(journalEntries.map(entry =>
            entry.id === updatedEntry.id ? updatedEntry : entry
        ));
        
        //clear highlights when content changes
        setPrediction("");
        setExplanation("");
        setHighlightRange(null);
    };

    const startEditingTitle = () => {
        if (selectedEntry) {
            setIsEditingTitle(true);
            setEditedTitle(selectedEntry.title);
        }
    };

    const handleTitleChange = () => {
        if (!selectedEntry || editedTitle.trim() === "") return;
        const updatedEntry = {
            ...selectedEntry,
            title: editedTitle.trim(),
            updatedAt: new Date().toISOString()
        };
        setSelectedEntry(updatedEntry);
        setJournalEntries(journalEntries.map(entry =>
            entry.id === updatedEntry.id ? updatedEntry : entry
        ));
        setIsEditingTitle(false);
    };

    const cancelTitleEdit = () => {
        setIsEditingTitle(false);
    };

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const postJournalEntry = async () => {
        if (!selectedEntry) return;
    
        try {
            const response = await fetch("http://127.0.0.1:8000/handle_single_entry", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    creation_date: selectedEntry.createdAt,
                    content: selectedEntry.content,
                    title: selectedEntry.title
                })
            });
    
            await response.json();
    
            if (response.ok) {
                console.log("Data sent successfully");
            } else {
                console.error("Failed to send data");
            }
        } catch (error) {
            console.error("Error while sending data:", error);
        }
    };

    const handlePrediction = async () => {
        if (!selectedEntry) return;
      
        try {
            const response = await fetch("http://127.0.0.1:8000/handle_prediction", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    creation_date: selectedEntry.createdAt,
                    content: selectedEntry.content,
                    title: selectedEntry.title,
                }),
            });
      
           const data = await response.json();
           //const data = {prediction:"Also, it would only worsen the situation. Instead, if he spoke for him, they would be always forgive their son.", explanation: "test"}
      
            if (response.ok) {
                console.log("Prediction and explanation received successfully:", data);
                if (data.prediction === "") {
                    // no distortions found
                    setPrediction("");
                    setExplanation("");
                    setHighlightRange(null);
                } else {
                    const dominant = data.prediction["Dominant Distortion"];
                    setPrediction(data.prediction);
                    setExplanation(data.explanation || "Potential cognitive distortion detected");
                    setDominantDistortion(dominant);
                    //find prediction text in entry
                    const predictionText = data.prediction["Distorted part"];
                    console.log(predictionText)
                    const contentText = selectedEntry.content;
                    const startIndex = contentText.indexOf(predictionText);
                    //highlight
                    if (startIndex !== -1) {
                        setHighlightRange({
                            start: startIndex,
                            end: startIndex + predictionText.length
                        });
                    } else {
                        setHighlightRange(null); //if text not found
                    }
                }
            } else {
                console.error("Failed to get prediction:", data);
                setPrediction("");
                setExplanation("");
                setHighlightRange(null);
            }
        } catch (error) {
            console.error("Error while sending prediction request:", error);
            setPrediction("");
            setExplanation("");
            setHighlightRange(null);
        }
    };
    
    return (
        <div className="flex h-screen pl-30 pt-15 pr-30 gap-20 items-center">
            <div className="w-2/5 h-3/4 px-6 py-6 rounded-2xl bg-transparent border-2 border-blue-400 flex flex-col">
                <h2 className="text-xl font-bold mb-4">Journal Entries</h2>
                <div className="flex mb-4 mr-2">
                    <input
                        type="text"
                        placeholder="New entry title"
                        value={newEntryTitle}
                        onChange={(e) => setNewEntryTitle(e.target.value)}
                        className="flex-grow text-[14px] p-2 border-2 border-blue-300 rounded-l-lg focus:outline-none"
                        onKeyDown={(e) => e.key === 'Enter' && handleCreateNewEntry()}
                    />
                    <button
                        onClick={handleCreateNewEntry}
                        className="bg-blue-400 text-white px-4 py-2 rounded-r-lg hover:bg-[#ffd35b] transition-colors"
                    >
                        +
                    </button>
                </div>

                <JournalEntryList
                    entries={journalEntries}
                    onEntrySelect={(entry) => {
                        setSelectedEntry(entry);
                        // Clear any active highlights when changing selected entry
                        setPrediction("");
                        setExplanation("");
                        setHighlightRange(null);
                    }}
                    onEntryDelete={handleDeleteEntry}
                    maxTitleLength={30}
                />
            </div>

            <div className="w-3/5 h-7/8 pt-20 mb-20 bg-transparent border-none rounded-2xl flex flex-col">
                {selectedEntry ? (
                    <>
                        {isEditingTitle ? (
                            <div className="mb-2">
                                <input
                                    ref={titleInputRef}
                                    type="text"
                                    value={editedTitle}
                                    onChange={(e) => setEditedTitle(e.target.value)}
                                    className="text-3xl font-bold p-1 border border-blue-300 rounded focus:outline-none w-full"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleTitleChange();
                                        else if (e.key === 'Escape') cancelTitleEdit();
                                    }}
                                    onBlur={cancelTitleEdit}
                                    autoFocus
                                />
                            </div>
                        ) : (
                            <div className="flex items-center justify-between mb-2 w-full">
                                <h1
                                    className="text-3xl font-bold flex items-center group cursor-pointer overflow-hidden max-w-[90%]"
                                    onClick={startEditingTitle}
                                    title={selectedEntry.title}
                                >
                                    <div className="truncate max-w-full">{selectedEntry.title}</div>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 ml-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                        />
                                    </svg>
                                </h1>
                                <div className="flex flex-row gap-5">
                                    <button 
                                        className="w-30 h-18 pl-2 rounded-xl bg-transparent border-1 border-blue-400 flex items-center justify-center text-blue-500 text-sm hover:bg-yellow-200 hover:border-transparent transition-colors flex-shrink-0"
                                        onClick={handlePrediction}
                                    >
                                        Mirror Mode <Image src="/hand_mirror.svg" alt="Logo" width={60} height={60} priority />
                                    </button>
                                    <button
                                        className="w-18 h-18 rounded-full bg-blue-400 border-1 border-blue-400 flex items-center justify-center text-white hover:bg-blue-500 transition-colors flex-shrink-0"
                                        onClick={postJournalEntry}
                                    >
                                        save
                                    </button>
                                </div>
                            </div>
                        )}
                        <div className="flex flex-col mb-6 text-gray-600">
                            <span className="text-sm">Created: {formatDateTime(selectedEntry.createdAt)}</span>
                            {selectedEntry.createdAt !== selectedEntry.updatedAt && (
                                <span className="text-sm">Last updated: {formatDateTime(selectedEntry.updatedAt)}</span>
                            )}
                        </div>
                        
                        {highlightRange ? (
                            // Show highlighted view when we have a prediction
                            <>
                                <HighlightedJournalContent 
                                    content={selectedEntry.content} 
                                    highlightRange={highlightRange}
                                    explanation={explanation}
                                    highlightColor={distortionColors[dominantDistortion] || '#FFD700'} // fallback color
                                />
                                <button
                                    className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                    onClick={() => {
                                        setPrediction("");
                                        setExplanation("");
                                        setHighlightRange(null);
                                    }}
                                >
                                    Return to Editing
                                </button>
                            </>
                        ) : (
                            // Show editable textarea when no prediction is active
                            <textarea
                                className="text-[13px] flex-grow w-full p-4 border border-gray-200 rounded-lg focus:outline-none"
                                placeholder="Write your thoughts here... watch their reflections appear."
                                value={selectedEntry.content}
                                onChange={(e) => handleEntryContentChange(e.target.value)}
                            />
                        )}
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">Select a journal entry or create a new one</p>
                    </div>
                )}
            </div>
        </div>
    );
}