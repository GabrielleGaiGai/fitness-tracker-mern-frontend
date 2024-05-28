import { useGetUsersQuery } from "../../app/api/usersApiSlice"
import { Link } from "react-router-dom"
import User from './User'
import './User.css'

const UserList = () => {
  const { data: users, isLoading, isSuccess, isError, error } = useGetUsersQuery()

  let content

  if (isLoading) {
    content = <h1 className='loading-status'>Loading ...</h1>
  } else if (isError) {
    content = <h1 className='loading-status'>{error?.data?.message}</h1>
  } else if (isSuccess) {
    const { ids } = users
    const tableContent = ids?.length ? ids.map(id => <User key={id} id={id} />) : null
    content = (
      <div className="user__list">
        <h1 className="user__header">All Users</h1>
        <div className="user__new"><Link to="new">New User</Link></div>
        <table className='table'>
          <thead>
            <tr>
              <th className='table__th'>Username</th>
              <th className='table__th'>First Name</th>
              <th className='table__th'>Last Name</th>
              <th className='table__th'>Roles</th>
              <th className='table__th'>Edit</th>
            </tr>
          </thead>
          <tbody>
            {tableContent}
          </tbody>
        </table>
      </div>
    )
  }


  return (
    <div>
      {content}
    </div>

  )
}
export default UserList