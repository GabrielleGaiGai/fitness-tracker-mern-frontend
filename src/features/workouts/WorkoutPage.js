import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate, useParams, Link } from "react-router-dom"

import { useAddNewWorkoutMutation, useUpdateWorkoutMutation, useDeleteWorkoutMutation, selectWorkoutById } from "../../app/api/workoutsApiSlice"

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import CheckIcon from '@mui/icons-material/Check';
import ToggleButton from '@mui/material/ToggleButton';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons/faArrowLeftLong"
import dayjs from "dayjs";

const WorkoutPage = () => {
  const { id } = useParams()
  const workout = useSelector(state => selectWorkoutById(state, id))

  const [title, setTitle] = useState(workout?.title)
  const [duration, setDuration] = useState(workout?.duration)
  const [distance, setDistance] = useState(workout?.distance)
  const [pace, setPace] = useState(null)
  const [weight, setWeight] = useState(workout?.weight)
  const [set, setSet] = useState(workout?.set)
  const [repetition, setRepetition] = useState(workout?.repetition)
  const [date, setDate] = useState(dayjs(workout?.date) || dayjs())
  const [note, setNote] = useState(workout?.note)
  const [completed, setCompleted] = useState(workout?.completed || false)

  const navigate = useNavigate()

  const [addNewWorkout, { isSuccess: isAddSuccess, isError: isAddError, error: addError }] = useAddNewWorkoutMutation()
  const [updateWorkout, { isSuccess: isUpdateSuccess, isError: isUpdateError, error: updateError }] = useUpdateWorkoutMutation()
  const [deleteWorkout, { isSuccess: isDeleteSuccess, isError: isDeleteError, error: deleteError }] = useDeleteWorkoutMutation()

  useEffect(() => {
    if (isAddSuccess || isUpdateSuccess || isDeleteSuccess) {
      setTitle('')
      setDuration('')
      setDistance('')
      setWeight('')
      setSet('')
      setRepetition('')
      setNote('')
      navigate('/workouts')
    }
  }, [isAddSuccess, isUpdateSuccess, isDeleteSuccess, navigate])


  useEffect(() => {
    if (duration && distance) {
      setPace(Math.floor(duration * 60 * 100 / distance) / 100)
    }
  }, [duration, distance])

  let header
  if (isAddError) {
    header = <h1 className='loading-status'>{addError?.data?.message}</h1>
  } else if (isUpdateError) {
    header = <h1 className='loading-status'>{updateError?.data?.message}</h1>
  } else if (isDeleteError) {
    header = <h1 className='loading-status'>{deleteError?.data?.message}</h1>
  } else if (id) {
    header = <h1 className="loading-status">Update Workout</h1>
    
  } else {
    header = <h1 className="loading-status">Create New Workout</h1>
  }



  const onSaveWorkoutClicked = async (e) => {
    e.preventDefault()
    if (title && id) {
      await updateWorkout({ id, title, duration, distance, weight, set, repetition, date, note, completed })
    } else if (title && !id) {
      await addNewWorkout({ title, duration, distance, weight, set, repetition, date, note, completed })
    }
  }

  const onDeleteWorkoutClicked = async (e) => {
    e.preventDefault()
    await deleteWorkout({ id: workout.id })
  }

  return (
    <div className="workoutpage">
      {header}

      <form className="workoutpage__form" >
        <FormControl variant="outlined" fullWidth>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker defaultValue={date} onChange={(e) => setDate(e)} className='workoutpage__input' />
          </LocalizationProvider>
          <FormHelperText>Date</FormHelperText>
        </FormControl>

        <FormControl variant="outlined" fullWidth className='workoutpage__title'>
          <OutlinedInput id="title"
            className='workoutpage__input' value={title} onChange={e => setTitle(e.target.value)} />
          <FormHelperText>Title</FormHelperText>
        </FormControl>

        <FormControl variant="outlined" fullWidth>
          <OutlinedInput id="weight" type="number" endAdornment={<InputAdornment position="end"> kg </InputAdornment>}
            className='workoutpage__input' value={weight} onChange={e => setWeight(e.target.value)} />
          <FormHelperText>Weight</FormHelperText>
        </FormControl>

        <FormControl variant="outlined" fullWidth>
          <OutlinedInput id="set" type="number" endAdornment={<InputAdornment position="end"> set </InputAdornment>}
            className='workoutpage__input' value={set} onChange={e => setSet(e.target.value)} />
          <FormHelperText>Set</FormHelperText>
        </FormControl>

        <FormControl variant="outlined" fullWidth>
          <OutlinedInput id="repetition" type="number" endAdornment={<InputAdornment position="end"> rep </InputAdornment>}
            className='workoutpage__input' value={repetition} onChange={e => setRepetition(e.target.value)} />
          <FormHelperText>Repetition</FormHelperText>
        </FormControl>


        <FormControl variant="outlined" fullWidth>
          <OutlinedInput id="distance" type="number" endAdornment={<InputAdornment position="end"> km </InputAdornment>}
            className='workoutpage__input' value={distance} onChange={e => setDistance(e.target.value)} />
          <FormHelperText>Distance</FormHelperText>
        </FormControl>

        <FormControl variant="outlined" fullWidth>
          <OutlinedInput id="duration" type="number" endAdornment={<InputAdornment position="end"> min </InputAdornment>}
            className='workoutpage__input' value={duration} onChange={e => setDuration(e.target.value)} />
          <FormHelperText>Duration</FormHelperText>
        </FormControl>

        <FormControl variant="outlined" fullWidth>
          <OutlinedInput id="pace" type="number" endAdornment={<InputAdornment position="end"> sec/km </InputAdornment>}
            readOnly className='workoutpage__input' value={pace} />
          <FormHelperText>Pace</FormHelperText>
        </FormControl>

        <FormControl variant="outlined" fullWidth >
          <ToggleButton value="Completed" className="workoutpage__input" fullWidth sx={{ "&.Mui-selected": { backgroundColor: "#d4b5b5" } }}
            selected={completed} onChange={() => { setCompleted(!completed) }}>
            <CheckIcon />
          </ToggleButton>
          <FormHelperText>Completed</FormHelperText>
        </FormControl>

        <div className="workoutpage__note">
          <FormControl variant="outlined" fullWidth >
            <OutlinedInput id="note" multiline rows={1}
              className='workoutpage__input' value={note} onChange={e => setNote(e.target.value)} />
            <FormHelperText>Note</FormHelperText>
          </FormControl>
        </div>

        <div className="workoutpage__buttons">
          <button className="workoutpage__button" title="Save" onClick={onSaveWorkoutClicked}> Save </button>
          <button className="workoutpage__button" title="Delete" disabled={!id} onClick={onDeleteWorkoutClicked}> Delete </button>
        </div>

      </form >


    </div>
  )
}
export default WorkoutPage