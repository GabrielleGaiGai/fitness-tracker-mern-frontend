import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { jwtDecode } from "jwt-decode";
import { setCredentials } from '../authSlice'

const baseQuery = fetchBaseQuery({
  // baseUrl: 'http://localhost:3500',
  baseUrl: 'https://fitness-tracker-mern-35vj.onrender.com',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token
    if (token) {
      headers.set("authorization", `Bearer ${token}`)
    }
    return headers
  }
})


const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)

  if (result?.error?.status === 403) {
    // Send refresh token to get a new access token
    const refreshResult = await baseQuery('/auth/refresh', api, extraOptions)

    if (refreshResult?.data) {
      const { accessToken } = refreshResult.data
      const decoded = jwtDecode(accessToken)
      const { username, roles, userId } = decoded.User
      api.dispatch(setCredentials({ accessToken, username, roles, userId }))

      result = await baseQuery(args, api, extraOptions)
    } else {
      if (refreshResult?.error?.status === 403) {
        refreshResult.error.data.message = "Your login has expired. "
      }
      return refreshResult
    }
  }

  return result
}

// will be added to state as api (state.api)
export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Workout', 'User'],
  endpoints: builder => ({})
})

