import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';

interface IDashboardChartProps {
  runningProjects: number;
  completedProjects: number;
}

const DashboardChart = (props: IDashboardChartProps) => {

  const { t } = useTranslation();
  
  const data = {
    labels: [`${t('app.company.Dashboard.Finished-projects.first-part')} ${t('app.company.Dashboard.Finished-projects.second-part')}`, `${t('app.company.Dashboard.Ongoing-projects.first-part')} ${t('app.company.Dashboard.Ongoing-projects.second-part')}`],
    // labels: ['Completed Projects', 'Running Projects'],
    datasets: [
      {
        data: [props.completedProjects, props.runningProjects],
        backgroundColor: ['#52EC90', '#3484F0'],
        hoverBackgroundColor: ['#52EC90', '#3484F0'],
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
