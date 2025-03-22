"use client";
import Calendar from "@/app/components/calendar";
import Navbar from "@/app/components/navbar";
import React, { useState } from "react";
import { SelectedPage } from "@/utils/types";
import Image from "next/image";

export default function About() {
    return (
        
        <div
            className="bg-top bg-no-repeat min-h-screen flex items-center justify-center pt-20"
            style={{ 
                backgroundImage: `url('/paper_bkg.svg')`,
                backgroundSize: "auto 140%",  // Ensure the image scales without stretching
                backgroundPosition: "top center",  // Center it vertically without cropping
            }} >
            <div className="container mx-auto px-4 bg-white bg-opacity-80 p-10 rounded-lg">
                <h1 className="text-3xl font-bold text-center">ABOUT</h1>
            </div>
        </div>
    )
}