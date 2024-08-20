import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";
import classes from "./Graph.module.css";

export default function LineGraph({ data }) {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue("--text-color");
    const textColorSecondary = documentStyle.getPropertyValue(
      "--text-color-secondary"
    );
    const surfaceBorder = documentStyle.getPropertyValue("--surface-border");
    const graphData = {
      labels: [...data.map((dataItem) => dataItem?.misDate)],
      datasets: [
        {
          label: "Total Revenue",
          data: [...data.map((dataItem) => dataItem?.totalRevenue)],
          fill: false,
          borderColor: documentStyle.getPropertyValue("--red-500"),
          tension: 0.4,
        },
        {
          label: "Renewal Revenue",
          data: [...data.map((dataItem) => dataItem?.renewalsRevenue)],
          fill: false,
          borderColor: documentStyle.getPropertyValue("--blue-500"),
          tension: 0.4,
        },
        {
          label: "Subscription Revenue",
          data: [...data.map((dataItem) => dataItem?.subscriptionRevenue)],
          fill: false,
          borderColor: documentStyle.getPropertyValue("--green-500"),
          tension: 0.4,
        },
      ],
    };
    const options = {
      maintainAspectRatio: false,
      aspectRatio: 0.9,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },

        tooltip: {
          displayColors: false,
          mode: 'index',
          intersect: false,
          // callbacks: {
          //   label: function (tooltipItem) {
          //     const index = tooltipItem.dataIndex;
          //     const totalRevenue = data[index]?.totalRevenue || 0;
          //     const renewalRevenue = data[index]?.renewalsRevenue || 0;
          //     const subscriptionRevenue = data[index]?.subscriptionRevenue || 0;

          //     const labels = [];
          //     labels.push(`Total Revenue: ${totalRevenue}`);
          //     labels.push(`Renewal Revenue: ${renewalRevenue}`);
          //     labels.push(`Subscription Revenue: ${subscriptionRevenue}`);
          //     return labels;
          //   },
          // },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
      },
    };

    setChartData(graphData);
    setChartOptions(options);
  }, [data]);

  return (
    <div className={classes.graph_container}>
      <div className={classes.info_container}>
        <p>Click the below buttons for data filtering in graph.</p>
      </div>
      <Chart type="line" data={chartData} options={chartOptions} />
    </div>
  );
}
