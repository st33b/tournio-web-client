import Chart from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';
import {format} from "date-fns";

import classes from '../ActiveTournament.module.scss';
import {chartColors} from "./common";

const RegistrationTypesWeek = ({tournament}) => {
  if (!tournament) {
    return '';
  }

  const labels = tournament.chartData.lastWeekRegistrationTypes.dates.map(dayIso8601 => format(new Date(dayIso8601), 'MMM d'));

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

  const bgColors = chartColors();
  const data = {
    labels,
    datasets: [
      {
        label: 'New Team',
        data: tournament.chartData.lastWeekRegistrationTypes.new_team,
        backgroundColor: bgColors[0],
      },
      {
        label: 'Solo',
        data: tournament.chartData.lastWeekRegistrationTypes.solo,
        backgroundColor: bgColors[2],
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
