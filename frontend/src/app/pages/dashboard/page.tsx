"use client"; 
import Calendar from "@/app/components/calendar";
import Navbar from "@/app/components/navbar";
import React, { useState } from "react";
import { SelectedPage } from "@/utils/types";


export default function page() {
  return (
    <>
      <div className = "flex flex-row w-full h-full ml-20 mt-50 gap-10">
        <div className = "w-150 h-150">
        <Calendar />
        </div>
      <div className="bg-blue-100 w-2xl h-2xl mb-20 rounded-2xl"></div>
      </div>
    </>
    
  );
}
