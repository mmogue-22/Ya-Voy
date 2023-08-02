import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../../Index'
import { Link } from 'react-router-dom'
import { Star } from 'react-feather'
import axios from 'axios'
import Swal from 'sweetalert2'

export const RouteCard = ({ id, stops, exits, price, rates }) => {

  const { dataUser } = useContext(AuthContext)

  return (
    <>
      <div
        className={`w-full h-48 border-2 rounded-3xl relative`}
      >
        <div
          className='absolute bottom-4 left-4 flex items-center gap-2'
        >
          <span className='text-yellow-400'>
            <Star fill='#facc15' />
          </span>
          <span className='text-white font-semibold text-lg'>
            {rates}
          </span>
        </div>
        <div
          className='absolute bottom-4 right-4'
        >
          <p
            className='text-white font-semibold text-lg'
          >
            {`${new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(Number(price))}`}
          </p>
        </div>
        <div
          className='w-full px-4 py-2'
        >
          <div>
            <h1 className='text-white font-semibold underline text-lg'>Exits</h1>
            <p
              className='text-white'
            >
              {
                exits?.map((exit, i) => {
                  return (

                    i > 2 ? (
                      ''
                    ) : (
                      `${exit}. `
                    )

                  )
                })
              }
              <Link
                className='underline'
                to={`${id}`}
              >
                More Info
              </Link>
            </p>
          </div>
          <div>
            <h1 className='text-white font-semibold underline text-lg'>Stops</h1>
            <p
              className='text-white'
            >
              {
                stops?.map(({ address }, i) => {
                  return (
                    i > 1 ? (
                      ''
                    ) : (
                      `${address.country}, ${address.town}. `
                    )
                  )
                })
              }
              <Link
                className='underline'
                to={`${id}`}
              >
                More Info
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
