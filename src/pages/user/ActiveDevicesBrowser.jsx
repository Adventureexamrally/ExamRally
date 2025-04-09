import React, { useState } from 'react'
import DashBoard from './DashBoard'

const ActiveDevicesBrowser = () => {
    const [open, setOpen] = useState(false);
    const handleDrawerToggle = () => {
      setOpen(!open);
    };
  return (
    <div className="flex flex-col md:flex-row">
          <DashBoard handleDrawerToggle={handleDrawerToggle} open={open} setOpen={setOpen} />
    <div>
      ActiveDevicesBrowser
    </div>
    </div>
  )
}

export default ActiveDevicesBrowser
