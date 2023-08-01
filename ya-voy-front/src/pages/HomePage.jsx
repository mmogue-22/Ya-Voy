import { useState, useEffect } from 'react'
import axios from 'axios'

export const HomePage = () => {

  const [coords, setCoords] = useState({})

  const getCoords = async () => {
    try {
      navigator.geolocation.getCurrentPosition(async(position) => {
        const { longitude, latitude } = position.coords;
        setCoords({ longitude, latitude });
        const { data } = await axios(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        console.log(data);
      });
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    getCoords()
  }, [])

  return (
    <div>
      {coords.longitude} // 
      {coords.latitude}
    </div>
  )
}
