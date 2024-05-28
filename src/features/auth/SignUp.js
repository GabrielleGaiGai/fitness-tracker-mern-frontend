import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons/faArrowLeftLong";
import { jwtDecode } from "jwt-decode";

import { useRegisterMutation } from '../../app/api/authApiSlice';
import { setCredentials } from '../../app/authSlice';
import usePersist from '../../hooks/usePersist';

import './Auth.css'

const SignUp = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [errMsg, setErrMsg] = useState('')
  const [persist, setPersist] = usePersist()
  const roles = ["user"]

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [register, { data, isSuccess, isError, error }] = useRegisterMutation()

  useEffect(() => {
    setErrMsg('');
  }, [username, password])

  const handleSubmit = async (e) => {
    e.preventDefault()
    await register({ username, password, firstname, lastname, roles })
  }

  useEffect(() => {
    if (isError) {
      if (!error.status) {
        setErrMsg('No Server Response');
      } else if (error.data) {
        setErrMsg(error.data?.message);
      } else {
        setErrMsg('Error');
      }
    } else if (isSuccess) {
      const { accessToken } = data
      const decoded = jwtDecode(accessToken)
      const { userId } = decoded.User
      dispatch(setCredentials({ accessToken, username, roles, userId }))
      setUsername('')
      setPassword('')
      setFirstname('')
      setLastname('')
      navigate('/workouts')
    }
  }, [isError, isSuccess])

  return (
    <div className='auth'>
      <Link to="/" className='auth__back'>
        <FontAwesomeIcon icon={faArrowLeftLong} />
        <p>Back to Home</p>
      </Link>

      <main className='auth__box'>
        <form className='signup__form'>
          <FormControl variant="outlined" fullWidth>
            <FormHelperText sx={{ ml: 0, fontSize: 16 }}>Username</FormHelperText>
            <OutlinedInput id="username" type="text" required className='signup_field'
              value={username} onChange={e => setUsername(e.target.value)} />
          </FormControl>

          <FormControl variant="outlined" fullWidth>
            <FormHelperText sx={{ ml: 0, fontSize: 16 }}>Password</FormHelperText>
            <OutlinedInput id="password" type="password" required className='signup_field'
              value={password} onChange={e => setPassword(e.target.value)} />
          </FormControl>

          <FormControl variant="outlined" fullWidth>
            <FormHelperText sx={{ ml: 0, fontSize: 16 }}>First Name</FormHelperText>
            <OutlinedInput id="firstname" type="text" required className='signup_field'
              value={firstname} onChange={e => setFirstname(e.target.value)} />
          </FormControl>

          <FormControl variant="outlined" fullWidth>
            <FormHelperText sx={{ ml: 0, fontSize: 16 }}>Last Name</FormHelperText>
            <OutlinedInput id="lastname" type="text" required className='signup_field'
              value={lastname} onChange={e => setLastname(e.target.value)} />
          </FormControl>

          <div className="auth__submit">
            <p className='auth__errmsg' aria-live="assertive">{errMsg}</p>
            <button className="auth__button" onClick={handleSubmit}>Sign In</button>
            <label htmlFor="persist" className="signin__persist">
              <input type="checkbox" className="signin__checkbox" id="persist" onChange={() => setPersist(prev => !prev)} checked={persist} />
              Remember Me
            </label>
          </div>
        </form>
      </main>
    </div>
  )
}

export default SignUp