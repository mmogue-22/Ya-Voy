import { useState, useEffect, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronsLeft } from 'react-feather'
import { verify } from '../js/utils'
import axios from 'axios'
import Swal from 'sweetalert2'
import { AuthContext } from '../Index'

export const RegisterPage = () => {

  const navigate = useNavigate()
  const { setDataUser, setLoggedIn } = useContext(AuthContext)
  const [curr, setCurr] = useState(0)
  const [img, setImg] = useState()
  const [form, setForm] = useState({
    name: '',
    surname: '',
    phone: '',
    email: '',
    birthday: '',
    password: ''
  });

  const goNext = () => {
    setCurr(curr => curr === 4 ? 0 : curr + 1)
  }

  const goBack = () => {
    setCurr(curr => curr === 0 ? 0 : curr - 1)
  }

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
    if (e.target.name == 'birthday') {
      setForm({
        ...form,
        [e.target.name]: new Date(e.target.value).toISOString()
      })
    }
  }

  const handleImg = (e) => {
    const f = new FormData()
    console.log(e.target.files);
    f.append('photo', e.target.files[0])
    setImg(f)
  }

  const register = async (e) => {
    try {
      e.preventDefault()
      console.log(img);
      const msg = verify(form)
      if (msg)
        return Swal.fire({
          title: 'Params Required',
          color: 'white',
          text: msg,
          icon: 'error',
          iconColor: 'orange',
          background: "#444444",
          showConfirmButton: true,
          showCloseButton: false,
        })
      if (!img)
        return Swal.fire({
          title: 'Params Required',
          color: 'white',
          text: 'A photograph is necessary to follow.',
          icon: 'error',
          iconColor: 'orange',
          background: "#444444",
          showConfirmButton: true,
          showCloseButton: false,
        })
      const confPass = document.getElementById('confirm-pass').value;
      if (form.password.length < 8)
        return Swal.fire({
          title: 'The password must have at least 8 characters',
          color: 'white',
          icon: 'error',
          iconColor: 'orange',
          background: "#444444",
          showConfirmButton: false,
          showCloseButton: false,
          timer: 2000
        })
      if (form.password != confPass)
        return Swal.fire({
          title: 'Passwords do not match',
          color: 'white',
          icon: 'error',
          iconColor: 'orange',
          background: "#444444",
          showConfirmButton: false,
          showCloseButton: false,
          timer: 2000
        })
      const { data } = await axios.post('/api/user/register', form)
      if (data) {
        const a = await axios.put(`/api/user/upload-img/${data.UI}`, img, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': data.IN6AV
          }
        })
        data.logged.t4Ca59q = a.data.name;
        await axios.post(`/api/account/create/${data.UI}`, {}, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': data.IN6AV
          }
        })
        localStorage.setItem('IN6AV', data.IN6AV)
        localStorage.setItem('3Tr13c', JSON.stringify(data.logged))
        setLoggedIn(true)
        setDataUser(data.logged)
        navigate('/')
      }
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

  useEffect(() => {

  }, [curr])

  return (
    <div className='min-h-screen bg-[#1e1e1e]'>
      <div className='flex flex-col justify-center items-center'>
        <Link
          to={'/'}
          className='text-white absolute top-6 left-6 z-10'
        >
          <ChevronsLeft size={32} />
        </Link>
        <div className='w-full overflow-hidden'>
          <div
            style={{
              transform: `translateX(-${curr * (100)}%)`
            }}
            className='flex transition-transform ease-out delay-100 duration-500'
          >
            <div className='min-w-[100%] min-h-[100vh] flex justify-center'>
              <div className='max-sm:w-full sm:w-96 h-full px-8 space-y-6 flex flex-col justify-center items-center'>
                <img src="https://3dicons.sgp1.cdn.digitaloceanspaces.com/v1/dynamic/color/boy-dynamic-color.png" />
                <p className='text-center justify-center font-medium text-slate-300'>We are going to collect some important information to create the profile. Let's start with the most important...</p>
                <div className='space-y-4 w-full'>
                  <div className='w-full'>
                    <label
                      htmlFor="name"
                      className='text-base text-slate-300'
                    >
                      Name
                    </label>
                    <input
                      className='w-full px-3 py-2 mt-1 border-[2px] border-slate-100 bg-transparent rounded-lg text-white'
                      placeholder='Example "Juan Jose"'
                      onChange={handleChange}
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
                      placeholder='Example "Estrada Lopez"'
                      onChange={handleChange}
                      name='surname'
                      inputMode='text'
                    />
                  </div>
                </div>
                <div className='w-full flex gap-4'>
                  <Link
                    to={'/'}
                    className='w-full px-4 py-2 bg-gray-400 rounded-3xl font-bold text-white text-center'
                  >
                    Back
                  </Link>
                  <button
                    className='w-full px-4 py-2 bg-lime-600 rounded-3xl font-bold text-white'
                    onClick={(e) => { e.preventDefault(); goNext() }}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>

            <div className='min-w-[100%] min-h-[100vh] flex justify-center'>
              <div className='max-sm:w-full sm:w-96 h-full px-8 space-y-6 flex flex-col justify-center items-center'>
                <img src="https://3dicons.sgp1.cdn.digitaloceanspaces.com/v1/dynamic/clay/copy-dynamic-clay.png" />
                <p className='text-center justify-center font-medium text-slate-300'>Let's go well, now we need to know the ways in which we can contact you in case we need it.</p>
                <div className='w-full space-y-4'>
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
                      onChange={handleChange}
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
                      onChange={handleChange}
                      name='email'
                      inputMode='email'
                    />
                  </div>
                </div>
                <div className='w-full flex gap-4'>
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

            <div className='min-w-[100%] min-h-[100vh] flex justify-center'>
              <div className='max-sm:w-full sm:w-96 h-full px-8 space-y-6 flex flex-col justify-center items-center'>
                <img src="https://3dicons.sgp1.cdn.digitaloceanspaces.com/v1/dynamic/gradient/gift-dynamic-gradient.png" />
                <p className='text-center justify-center font-medium text-slate-300'>One thing for us is your birthday, so could you tell us the date you have your birthday...</p>
                <div className='w-full space-y-4'>
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
                      onChange={handleChange}
                      type='date'
                    />
                  </div>
                </div>
                <div className='w-full flex gap-4'>
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

            <div className='min-w-[100%] min-h-[100vh] flex justify-center'>
              <div className='max-sm:w-full sm:w-96 h-full px-8 space-y-6 flex flex-col justify-center items-center'>
                <img src="https://3dicons.sgp1.cdn.digitaloceanspaces.com/v1/dynamic/color/picture-dynamic-color.png" />
                <p className='text-center justify-center font-medium text-slate-300'>A photo wouldn't go well, would it? This to be able to live with others and know how they are (will be). This can then be modified.</p>
                <div className='w-full space-y-4'>
                  <div className=''>
                    <label
                      htmlFor="Photo"
                      className='text-base text-slate-300'
                    >
                      Photo
                    </label>
                    <input
                      className='w-full px-3 py-2 mt-1 border-[2px] border-slate-100 bg-transparent rounded-lg text-white'
                      name='photo'
                      onChange={handleImg}
                      type='file'
                    />
                  </div>
                </div>
                <div className='w-full flex gap-4'>
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

            <div className='min-w-[100%] min-h-[100vh] flex justify-center'>
              <div className='max-sm:w-full sm:w-96 h-full px-8 space-y-6 flex flex-col justify-center items-center'>
                <img src="https://3dicons.sgp1.cdn.digitaloceanspaces.com/v1/dynamic/premium/lock-dynamic-premium.png" />
                <p className='text-center justify-center font-medium text-slate-300'>Now yes... so that you can have point security, a password is necessary respectively. Create one but without forgetting it...</p>
                <div className='w-full space-y-4'>
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
                      onChange={handleChange}
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
                <div className='w-full flex gap-4'>
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
