import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wrench,
  Clock,
  Calendar,
  AlertTriangle,
  HelpCircle,
  Lock,
  Radio
} from "lucide-react";
import logo from "../assets/logo/logo.png";
import {
  getMaintenanceConfig,
  isWithinLockedMaintenanceWindow
} from "./maintenanceConfig";

const MaintenancePopup = () => {
  const [config, setConfig] = useState(getMaintenanceConfig());
  const [isLocked, setIsLocked] = useState(true);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isEnded: false,
  });

  // Load config and listen for live updates
  useEffect(() => {
    const updateFromStorage = () => {
      const cfg = getMaintenanceConfig();
      setConfig(cfg);
      setIsLocked(isWithinLockedMaintenanceWindow());
    };
    updateFromStorage();

    window.addEventListener("examrally_maintenance_config_updated", updateFromStorage);
    return () => {
      window.removeEventListener("examrally_maintenance_config_updated", updateFromStorage);
    };
  }, []);

  // Live countdown to Tomorrow 8:00 PM
  useEffect(() => {
    if (!config?.endDateTime) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const endTime = new Date(config.endDateTime).getTime();
      const diff = endTime - now;

      if (diff <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isEnded: true,
        });
        setIsLocked(false);
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
        isEnded: false,
      });
      setIsLocked(isWithinLockedMaintenanceWindow());
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [config?.endDateTime]);

  // If maintenance is disabled, do not show
  if (!config?.isEnabled) return null;

  return (
    <AnimatePresence>
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        style={{
          backgroundColor: "rgba(15, 23, 42, 0.9)",
          backdropFilter: "blur(10px)",
          zIndex: 10500,
          pointerEvents: "auto",
        }}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-dialog modal-dialog-centered modal-lg px-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="modal-content shadow-2xl border-0 overflow-hidden"
            style={{
              borderRadius: "1.25rem",
              background: "#ffffff",
              boxShadow: "0 25px 60px -12px rgba(15, 23, 42, 0.6)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Themed with ExamRally Logo & Branding */}
            <div
              className="p-4 position-relative"
              style={{
                background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 55%, #0284c7 100%)",
                borderBottom: "3px solid #f59e0b",
              }}
            >
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                {/* Logo and Platform Name */}
                <div className="d-flex align-items-center gap-3">
                  <div
                    className="p-2.5 rounded-3 bg-white shadow-sm d-flex align-items-center justify-content-center"
                    style={{
                      minWidth: "120px",
                      height: "50px",
                    }}
                  >
                    <img
                      src={logo}
                      alt="ExamRally Logo"
                      style={{
                        maxHeight: "36px",
                        maxWidth: "130px",
                        objectFit: "contain",
                      }}
                    />
                  </div>

                  <div className="text-white">
                    <div className="d-inline-flex align-items-center gap-1.5 px-2.5 py-0.5 rounded-pill bg-danger text-white font-weight-bold mb-1 shadow-sm">
                      <Radio size={12} className="text-white animate-pulse" />
                      <span style={{ fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.5px" }}>
                        SYSTEM UPGRADE IN PROGRESS
                      </span>
                    </div>
                    <h4 className="m-0 text-white font-weight-bold" style={{ fontWeight: 800 }}>
                      {config.title}
                    </h4>
                  </div>
                </div>

                {/* Lock Badge */}
                <div
                  className="rounded-3 d-flex align-items-center gap-2 px-3 py-2 text-white shadow-sm"
                  style={{
                    background: "rgba(239, 68, 68, 0.2)",
                    border: "1px solid rgba(239, 68, 68, 0.4)",
                  }}
                >
                  <Lock size={18} className="text-warning" />
                  <div className="text-start">
                    <div style={{ fontSize: "0.65rem", textTransform: "uppercase", color: "#fca5a5" }}>Status</div>
                    <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#ffffff" }}>
                      Maintenance Mode
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="modal-body p-4">
              <p className="text-muted mb-3" style={{ fontSize: "0.95rem", lineHeight: 1.5 }}>
                {config.subtitle}
              </p>

              {/* Maintenance Schedule & Live Countdown */}
              <div
                className="p-3 mb-3 rounded-3 border d-flex flex-wrap align-items-center justify-content-between gap-3"
                style={{
                  background: "#f8fafc",
                  borderColor: "#cbd5e1",
                }}
              >
                <div className="d-flex align-items-center gap-3">
                  <div
                    className="text-white p-3 rounded-3 d-flex align-items-center justify-content-center shadow-sm"
                    style={{ background: "#1e3a8a" }}
                  >
                    <Calendar size={24} className="text-warning" />
                  </div>
                  <div>
                    <span className="badge bg-primary text-white mb-1" style={{ fontSize: "0.7rem", fontWeight: 700 }}>
                      RESUMPTION SCHEDULE
                    </span>
                    <div className="font-weight-bold text-dark" style={{ fontSize: "1.1rem", fontWeight: 800 }}>
                      Resumes Tomorrow at 8:00 PM IST
                    </div>
                    <div className="text-muted small d-flex align-items-center gap-1 mt-0.5">
                      <Clock size={14} className="text-primary" />
                      <span>Countdown until platform reopens</span>
                    </div>
                  </div>
                </div>

                {/* Live Countdown */}
                <div
                  className="d-flex align-items-center gap-2 bg-white px-3 py-2.5 rounded-3 border shadow-sm"
                  style={{ borderColor: "#0284c7" }}
                >
                  <div className="text-center px-1">
                    <div className="font-weight-bold text-primary" style={{ fontSize: "1.2rem", fontWeight: 800 }}>
                      {String(timeLeft.hours + (timeLeft.days * 24)).padStart(2, "0")}
                    </div>
                    <span className="text-muted" style={{ fontSize: "0.65rem", fontWeight: 700 }}>HOURS</span>
                  </div>
                  <span className="font-weight-bold text-muted">:</span>
                  <div className="text-center px-1">
                    <div className="font-weight-bold text-primary" style={{ fontSize: "1.2rem", fontWeight: 800 }}>
                      {String(timeLeft.minutes).padStart(2, "0")}
                    </div>
                    <span className="text-muted" style={{ fontSize: "0.65rem", fontWeight: 700 }}>MINUTES</span>
                  </div>
                  <span className="font-weight-bold text-muted">:</span>
                  <div className="text-center px-1">
                    <div className="font-weight-bold text-danger" style={{ fontSize: "1.2rem", fontWeight: 800 }}>
                      {String(timeLeft.seconds).padStart(2, "0")}
                    </div>
                    <span className="text-muted" style={{ fontSize: "0.65rem", fontWeight: 700 }}>SECONDS</span>
                  </div>
                </div>
              </div>

              {/* Crucial Student Warning Box */}
              <div
                className="p-3 mb-4 rounded-3 d-flex align-items-start gap-3 border"
                style={{
                  background: "#fff1f2",
                  borderColor: "#fecdd3",
                }}
              >
                <div className="p-1 rounded bg-danger text-white mt-0.5">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h6 className="font-weight-bold mb-1" style={{ color: "#9f1239", fontWeight: 800 }}>
                    Notice For All Students & Aspirants
                  </h6>
                  <p className="m-0 small" style={{ color: "#881337", lineHeight: 1.5, fontWeight: 500 }}>
                    {config.emergencyNotice}
                  </p>
                </div>
              </div>

              {/* Impacted Services Grid */}
              <div className="mb-2">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="text-muted small font-weight-bold text-uppercase" style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}>
                    Status of Platform Features
                  </span>
                  <span className="badge bg-danger text-white font-weight-bold" style={{ fontSize: "0.7rem" }}>
                    Resumes Tomorrow at 8:00 PM
                  </span>
                </div>
                <div className="row g-2">
                  {config.impactedServices.map((service, idx) => (
                    <div key={idx} className="col-12 col-md-6">
                      <div
                        className="p-2.5 rounded-3 border d-flex align-items-center justify-content-between"
                        style={{ background: "#ffffff", borderColor: "#e2e8f0" }}
                      >
                        <div className="d-flex align-items-center gap-2">
                          <span
                            style={{
                              width: "9px",
                              height: "9px",
                              borderRadius: "50%",
                              background: "#ef4444",
                              display: "inline-block",
                            }}
                          />
                          <span className="small font-weight-semibold text-dark" style={{ fontWeight: 600 }}>
                            {service.name}
                          </span>
                        </div>
                        <span
                          className="badge"
                          style={{
                            background: "#fee2e2",
                            color: "#991b1b",
                            border: "1px solid #fecaca",
                            fontSize: "0.7rem",
                            fontWeight: 600,
                          }}
                        >
                          {service.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer - Non-closable lock status */}
            <div
              className="modal-footer p-3 px-4 d-flex flex-wrap align-items-center justify-content-between border-top"
              style={{ background: "#f8fafc" }}
            >
              <div className="d-flex align-items-center gap-2 text-danger small font-weight-bold">
                <Lock size={16} />
                <span>Under Maintenance • Resumes Tomorrow at 8:00 PM IST</span>
              </div>

              <div className="d-flex align-items-center gap-2">
                <a
                  href={`mailto:${config.supportEmail}?subject=ExamRally%20Maintenance%20Urgent%20Inquiry`}
                  className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1.5 px-3 py-2"
                  style={{ borderRadius: "8px", fontWeight: 600, fontSize: "0.85rem" }}
                >
                  <HelpCircle size={15} />
                  <span>ExamRally Support</span>
                </a>

                {/* Non-closable status badge */}
                <div
                  className="btn btn-secondary btn-sm px-3 py-2 d-flex align-items-center gap-2 text-white shadow-sm disabled"
                  style={{
                    borderRadius: "8px",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    background: "#0f172a",
                    border: "none",
                    cursor: "not-allowed",
                    opacity: 1,
                  }}
                >
                  <Clock size={15} className="text-warning" />
                  <span>Resumes Tomorrow at 8:00 PM</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default MaintenancePopup;
