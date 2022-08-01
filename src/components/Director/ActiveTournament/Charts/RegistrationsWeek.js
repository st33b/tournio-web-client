import Chart from 'chart.js/auto';
import { Line } from 'react-chartjs-2';
import {eachDayOfInterval, format} from "date-fns";

import classes from '../ActiveTournament.module.scss';

const RegistrationsWeek = ({tournament}) => {
  if (!tournament) {
    return '';
  }

  const labels = tournament.chart_data.last_week_registrations.dates.map(dayIso8601 => format(new Date(dayIso8601), 'MMM d'));
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Last Week's Activity",
      },
      legend: {
        display: true,
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
        label: 'Registrations',
        data: tournament.chart_data.last_week_registrations.values,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Payments',
        data: Object.values(tournament.chart_data.last_week_payments.values),
        borderColor: 'rgb(64, 130, 76)',
        backgroundColor: 'rgba(64, 130, 76, 0.5)',
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