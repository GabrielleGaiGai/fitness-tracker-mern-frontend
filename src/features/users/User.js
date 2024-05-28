import { selectUserById } from "../../app/api/usersApiSlice"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons/faPenToSquare"
import './User.css'

const User = ({ id }) => {
    const user = useSelector((state) => selectUserById(state, id))
    const userRolesString = user?.roles.toString().replaceAll(',', ', ')

    const navigate = useNavigate()

    if (user) {
        const editClicked = () => navigate(`/users/${id}`)

        return (
            <tr>
                <td className='table__td'>{user.username}</td>
                <td className='table__td'>{user.firstname}</td>
                <td className='table__td'>{user.lastname}</td>
                <td className='table__td'>{userRolesString}</td>
                <td className='table__td'><button onClick={editClicked} className='table__button'><FontAwesomeIcon icon={faPenToSquare} /></button></td>
            </tr>
        )
    } else {
        return null
    }

}
export default User