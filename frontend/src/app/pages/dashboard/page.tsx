"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";

import Calendar from "@/app/components/calendar";

interface DistortionInfo {
    name: string;
    description: string;
    color: string;
    example: string;
    identify: string;
    challenge: string;
    ask: string;
}

export default function Page() {
    const [isFlipped, setIsFlipped] = useState(false);
    const [selectedDistortion, setSelectedDistortion] = useState<DistortionInfo | null>(null);

    const distortions: DistortionInfo[] = [
        {
            name: "Personalization",
            description: "Taking responsibility for external events outside of your control.",
            color: "#D3CEFF",
            example: "My friend seemed quiet today. I must have done something to upset them.",
            identify: "Notice when you take excessive responsibility for external events",
            challenge: "Identify all factors that contribute to a situation",
            ask: "What other factors beyond my control influenced this outcome?"
        },
        {
            name: "Labeling",
            description: "Assigning global negative traits to yourself or others based on specific behaviors.",
            color: "#ACC5F4",
            example: "I failed that test. I'm such a failure at everything.",
            identify: "Catch yourself using global labels for yourself or others",
            challenge: "Consider multiple possible outcomes, including positive ones",
            ask: "Use specific, behavior-focused descriptions instead"
        },
        {
            name: "Fortune-Telling",
            description: "Predicting negative outcomes without adequate evidence.",
            color: "#96E0E4",
            example: "I'll definitely bomb the interview tomorrow. There's no way they'll hire me.",
            identify: "Notice when you predict negative outcomes with certainty",
            challenge: "Consider multiple possible outcomes, including positive ones",
            ask: "What's the actual likelihood of this worst-case scenario?"
        },
        {
            name: "Magnification",
            description: "Exaggerating the importance of negative events while minimizing positive ones.",
            color: "#AEC8B2",
            example: "I made one mistake in my presentation. The entire project is ruined now.",
            identify: "Catch yourself exaggerating negatives or downplaying positives",
            challenge: "Try to evaluate situations more objectively and proportionally",
            ask: "How important will this really be in a week, month, or year?"
        },
        {
            name: "Mind Reading",
            description: "Assuming you know what others are thinking without sufficient evidence.",
            color: "#C8DC77",
            example: "She didn't smile at me. She must think I'm incompetent.",
            identify: "Recognize when you assume you know what others are thinking",
            challenge: "Consider alternative interpretations or directly ask for clarification",
            ask: "Do I have actual evidence for what I think they're thinking?"
        },
        {
            name: "All-Or-Nothing",
            description: "Viewing situations in only black-and-white categories with no middle ground.",
            color: "#FDB745",
            example: "If I don't get a perfect score, I've completely failed.",
            identify: "Recognize when you're seeing things in black and white terms",
            challenge: "Look for the gray areas and nuance in situations",
            ask: "Is there a middle ground here that I'm missing?"
        },
        {
            name: "Overgeneralization",
            description: "Making broad negative conclusions based on a single incident.",
            color: "#FFD1A0",
            example: "That one person didn't like my idea. No one ever appreciates my contributions.",
            identify: "Notice when you use words like \"always,\" \"never,\" or \"every time\"",
            challenge: "Find counterexamples to your sweeping conclusion",
            ask: "Has there ever been a time when this wasn't true?"
        },
        {
            name: "Mental Filter",
            description: "Focusing exclusively on negative details while ignoring positives.",
            color: "#FF8747",
            example: "I received lots of good feedback, but that one criticism is all that matters.",
            identify: "Catch yourself focusing only on negatives while filtering out positives",
            challenge: "Deliberately identify positive aspects of the situation",
            ask: "What good things am I overlooking?"
        },
        {
            name: "Emotional Reasoning",
            description: "Assuming your negative emotions reflect reality.",
            color: "#FF6B5B",
            example: "I feel anxious about flying, so planes must be dangerous.",
            identify: "Notice when you assume feelings reflect facts (\"I feel bad, so it must be bad\")",
            challenge: "Separate emotions from facts by examining evidence",
            ask: "Just because I feel this way, does it make it true?"
        },
        {
            name: "Should Statements",
            description: "Holding rigid rules about how you and others should behave.",
            color: "#FF8190",
            example: "I should never make mistakes. Others should always be considerate.",
            identify: "Spot rigid \"should,\" \"must,\" or \"ought to\" statements in your thinking",
            challenge: "Replace these with more flexible preferences and goals",
            ask: "Is this expectation realistic and helpful?"
        }
    ];

    const handleDistortionClick = (distortion: DistortionInfo) => {
        setSelectedDistortion(distortion);
        setIsFlipped(true);
    };

    const handleFlipBack = () => {
        setIsFlipped(false);
    };

    return (
        <>
            <div className="container mx-auto px-4 mt-40 flex flex-col md:flex-row gap-20 ml-25">
                <div className="min-w-10/19">
                    <Calendar />
                </div>
                <div className="perspective-1000 w-full md:w-1/3 lg:w-1/3 p-1 overflow-visible">
                    <div className="relative w-full h-full overflow-visible" style={{ perspective: "2000px" }}>
                        <motion.div
                            className="w-full h-full"
                            animate={{
                                rotateY: isFlipped ? 180 : 0
                            }}
                            transition={{
                                duration: 0.6,
                                ease: [0.16, 1, 0.3, 1],
                                type: "tween"
                            }}
                            style={{
                                transformStyle: "preserve-3d",
                                position: "relative"
                            }}
                        >
                            {/* front side*/}
                            <div
                                className="absolute w-full h-full backface-hidden rounded-2xl overflow-visible"
                                style={{
                                    backfaceVisibility: "hidden",
                                    transform: "translateZ(1px)" // slight offset for spin
                                }}>
                                <div className="w-full h-full border-2 border-blue-400 rounded-2xl p-10 overflow-y-auto">
                                    <div className="flex flex-col items-center">
                                        <h1 className="font-bold text-[16px] mb-1">Understanding Cognitive Distortions</h1>
                                        <p className="text-[13px] italic mb-4">Exploring the sections below for insights</p>
                                        <button
                                            onClick={() => handleDistortionClick(distortions.find(d => d.name === "Personalization")!)}
                                            className="w-[80%] hover:w-[85%] rounded-xl bg-[#D3CEFF] px-5 py-2 text-sm text-center transition-all duration-300">
                                            Personalization
                                        </button>
                                        <button
                                            onClick={() => handleDistortionClick(distortions.find(d => d.name === "Labeling")!)}
                                            className="w-[80%] hover:w-[85%] rounded-xl bg-[#ACC5F4] px-5 py-2 mt-2 text-sm text-center transition-all duration-300">
                                            Labeling
                                        </button>
                                        <button
                                            onClick={() => handleDistortionClick(distortions.find(d => d.name === "Fortune-Telling")!)}
                                            className="w-[80%] hover:w-[85%] rounded-xl bg-[#96E0E4] px-5 py-2 mt-2 text-sm text-center transition-all duration-300">
                                            Fortune-Telling
                                        </button>
                                        <button
                                            onClick={() => handleDistortionClick(distortions.find(d => d.name === "Magnification")!)}
                                            className="w-[80%] hover:w-[85%] rounded-xl bg-[#AEC8B2] px-5 py-2 mt-2 text-sm text-center transition-all duration-300">
                                            Magnification
                                        </button>
                                        <button
                                            onClick={() => handleDistortionClick(distortions.find(d => d.name === "Mind Reading")!)}
                                            className="w-[80%] hover:w-[85%] rounded-xl bg-[#C8DC77] px-5 py-2 mt-2 text-sm text-center transition-all duration-300">
                                            Mind Reading
                                        </button>
                                        <button
                                            onClick={() => handleDistortionClick(distortions.find(d => d.name === "All-Or-Nothing")!)}
                                            className="w-[80%] hover:w-[85%] rounded-xl bg-[#FDB745] px-5 py-2 mt-2 text-sm text-center transition-all duration-300">
                                            All-Or-Nothing
                                        </button>
                                        <button
                                            onClick={() => handleDistortionClick(distortions.find(d => d.name === "Overgeneralization")!)}
                                            className="w-[80%] hover:w-[85%] rounded-xl bg-[#FFD1A0] px-5 py-2 mt-2 text-sm text-center transition-all duration-300">
                                            Overgeneralization
                                        </button>
                                        <button
                                            onClick={() => handleDistortionClick(distortions.find(d => d.name === "Mental Filter")!)}
                                            className="w-[80%] hover:w-[85%] rounded-xl bg-[#FF8747] px-5 py-2 mt-2 text-sm text-center transition-all duration-300">
                                            Mental Filter
                                        </button>
                                        <button
                                            onClick={() => handleDistortionClick(distortions.find(d => d.name === "Emotional Reasoning")!)}
                                            className="w-[80%] hover:w-[85%] rounded-xl bg-[#FF6B5B] px-5 py-2 mt-2 text-sm text-center transition-all duration-300">
                                            Emotional Reasoning
                                        </button>
                                        <button
                                            onClick={() => handleDistortionClick(distortions.find(d => d.name === "Should Statements")!)}
                                            className="w-[80%] hover:w-[85%] rounded-xl bg-[#FF8190] px-5 py-2 mt-2 text-sm text-center transition-all duration-300">
                                            Should Statements
                                        </button>
                                    </div>
                                </div>
                            </div>
                            {/* backside */}
                            <div
                                className="absolute w-full h-full backface-hidden rounded-xl"
                                style={{
                                    transform: "rotateY(180deg)",
                                    backfaceVisibility: "hidden"
                                }}>
                                <div className="w-full h-full border-2 border-blue-400 rounded-2xl p-10 overflow-y-auto">
                                    {selectedDistortion && (
                                        <div className="h-full flex flex-col">
                                            <div className="flex justify-between items-center mb-6">
                                                <div className="flex items-center">
                                                    <div
                                                        className="w-6 h-6 rounded-full mr-3"
                                                        style={{ backgroundColor: selectedDistortion.color }}
                                                    ></div>
                                                    <h2 className="font-bold text-xl">{selectedDistortion.name}</h2>
                                                </div>
                                                <button
                                                    onClick={handleFlipBack}
                                                    className="text-gray-500 hover:text-gray-700">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-6 w-6"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor">
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                            clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </div>

                                            <div className="mb-6">
                                                <p className="text-gray-600 text-lg">{selectedDistortion.description}</p>
                                            </div>

                                            <div className="mb-6">
                                                <h3 className="text-sm font-bold text-gray-700 mb-2">Example:</h3>
                                                <div className="bg-gray-50 p-4 rounded-lg">
                                                    <p className="text-gray-600 italic text-sm">"{selectedDistortion.example}"</p>
                                                </div>
                                            </div>

                                            <div className="mb-6">
                                                <p className="text-sm mb-2">
                                                    <span style={{ backgroundColor: selectedDistortion.color, padding: "2px 4px", borderRadius: "4px" }}>
                                                        <b>Identify:</b>
                                                    </span> {selectedDistortion.identify}
                                                </p>
                                                <p className="text-sm mb-2">
                                                    <span style={{ backgroundColor: selectedDistortion.color, padding: "2px 4px", borderRadius: "4px" }}>
                                                        <b>Challenge It:</b>
                                                    </span> {selectedDistortion.challenge}
                                                </p>
                                                <p className="text-sm mb-2">
                                                    <span style={{ backgroundColor: selectedDistortion.color, padding: "2px 4px", borderRadius: "4px" }}>
                                                        <b>Ask Yourself:</b>
                                                    </span> {selectedDistortion.ask}
                                                </p>
                                            </div>

                                            <div className="mt-auto flex justify-end">
                                                <button
                                                    className="px-4 w-18 h-8 text-white text-sm  text-center rounded-xl"
                                                    style={{ backgroundColor: selectedDistortion.color }}
                                                    onClick={handleFlipBack}>Back</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </>
    );
}