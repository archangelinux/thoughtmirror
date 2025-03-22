"use client"; 
import Calendar from "@/app/components/calendar";
import Navbar from "@/app/components/navbar";
import React, { useState } from "react";
import { SelectedPage } from "@/utils/types";



export default function Login() {
    const [selectedPage, setSelectedPage] = useState<SelectedPage>(SelectedPage.about);
    return (
      <>
      <Navbar isTopOfPage={true} selectedPage={selectedPage} setSelectedPage={setSelectedPage} />
        <div className = "w-150 h-150 ml-20 mt-50">
            <h1>LOGIN/SIGNUP</h1>
        </div>
      </>
    )
  }