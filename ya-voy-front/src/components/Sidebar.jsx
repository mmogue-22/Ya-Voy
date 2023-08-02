import { useState, useEffect, useContext } from 'react'
import { AlignJustify, ChevronRight, GitMerge, LogOut, Navigation2, Truck, User, Bell } from 'react-feather';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Index';

export const Sidebar = () => {

  const navigate = useNavigate()
  const { setDataUser, setLoggedIn, dataUser } = useContext(AuthContext)
  const [open, setOpen] = useState(false)

  const links = [
    {
      name: 'Buses',
      link: 'bus',
      icon: <Truck />
    },
    {
      name: 'Routes',
      link: 'route',
      icon: <GitMerge />
    }, {
      name: 'Map',
      link: 'map-online',
      icon: <Navigation2 />
    }
  ]

  const logout = (e) => {
    e.preventDefault()
    localStorage.clear();
    setLoggedIn(false)
    setDataUser({})
    navigate('/')
  }

  return (
    <>
      <div className='w-full h-14 bg-[#1e1e1e] shadow-xl flex justify-between items-center z-[5]'>
        <div className='p-4 text-slate-200 text-xl font-black flex justify-center items-center gap-2'>
          <button className=' text-slate-200' onClick={() => { setOpen(!open) }}>
            <AlignJustify size={26} />
          </button>
          <Link to={'/'}>Ya Voy</Link>
        </div>
        <Link 
        to={'/alarms'}
        className='p-4 text-slate-200'
        >
          <Bell size={26} />
        </Link>
      </div>
      <div onClick={() => { setOpen(false) }} className={`w-full min-h-screen overflow-hidden fixed inset-0 z-[1] ${open ? 'sm:bg-[rgba(0,0,0,0.3)] opacity-100' : 'invisible'} transition-colors`}>
        <div className='w-full relative'>
          <div className={`max-sm:w-full sm:w-96 min-h-screen p-4 bg-[#444444] absolute top-0 right-0 ${open ? 'translate-x-0' : 'translate-x-[100%]'} transition-transform ease-in-out duration-300 flex flex-col justify-between`}>
            <button onClick={() => { setOpen(!open) }}>
              <ChevronRight size={32} color='white'/>
            </button>
            <div className='flex flex-col gap-3'>
              {
                links.map(({ name, link, icon }, i) => {
                  return (
                    <Link
                      key={i}
                      to={link}
                      className={`flex text-white items-center max-sm:justify-center gap-3 px-4 py-4 hover:bg-slate-50/40 rounded-xl ${open ? `animate-fade-left animate-duration-[` + (800 + i * 200) + `ms] animate-delay-[200ms] animate-ease-in-out` : ''}`}
                    >
                      {icon}
                      {name}
                    </Link>
                  )
                })
              }
            </div>
            <div className='flex flex-col gap-3'>
              <Link
                to={'profile'}
                className={`flex text-white items-center max-sm:justify-center gap-3 px-4 py-4 hover:bg-slate-50/40 rounded-xl ${open ? `animate-fade-left animate-duration-[1400ms] animate-delay-[200ms] animate-ease-in-out` : ''}`}
              >
                <User />
                {dataUser.username}
              </Link>
              <button
                onClick={(e) => { logout(e) }}
                className={`flex text-white items-center max-sm:justify-center gap-3 px-4 py-4 hover:bg-slate-50/40 rounded-xl ${open ? `animate-fade-left animate-duration-[1600ms] animate-delay-[200ms] animate-ease-in-out` : ''}`}
              >
                <LogOut />
                Log Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
