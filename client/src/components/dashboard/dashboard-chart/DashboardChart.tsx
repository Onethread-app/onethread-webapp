import React from 'react';
import { Doughnut } from 'react-chartjs-2';

interface IDashboardChartProps {
  runningProjects: number;
  completedProjects: number;
}

const DashboardChart = (props: IDashboardChartProps) => {
  const data = {
    labels: ['Completed Projects', 'Running Projects'],
    datasets: [
      {
        data: [props.completedProjects, props.runningProjects],
        backgroundColor: ['#3484F0', '#52EC90'],
        hoverBackgroundColor: ['#3484F0', '#52EC90'],
      },
    ],
    text: '25%',
  };
  const option = {
    maintainAspectRatio: false,
    responsive: true,
    legend: {
      position: 'right',
      align: 'end',
      labels: {
        usePointStyle: true,
        boxWidth: 10,
      },
    },
  };
  return <Doughnut data={data} options={option} height={50} />;
};

export default DashboardChart;
