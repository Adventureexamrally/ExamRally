/**
 * Configuration and helper utilities for ExamRally Scheduled Maintenance
 * Non-closable maintenance modal until Tomorrow 8:00 PM
 */

export const getMaintenanceScheduleDefaults = () => {
  const now = new Date();

  // End: Tomorrow 8:00 PM (20:00)
  const endTime = new Date();
  endTime.setDate(endTime.getDate() + 1);
  endTime.setHours(20, 0, 0, 0);

  const tomorrowDateStr = endTime.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return {
    nowIso: now.toISOString(),
    endTime: endTime.toISOString(),
    formattedWindow: `Tomorrow at 8:00 PM (${tomorrowDateStr})`,
  };
};

const defaults = getMaintenanceScheduleDefaults();

export const DEFAULT_MAINTENANCE_CONFIG = {
  isEnabled: true,
  canClose: false, // NON-CLOSABLE until Tomorrow 8:00 PM
  title: "ExamRally Platform Maintenance & System Upgrade",
  subtitle: "Our system is undergoing scheduled maintenance to upgrade servers, enhance test speed, and improve security.",
  dateDisplay: `Expected Resumption: Tomorrow at 8:00 PM IST (${defaults.formattedWindow})`,
  timeWindow: "Until Tomorrow, 8:00 PM IST",
  endDateTime: defaults.endTime,
  emergencyNotice: "Platform features are paused for maintenance. All ongoing sessions, mock tests, and purchases will resume tomorrow at 8:00 PM.",
  impactedServices: [
    { name: "Live Mock Tests", status: "Temporarily Paused" },
    { name: "Test Series & Submissions", status: "Maintenance Mode" },
    { name: "PDF Courses & Video Library", status: "Under Maintenance" },
    { name: "Payments & Purchases", status: "Temporarily Disabled" },
  ],
  supportEmail: "support@examrally.in",
  supportContact: "+91 98765 43210",
};

const CONFIG_STORAGE_KEY = "examrally_maintenance_config";

export const getMaintenanceConfig = () => {
  try {
    const saved = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (saved) {
      return { ...DEFAULT_MAINTENANCE_CONFIG, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error("Error reading maintenance config:", e);
  }
  return DEFAULT_MAINTENANCE_CONFIG;
};

export const saveMaintenanceConfig = (config) => {
  try {
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
    window.dispatchEvent(new Event("examrally_maintenance_config_updated"));
    return true;
  } catch (e) {
    console.error("Error saving maintenance config:", e);
    return false;
  }
};

export const resetMaintenanceConfig = () => {
  try {
    localStorage.removeItem(CONFIG_STORAGE_KEY);
    window.dispatchEvent(new Event("examrally_maintenance_config_updated"));
    return DEFAULT_MAINTENANCE_CONFIG;
  } catch (e) {
    console.error("Error resetting maintenance config:", e);
    return DEFAULT_MAINTENANCE_CONFIG;
  }
};

export const isWithinLockedMaintenanceWindow = () => {
  const config = getMaintenanceConfig();
  if (!config.isEnabled) return false;

  const now = new Date().getTime();
  const endTime = new Date(config.endDateTime).getTime();

  if (config.canClose === false) {
    return now <= endTime;
  }

  return now <= endTime;
};
