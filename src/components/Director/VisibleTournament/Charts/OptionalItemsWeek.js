import Chart from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';
import {format} from "date-fns";
import {color} from "chart.js/helpers";

import {chartColors} from "./common";

import classes from '../VisibleTournament.module.scss';

const OptionalItemsWeek = ({tournament, title, dataKeys}) => {
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

  let colorIndex = 0;
  const datasets = [];
  const bgColors = chartColors();
  dataKeys.forEach(dataKey => {
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