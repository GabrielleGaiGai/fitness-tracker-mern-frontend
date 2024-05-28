import { useState } from "react";
import { Link } from "react-router-dom";

import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import dayjs from 'dayjs';

import { useGetWorkoutsQuery } from "../../app/api/workoutsApiSlice"
import LeftPanel from "./LeftPanel";
import Workout from './Workout'
import "./Workout.css"


const WorkoutList = () => {
  const { data: workouts, isLoading, isSuccess, isError, error } = useGetWorkoutsQuery()
  const [date, setDate] = useState(dayjs());

  let content
  if (isLoading) {
    content = <h1 className='loading-status'>Loading ...</h1>
  } else if (isError) {
    content = <h1 className='loading-status'>{error?.data?.message}</h1>
  } else if (isSuccess) {
    const { entities } = workouts

    const workouts_selected_date = Object.entries(entities).filter(([key, workout]) => date.isSame(workout.date, 'day'))

    const tableContent = workouts_selected_date?.length ? workouts_selected_date.map(workout => <Workout key={workout[1].id} workoutId={workout[1].id} />) : null
    
    content = (
      <div className="workout__list">
        <div className="loading-status">
          <h1 className="workout__header">
            Workouts
            <Link to="new">
              <Fab className="workout__new" aria-label="add" size="medium" sx={{ "&.MuiFab-root": { backgroundColor: "#d4b5b5" } }}>
                <AddIcon />
              </Fab>
            </Link>
          </h1>
        </div>

        <div className="workout__panel">
          {tableContent}
        </div>
      </div>
    )
  }

  return (
    <div className="workout">
      <LeftPanel date={date} setDate={setDate} />
      {content}
    </div>
  )
}
export default WorkoutList