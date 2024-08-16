import { Route, Routes } from 'react-router-dom'

import Home from '~views/Home'
import Layout from '~views/Layout'
import StationsList from '~views/StationsList'

const Routing = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/stations" element={<StationsList />} />
      </Route>
    </Routes>
  )
}

export default Routing
