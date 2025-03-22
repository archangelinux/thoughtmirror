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
      <div className = "w-150 h-150 ml-20 mt-50">
      <Calendar />
      </div>
    </>
    
  );
}
