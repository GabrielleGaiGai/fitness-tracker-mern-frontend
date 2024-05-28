import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";

const usersAdapter = createEntityAdapter({

})

const initialState = usersAdapter.getInitialState()

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getUsers: builder.query({
            query: () => 'users',
            transformResponse: response => {
                const users = response.map(user => {
                    user.id = user._id
                    return user
                })
                // return the entity
                return usersAdapter.setAll(initialState, users)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'User', id: 'LIST' }, ...result.ids.map(id => ({ type: 'User', id }))
                    ]
                } else {
                    return [{ type: 'User', id: 'LIST' }]
                }
            }
        }),

        addNewUser: builder.mutation({
            query: initialUserData => ({
                url: '/users',
                method: 'POST',
                body: initialUserData
            }),
            invalidatesTags: [{ type: 'User', id: 'LIST' }]
        }),

        updateUser: builder.mutation({
            query: initialUserData => ({
                url: '/users',
                method: 'PATCH',
                body: initialUserData
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'User', id: arg.id }]
        }),

        deleteUser: builder.mutation({
            query: ({ id }) => ({
                url: '/users',
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'User', id: arg.id }]
        })
    })
})

// fetch data (if neccesary) and store the transformed data in an entity structure in cache
export const { useGetUsersQuery, useAddNewUserMutation, useUpdateUserMutation, useDeleteUserMutation } = usersApiSlice

// a new memoized selector function that returns query result (data + status) from cache
export const selectUsersResult = usersApiSlice.endpoints.getUsers.select()

// a memoized selector function that returns user data from cache
const selectAllUsersData = createSelector(
    selectUsersResult,
    allUsers => allUsers.data
)

// prebuilt reducers
// need to provide the an "input selector" so they know where to find the data
export const {
    selectAll: selectAllUsers,
    selectById: selectUserById,
    selectIds: selectAllUserIds
} = usersAdapter.getSelectors(state => selectAllUsersData(state) ?? initialState)