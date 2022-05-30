import Chart from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';
import {eachDayOfInterval, format} from "date-fns";

import classes from '../ActiveTournament.module.scss';

const RegistrationTypesWeek = ({tournament}) => {
  if (!tournament) {
    return '';
  }

  const days = eachDayOfInterval(
    { start: new Date(2022, 4, 21), end: new Date(2022, 4, 27) }
  );

  const labels = days.map(d => format(d, 'MMM d'));

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Registration Types",
      },
      legend: {
        display: true,
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  const data = {
    labels,
    datasets: [
      {
        label: 'New Team',
        data: [3, 5, 1, 8, 6, 4, 3],
        backgroundColor: 'rgb(255, 99, 132)',
      },
      {
        label: 'Join a Team',
        data: [1, 0, 2, 1, 3, 0, 2],
        backgroundColor: 'rgb(75, 192, 192)',
      },
      {
        label: 'Solo',
        data: [2, 1, 0, 2, 3, 0, 1],
        backgroundColor: 'rgb(53, 162, 235)',
      },
    ],
  };

  return (
    <div className={classes.Chart}>
      <Bar options={options} data={data} />
    </div>
  );
}

export default RegistrationTypesWeek