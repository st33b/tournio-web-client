import Chart from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';
import {eachDayOfInterval, format} from "date-fns";

import classes from '../VisibleTournament.module.scss';
import {chartColors} from "./common";
import {useTournament} from "../../../../director";

const RegistrationTypesWeek = () => {
  const {loading, tournament} = useTournament();
  if (loading) {
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

  const bgColors = chartColors();
  const data = {
    labels,
    datasets: [
      {
        label: 'New Team',
        data: tournament.chart_data.last_week_registration_types.new_team,
        backgroundColor: bgColors[0],
      },
      {
        label: 'Solo',
        data: tournament.chart_data.last_week_registration_types.solo,
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
