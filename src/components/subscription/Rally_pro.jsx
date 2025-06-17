import React, { useEffect, useState, useContext } from "react";
import Api from "../../service/Api";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./../../context/UserProvider";
import PackageCoupon from "../../pages/PackageCoupon";
import { fetchUtcNow } from "../../service/timeApi";

const Rally_pro = () => {
  const [sub, setSub] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [expired, setExpired] = useState(false);
  const [daysLeft, setDaysLeft] = useState(null);

  const { user } = useContext(UserContext);
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubscription();
  }, []);
     const [utcNow, setUtcNow] = useState(null);
      
  // 1. Fetch UTC time from server
   useEffect(() => {
      fetchUtcNow()
        .then(globalDate => {
          setUtcNow(globalDate);
          console.warn("Server UTC Date:", globalDate.toISOString());
        })
        .catch(error => {
          console.error("Failed to fetch UTC time:", error);
          // handle error as needed
        });
    }, []);

  const fetchSubscription = async () => {
    try {
      const response = await Api.get("subscription/getall/sub");
      const filtered = response.data.filter(
        (sub) => sub.subscriptionType.toLowerCase() === "rally pro"
      );

      const selectedSub = filtered.length > 0 ? filtered[0] : null;
      setSub(selectedSub);
      setData(selectedSub);
      console.log(selectedSub)
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (user && data) {
      const matchedCourse = user.enrolledCourses?.find(
        (course) =>
          course.courseName?.trim().toLowerCase() ===
          data.subscriptionType?.trim().toLowerCase()
      );

      if (matchedCourse) {
        const currentDate = utcNow;
        const expiryDate = new Date(matchedCourse.expiryDate);
        const timeDiff = expiryDate - currentDate;
        const remainingDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

console.log("koli",currentDate,expiryDate,timeDiff,remainingDays)

        if (remainingDays > 0) {
          setEnrolled(true);
          setExpired(false);
          setDaysLeft(remainingDays);
        } else {
          setEnrolled(false);
          setExpired(true);
          setDaysLeft(0);
        }
      }
    }
  }, [user, data]);

  return (
    <div className="relative container border-2 mt-2 rounded-lg shadow-xl mb-4">
      <div className="absolute inset-0 z-[-10] border-2 rounded-lg"></div>

      {loading ? (
        <div className="mt-3 bg-gray-100 p-4 rounded-lg">
          <div className="text-center mt-2">
            <h1 className="font text-3xl my-3 text-gray-400 fw-bold placeholder-glow">
              <span className="placeholder col-6 mx-auto bg-gray-200"></span>
            </h1>
            <hr className="text-gray-300" />
          </div>
          <div className="row bg-gradient-to-b from-gray-200 to-gray-300 rounded-lg p-2">
            <div className="w-full h-64 bg-gray-200 mt-2 placeholder-glow">
              <span className="placeholder col-12"></span>
            </div>
            <div className="text-center mb-3">
              <p className="placeholder-glow">
                <span className="placeholder col-8 mx-auto bg-gray-200"></span>
              </p>
              <div className="bg-gray-300 text-white rounded p-1 mb-2 placeholder-glow">
                <span className="placeholder col-4 mx-auto"></span>
              </div>
              <p className="text-gray-400 font-bold h5 font placeholder-glow">
                <span className="placeholder col-6 mx-auto bg-gray-200"></span>
              </p>
              <div className="bg-gray-300 text-white px-3 py-1 font-bold rounded-full placeholder-glow">
                <span className="placeholder col-4 mx-auto"></span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-3">
          <div className="text-center mt-2">
            <h1 className="font text-3xl my-3 text-black fw-bold">Rally Pro</h1>
            <hr className="text-black-500" />
          </div>
          <div className="row">
            {sub ? (
              <>
                <img
                  src={sub.photo}
                  alt="Rally pro"
                  className="w-full h-full object-cover mt-2"
                />
                <div className="text-center mb-3 mt-3">
                  <del className="text-gray-500 rounded px-2 py-1 mb-2 drop-shadow">
                    ₹{sub.amount}
                  </del>
                  <br />
            <button
  className={`px-3 py-1 font-bold rounded-full ${
    enrolled && !expired
      ? "bg-gray-400 cursor-not-allowed text-white"
      : "bg-green-500 hover:bg-green-400 text-white"
  }`}
  disabled={enrolled && !expired}
  onClick={() => {
    if (!isSignedIn) {
      navigate("/sign-in");
    } else {
      setShowModal(true);
    }
  }}
>
  {enrolled && !expired
    ? "Purchased"
    : `Buy Now ₹${sub.discountedAmount}`}
</button>

                  {enrolled && !expired ? (
                    <p className="text-md text-red-500 mt-2 font blink">
                      <i className="bi bi-clock-history"></i> {daysLeft} Days Left
                    </p>
                  ) : expired ? (
                    <p className="text-md text-orange-500 mt-2 font">
                      <i className="bi bi-exclamation-triangle-fill"></i> Expired - Repurchase
                    </p>
                  ) : (
                    <p className="text-md text-gray-500 mt-2 font">
                      <i className="bi bi-clock-history"></i> Limited Time Offer
                    </p>
                  )}
                  <p className="font-bold text-gray-700">
                    You Save Money: ₹{sub.amount - sub.discountedAmount}
                  </p>
                </div>
                {showModal && <PackageCoupon pkg={sub} setShowModal={setShowModal} />}
              </>
            ) : (
              <div className="text-center text-gray-700">
                No subscription found for Rally Pro.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Rally_pro;
