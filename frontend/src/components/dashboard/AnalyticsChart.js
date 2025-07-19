import React from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AnalyticsChart = ({ title, data, type = 'line' }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#1e293b',
          font: { size: 14, weight: 'bold' },
        },
      },
      title: {
        display: !!title,
        text: title,
        color: '#2563eb',
        font: { size: 20, weight: 'bold' },
      },
    },
    scales: {
      x: { ticks: { color: '#64748b' } },
      y: { ticks: { color: '#64748b' } },
    },
  };

  const chartData = {
    labels: data?.labels ?? [],
    datasets: [
      {
        label: data?.label || 'Data',
        data: data?.values ?? [],
        borderColor: type === 'line' ? 'rgb(53, 162, 235)' : 'rgb(75, 192, 192)',
        backgroundColor: type === 'bar' ? 'rgba(75, 192, 192, 0.5)' : 'rgba(53, 162, 235, 0.2)',
        pointBackgroundColor: 'rgb(53, 162, 235)',
        pointRadius: 5,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="backdrop-blur-lg bg-gradient-to-br from-blue-100 via-white to-green-100 p-8 rounded-2xl shadow-2xl border border-white/30 mb-6">
      {type === 'line' ? (
        <Line options={options} data={chartData} />
      ) : (
        <Bar options={options} data={chartData} />
      )}
    </div>
  );
};

export default AnalyticsChart;