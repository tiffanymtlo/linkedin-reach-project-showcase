import {Line} from 'react-chartjs-2';
import './TotalGainLossChart.css';

class TotalGainLossChart extends React.Component {
  render() {
    const {totalGainLossOverTime} = this.props;
    let totalGainLoss;
    if (!totalGainLossOverTime.length) {
      totalGainLoss = 0;
    } else {
      totalGainLoss = totalGainLossOverTime[totalGainLossOverTime.length - 1].gainLoss.toFixed(2);
    }
    const lineColor = totalGainLoss > 0 ? '#50D4AB' : '#F1563A';
    const data = {
      labels: totalGainLossOverTime.map((dateEntry) => dateEntry.dateString),
      datasets: [{
        data: totalGainLossOverTime.map((dateEntry) => dateEntry.gainLoss.toFixed(2)),
        fill: true,
        borderColor: lineColor,
        backgroundColor: '#F6F6F6',
        borderWidth: 2,
        pointRadius: totalGainLossOverTime.length > 100 ? 0 : 2,
        pointBorderColor: lineColor,
        pointBackgroundColor: lineColor,
        pointHoverBackgroundColor: lineColor,
        pointHoverBorderColor: lineColor,
      }]
    };

    const options = {
      legend: {
        display: false,
      },
      tooltips: {
        callbacks: {
          label: (tooltipItem, data) => {
            return `$${tooltipItem.yLabel.toFixed(2)}`;
          },
        },
      },
      scales: {
        xAxes: [{
          display: false,
          scaleLabel: {
            display: false,
            labelString: 'Dates'
          },
          gridLines: {
            display: false,
            color: '#afb5ff',
          },
        }],
        yAxes: [{
          scaleLabel: {
            display: false,
            labelString: 'Amount($)'
          },
          gridLines: {
            display: false,
            color: '#afb5ff',
          },
          ticks: {
            callback: (value, index, values) => {
              return `$${value}`;
            },
          },
        }],
       }
    };

    return (
      <div className="totalGainLossChartContainer">
        <div className="totalGainLossSummary">
          <div className={classnames({
              positiveSummary : true,
              negativeSummary : totalGainLoss < 0
            })}>${totalGainLoss}</div>
          <div className="totalGainLossText">Realized P/L</div>
        </div>
        <Line data={data} options={options} />
      </div>
    );
  }
}

export default TotalGainLossChart;
