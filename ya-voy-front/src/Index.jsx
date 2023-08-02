import { useEffect, useState, createContext } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import App from './App';
import { BusesPage } from './pages/BusesPage';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { MapPage } from './pages/MapPage';
import { RegisterPage } from './pages/RegisterPage';
import { RoutesPage } from './pages/RoutesPage';
import { ProfilePage } from './pages/ProfilePage'
import { InfoRoutePage } from './pages/InfoRoutePage';
import { AlarmsPage } from './pages/AlarmsPage';

export const AuthContext = createContext()

export const Index = () => {

  const [loggedIn, setLoggedIn] = useState(false)
  const [dataUser, setDataUser] = useState({})

  useEffect(() => {
    const tok = localStorage.getItem('IN6AV')
    if (tok) {
      setLoggedIn(true)
      setDataUser(JSON.parse(localStorage.getItem('3Tr13c')))
    }
  }, [])

  const routes = createBrowserRouter([
    {
      path: '/',
      element: loggedIn ? <App /> : <LoginPage />,
      errorElement: <></>,
      children: [
        {
          path: '',
          element: <HomePage />
        },
        {
          path: 'bus',
          element: <BusesPage />
        },
        {
          path: 'route',
          element: <RoutesPage />
        },
        {
          path: 'route/:id',
          element: <InfoRoutePage />
        },
        {
          path: 'map-online',
          element: <MapPage />
        },
        {
          path: 'profile',
          element: <ProfilePage />
        },
        {
          path: 'alarms',
          element: <AlarmsPage />
        }
      ]
    },
    {
      path: '/register',
      element: <RegisterPage />
    }
  ])

  return (
    <>
      <AuthContext.Provider value={{ loggedIn, dataUser, setDataUser, setLoggedIn }}>
        <RouterProvider router={routes} />
      </AuthContext.Provider>
    </>
  )
}
