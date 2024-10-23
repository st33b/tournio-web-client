import Chart from 'chart.js/auto';
import { Line } from 'react-chartjs-2';
import {eachDayOfInterval, format} from "date-fns";

import classes from '../ActiveTournament.module.scss';

const RegistrationsWeekChart = ({tournament}) => {
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
        text: "Last Week's Registrations",
      },
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        suggestedMin: 0,
      },
    },
  };

  const data = {
    labels,
    datasets: [
      {
        label: 'Foo',
        data: [3, 5, 1, 8, 6, 4, 3],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  return (
    <div className={classes.Chart}>
      <Line options={options} data={data} />
    </div>
  );
}

export default RegistrationsWeekChart
