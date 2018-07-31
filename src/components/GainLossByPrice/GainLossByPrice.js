import {Scatter} from "react-chartjs-2";

class GainLossByPrice extends React.Component {
  getChartData(data) {
    const {tickers} = data;
    const allClosedLots = Object.keys(tickers).reduce((res, ticker) => {
      const tickerData = tickers[ticker];
      return res.concat(tickerData.closedLots);
    }, []);
    const winners = allClosedLots.filter((lot) => lot.gainLoss > 0);
    const losers = allClosedLots.filter((lot) => lot.gainLoss < 0);

    const datasets = [
      {
        data: winners.map((lot) => {
          return {
            x: lot.costBasis.toFixed(2),
            y: lot.gainLoss.toFixed(2),
          };
        }),
        pointStyle: 'triangle',
        pointBackgroundColor: '#21ce99',
        label: 'winning trades',
      },
      {
        data: losers.map((lot) => {
          return {
            x: lot.costBasis.toFixed(2),
            y: lot.gainLoss.toFixed(2),
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
            return `Price: $${xLabel.toFixed(2)} - P/L: $${yLabel.toFixed(2)}`;
          },
        },
      },
      scales: {
          xAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'Ticker Price',
              },
              ticks: {
                  callback: ((value, index, values) => `$${+value.toFixed(2)}`),
              }
          }],
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: 'Total P/L',
              },
              ticks: {
                  callback: ((value, index, values) => `$${+value.toFixed(2)}`),
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
        <div className="container-title">Total P/L vs Ticker Price</div>
        <Scatter data={chartData} options={chartOptions}/>
      </div>
    );
  }
}

export default GainLossByPrice;
