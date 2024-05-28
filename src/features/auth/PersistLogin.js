import { useEffect, useRef, useState } from 'react'
import { Outlet, Navigate, useLocation } from "react-router-dom"
import { useSelector } from 'react-redux'
import { useDispatch } from "react-redux"
import { jwtDecode } from "jwt-decode";

import { useRefreshMutation } from '../../app/api/authApiSlice';
import { setCredentials, selectCurrentToken } from "../../app/authSlice"
import usePersist from "../../hooks/usePersist"

const PersistLogin = () => {
    const dispatch = useDispatch()
    const location = useLocation()
    const [persist] = usePersist()
    const [credSuccess, setCredSuccess] = useState(false)
    const token = useSelector(selectCurrentToken)
    const effectRan = useRef(false)

    const [refresh, { isUninitialized, isLoading, isSuccess, isError }] = useRefreshMutation()

    useEffect(() => {
        if (effectRan.current === true || process.env.NODE_ENV !== 'development') {
            const verifyRefreshToken = async () => {
                try {
                    const { accessToken } = await refresh().unwrap()
                    const decoded = jwtDecode(accessToken)
                    const { username, roles, userId } = decoded.User
                    dispatch(setCredentials({ accessToken, username, roles, userId }))
                    setCredSuccess(true)
                } catch (err) {
                    console.error(err)
                }
            }
            if (!token && persist) verifyRefreshToken()
        }

        // in development mode, every component mount -> unmount -> mount again.
        // only refresh on the second mount to avoid sending refresh token twice.
        return () => effectRan.current = true
        // eslint-disable-next-line
    }, [])

    let content
    if (!persist) {
        content = <Outlet />
    } else if (isLoading) {
        content = <p className='loading-status'>Loading...</p>
    } else if (isError) {
        content = <Navigate to="/signin" state={{ from: location }} replace />
    } else if (isSuccess && credSuccess) {
        content = <Outlet />
    } else if (token && isUninitialized) {
        content = <Outlet />
    }

    return content
}
export default PersistLogin