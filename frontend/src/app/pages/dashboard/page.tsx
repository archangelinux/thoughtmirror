"use client";

import Calendar from "@/app/components/calendar";
import Navbar from "@/app/components/navbar";
import React, { useState } from "react";
import { SelectedPage } from "@/utils/types";

export default function Page() {
  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-32 flex flex-col md:flex-row gap-10 overflow-x-hidden">
        <div className="w-full md:w-2/3 lg:w-2/3">
          <Calendar />
        </div>
        <div className="bg-blue-100 w-full md:w-1/2 lg:w-1/2 mb-20 rounded-2xl"></div>
      </div>
    </>
  );
}