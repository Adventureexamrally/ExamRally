import React, { useState } from 'react'
import DashBoard from './DashBoard'

const PurchaseHistory = () => {
  const [open, setOpen] = useState(false);
  const handleDrawerToggle = () => {
    setOpen(!open);
  };
  return (
<div className="flex flex-col md:flex-row">
      <DashBoard handleDrawerToggle={handleDrawerToggle} open={open} setOpen={setOpen} />
    <div>
      PurchaseHistory
    </div>
    </div>
  )
}

export default PurchaseHistory
