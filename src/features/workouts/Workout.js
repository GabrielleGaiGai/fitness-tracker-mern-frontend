import { useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { selectWorkoutById, useUpdateWorkoutMutation } from "../../app/api/workoutsApiSlice"

import Checkbox from '@mui/material/Checkbox';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmark, faDumbbell, faHourglassHalf, faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import "./Workout.css"

const User = ({ workoutId }) => {
    const workout = useSelector((state) => selectWorkoutById(state, workoutId))
    const [updateWorkout] = useUpdateWorkoutMutation()

    const duration = workout.duration ?? "0"
    const set = workout.set ?? "0"
    const repetition = workout.repetition ?? 0
    const weight = workout.weight ?? 0
    const [completed, setCompleted] = useState(workout.completed)

    const onCompleteWorkoutClicked = async (e) => {
        e.preventDefault()
        try {
            console.log(completed)
            await updateWorkout({ ...workout, completed: !completed })
            setCompleted(!completed)
        } catch (err) {
            console.log(err)
        }

    }

    const navigate = useNavigate()

    if (workout) {
        const editClicked = () => navigate(`/workouts/${workoutId}`)

        return (
            <div className="workout__board">
                <div className="workout__head">
                    <div className="workout__title">
                        <Checkbox checked={completed} sx={{ '& .MuiSvgIcon-root': { fontSize: 26, color: "#4b4141" } }}
                            onChange={onCompleteWorkoutClicked} />
                        <p> {workout.title} </p>
                    </div>

                    <button onClick={editClicked} className='workout__edit'><FontAwesomeIcon icon={faPenToSquare} /></button>
                </div>
                <div className="workout__count">
                    <p>Count:</p>
                    {set} sets
                    <FontAwesomeIcon icon={faXmark} />
                    {repetition} reps
                </div>
                <div className="workout__infos">
                    <div className="workout__info">
                        <FontAwesomeIcon icon={faDumbbell} />
                        {weight} kg
                    </div>
                    <div className="workout__info">
                        <FontAwesomeIcon icon={faHourglassHalf} />
                        {duration} min
                    </div>
                </div>
            </div>
        )
    } else {
        return null
    }

}
export default User