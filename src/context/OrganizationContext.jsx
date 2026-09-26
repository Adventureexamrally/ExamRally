import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

export const OrganizationContext = createContext({ organization: null, loading: false, error: null });

export const OrganizationProvider = ({ children }) => {
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        // Attempt to fetch organization details based on the current hostname
        const hostname = window.location.hostname;
        
        // In a real app, this endpoint would use the hostname or a header to resolve the tenant
        // e.g. GET /api/organization/current
        // We pass hostname as a query param for explicit resolution if needed
        const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/organization/current?domain=${hostname}`);
        
        if (response.data.success) {
          const orgData = response.data.organization;
          setOrganization(orgData);
          
          // Apply dynamic CSS variables for theming
          if (orgData?.branding) {
            const root = document.documentElement;
            if (orgData.branding.primaryColor) {
              root.style.setProperty('--primary-color', orgData.branding.primaryColor);
            }
            if (orgData.branding.secondaryColor) {
              root.style.setProperty('--secondary-color', orgData.branding.secondaryColor);
            }
          }
        } else {
          // Fallback to default
          setOrganization(null);
        }
      } catch (err) {
        console.error('Failed to fetch organization details', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganization();
  }, []);

  return (
    <OrganizationContext.Provider value={{ organization, loading, error }}>
      {children}
    </OrganizationContext.Provider>
  );
};

export const useOrganization = () => useContext(OrganizationContext);
