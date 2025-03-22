import Calendar from "@/components/calendar";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React from "react";

const Dashboard = () => {
  return  (<div className = "w-5/8 h-5/8">
      <PageBreadcrumb pageTitle="Calendar" />
      <Calendar />
    </div> )
};

export default Dashboard;
