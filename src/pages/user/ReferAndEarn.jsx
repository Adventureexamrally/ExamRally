import React, { useState } from 'react'
import DashBoard from './DashBoard'

const ReferAndEarn = () => {
  const [open, setOpen] = useState(false);
  const handleDrawerToggle = () => {
    setOpen(!open);
  };
  return (
    <div className="flex flex-col md:flex-row">
          <DashBoard handleDrawerToggle={handleDrawerToggle} open={open} setOpen={setOpen} />
    <div>
      ReferAndEarn
    </div>
    </div>
  )
}

export default ReferAndEarn
