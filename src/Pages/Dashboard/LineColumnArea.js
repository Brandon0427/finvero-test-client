import React from "react";
import ReactApexChart from "react-apexcharts";


const LineColumnAreaData = {
  options: {
    dataLabels: {
      enabled: false
    },
    chart: {
      stacked: false,
      toolbar: {
        show: false,
      },
    },
    stroke: {
      width: [0, 0.5, 1],
      curve: "smooth",
      dashArray: [0, 8, 5]
    },
    plotOptions: {
      bar: {
        columnWidth: "18%",
      },
    },
    colors: ["#0ab39c", "rgb(251, 77, 83)", "rgba(64, 153, 255, 0.25)",],

    fill: {
      opacity: [0.85, 0.25, 1],
      gradient: {
        inverseColors: false,
        shade: "light",
        type: "vertical",
        opacityFrom: 0.85,
        opacityTo: 0.55,
        stops: [0, 100, 100, 100],
      },
    },
    labels: [
      "Sun",
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat"
    ],
    markers: {
      size: 0,
    },
    legend: {
      offsetY: 11,
    },
    xaxis: {
      type: "month",
    },
    yaxis: {
      title: {
        text: "($)",
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: function (y) {
          if (typeof y !== "undefined") {
            return '$' + y.toFixed(2)
          }
          return y
        },
      },
    },
    grid: {
      borderColor: "#f1f1f1",
    },
  },
}

const LineColumnArea = ({asyncProps}) => {

  return(
    <React.Fragment>
        <ReactApexChart
          options={LineColumnAreaData.options}
          series={asyncProps}
          type="line"
          height="350"
          stacked= "false"
          className="apex-charts"
        />
      </React.Fragment>
  )
}

export default LineColumnArea;