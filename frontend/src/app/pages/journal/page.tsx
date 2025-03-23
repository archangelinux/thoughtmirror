"use client";
import React, { useState, useEffect, useRef } from "react";
import JournalEntryList, { JournalEntry } from "@/app/components/entrylist";
import Image from "next/image";
import { v4 as uuidv4 } from 'uuid';

export default function Journal() {
    const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([
        {
            id: "1",
            title: "First Day of Spring",
            content: "Today marks the first day of spring. The weather was absolutely beautiful - sunny and warm. I spent most of the afternoon walking through the park and noticed the cherry blossoms are starting to bloom. Feeling refreshed and optimistic about the season ahead.",
            createdAt: "2025-03-20T14:32:15Z",
            updatedAt: "2025-03-20T14:32:15Z"
          },
          {
            id: "2",
            title: "New Project Ideas",
            content: "Brainstormed some interesting new project ideas today. I'm especially excited about building a personal knowledge management system that integrates with my journal. Key features I want: tag-based organization, full-text search, and automated insights based on mood patterns. Need to start sketching out the architecture tomorrow.",
            createdAt: "2025-03-18T20:15:43Z",
            updatedAt: "2025-03-19T08:22:10Z"
          },
          {
            id: "3",
            title: "Reflection on Goals",
            content: "Quarterly review of my personal goals. Progress on fitness has been good - consistently hitting the gym 3x weekly. Career development is on track with the new certification almost complete. Need to focus more on reading as I've fallen behind my book goal. Overall feeling positive about progress but need to maintain momentum.",
            createdAt: "2025-03-15T22:05:33Z",
            updatedAt: "2025-03-15T22:30:45Z"
          },
          {
            id: "4",
            title: "Weekend Hiking Trip",
            content: "Just returned from an amazing weekend hiking trip in the mountains. The trail was challenging but the views at the summit were absolutely worth it. Managed to take some great photos of the valley below. Feeling physically tired but mentally recharged. Need to plan more outdoor adventures like this soon.",
            createdAt: "2025-03-10T19:12:06Z",
            updatedAt: "2025-03-10T19:12:06Z"
          },
          {
            id: "5",
            title: "Learning TypeScript",
            content: "Spent the day diving deeper into TypeScript. Getting more comfortable with interfaces, generics, and utility types. Built a small project to practice these concepts. Still struggling a bit with some of the more advanced type manipulations, but making steady progress. Need to review the documentation on conditional types again tomorrow.",
            createdAt: "2025-03-05T16:40:22Z",
            updatedAt: "2025-03-06T10:15:37Z"
          }

    ]);
    const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
    const [newEntryTitle, setNewEntryTitle] = useState("");
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [editedTitle, setEditedTitle] = useState("");
    const titleInputRef = useRef<HTMLInputElement>(null);


    useEffect(() => {
        const storedEntries = localStorage.getItem('journalEntries');
        if (storedEntries) {
            const parsedEntries = JSON.parse(storedEntries) as JournalEntry[];
            setJournalEntries(parsedEntries);
            if (parsedEntries.length > 0) {
                setSelectedEntry(parsedEntries[0]);
            }
        }
    }, []);

    // Save entries to local storage whenever they change
    useEffect(() => {
        localStorage.setItem('journalEntries', JSON.stringify(journalEntries));
    }, [journalEntries]);

    // Focus input when editing mode is enabled
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
            title: title,
            content: "",
            createdAt: currentTime,
            updatedAt: currentTime
        };

        const updatedEntries = [newEntry, ...journalEntries];
        setJournalEntries(updatedEntries);
        setSelectedEntry(newEntry);
        setNewEntryTitle("");
    };

    const handleDeleteEntry = (id: string) => {
        if (confirm("Are you sure you want to delete this journal entry? This action cannot be undone.")) {
            const updatedEntries = journalEntries.filter(entry => entry.id !== id);
            setJournalEntries(updatedEntries);

            // Update selected entry if the deleted one was selected
            if (selectedEntry && selectedEntry.id === id) {
                setSelectedEntry(updatedEntries.length > 0 ? updatedEntries[0] : null);
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

    // Format the date in a human-readable format
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

    return (
        <div className="flex h-screen pl-30 pt-15 pr-30 gap-20 items-center">
            {/* Left panel - Journal entries list */}
            <div className="w-2/5 h-3/4 px-6 py-6 rounded-2xl bg-transparent border-2 border-blue-400 flex flex-col">
                <h2 className="text-xl font-bold mb-4">Journal Entries</h2>

                <div className="flex mb-4 mr-2">
                    <input
                        type="text"
                        placeholder="New entry title"
                        value={newEntryTitle}
                        onChange={(e) => setNewEntryTitle(e.target.value)}
                        className="flex-grow text-[14px] p-2 border-2 border-blue-300 rounded-l-lg focus:outline-none"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleCreateNewEntry();
                            }
                        }}
                    />
                    <button
                        onClick={handleCreateNewEntry}
                        className="bg-blue-400 text-white px-4 py-2 rounded-r-lg hover:bg-[#ffd35b] transition-colors">
                        +
                    </button>
                </div>

                <JournalEntryList
                    entries={journalEntries}
                    onEntrySelect={setSelectedEntry}
                    onEntryDelete={handleDeleteEntry}
                    maxTitleLength={30}
                />
            </div>

            {/* Right panel - Journal entry content */}
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
                                        if (e.key === 'Enter') {
                                            handleTitleChange();
                                        } else if (e.key === 'Escape') {
                                            cancelTitleEdit();
                                        }
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
                                    title={selectedEntry.title} // Show full title on hover
                                >
                                    <div className="truncate max-w-full">
                                        {selectedEntry.title}
                                    </div>
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
                                <div className = "flex flex-row gap-5">
                                <button className="w-18 h-18 rounded-full bg-transparent border-1 border-blue-400 flex items-center justify-center text-white hover:bg-blue-500 transition-colors flex-shrink-0">
                                    <Image src="/hand_mirror.svg" alt="Logo" width={60} height={60} priority />   
                                </button>
                                <button className="w-18 h-18 rounded-full bg-blue-400 border-1 border-blue-400 flex items-center justify-center text-white hover:bg-blue-500 transition-colors flex-shrink-0"
                                onClick={async () => {
                                    try {
                                      // Get the content of the text area
                                      const content = selectedEntry.content;
                                      const title = selectedEntry.title || "Untitled Entry";
                                      const creation_date = selectedEntry.createdAt;
                                      
                                      // Send the content to your backend using fetch
                                      const response = await fetch("http://localhost:8000/handle_single_entry", {
                                        method: "post",
                                        headers: {
                                          "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify({
                                            creation_date: creation_date,
                                            action: "post",
                                            "entry": {
                                                "content": content,
                                                "title": title,
                                            }})
                                      });
                                      
                                      const data = await response.json();
                                      
                                      if (response.ok) {
                                        // Handle success (e.g., display a success message)
                                        console.log("Data sent successfully:", data);
                                      } else {
                                        // Handle error response from the backend
                                        console.error("Failed to send data:", data);
                                      }
                                    } catch (error) {
                                      console.error("Error while sending data:", error);
                                    }
                                  }}
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
                        <textarea
                            className="text-[13px] flex-grow w-full p-4 border border-gray-200 rounded-lg focus:outline-none"
                            placeholder="Write your thoughts here... watch their reflections appear."
                            value={selectedEntry.content}
                            onChange={(e) => handleEntryContentChange(e.target.value)}
                        />
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