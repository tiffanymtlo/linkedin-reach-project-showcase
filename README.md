# MerryMen front-end source code

- [Introduction](#introduction)
- [Core functionalities](#core-functionalities)
- [Major components](#components)
    - [App](#app-component)
    - [FileUploader](#fileuploader-component)
    - [Dashboard](#dashboard-component)
    - [TotalGainLossChart](#totalgainlosschart-component)
    - [SummaryBar](#summarybar-component)
    - [SummaryByTickers](#summarybytickers-component)
    - [Positions](#positions-component)
    - [GainLossByPrice and GainLossByPositionSize](#gainlossbyprice-and-gainlossbypositionsize-components)
    - [BarChart and BreakDownChart](#barchart-and-breakdownchart)
- [Tech/Framework used](#technologies-frameworks-and-libraries)


## Introduction

Production app: [www.merrymen.co](http://www.merrymen.co)

MerryMen is a tool for stock traders to analyze their investments' performance. This repo includes source code for the app's front-end before being transpiled by Babel and bundled with Webpack.

To use the app, users can either load the sample data on the app, or request a CSV file from Robinhood support.

## Core functionalities
- Total profit/loss (P/L) over time
- Performance metrics: short-term P/L, long-term P/L, profit factor, expectancy, winning positions average size, losing positions average size, win rate, and loss rate
- P/L breakdown by stock symbol
- P/L breakdown by time frame: daily, monthly, quarterly, and day-of-week
- P/L breakdown by stock price and position size
- Distribution of winning and losing positions
- Ability to filter data by dates and stock symbol

## Components

### `App` component
The `App` component contains the app's header, footer, and the content pane, into where different components is rendered depending on the state of `App` component.

- Before a file is selected, the `FileUploader` component would be rendered in the content area to allow the user to select and upload a CSV file
- While the file is being processed, the `ProgressLoader` component would be rendered to inform the user that the file is being parsed and analyzed
- After the file has been processed, the `Dashboard` component would be displayed

`App` component's `state`:

```
{
  "data": {
    "events": Array // List of trading events
  },
  "processingFile": boolean, // true when the app processes the uploaded file
  "errors": Object // Object containing errors when parsing the file
}
```

### `FileUploader` component
This component includes instructions to get a CSV export file from Robinhood and a `<DropZone>` component so the user can select the file

`FileUploader` component's `props`:

```
{
  "loadSampleData": Function, // Callback function to invoke when user clicks the 'Load sample data' button
  "onFileProcessing": Function, // Callback function to invoke when the app parses the selected file
  "onParseComplete": Function, // Callback function to invoke when the app finished parsing the selected file
}
```

### `Dashboard` component
This component sets up the dashboard for investment performance analysis. It applies filters to the data set, processes calculations and passes the data needed to other components for them to render correctly. It takes in an object `data` as `props` of the `Dashboard` component. The `data` object holds the sanitized (unfiltered) transaction data in a standard format.

`Dashboard` component's sample `props`:

```
{
  "data": {
    "events": [ // List of all trading events
      {
        "id": "92bdd71c-1743-44b3-bc8b-5269241c076d",
        "ticker": "NVDA",
        "description": "NVIDIA CORP --- UNSOLICITED",
        "qty": 1,
        "netAmount": -100,
        "fees": 0,
        "price": 100,
        "tradeDate": "2017-01-03T08:00:00.000Z",
        "settleDate": "2017-01-06T08:00:00.000Z",
        "timestamp": "2017-01-03T20:44:43.000Z",
        "tradeAction": "BUY",
        "type": "TRADES"
      }, // A trading event object
      {
        "id": "ba2bc7a9-4329-4a2d-b1da-07e6870dc2cd",
        "ticker": "AMZN",
        "description": "AMAZON.COM INC --- UNSOLICITED",
        "qty": 15,
        "netAmount": -11275.05,
        "fees": 0,
        "price": 751.6699,
        "tradeDate": "2017-01-03T08:00:00.000Z",
        "settleDate": "2017-01-06T08:00:00.000Z",
        "timestamp": "2017-01-03T21:21:58.000Z",
        "tradeAction": "BUY",
        "type": "TRADES"
      },
      ...
    ],
  },
}
```

`Dashboard` component's `state`:

```
{
  "filters": {
    "fromDate": Moment, // Only count events after this date
    "toDate": Moment, // Only count events before this date
    "ticker": string, // Only count events for this stock ticker (symbol)
  },
}
```

### `TotalGainLossChart` component
This component displays the accumulated gain/loss overtime in a line chart

`TotalGainLossChart` sample `props`:

```
{
  "totalGainLossOverTime": [
    {
      "dateString": "2015/04/06",
      "gainLoss": 347.8799999999999
    },
    {
      "dateString": "2015/06/24",
      "gainLoss": 414.27999999999963
    },
    {
      "dateString": "2015/06/25",
      "gainLoss": -14.27999999999963
    },
  ],
}
```

![TotalGainLossChart component](https://github.com/tiffanymtlo/linkedin-reach-project-showcase/blob/master/images/TotalGainLossChart.png)


### `SummaryBar` component
This component displays the performance metrics for the given data. The `props` for this component is an object containing pre-computed performance metrics.

Sample `props`:

```
{
  "data": {
    "shortTermGainLoss": 2461.401499999998,
    "longTermGainLoss": 0,
    "totalTradeCount": 53,
    "winnersSum": 3790.432999999998,
    "winnersCount": 26,
    "winnersAvg": 145.78588461538453,
    "losersSum": -1329.0315000000012,
    "losersCount": 27,
    "losersAvg": -49.223388888888934,
    "winRate": 0.49056603773584906,
    "loseRate": 0.5094339622641509,
    "profitFactor": 2.852026456859747,
    "expectancy": 46.441537735848996
  },
}
```

![SummaryBar component](https://github.com/tiffanymtlo/linkedin-reach-project-showcase/blob/master/images/SummaryBar.png)

### `SummaryByTickers` component
This component displays each ticker included in the data and its short-term and long-term P/L, as well as the average amount for its winning positions and losing positions

Sample `props`:

```
{
  "data": {
    "AAPL": {
      "openLots": [],
      "closedLots": [
        {
          "buyEventId": "a94ef0f0-4041-4d04-9c29-e1ed0ae29ad7",
          "sellEventId": "08ac829b-a03a-43f1-893e-a3f30aa1664a",
          "dateAcquired": "2016-12-28T08:00:00.000Z",
          "dateSold": "2017-01-05T08:00:00.000Z",
          "qty": 35,
          "costBasis": 117.58,
          "price": 116.4501,
          "daysHeld": 8,
          "gainLoss": -39.546499999999725,
          "isLongTermGainLoss": false
        },
        ...
      ],
      "totalQty": 0,
      "isOption": false,
      "longTermGainLoss": 0,
      "shortTermGainLoss": -39.546499999999725,
      "positions": {
        "a94ef0f0-4041-4d04-9c29-e1ed0ae29ad7": {
          "id": "a94ef0f0-4041-4d04-9c29-e1ed0ae29ad7",
          "qty": 35,
          "dateAcquired": "2016-12-28T08:00:00.000Z",
          "shortTermGainLoss": -39.546499999999725,
          "longTermGainLoss": 0,
          "totalCost": 4115.3,
          "dateSold": "2017-01-05T08:00:00.000Z",
          "roi": -0.009609627487667903
        }
      },
      "roi": -0.009609627487667903,
      "totalTradeCount": 1,
      "totalDaysHeld": 8,
      "dailyGainLoss": -4.943312499999966,
      "winnersSum": 0,
      "winnersCount": 0,
      "winRate": 0,
      "winnersAvg": null,
      "winnersMax": null,
      "winnersMin": null,
      "losersCount": 1,
      "losersSum": -39.546499999999725,
      "loseRate": 1,
      "losersAvg": -39.546499999999725,
      "losersMax": -39.546499999999725,
      "losersMin": -39.546499999999725,
      "profitFactor": null
    },
    "AMZN": {
      "openLots": [
        {
          "dateAcquired": "2018-07-11T07:00:00.000Z",
          "costBasis": 1749.76,
          "qty": 6,
          "buyEventId": "a7cd7e57-9749-4028-b6ad-ae66aa1e49cf",
          "netAmount": 10498.56
        }
      ],
      "closedLots": [
        {
          "buyEventId": "9d396235-15f6-4391-ac7e-5b62681ad56e",
          "sellEventId": "2ea8edb8-29d2-4b5f-b30f-f76af717c7b7",
          "dateAcquired": "2016-12-23T08:00:00.000Z",
          "dateSold": "2017-01-04T08:00:00.000Z",
          "qty": 10,
          "costBasis": 761.0408,
          "price": 757.5501,
          "daysHeld": 12,
          "gainLoss": -34.90699999999947,
          "isLongTermGainLoss": false
        },
      ],
      "totalQty": 6,
      "isOption": false,
      "longTermGainLoss": 0,
      "shortTermGainLoss": 4415.158500000007,
      "positions": {
        "9d396235-15f6-4391-ac7e-5b62681ad56e": {
          "id": "9d396235-15f6-4391-ac7e-5b62681ad56e",
          "qty": 10,
          "dateAcquired": "2016-12-23T08:00:00.000Z",
          "shortTermGainLoss": -34.90699999999947,
          "longTermGainLoss": 0,
          "totalCost": 7610.407999999999,
          "dateSold": "2017-01-04T08:00:00.000Z",
          "roi": -0.0045867448893672285
        },
      },
      "roi": 0.017670229040390333,
      "totalTradeCount": 16,
      "totalDaysHeld": 38,
      "dailyGainLoss": 116.18838157894754,
      "winnersSum": 5317.855900000002,
      "winnersCount": 9,
      "winRate": 0.5625,
      "winnersAvg": 590.8728777777781,
      "winnersMax": 2245.8916000000017,
      "winnersMin": 136.44600000000037,
      "losersCount": 7,
      "losersSum": -902.697399999997,
      "loseRate": 0.4375,
      "losersAvg": -128.956771428571,
      "losersMax": -4.6469999999999345,
      "losersMin": -310.3484999999995,
      "profitFactor": 5.891072578695829
    },
  },
}
```

![SummaryByTickers component](https://github.com/tiffanymtlo/linkedin-reach-project-showcase/blob/master/images/SummaryByTickers.png)

### `Positions` component
This component displays closed positions for each stock symbol. Fields displayed include: date opened, date closed, quantity, cost, profit/loss and ROI

`props` for this component is the same as [`SummaryByTickers`](#summarybytickers-component) component's `props`

![Positions component](https://github.com/tiffanymtlo/linkedin-reach-project-showcase/blob/master/images/Positions.png)

### `GainLossByPrice` and `GainLossByPositionSize` components
These components display scatter plots to show the distribution of investments' returns in related to ticker price and position size

1. **Total Profit/Loss(P/L) vs. Ticker Price**: Shows how ticker price corresponds to total P/L  
2. **Return On Investment (ROI) vs. Position Size**: Shows how position size corresponds to ROI.

Sample `props`:

```
{
  "tickers": {
    "AAPL": {
      ...
      "positions": {
        "bdb979d4-30e4-44b5-ba6c-573164beae08": {
          "id": "bdb979d4-30e4-44b5-ba6c-573164beae08",
          "qty": 20,
          "dateAcquired": "2014-04-07T07:00:00.000Z",
          "shortTermGainLoss": 346.9999999999999,
          "longTermGainLoss": 0,
          "totalCost": 2198,
          "dateSold": "2015-04-06T07:00:00.000Z",
          "roi": 0.15787079162875337
        },
        "1212e0fd-a57a-4b6f-aabe-133482d416a8": {
          "id": "1212e0fd-a57a-4b6f-aabe-133482d416a8",
          "qty": 31,
          "dateAcquired": "2015-03-23T07:00:00.000Z",
          "shortTermGainLoss": 44.47999999999983,
          "longTermGainLoss": 0,
          "totalCost": 3942.2700000000004,
          "dateSold": "2015-06-24T07:00:00.000Z",
          "roi": 0.011282839582271085
        },
      },
    },
    "AMZN": {...},
    ...
  }
}
```
![GainLossByPrice and GainLossByPositionSize components](https://github.com/tiffanymtlo/linkedin-reach-project-showcase/blob/master/images/GainLossByPriceAndGainLossByPositionSize.png)

### `BarChart` and `BreakDownChart` components
- `BarChart` component: This component displays a bar chart to show the P/L over different time frames
- `BreakDownChart` component: This component displays a doughnut chart to show the breakdown of winning stocks and losing stocks

Sample `props`: 
```
{
  "title": String, // Title of chart
  "data": Object, // Object containing chart data
  "options": Object // Object containing chart options
}
```
![BarChart component](https://github.com/tiffanymtlo/linkedin-reach-project-showcase/blob/master/images/BarChart.png)
![BreakDownChart component](https://github.com/tiffanymtlo/linkedin-reach-project-showcase/blob/master/images/BreakdownChart.png)

## Technologies, frameworks and libraries
- HTML/CSS
- ES6
- ReactJS (https://reactjs.org/)
- Babel (https://babeljs.io/)
- Webpack (https://webpack.js.org/)
- `react-chartjs-2`(https://github.com/jerairrest/react-chartjs-2)
- Moment.js (https://momentjs.com/)
- `react-tabs` (https://github.com/reactjs/react-tabs)
- Papa Parse (https://www.papaparse.com/)
- `react-dropzone` (https://github.com/react-dropzone/react-dropzone)
