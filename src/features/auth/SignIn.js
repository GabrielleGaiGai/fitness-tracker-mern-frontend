import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux';

import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons/faArrowLeftLong"
import { jwtDecode } from "jwt-decode";

import { useLoginMutation } from '../../app/api/authApiSlice'
import { setCredentials } from '../../app/authSlice';
import usePersist from '../../hooks/usePersist';

import './Auth.css'

const SignIn = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errMsg, setErrMsg] = useState('')
  const [persist, setPersist] = usePersist()

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [login, { data, isSuccess, isError, error }] = useLoginMutation()

  useEffect(() => {
    setErrMsg('');
  }, [username, password])

  const handleSubmit = async (e) => {
    e.preventDefault()
    await login({ username, password })
  }

  useEffect(() => {
    if (isError) {
      if (!error.status) {
        setErrMsg('No Server Response');
      } else if (error.data) {
        setErrMsg(error.data?.message);
      } else {
        setErrMsg('Inauthorized');
      }
    } else if (isSuccess) {
      const { accessToken } = data
      const decoded = jwtDecode(accessToken)
      const { roles, userId } = decoded.User
      dispatch(setCredentials({ accessToken, username, roles, userId }))
      setUsername('')
      setPassword('')
      navigate('/workouts')
    }
  }, [isError, isSuccess, error])


  return (
    <div className='auth'>
      <Link to="/" className='auth__back'>
        <FontAwesomeIcon icon={faArrowLeftLong} />
        <p>Back to Home</p>
      </Link>

      <main className='auth__box'>
        <form>
          <FormControl variant="outlined" fullWidth sx={{ mb: 4 }}>
            <FormHelperText sx={{ ml: 0, mb: 0.5, fontSize: 16 }}>Username</FormHelperText>
            <OutlinedInput id="username" type="text" required
              className='' value={username} onChange={e => setUsername(e.target.value)} />
          </FormControl>

          <FormControl variant="outlined" fullWidth>
            <FormHelperText sx={{ ml: 0, mb: 0.5, fontSize: 16 }}>Password</FormHelperText>
            <OutlinedInput id="password" type="password" required
              className='' value={password} onChange={e => setPassword(e.target.value)} />
          </FormControl>

          <div className="auth__submit">
            <p className='auth__errmsg' aria-live="assertive">{errMsg}</p>
            <button className="auth__button" onClick={handleSubmit}>Sign In</button>
            <label htmlFor="persist" className="signin__persist">
              <input type="checkbox" className="signin__checkbox" id="persist" onChange={(e) => setPersist(e.target.checked)} checked={persist} />
              Remember Me
            </label>
          </div>
        </form>
      </main>
    </div>
  )
}

export default SignIn