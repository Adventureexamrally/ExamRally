import React from 'react';
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";

// Topics for Static GK with relevant Bootstrap icons
const topics = [
  { name: "Indian States & Capitals", icon: "bi-house-door" },
  { name: "Rivers, Lakes & Dams", icon: "bi-droplet" },
  { name: "National Parks & Wildlife Sanctuaries", icon: "bi-tree" },
  { name: "Mountains & Famous Monuments", icon: "bi-mountain" },
  { name: "Indian Constitution & Parliament", icon: "bi-house-lock" },
  { name: "President, PM & CMs", icon: "bi-person-circle" },
  { name: "Important Days & Events", icon: "bi-calendar" },
  { name: "Sports Trophies & Awards", icon: "bi-trophy" },
  { name: "National & International Organizations", icon: "bi-building" },
  { name: "Census & Population Data", icon: "bi-bar-chart" },
  { name: "Indian Cities & Their Nicknames", icon: "bi-house" },
  { name: "Famous Books & Authors", icon: "bi-book" },
  { name: "Airports, Seaports & Railway Zones", icon: "bi-airplane-engines" },
  { name: "Festivals of India", icon: "bi-gift" },
  { name: "First in India & World (Male & Female Achievements)", icon: "bi-flag" },
  { name: "Important Government Schemes & Programs", icon: "bi-clipboard" },
  { name: "Folk Dances & Music of India", icon: "bi-music-note" },
  { name: "Famous Temples in India", icon: "bi-geo-alt" },
  { name: "Important Highways & Border Roads", icon: "bi-road" },
  { name: "Indian & International Airports", icon: "bi-airport" },
  { name: "Nuclear & Thermal Power Plants in India", icon: "bi-lightning" },
  { name: "Stock Exchanges in India & World", icon: "bi-bar-chart" },
  { name: "Major Agreements & Treaties", icon: "bi-pencil-square" },
  { name: "Indian Space Missions", icon: "bi-rocket" },
  { name: "International Borders", icon: "bi-border" },
  { name: "Headquarters of Major Organizations", icon: "bi-bank" },
  { name: "Currency & Capitals of Countries", icon: "bi-currency-exchange" },
  { name: "Famous Scientists & Their Inventions", icon: "bi-lightbulb" },
  { name: "Military Exercises & Defense Deals", icon: "bi-shield-lock" }
];

const Staticgk = () => {
  return (
    <div className="container py-5">
      <h1 className="text-center text-green-500 font fw-bold">
      <LibraryBooksIcon fontSize="large" className="text-green-600" />
        Static GK</h1>
      
      <div className="row mt-4">
        {topics.map((topic, index) => (
          <div key={index} className="col-md-4 mb-4">
            <div className="card shadow-lg">
              <div className="card-body text-center">
                <i className={`bi ${topic.icon } display-4`} style={{ fontSize: '40px' }}></i>
                <h5 className="card-title mt-3 text-green-500 font fw-bold">{topic.name}</h5>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Staticgk;
