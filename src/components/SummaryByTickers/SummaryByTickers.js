class TickerClosedPositions extends React.Component {
  render() {
    const {data} = this.props;
    const totalGainLoss = data.shortTermGainLoss + data.longTermGainLoss;
    const winnersAvg = isNaN(data.winnersAvg) ? 0 : data.winnersAvg.toFixed(2);
    const losersAvg = isNaN(data.losersAvg) ? 0 : data.losersAvg.toFixed(2);

    return (
      <tr>
        <td>{data.ticker}</td>
        <td className={classnames(
            {positive: data.shortTermGainLoss > 0, negative: data.shortTermGainLoss < 0}
        )}>${data.shortTermGainLoss.toFixed(2)}</td>
        <td className={classnames(
            {positive: data.longTermGainLoss > 0, negative: data.longTermGainLoss < 0}
        )}>${data.longTermGainLoss.toFixed(2)}</td>
        <td className={classnames(
            {positive: totalGainLoss > 0, negative: totalGainLoss < 0}
        )}>${totalGainLoss.toFixed(2)}</td>
      <td>${winnersAvg}</td>
        <td>${losersAvg}</td>
      </tr>
    );
  }
}

class SummaryByTickers extends React.Component {
  render() {
    const {data} = this.props;
    const renderData = Object.keys(data).map((ticker, index) => {
      return {
        ticker,
        ...data[ticker],
      };
    });

    renderData.sort((a, b) => {
      return (b.shortTermGainLoss + b.longTermGainLoss) - (a.shortTermGainLoss + a.longTermGainLoss);
    });

    const renderDataRow = renderData.map((tickerData, index) => {
      if (tickerData.shortTermGainLoss === 0 && tickerData.longTermGainLoss === 0) {
        return null;
      }
      return (
        <TickerClosedPositions key={index} data={tickerData} />
      );
    });

    return (
      <div className="container">
        <table className="info-table">
          <thead>
            <tr>
              <th>Ticker</th>
              <th>Short term P/L</th>
              <th>Long term P/L</th>
              <th>Total P/L</th>
              <th>Avg winner</th>
              <th>Avg loser</th>
            </tr>
          </thead>
          <tbody>
            {renderDataRow}
          </tbody>
        </table>
      </div>
    );
  }
}

export default SummaryByTickers;
