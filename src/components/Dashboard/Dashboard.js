import React from 'react';
import moment from 'moment';
import TotalGainLossChart from '../TotalGainLossChart/TotalGainLossChart';
import Filters from '../Filters/Filters';
import BreakDownChart from '../BreakDownChart/BreakDownChart';
import Positions from '../Positions/Positions';
import SummaryBar from '../SummaryBar/SummaryBar';
import GainLossByPrice from '../GainLossByPrice/GainLossByPrice';
import GainLossByPositionSize from '../GainLossByPositionSize/GainLossByPositionSize';
import BarChart from '../BarChart/BarChart';
import SummaryByTickers from '../SummaryByTickers/SummaryByTickers';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import organizeData from '../../../utils/organizeData';
import calculateTickersSummary from '../../../utils/calculateTickersSummary';
import calculateOverallSummary from '../../../utils/calculateOverallSummary';
import calculateGainLossByTimeIntervals from '../../../utils/calculateGainLossByTimeIntervals';
import calculateTotalGainLossOverTime from '../../../utils/calculateTotalGainLossOverTime';
import getRandomColor from '../../../utils/getRandomColor';
import colors from '../../../utils/colors';
import './Dashboard.css';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filters: {
        fromDate: null,
        toDate: null,
        ticker: null,
      },
      events: props.data.events,
    };
  }

  onFiltersChange(filters) {
    this.setState({
      filters,
    })
  }

  getWinnersChartData(tickersData) {
    const winners = [];

    for (let ticker in tickersData) {
      const tickerData = tickersData[ticker];

      const {
        shortTermGainLoss,
        longTermGainLoss,
      } = tickerData;
      const totalGainLoss = shortTermGainLoss + longTermGainLoss;

      if (totalGainLoss > 0) {
        winners.push({
          ticker,
          totalGainLoss,
        });
      }
    }

    winners.sort((a, b) => {
      return b.totalGainLoss - a.totalGainLoss;
    });

    const data = {
    		labels: winners.map((winner) => winner.ticker),
    		datasets: [{
    				data: winners.map((winner) => winner.totalGainLoss.toFixed(2)),
            backgroundColor: colors.slice(0, winners.length),
    		}]
    };

    const options = {
      legend: {
        position: 'left',
      },
      tooltips: {
        callbacks: {
          label: (tooltipItem, data) => {
            const {index, datasetIndex} = tooltipItem;
            const value = parseFloat(data.datasets[datasetIndex].data[index]);
            return `$${value.toFixed(2)}`;
          },
        },
      },
    };

    return {
      data,
      options,
    };
  }

  getLosersChartData(tickersData) {
    const losers = [];

    for (let ticker in tickersData) {
      const tickerData = tickersData[ticker];
      const {
        shortTermGainLoss,
        longTermGainLoss,
      } = tickerData;
      const totalGainLoss = shortTermGainLoss + longTermGainLoss;

      if (totalGainLoss < 0) {
        losers.push({
          ticker,
          totalGainLoss,
        });
      }
    }

    losers.sort((a, b) => {
      return a.totalGainLoss - b.totalGainLoss;
    });


    const data = {
    		labels: losers.map((loser) => loser.ticker),
    		datasets: [{
    				data: losers.map((loser) => +(loser.totalGainLoss).toFixed(2)),
            backgroundColor: colors.slice(0, losers.length),
    		}]
    };

    const options = {
      legend: {
        position: 'left',
      },
      tooltips: {
        callbacks: {
          label: (tooltipItem, data) => {
            const {index, datasetIndex} = tooltipItem;
            const value = parseFloat(data.datasets[datasetIndex].data[index]);
            return `$${value.toFixed(2)}`;
          },
        },
      },
    };

    return {
      data,
      options,
    };
  }

  getDailyGainLossData(dailyGainLoss) {
    const dates = Object.keys(dailyGainLoss).map((dateString) => {
      return {
        date: dateString,
        value: dailyGainLoss[dateString]
      };
    });

    dates.sort((a, b) => {
      if (a.date < b.date) return -1;
      else if (a.date > b.date) return 1;
      else return 0;
    });

    const data = {
      labels: dates.map((dateEntry) => dateEntry.date),
      datasets: [{
        data: dates.map((dateEntry) => dateEntry.value.toFixed(2)),
        backgroundColor: dates.map((dateEntry) => {
          if (dateEntry.value > 0) return "#21ce99";
          else return "#f45531";
        }),
      }]
    };

    const options = {
      legend: {
        display: false
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
          color: '#4A4FE9',
          scaleLabel: {
            display: false,
            labelString: 'Dates'
          },
          gridLines: {
            display: false,
            color: '#afb5ff',
          },
          ticks: {
            display: false,
          },
        }],
        yAxes: [{
          color: '#4A4FE9',
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

    return {
      data,
      options
    };
  }

  getMonthlyGainLossData(monthlyGainLoss) {
    const dates = [];

    Object.keys(monthlyGainLoss).map((dateString) => {
      dates.push({month: dateString, value: monthlyGainLoss[dateString]});
    });

    dates.sort((a, b) => {
      if (a.month < b.month) return -1;
      else if (a.month > b.month) return 1;
      else return 0;
    });

    const data = {
      labels: dates.map((dateEntry) => dateEntry.month),
      datasets: [{
        data: dates.map((dateEntry) => dateEntry.value.toFixed(2)),
        backgroundColor: dates.map((dateEntry) => {
          if (dateEntry.value > 0) return "#21ce99";
          else return "#f45531";
        }),
      }]
    };

    const options = {
      legend: {
        display: false
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
         scaleLabel: {
           display: false,
           labelString: 'Dates'
         },
         gridLines: {
           display: false,
           color: '#afb5ff',
         }
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

    return {
      data,
      options
    };
  }

  getQuarterlyGainLossData(quarterlyGainLoss) {
    const dates = [];

    Object.keys(quarterlyGainLoss).map((dateString) => {
      dates.push({quarter: dateString, value: quarterlyGainLoss[dateString]});
    });

    dates.sort((a, b) => {
      if (a.quarter < b.quarter) return -1;
      else if (a.quarter > b.quarter) return 1;
      else return 0;
    });

    const data = {
      labels: dates.map((dateEntry) => dateEntry.quarter),
      datasets: [{
        data: dates.map((dateEntry) => dateEntry.value.toFixed(2)),
        backgroundColor: dates.map((dateEntry) => {
          if (dateEntry.value > 0) return "#21ce99";
          else return "#f45531";
        }),
      }]
    };

    const options = {
      legend: {
        display: false
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

    return {
      data,
      options
    };
  }

  getDayOfWeekGainLossData(dayOfWeekGainLoss) {
    const dates = [];

    Object.keys(dayOfWeekGainLoss).map((dayString) => {
      dates.push({day: dayString, value: dayOfWeekGainLoss[dayString]});
    });

    dates.sort((a, b) => {
      if (a.day < b.day) return -1;
      else if (a.day > b.day) return 1;
      else return 0;
    });

    const data = {
      labels: dates.map((dayEntry) => dayEntry.day.slice(1)),
      datasets: [{
        data: dates.map((dayEntry) => dayEntry.value.toFixed(2)),
        backgroundColor: dates.map((dayEntry) => {
          if (dayEntry.value > 0) return "#21ce99";
          else return "#f45531";
        }),
      }]
    };

    const options = {
      legend: {
        display: false
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

    return {
      data,
      options
    };
  }

  render() {
    const {events, filters} = this.state;
    const organizedData = organizeData(events);
    const tickersSummary = calculateTickersSummary(organizedData, filters);
    const overallSummary = calculateOverallSummary(tickersSummary.tickers);
    const gainLossByTimeIntervals = calculateGainLossByTimeIntervals(tickersSummary);
    const totalGainLossOverTime = calculateTotalGainLossOverTime(gainLossByTimeIntervals.dailyGainLoss);
    const {tickers: tickersData} = tickersSummary;
    const {shortTermGainLoss, longTermGainLoss} = overallSummary;

    const {
      data: winnersChartData,
      options: winnersChartOptions,
    } = this.getWinnersChartData(tickersData);

    const {
      data: losersChartData,
      options: losersChartOptions,
    } = this.getLosersChartData(tickersData);

    const {
      data: dailyGainLossChartData,
      options: dailyGainLossChartOptions,
    } = this.getDailyGainLossData(gainLossByTimeIntervals.dailyGainLoss);

    const {
      data: monthlyGainLossChartData,
      options: monthlyGainLossChartOptions,
    } = this.getMonthlyGainLossData(gainLossByTimeIntervals.monthlyGainLoss);

    const {
      data: quarterlyGainLossChartData,
      options: quarterlyGainLossChartOptions,
    } = this.getQuarterlyGainLossData(gainLossByTimeIntervals.quarterlyGainLoss);

    const {
      data: dayOfWeekGainLossChartData,
      options: dayOfWeekGainLossChartOptions,
    } = this.getDayOfWeekGainLossData(gainLossByTimeIntervals.dayOfWeekGainLoss);

    return (
      <div className={classnames('dashboard')}>
        <Filters onFiltersChange={this.onFiltersChange.bind(this)} />
        <TotalGainLossChart totalGainLossOverTime={totalGainLossOverTime} />
        <SummaryBar data={overallSummary} />
        <Tabs selectedTabClassName="dashboardTabTitle--active">
          <TabList className="dashboardTabsTitles">
            <Tab className="dashboardTabTitle">Tickers</Tab>
            <Tab className="dashboardTabTitle">Time</Tab>
            <Tab className="dashboardTabTitle">Distribution</Tab>
            <Tab className="dashboardTabTitle">Winners</Tab>
            <Tab className="dashboardTabTitle">Losers</Tab>
            <Tab className="dashboardTabTitle">Positions</Tab>
          </TabList>
          <TabPanel>
            <SummaryByTickers data={tickersData}/>
          </TabPanel>
          <TabPanel>
            <BarChart title={'Daily P/L'} data={dailyGainLossChartData} options={dailyGainLossChartOptions}/>
            <BarChart title={'Monthly P/L'} data={monthlyGainLossChartData} options={monthlyGainLossChartOptions}/>
            <BarChart title={'Quarterly P/L'} data={quarterlyGainLossChartData} options={quarterlyGainLossChartOptions}/>
            <BarChart title={'Day of the Week P/L'} data={dayOfWeekGainLossChartData} options={dayOfWeekGainLossChartOptions}/>
          </TabPanel>
          <TabPanel>
            <GainLossByPrice data={tickersSummary}/>
            <GainLossByPositionSize data={tickersSummary}/>
          </TabPanel>
          <TabPanel>
            <BreakDownChart title={'Winners'} data={winnersChartData} options={winnersChartOptions}/>
          </TabPanel>
          <TabPanel>
            <BreakDownChart title={'Losers'} data={losersChartData} options={losersChartOptions}/>
          </TabPanel>
          <TabPanel>
            <Positions data={tickersData}/>
          </TabPanel>
        </Tabs>
      </div>
    );
  }
}


export default Dashboard;
