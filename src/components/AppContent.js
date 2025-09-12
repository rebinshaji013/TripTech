import React from 'react'
import { Outlet } from 'react-router-dom'
import { CContainer } from '@coreui/react'

const AppContent = () => {
  return (
    <CContainer className="px-4" lg>
      {/* All nested routes will be injected here */}
      <Outlet />
    </CContainer>
  )
}

export default React.memo(AppContent)
