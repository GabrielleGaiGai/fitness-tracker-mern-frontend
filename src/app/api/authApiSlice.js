import { apiSlice } from "../../app/api/apiSlice";
import { setCredentials } from "../authSlice";
import { jwtDecode } from "jwt-decode";

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        login: builder.mutation({
            query: credentials => ({
                url: '/auth',
                method: 'POST',
                body: credentials
            })
        }),

        register: builder.mutation({
            query: credentials => ({
                url: '/auth/register',
                method: 'POST',
                body: credentials
            })
        }),

        refresh: builder.mutation({
            query: () => ({
                url: '/auth/refresh',
                method: 'GET',
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const {data} = await queryFulfilled
                    const { accessToken } = data
                    const decoded = jwtDecode(accessToken)
                    const { username, roles, userId } = decoded.User
                    dispatch(setCredentials({ accessToken, username, roles, userId }))
                } catch (err) {
                    console.log(err)
                }
            }
        }),

        logout: builder.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'POST'
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled
                    // need to delay because isSuccess is set to true when the last mutation has DATA from a successful request.
                    // Will not "return success" if the api state is reset (= no data).
                    setTimeout(() => {
                        dispatch(apiSlice.util.resetApiState())
                    }, 1000)
                } catch (err) {
                    console.log(err)
                }
            }
        })
    })
})

export const { useLoginMutation, useRegisterMutation, useLogoutMutation, useRefreshMutation } = authApiSlice 