import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DateCalendar } from "@mui/x-date-pickers";
import { useSelector } from 'react-redux'

import { BarChart } from '@mui/x-charts/BarChart'
import dayjs from 'dayjs';

import { selectAllWorkouts } from '../../app/api/workoutsApiSlice'
import './Workout.css'

// https://mui.com/x/api/date-pickers/date-calendar/
const LeftPanel = ({ date, setDate }) => {
  let workouts = useSelector(selectAllWorkouts)

    const today = dayjs()
    workouts = workouts.filter((workout) => today.isSame(workout.date, 'week'))

    const weekly_workouts_count = []
    for (let i = 0; i < 7; i++) {
        const count = workouts.filter((workout) => dayjs(workout.date).day() === i).length
        weekly_workouts_count.push(count)
    }

  return (
    <div className="workout__leftpanel">
      <div className="workout__card">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar 
            views={['year', 'month', 'day']}
            slotProps={{ day: { sx: { "&.MuiPickersDay-root.Mui-selected": { backgroundColor: "#d4b5b5" } } } }}
            value={date}
            onChange={(e) => setDate(e)} />
        </LocalizationProvider>
      </div>


      <h2 className='workout_chart_title'>Weekly Workouts Count</h2>
      <div className="workout__card">
            <BarChart
                width={300}
                height={300}
                series={[{ data: weekly_workouts_count }]}
                xAxis={[{ data: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], scaleType: 'band', tickFontSize: 12 }]}
            />
        </div>
    </div>

  )
}
export default LeftPanel