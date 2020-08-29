let ctx = document.getElementById('myChart').getContext('2d');
let chart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: stockLabels,
    datasets: [{
      data: stockData
    }]
  },
  options: {
    legend: {
      display: false
    },
    tooltips: {
      enabled: false
    },
    scales: {
      xAxes: [{
        gridLines: {
          display: false
        }
      }]
    },
    elements: {
      point: {
        pointStyle: "dash",
          radius: 0
        },
        line: {
          tension: 0
      }
    }
  }
});
