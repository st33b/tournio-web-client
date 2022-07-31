import Chart from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';
import {eachDayOfInterval, format} from "date-fns";

import classes from '../ActiveTournament.module.scss';
import {color} from "chart.js/helpers";

const OptionalItemsWeek = ({tournament, title, dataKey}) => {
  if (!tournament) {
    return '';
  }

  const labels = tournament.chart_data.last_week_purchases_by_day.dates.map(dayIso8601 => format(new Date(dayIso8601), 'MMM d'));

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: title,
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

  const bgColors = [
    'rgb(31, 96, 194)', // primary
    'rgb(64, 130, 76)', // success
    'rgb(255, 193, 7)', // warning
    'rgb(191, 46, 60)', // danger
    'rgb(104, 211, 232)', // info
    'rgb(108, 117, 125)', // secondary
  ];

  let colorIndex = 0;
  const datasets = [];
  Object.entries(tournament.chart_data.last_week_purchases_by_day[dataKey]).forEach(pair => {
    const itemIdentifier = pair[0];
    const label = tournament.purchasable_items[dataKey].find(({identifier}) => identifier === itemIdentifier).name;
    datasets.push({
      label: label,
      data: pair[1],
      backgroundColor: bgColors[colorIndex],
    });
    colorIndex++;
  });

  const chartData = {
    labels,
    datasets: datasets,
  };

  return (
    <div className={classes.Chart}>
      <Bar options={options} data={chartData} />
    </div>
  );
}

export default OptionalItemsWeek