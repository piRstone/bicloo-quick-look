import { useEffect, useState } from "react"
import { MemoryRouter } from 'react-router-dom'

import type { Station } from '~types/station'
import { getStations } from '~api/stations'
import Routing from '~routes'

import "./style.css"

const IndexPopup = () => {
  const [stations, setStations] = useState<Station[]>([])

  useEffect(() => {
    init()
  }, [])

  const init = async () => {
    setStations(await getStations())
  }

  return (
    <MemoryRouter>
      <Routing />
    </MemoryRouter>
  )
}

export default IndexPopup
