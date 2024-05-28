import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"

import { useAddNewUserMutation, useUpdateUserMutation, useDeleteUserMutation, selectUserById } from "../../app/api/usersApiSlice"
import { ROLES } from '../../config/roles'
import './User.css'

import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

const USER_REGEX = /^[A-z0-9]{2,20}$/
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/

const UserPage = () => {
    const { id } = useParams()
    const user = useSelector(state => selectUserById(state, id))

    const [username, setUsername] = useState(user?.username || '')
    const [password, setPassword] = useState(user?.password || '')
    const [firstname, setFirstname] = useState(user?.firstname || '')
    const [lastname, setLastname] = useState(user?.lastname || '')
    const [roles, setRoles] = useState(user?.roles || ["user"])
    const [errMsg, setErrMsg] = useState('')

    const navigate = useNavigate()

    const [addNewUser, { isSuccess: isAddSuccess }] = useAddNewUserMutation()
    const [updateUser, { isSuccess: isUpdateSuccess }] = useUpdateUserMutation()
    const [deleteUser, { isSuccess: isDeleteSuccess }] = useDeleteUserMutation()

    const roles_options = Object.values(ROLES)

    useEffect(() => {
        if (isAddSuccess || isUpdateSuccess || isDeleteSuccess) {
            setUsername('')
            setPassword('')
            setFirstname('')
            setLastname('')
            setRoles([])
            navigate('/users')
        }
    }, [isAddSuccess, isUpdateSuccess, isDeleteSuccess, navigate])

    const onSaveUserClicked = async (e) => {
        e.preventDefault()
        if (id && !password && USER_REGEX.test(username)) {
            try {
                await updateUser({ id, username, firstname, lastname, roles }).unwrap()
            } catch (err) {
                console.log(err.data?.message)
                setErrMsg(err.data?.message)
            }

        } else if (id && password && USER_REGEX.test(username) && PWD_REGEX.test(password)) {
            try {
                await updateUser({ id, username, password, firstname, lastname, roles }).unwrap()
            } catch (err) {
                console.log(err.data?.message)
                setErrMsg(err.data?.message)
            }
        } else if (!id && USER_REGEX.test(username) && PWD_REGEX.test(password)) {
            try {
                await addNewUser({ username, password, firstname, lastname, roles }).unwrap()
            } catch (err) {
                console.log(err.data?.message)
                setErrMsg(err.data?.message)
            }
        } else {
            setErrMsg("Invalid username or password")
        }
    }

    const onDeleteUserClicked = async (e) => {
        e.preventDefault()
        try {
            await deleteUser({ id: user.id })
        } catch (err) {
            setErrMsg(err)
        }
    }

    let header
    if (id) {
        header = "Update User"
    } else {
        header = "Create New User"
    }

    useEffect(() => {
        setErrMsg('')
    }, [username, lastname, firstname, password, roles])

    return (
        <div className="userpage">
            <div className="userpage__header">
                <h1 className="loading-status">{header}</h1>
                <p className='userpage__errmsg' aria-live="assertive">{errMsg}</p>
            </div>


            <form className="userpage__form" >
                <label htmlFor="username" > Username:  </label>
                <input className='userpage__input' id="username" name="username" type="text" value={username} onChange={e => setUsername(e.target.value)} />

                <label htmlFor="password"> Password: </label>
                <input className='userpage__input' id="password" name="password" type="text" value={password} onChange={e => setPassword(e.target.value)} />


                <label htmlFor="firstname"> First Name:</label>
                <input className='userpage__input' id="firstname" name="firstname" type="text" value={firstname} onChange={e => setFirstname(e.target.value)} />

                <label htmlFor="lastname"> Last Name: </label>
                <input className='userpage__input' id="lastname" name="lastname" type="text" value={lastname} onChange={e => setLastname(e.target.value)} />

                <label htmlFor="roles"> Roles:</label>
                <FormControl>
                    <Select id="roles" name="roles" multiple value={roles}
                        onChange={(e) => { setRoles(e.target.value) }} renderValue={(selected) => selected.join(', ')} >
                        {roles_options.map((option) =>
                        (<MenuItem key={option} value={option} >
                            <Checkbox checked={roles.indexOf(option) > -1} /> <ListItemText primary={option} />
                        </MenuItem>))}
                    </Select>
                </FormControl>

                <div className="userpage__buttons">
                    <button className="userpage__button" title="Save" onClick={onSaveUserClicked}> Save </button>
                    <button className="userpage__button" title="Delete" disabled={!id} onClick={onDeleteUserClicked}> Delete </button>
                </div>
            </form >
        </div >

    )
}
export default UserPage