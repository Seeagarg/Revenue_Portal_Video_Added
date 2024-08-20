import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";
import classes from "./Graph.module.css";

export default function VerticalBarGraph({ data }) {
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
          backgroundColor: documentStyle.getPropertyValue("--red-500"),
          borderColor: documentStyle.getPropertyValue("--red-500"),
        },
        {
          label: "Renewal Revenue",
          data: [...data.map((dataItem) => dataItem?.renewalsRevenue)],
          backgroundColor: documentStyle.getPropertyValue("--blue-500"),
          borderColor: documentStyle.getPropertyValue("--blue-500"),
        },
        {
          label: "Subscription Revenue",
          data: [...data.map((dataItem) => dataItem?.subscriptionRevenue)],
          backgroundColor: documentStyle.getPropertyValue("--green-500"),
          borderColor: documentStyle.getPropertyValue("--green-500"),
        },
      ],
    };
    const options = {
      indexAxis: "y",
      maintainAspectRatio: false,
      aspectRatio: 0.3,
      plugins: {
        legend: {
          labels: {
            fontColor: textColor,
          },
        },

        tooltip: {
          displayColors: false,
          mode:"index",
          intersect:true,
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
            font: {
              weight: 500,
            },
          },
          grid: {
            display: false,
            drawBorder: false,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
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
      <Chart type="bar" data={chartData} options={chartOptions} />
    </div>
  );
}
