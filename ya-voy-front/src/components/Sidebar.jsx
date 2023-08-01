import { useState, useEffect } from 'react'
import { AlignRight, ChevronRight, GitMerge, Navigation2, Truck } from 'react-feather';
import { Link } from 'react-router-dom';

export const Sidebar = () => {

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

  return (
    <>
      <div className='w-full h-14 bg-slate-100/25 shadow-xl flex justify-between items-center z-[5]'>
        <div className='p-2'>
          Ya Voy
        </div>
        <button className='p-2' onClick={() => { setOpen(!open) }}>
          <AlignRight size={32} />
        </button>
      </div>
      <div onClick={() => { setOpen(false) }} className={`w-full min-h-screen overflow-hidden fixed inset-0 z-[1] ${open ? 'sm:bg-[rgba(0,0,0,0.3)] opacity-100' : 'invisible'} transition-colors`}>
        <div className='w-full relative'>
          <div className={`max-sm:w-full sm:w-96 min-h-screen p-4 bg-white absolute top-0 right-0 ${open ? 'translate-x-0' : 'translate-x-[100%]'} transition-transform ease-in-out duration-300 flex flex-col justify-between`}>
            <button onClick={() => { setOpen(!open) }}>
              <ChevronRight size={32} />
            </button>
            <div className='flex flex-col gap-3'>
              {
                links.map(({ name, link, icon }, i) => {
                  return (
                    <Link
                      key={i}
                      to={link}
                      className={`flex items-center max-sm:justify-center gap-3 px-4 py-4 hover:bg-slate-50/40 rounded-xl ${open ? `animate-fade-left animate-duration-[` + (800 + i * 200) + `ms] animate-delay-[200ms] animate-ease-in-out` : ''}`}
                    >
                      {icon}
                      {name}
                    </Link>
                  )
                })
              }
            </div>
            <Link>
              Profile
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
