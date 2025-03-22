"use client"; 
import Calendar from "@/components/calendar";
import Navbar from "@/components/navbar";
import React, { useState } from "react";
import { SelectedPage } from "@/utils/types";


export default function page() {
  const [selectedPage, setSelectedPage] = useState<SelectedPage>(SelectedPage.about);
  return (
    <>
    <Navbar isTopOfPage={true} selectedPage={selectedPage} setSelectedPage={setSelectedPage} />
      <div className = "flex flex-row w-full h-full ml-20 mt-50 gap-10">
        <div className = "w-150 h-150">
        <Calendar />
        </div>
      <div className="bg-blue-100 w-2xl h-2xl mb-20 rounded-2xl"></div>
      </div>
    </>
    
  );
}
