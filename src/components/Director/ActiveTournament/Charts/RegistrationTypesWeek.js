import Chart from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';
import {eachDayOfInterval, format} from "date-fns";

import classes from '../ActiveTournament.module.scss';

const RegistrationTypesWeek = ({tournament}) => {
  if (!tournament) {
    return '';
  }

  const labels = tournament.chart_data.last_week_registration_types.dates.map(dayIso8601 => format(new Date(dayIso8601), 'MMM d'));

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
        data: tournament.chart_data.last_week_registration_types.new_team,
        backgroundColor: 'rgb(255, 99, 132)',
      },
      {
        label: 'Join a Team',
        data: tournament.chart_data.last_week_registration_types.join_team,
        backgroundColor: 'rgb(75, 192, 192)',
      },
      {
        label: 'Solo',
        data: tournament.chart_data.last_week_registration_types.solo,
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