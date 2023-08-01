import { useEffect, useState, createContext } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import App from './App';
import { HomePage } from './pages/HomePage';

const AuthContext = createContext()

export const Index = () => {

  const [loggedIn, setLoggedIn] = useState(false)
  const [dataUser, setDataUser] = useState({})

  const routes = createBrowserRouter([
    {
      path: '/',
      element: <App />,
      children: [
        {
          path: '',
          element: <HomePage />
        }
      ]
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
