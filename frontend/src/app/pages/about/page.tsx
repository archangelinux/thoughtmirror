"use client";
import Calendar from "@/components/calendar";
import Navbar from "@/components/navbar";
import React, { useState } from "react";
import { SelectedPage } from "@/utils/types";
import Image from "next/image";
import PaperBkg from "@/assets/paper_bkg.svg";


export default function About() {
    const [selectedPage, setSelectedPage] = useState<SelectedPage>(SelectedPage.about);
    return (
        
        <div
            className="bg-top bg-no-repeat min-h-screen flex items-center justify-center pt-20"
            style={{ 
                backgroundImage: `url(${PaperBkg.src})`, // Use PaperBkg.src for Next.js image path
                backgroundSize: "auto 140%",  // Ensure the image scales without stretching
                backgroundPosition: "top center",  // Center it vertically without cropping
            }} >
                <Navbar isTopOfPage={true} selectedPage={selectedPage} setSelectedPage={setSelectedPage} />

            <div className="container mx-auto px-4 bg-white bg-opacity-80 p-10 rounded-lg">
                <h1 className="text-3xl font-bold text-center">ABOUT</h1>
            </div>
        </div>
    )
}