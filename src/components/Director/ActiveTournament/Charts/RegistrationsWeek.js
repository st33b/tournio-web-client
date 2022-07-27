import Chart from 'chart.js/auto';
import { Line } from 'react-chartjs-2';
import {eachDayOfInterval, format} from "date-fns";

import classes from '../ActiveTournament.module.scss';

const RegistrationsWeek = ({tournament}) => {
  if (!tournament) {
    return '';
  }

  const labels = Object.keys(tournament.registrations_by_day).map(dayTs => format(new Date(dayTs*1000), 'MMM d'));
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
        data: Object.values(tournament.registrations_by_day),
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

export default RegistrationsWeek