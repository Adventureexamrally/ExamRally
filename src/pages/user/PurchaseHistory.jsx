import React, { useContext, useEffect, useState } from "react";
import DashBoard from "./DashBoard";
import Api from "../../service/Api";
import { useNavigate } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";
import { UserContext } from "../../context/UserProvider";

const PurchaseHistory = () => {
  const [open, setOpen] = useState(false);
  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const { user } = useContext(UserContext);

  console.warn(useAuth);
  console.log(user);
  

  return (
    <div className="flex flex-col md:flex-row">
      <DashBoard
        handleDrawerToggle={handleDrawerToggle}
        open={open}
        setOpen={setOpen}
      />

      <div className="flex-1 p-4">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {user?.enrolledCourses?.map((course, index) => {
            const formattedDate = new Date(
              course?.purchaseDate
            ).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            });

            return (
              <div key={index} className="w-full">
                <div className="bg-white shadow-md rounded-lg h-full p-4 border-2 border-green-500">
                  <div className="d-flex justify-between">
                    <h5 className="text-lg font-semibold mb-2">
                      {course?.courseName}
                    </h5>
                    <i className="bi bi-bag-check-fill h3 text-green-500"></i>
                  </div>

                  <h5 className="text-gray-700 mb-1">
                    Amount: {course?.amount}
                  </h5>
                  <h5 className="text-gray-700">Date: {formattedDate}</h5>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PurchaseHistory;
