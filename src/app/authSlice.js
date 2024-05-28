import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: 'auth',
    initialState: { token: null, username: null, roles: [], userId: null },
    reducers: {
        setCredentials: (state, action) => {
            const { accessToken, username, roles, userId } = action.payload
            state.token = accessToken
            state.username = username
            state.roles = typeof roles === 'string' ? [roles] : roles
            state.userId = userId
        },

        clearCredentials: (state, action) => {
            state.token = null
            state.username = null
            state.roles = []
            state.userId = null
        }
    }
})

export const { setCredentials, clearCredentials } = authSlice.actions

export default authSlice.reducer

export const selectCurrentToken = (state) => state.auth.token

export const selectUserInfo = (state) => state.auth