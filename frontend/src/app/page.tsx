import Calendar from "@/components/calendar";
import RatingCal from "@/components/ratingcal/ratingCal";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React from "react";

export default function page() {
  return (
    <div className = "w-5/8 h-5/8">
      <PageBreadcrumb pageTitle="Calendar" />
      <Calendar />
    </div>
  );
}
