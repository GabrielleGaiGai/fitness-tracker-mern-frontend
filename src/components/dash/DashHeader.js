import { useNavigate, Link } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons'

import { clearCredentials, selectUserInfo } from '../../app/authSlice'
import { useLogoutMutation } from '../../app/api/authApiSlice'
import './DashHeader.css'

const DashHeader = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { roles } = useSelector(selectUserInfo)

    const [logout, { isLoading, isSuccess, isError, error }] = useLogoutMutation()

    useEffect(() => {
        if (isSuccess) {
            dispatch(clearCredentials())
            navigate('/')
        }

    }, [isSuccess, navigate, dispatch])

    if (isLoading) return <p>Logging Out...</p>

    if (isError) return <p>Error: {error.data?.message}</p>

    let userLink = null
    if (roles.includes('admin')) {
        userLink = <Link to="/users" className="dash__link">Users</Link>
    }

    return (
        <>
            <header className='dash__header'>
                <div className="dash__links">
                    <Link to="/workouts" className="dash__link">Workouts</Link>
                    {userLink}
                </div>
                <button className="dash__logout" title="Logout" onClick={logout}>
                    <FontAwesomeIcon icon={faRightFromBracket} />
                </button>
            </header>
            <Outlet />
        </>
    )
}

export default DashHeader