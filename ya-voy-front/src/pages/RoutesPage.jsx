import { useEffect, useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../Index'
import { RouteCard } from '../components/Cards/RouteCard'
import axios from 'axios'
import Swal from 'sweetalert2'

export const RoutesPage = () => {

  const { dataUser } = useContext(AuthContext)
  const [isCompany, setIsCompany] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  const [routes, setRoutes] = useState([])

  const getRoutes = async () => {
    try {
      const { data } = await axios('/api/route/get')
      setRoutes(data.routes)
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (dataUser.Qdt3caW4 != 'qgEE30w')
      setIsCompany(true)
    getRoutes()
  }, [])

  return (
    <div className='app'>
      <div>
        {
          routes.length > 0 ? (
            routes.map(({ _id,stops, exits, price, rates }, i) => {
              return (
                <RouteCard
                  key={i}
                  id={_id}
                  stops={stops}
                  exits={exits}
                  price={price}
                  rates={rates}
                />
              )
            })

          ) : (
            ''
          )
        }
      </div>
    </div>
  )
}
