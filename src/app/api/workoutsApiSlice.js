import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";

const workoutsAdapter = createEntityAdapter({
})

const initialState = workoutsAdapter.getInitialState()

export const workoutsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getWorkouts: builder.query({
            query: () => 'workouts',
            transformResponse: response => {
                const workouts = response.map(workout => {
                    workout.id = workout._id
                    return workout
                })
                return workoutsAdapter.setAll(initialState, workouts)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Workout', id: 'LIST' }, ...result.ids.map(id => ({ type: 'Workout', id }))
                    ]
                } else {
                    return [{ type: 'Workout', id: 'LIST' }]
                }
            }
        }),

        addNewWorkout: builder.mutation({
            query: initialWorkoutData => ({
                url: '/workouts',
                method: 'POST',
                body: initialWorkoutData
            }),
            invalidatesTags: [{ type: 'Workout', id: 'LIST' }]
        }),

        updateWorkout: builder.mutation({
            query: initialWorkoutData => ({
                url: '/workouts',
                method: 'PATCH',
                body: initialWorkoutData
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'Workout', id: arg.id }]
        }),

        deleteWorkout: builder.mutation({
            query: ({ id }) => ({
                url: '/workouts',
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'Workout', id: arg.id }]
        })
    })
})

export const { useGetWorkoutsQuery, useAddNewWorkoutMutation, useUpdateWorkoutMutation, useDeleteWorkoutMutation } = workoutsApiSlice

export const selectWorkoutsResult = workoutsApiSlice.endpoints.getWorkouts.select()

const selectAllWorkoutsData = createSelector(
    selectWorkoutsResult,
    allWorkouts => allWorkouts.data
)

export const {
    selectAll: selectAllWorkouts,
    selectById: selectWorkoutById,
    selectIds: selectAllWorkoutIds
} = workoutsAdapter.getSelectors(state => selectAllWorkoutsData(state) ?? initialState)