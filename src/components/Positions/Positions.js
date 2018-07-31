class PositionsRow extends React.Component {
  render() {
    const {ticker, data} = this.props;
    const positions = Object.keys(data).map((id) => {
      return data[id];
    });

    //Sort positions by acquired date
    positions.sort((a, b) => {
      if (a.dateAcquired.isBefore(b.dateAcquired)) {
        return -1;
      } else if (a.dateAcquired.isAfter(b.dateAcquired)) {
        return 1;
      } else if (a.dateSold.isBefore(b.dateSold)) {
        return -1;
      } else if (a.dateSold.isAfter(b.dateSold)) {
        return 1;
      }
      return 0;
    });

    const row = positions.map((entry) => {
      return (
        <tr key={entry.id}>
          <td>{ticker}</td>
          <td>{entry.dateAcquired.format('YYYY/MM/DD')}</td>
          <td>{entry.dateSold.format('YYYY/MM/DD')}</td>
          <td>{entry.qty}</td>
          <td>${entry.totalCost.toFixed(2)}</td>
          <td className={classnames({
              positive: (entry.shortTermGainLoss + entry.longTermGainLoss) > 0,
              negative: (entry.shortTermGainLoss + entry.longTermGainLoss) < 0,
            })}>${(entry.shortTermGainLoss + entry.longTermGainLoss).toFixed(2)}</td>
          <td className={classnames({
              positive: entry.roi > 0,
              negative: entry.roi < 0,
            })}>{(entry.roi *100).toFixed(1)}%</td>
        </tr>
      );
    });

    return row;
  }
}


class Positions extends React.Component {
  render() {
    const {data} = this.props;
    const renderDataRow = Object.keys(data).map((ticker, index) => {
      return (
        <PositionsRow key={index} data={data[ticker].positions} ticker={ticker} />
      );
    });

    return (
      <div className="container">
        <div className="container-title">Positions breakdown</div>
        <table className="info-table">
          <thead>
            <tr>
              <th>Ticker</th>
              <th>Date opened</th>
              <th>Date closed</th>
              <th>Qty</th>
              <th>Cost</th>
              <th>P/L</th>
              <th>ROI</th>
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

export default Positions;
