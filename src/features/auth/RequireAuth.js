import { useLocation, Navigate, Outlet } from "react-router-dom"
import { useSelector } from "react-redux"
import { selectUserInfo } from "../../app/authSlice"

// eslint-disable-next-line
const RequireAuth = ({ }) => {
    const location = useLocation()
    const { roles } = useSelector(selectUserInfo)

    const content = (
        roles.includes('admin'))
            ? <Outlet />
            : <Navigate to="/signin" state={{ from: location }} replace />

    return content
}
export default RequireAuth