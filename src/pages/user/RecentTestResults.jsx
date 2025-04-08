import React, { useState } from 'react'
import DashBoard from './DashBoard'

const RecentTestResults = () => {
  const [open, setOpen] = useState(false);
  const handleDrawerToggle = () => {
    setOpen(!open);
  };
  return (
    <div className="flex flex-col md:flex-row">
          <DashBoard handleDrawerToggle={handleDrawerToggle} open={open} setOpen={setOpen} />
    <div>
      RecentTestResults
    </div>
    </div>
  )
}

export default RecentTestResults
