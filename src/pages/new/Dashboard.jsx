import React from "react";

// components
import Sidebar from "../../components/new/Sidebar";

// styles
import "../../assets/styles/dashboard.css";

const NewDashboard = () => {
  return (
    <>
      <Sidebar />

      {/*------ Map and other functionality will be here ------*/}
      <div className="dashboard-wrapper"></div>
    </>
  );
};

export default NewDashboard;
