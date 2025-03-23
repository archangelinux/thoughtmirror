"use client";
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import Calendar from "@/app/components/calendar";

interface DistortionInfo {
    name: string;
    description: string;
    color: string;
    example: string;
}

export default function Page() {
    const [selectedDistortion, setSelectedDistortion] = useState<DistortionInfo | null>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const distortions: DistortionInfo[] = [
        {
            name: "Personalization",
            description: "Taking responsibility for external events outside of your control.",
            color: "#D3CEFF",
            example: "My friend seemed quiet today. I must have done something to upset them."
        },
        {
            name: "Labeling",
            description: "Assigning global negative traits to yourself or others based on specific behaviors.",
            color: "#ACC5F4",
            example: "I failed that test. I'm such a failure at everything."
        },
        {
            name: "Fortune-Telling",
            description: "Predicting negative outcomes without adequate evidence.",
            color: "#96E0E4",
            example: "I'll definitely bomb the interview tomorrow. There's no way they'll hire me."
        },
        {
            name: "Magnification",
            description: "Exaggerating the importance of negative events while minimizing positive ones.",
            color: "#AEC8B2",
            example: "I made one mistake in my presentation. The entire project is ruined now."
        },
        {
            name: "Mind Reading",
            description: "Assuming you know what others are thinking without sufficient evidence.",
            color: "#C8DC77",
            example: "She didn't smile at me. She must think I'm incompetent."
        },
        {
            name: "All-Or-Nothing",
            description: "Viewing situations in only black-and-white categories with no middle ground.",
            color: "#FDB745",
            example: "If I don't get a perfect score, I've completely failed."
        },
        {
            name: "Overgeneralization",
            description: "Making broad negative conclusions based on a single incident.",
            color: "#FFD1A0",
            example: "That one person didn't like my idea. No one ever appreciates my contributions."
        },
        {
            name: "Mental Filter",
            description: "Focusing exclusively on negative details while ignoring positives.",
            color: "#FF8747",
            example: "I received lots of good feedback, but that one criticism is all that matters."
        },
        {
            name: "Emotional Reasoning",
            description: "Assuming your negative emotions reflect reality.",
            color: "#FF6B5B",
            example: "I feel anxious about flying, so planes must be dangerous."
        },
        {
            name: "Should Statements",
            description: "Holding rigid rules about how you and others should behave.",
            color: "#FF8190",
            example: "I should never make mistakes. Others should always be considerate."
        }
    ];

    const handleClick = (distortion: DistortionInfo) => {
        setSelectedDistortion(prevDistortion =>
            prevDistortion?.name === distortion.name ? null : distortion
        );
    };

    const closePopup = () => {
        setSelectedDistortion(null);
    };

    return (
        <>
            <div className="container mx-auto px-4 mt-40 flex flex-col md:flex-row gap-20 ml-25 overflow-x-hidden">
                <div className="min-w-10/19">
                    <Calendar />
                </div>
                <div className="bg-transparent border-2 border-blue-400 w-full max-h-screen md:w-1/3 lg:w-1/3 rounded-2xl p-10">
                    <div className="flex flex-col items-center">
                        <h1 className="font-bold text-[16px] mb-10">Understanding Cognitive Distortions</h1>

                        <button onClick={(e) => handleClick(distortions.find(d => d.name === "Personalization")!)} className="w-[80%] hover:w-[85%] rounded-3xl bg-[#D3CEFF] px-5 py-2 text-sm text-center  transition-all duration-300">Personalization</button>
                        <button onClick={(e) => handleClick(distortions.find(d => d.name === "Labeling")!)} className="w-[80%] hover:w-[85%] rounded-3xl bg-[#ACC5F4] px-5 py-2 mt-2 text-sm text-center transition-all duration-300">Labeling</button>
                        <button onClick={(e) => handleClick(distortions.find(d => d.name === "Fortune-Telling")!)} className="w-[80%] hover:w-[85%] rounded-3xl bg-[#96E0E4] px-5 py-2 mt-2 text-sm text-center transition-all duration-300">Fortune-Telling</button>
                        <button onClick={(e) => handleClick(distortions.find(d => d.name === "Magnification")!)} className="w-[80%] hover:w-[85%] rounded-3xl bg-[#AEC8B2] px-5 py-2 mt-2 text-sm text-center transition-all duration-300">Magnification</button>
                        <button onClick={(e) => handleClick(distortions.find(d => d.name === "Mind Reading")!)} className="w-[80%] hover:w-[85%] rounded-3xl bg-[#C8DC77] px-5 py-2 mt-2 text-sm text-center transition-all duration-300">Mind Reading</button>
                        <button onClick={(e) => handleClick(distortions.find(d => d.name === "All-Or-Nothing")!)} className="w-[80%] hover:w-[85%] rounded-3xl bg-[#FDB745] px-5 py-2 mt-2 text-sm text-center transition-all duration-300">All-Or-Nothing</button>
                        <button onClick={(e) => handleClick(distortions.find(d => d.name === "Overgeneralization")!)} className="w-[80%] hover:w-[85%] rounded-3xl bg-[#FFD1A0] px-5 py-2 mt-2 text-sm text-center transition-all duration-300">Overgeneralization</button>
                        <button onClick={(e) => handleClick(distortions.find(d => d.name === "Mental Filter")!)} className="w-[80%] hover:w-[85%] rounded-3xl bg-[#FF8747] px-5 py-2 mt-2 text-sm text-center transition-all duration-300">Mental Filter</button>
                        <button onClick={(e) => handleClick(distortions.find(d => d.name === "Emotional Reasoning")!)} className="w-[80%] hover:w-[85%] rounded-3xl bg-[#FF6B5B] px-5 py-2 mt-2 text-sm text-center transition-all duration-300">Emotional Reasoning</button>
                        <button onClick={(e) => handleClick(distortions.find(d => d.name === "Should Statements")!)} className="w-[80%] hover:w-[85%] rounded-3xl bg-[#FF8190] px-5 py-2 mt-2 text-sm text-center transition-all duration-300">Should Statements</button>
                    </div>
                    <AnimatePresence>
                        {selectedDistortion && (
                            <motion.div
                                className="absolute top-3/7 right-3/22 transform z-10 max-w-1/4"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                                <div className="bg-white rounded-lg shadow-xl overflow-hidden p-5">
                                    <div className="flex items-center mb-4">
                                        <div
                                            className="w-4 h-4 rounded-full mr-3"
                                            style={{ backgroundColor: selectedDistortion.color }}
                                        ></div>
                                        <h3 className="font-bold text-lg">{selectedDistortion.name}</h3>
                                        <button
                                            onClick={closePopup}
                                            className="ml-auto text-gray-400 hover:text-gray-600"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                    <p className="mb-3 text-[16px] text-gray-700">
                                        {selectedDistortion.description}
                                    </p>
                                    <div className="mt-4 bg-gray-50 p-3 rounded-md">
                                        <span className="text-sm font-medium text-gray-500">Example:</span>
                                        <p className="text-sm text-gray-700 italic">
                                            "{selectedDistortion.example}"
                                        </p>
                                    </div>
                                    <div className="mt-4 flex justify-end">
                                        <button
                                            className="text-sm px-3 py-1 rounded-full text-white"
                                            style={{ backgroundColor: selectedDistortion.color }}
                                        >
                                            Learn more
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>


        </>
    );
}