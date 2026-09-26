import React, { useState, useEffect } from "react";
import { Radio, Lock } from "lucide-react";
import logo from "../assets/logo/logo.png";
import { getMaintenanceConfig } from "./maintenanceConfig";

const MaintenanceBanner = () => {
  const [config, setConfig] = useState(getMaintenanceConfig());

  useEffect(() => {
    const handleUpdate = () => {
      setConfig(getMaintenanceConfig());
    };
    window.addEventListener("examrally_maintenance_config_updated", handleUpdate);
    return () => {
      window.removeEventListener("examrally_maintenance_config_updated", handleUpdate);
    };
  }, []);

  if (!config?.isEnabled) {
    return null;
  }

  return (
    <div
      className="w-100 text-white py-2 px-3 position-relative shadow-sm"
      style={{
        background: "linear-gradient(90deg, #0f172a 0%, #991b1b 50%, #b45309 100%)",
        borderBottom: "2px solid #ef4444",
        zIndex: 1040,
        fontSize: "0.85rem",
      }}
    >
      <div className="container d-flex flex-wrap align-items-center justify-content-between gap-2">
        <div className="d-flex align-items-center gap-3 flex-grow-1">
          {/* Logo badge in banner */}
          <div
            className="bg-white rounded px-2 py-0.5 d-flex align-items-center shadow-sm"
            style={{ height: "26px" }}
          >
            <img
              src={logo}
              alt="ExamRally"
              style={{ maxHeight: "20px", maxWidth: "80px", objectFit: "contain" }}
            />
          </div>

          <div className="d-flex flex-wrap align-items-center gap-2">
            <span
              className="badge d-inline-flex align-items-center gap-1 font-weight-bold"
              style={{
                background: "#ef4444",
                color: "#ffffff",
                fontSize: "0.7rem",
                letterSpacing: "0.4px",
                fontWeight: 800,
              }}
            >
              <Radio size={11} className="text-white animate-pulse" />
              SYSTEM UPGRADE IN PROGRESS
            </span>
            <span className="font-weight-medium">
              Platform Maintenance: <strong>Resumes Tomorrow at 8:00 PM IST</strong>.
            </span>
            <span className="text-white-50 d-none d-lg-inline">
              Mock test submissions are paused for server upgrades.
            </span>
          </div>
        </div>

        <div className="d-flex align-items-center gap-2">
          <div
            className="d-flex align-items-center gap-1.5 px-2.5 py-1 rounded bg-black text-warning small font-weight-bold"
            style={{ fontSize: "0.75rem", border: "1px solid rgba(255,255,255,0.2)" }}
          >
            <Lock size={12} />
            <span>Resumes Tomorrow at 8:00 PM</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceBanner;
