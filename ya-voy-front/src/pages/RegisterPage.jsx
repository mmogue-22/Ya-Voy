import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronsLeft } from 'react-feather'
import axios from 'axios'
import Swal from 'sweetalert2'

export const RegisterPage = () => {

  const [curr, setCurr] = useState(0)
  const [form, setForm] = useState({

  });

  const goNext = () => {
    setCurr(curr => curr === 3 ? 0 : curr + 1)
  }

  const goBack = () => {
    setCurr(curr => curr === 0 ? 0 : curr - 1)
  }

  const register = async (e) => {
    try {
      e.preventDefault()
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: err.response.data.message,
        icon: 'info',
        iconColor: 'orange',
        showConfirmButton: false,
        showCloseButton: false,
        timer: 2000
      })
    }
  }

  return (
    <div className='w-full min-h-screen bg-[#1e1e1e]'>
      <div className='w-full flex flex-col justify-center items-center'>
        <Link
          to={'/'}
          className='text-white absolute top-6 left-6 z-10'
        >
          <ChevronsLeft size={32} />
        </Link>
        <div className='min-w-full overflow-hidden'>
          <div
            style={{
              transform: `translateX(-${curr * (100)}%)`
            }}
            className='flex transition-transform ease-out delay-200 duration-500 max-w-full'
          >
            <div className='min-w-full max-w-[100%] min-h-screen flex flex-col justify-center items-center'>
              <div className='max-sm:w-full sm:w-96 px-8 space-y-6'>
                <img src="https://3dicons.sgp1.cdn.digitaloceanspaces.com/v1/dynamic/color/boy-dynamic-color.png" />
                <p className='text-center justify-center font-medium text-slate-300'>We are going to collect some important information to create the profile. Let's start with the most important...</p>
                <div className='space-y-4 max-w-full'>
                  <div className='w-full'>
                    <label
                      htmlFor="name"
                      className='text-base text-slate-300'
                    >
                      Name
                    </label>
                    <input
                      className='w-full px-3 py-2 mt-1 border-[2px] border-slate-100 bg-transparent rounded-lg text-white'
                      placeholder='Name'
                      name='name'
                      inputMode='text'
                    />
                  </div>
                  <div className='w-full'>
                    <label
                      htmlFor="surname"
                      className='text-base text-slate-300'
                    >
                      Surname
                    </label>
                    <input
                      className='w-full px-3 py-2 mt-1 border-[2px] border-slate-100 bg-transparent rounded-lg text-white'
                      placeholder='Suename'
                      name='surname'
                      inputMode='text'
                    />
                  </div>
                </div>
                <div className='flex gap-4'>
                  <button
                    className='w-full px-4 py-2 bg-gray-400 rounded-3xl font-bold text-white'
                    onClick={(e) => { e.preventDefault(); goBack() }}
                  >
                    Back
                  </button>
                  <button
                    className='w-full px-4 py-2 bg-lime-600 rounded-3xl font-bold text-white'
                    onClick={(e) => { e.preventDefault(); goNext() }}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>

            <div className='min-w-full min-h-screen flex flex-col justify-center items-center'>
              <div className='max-sm:w-full sm:w-96 px-8 space-y-6'>
                <img src="https://3dicons.sgp1.cdn.digitaloceanspaces.com/v1/dynamic/clay/copy-dynamic-clay.png" />
                <p className='text-center justify-center font-medium text-slate-300'>Let's go well, now we need to know the ways in which we can contact you in case we need it.</p>
                <div className='space-y-4 max-w-full'>
                  <div className=''>
                    <label
                      htmlFor="phone"
                      className='text-base text-slate-300'
                    >
                      Phone
                    </label>
                    <input
                      className='w-full px-3 py-2 mt-1 border-[2px] border-slate-100 bg-transparent rounded-lg text-white'
                      placeholder='Phone example +50278684578'
                      name='phone'
                      inputMode='numeric'
                    />
                  </div>
                  <div className=''>
                    <label
                      htmlFor="email"
                      className='text-base text-slate-300'
                    >
                      Email
                    </label>
                    <input
                      className='w-full px-3 py-2 mt-1 border-[2px] border-slate-100 bg-transparent rounded-lg text-white'
                      placeholder='example@example.com'
                      name='email'
                      inputMode='email'
                    />
                  </div>
                </div>
                <div className='flex gap-4'>
                  <button
                    className='w-full px-4 py-2 bg-gray-400 rounded-3xl font-bold text-white'
                    onClick={(e) => { e.preventDefault(); goBack() }}
                  >
                    Back
                  </button>
                  <button
                    className='w-full px-4 py-2 bg-lime-600 rounded-3xl font-bold text-white'
                    onClick={(e) => { e.preventDefault(); goNext() }}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>

            <div className='min-w-full min-h-screen flex flex-col justify-center items-center'>
              <div className='max-sm:w-full sm:w-96 px-8 space-y-6'>
                <img src="https://3dicons.sgp1.cdn.digitaloceanspaces.com/v1/dynamic/gradient/gift-dynamic-gradient.png" />
                <p className='text-center justify-center font-medium text-slate-300'>One thing for us is your birthday, so could you tell us the date you have your birthday...</p>
                <div className='space-y-4 max-w-full'>
                  <div className=''>
                    <label
                      htmlFor="birthday"
                      className='text-base text-slate-300'
                    >
                      Birthday
                    </label>
                    <input
                      className='w-full px-3 py-2 mt-1 border-[2px] border-slate-100 bg-transparent rounded-lg text-white'
                      name='birthday'
                      type='date'
                    />
                  </div>
                </div>
                <div className='flex gap-4'>
                  <button
                    className='w-full px-4 py-2 bg-gray-400 rounded-3xl font-bold text-white'
                    onClick={(e) => { e.preventDefault(); goBack() }}
                  >
                    Back
                  </button>
                  <button
                    className='w-full px-4 py-2 bg-lime-600 rounded-3xl font-bold text-white'
                    onClick={(e) => { e.preventDefault(); goNext() }}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>

            <div className='min-w-full min-h-screen flex flex-col justify-center items-center'>
              <div className='max-sm:w-full sm:w-96 px-8 space-y-6'>
                <img src="https://3dicons.sgp1.cdn.digitaloceanspaces.com/v1/dynamic/premium/lock-dynamic-premium.png" />
                <p className='text-center justify-center font-medium text-slate-300'>Now yes... so that you can have point security, a password is necessary respectively. Create one but without forgetting it...</p>
                <div className='space-y-4 max-w-full'>
                  <div className=''>
                    <label
                      htmlFor="password"
                      className='text-base text-slate-300'
                    >
                      Password
                    </label>
                    <input
                      className='w-full px-3 py-2 mt-1 border-[2px] border-slate-100 bg-transparent rounded-lg text-white'
                      placeholder='aA33sQsdw@sf'
                      name='password'
                      type='password'
                    />
                  </div>
                  <div className=''>
                    <label
                      htmlFor="confirm-password"
                      className='text-base text-slate-300'
                    >
                      Confirm Password
                    </label>
                    <input
                      className='w-full px-3 py-2 mt-1 border-[2px] border-slate-100 bg-transparent rounded-lg text-white'
                      placeholder='aA33sQsdw@sf'
                      id='confirm-pass'
                      type='password'
                    />
                  </div>
                </div>
                <div className='flex gap-4'>
                  <button
                    className='w-full px-4 py-2 bg-gray-400 rounded-3xl font-bold text-white'
                    onClick={(e) => { e.preventDefault(); goBack() }}
                  >
                    Back
                  </button>
                  <button
                    className='w-full px-4 py-2 bg-lime-600 rounded-3xl font-bold text-white'
                    onClick={(e) => { register(e) }}
                  >
                    Create Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
