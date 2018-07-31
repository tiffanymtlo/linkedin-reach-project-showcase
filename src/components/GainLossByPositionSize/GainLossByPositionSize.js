import {Scatter} from "react-chartjs-2";

class GainLossByPositionSize extends React.Component {
  getChartData(data) {
    const {tickers} = data;
    const allPositions = Object.keys(tickers).reduce((res, ticker) => {
      const tickerData = tickers[ticker];
      const positions = Object.values(tickerData.positions);
      return res.concat(positions);
    }, []);

    const winners = allPositions.filter((position) => {
      return position.shortTermGainLoss + position.longTermGainLoss > 0;
    });
    const losers = allPositions.filter((position) => {
      return position.shortTermGainLoss + position.longTermGainLoss < 0;
    });

    const datasets = [
      {
        data: winners.map((position) => {
          return {
            x: position.totalCost.toFixed(2),
            y: (position.roi * 100).toFixed(2),
          };
        }),
        pointStyle: 'triangle',
        pointBackgroundColor: '#21ce99',
        label: 'winning trades',
      },
      {
        data: losers.map((position) => {
          return {
            x: position.totalCost.toFixed(2),
            y: (position.roi * 100).toFixed(2),
          };
        }),
        pointStyle: 'rect',
        pointBackgroundColor: '#f45531',
        label: 'losing trades',
      },
    ];

    const chartOptions = {
      legend: {
        display: false,
      },
      tooltips: {
        callbacks: {
          label: (tooltipItem, data) => {
            const {xLabel, yLabel} = tooltipItem;
            return `Position size: $${xLabel.toFixed(2)} (ROI: ${yLabel.toFixed(2)}%)`;
          },
        },
      },
      scales: {
          xAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'Position Size',
              },
              ticks: {
                  callback: ((value, index, values) => `$${+value.toFixed(2)}`),
              }
          }],
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: 'ROI',
              },
              ticks: {
                  callback: ((value, index, values) => `${+value.toFixed(2)}%`),
              }
            },
          ],
      },
    };

    return {
      chartData: {
        datasets,
      },
      chartOptions,
    };
  }

  render() {
    const {chartData, chartOptions} = this.getChartData(this.props.data);
    return (
      <div className="container">
        <div className="container-title">ROI vs Position Size</div>
        <Scatter data={chartData} options={chartOptions}/>
      </div>
    );
  }
}

export default GainLossByPositionSize;
