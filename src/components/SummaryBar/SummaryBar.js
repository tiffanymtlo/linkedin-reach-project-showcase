import './SummaryBar.css';

class SummaryBar extends React.Component {
  render() {
    const {data} = this.props;
    const shortTermGainLoss = data.shortTermGainLoss.toFixed(2);
    const longTermGainLoss = data.longTermGainLoss.toFixed(2);
    const profitFactor = data.profitFactor.toFixed(2);
    const expectancy = data.expectancy.toFixed(2);
    const winnersAvg = data.winnersAvg.toFixed(2);
    const losersAvg = data.losersAvg.toFixed(2);
    const winRate = (data.winRate * 100).toFixed(2);
    const loseRate = (data.loseRate * 100).toFixed(2);

    return (
      <div className="summaryBarContainer">
        <div className="summaryBarRow">
          <div className="summaryBarCell">
            <p className="summaryBarCellTitle">Short term P/L</p>
            <p className={classnames('summaryBarCellValue', {
                positive: shortTermGainLoss > 0,
                negative: shortTermGainLoss < 0
              })}>${shortTermGainLoss}</p>
          </div>
          <div className="summaryBarCell">
            <p className="summaryBarCellTitle">Long term P/L</p>
            <p className={classnames('summaryBarCellValue', {
                positive: longTermGainLoss > 0,
                negative: longTermGainLoss < 0
              })}>${longTermGainLoss}</p>
          </div>
          <div className="summaryBarCell">
            <p className="summaryBarCellTitle">Profit factor</p>
            <p className={classnames('summaryBarCellValue', {
                positive: profitFactor > 1,
                negative: profitFactor < 1
              })}>{isNaN(profitFactor) ? 0 : profitFactor}</p>
          </div>
          <div className="summaryBarCell">
            <p className="summaryBarCellTitle">Expectancy</p>
            <p className={classnames('summaryBarCellValue', {
                positive: expectancy > 0,
                negative: expectancy < 0
              })}>${isNaN(expectancy) ? 0 : expectancy}</p>
          </div>
        </div>
        <div className="summaryBarRow">
          <div className="summaryBarCell">
            <p className="summaryBarCellTitle">Avg winner</p>
            <p className={classnames('summaryBarCellValue', {
                positive: winnersAvg > 0,
                negative: winnersAvg < 0
              })}>${isNaN(winnersAvg) ? 0 : winnersAvg}</p>
          </div>
          <div className="summaryBarCell">
            <p className="summaryBarCellTitle">Avg loser</p>
            <p className={classnames('summaryBarCellValue', {
                positive: losersAvg > 0,
                negative: losersAvg < 0
              })}>${isNaN(losersAvg) ? 0 : losersAvg}</p>
          </div>
          <div className="summaryBarCell">
            <p className="summaryBarCellTitle">Win rate</p>
            <p className="summaryBarCellValue positive">
              {isNaN(winRate) ? 0 : winRate}%
            </p>
          </div>
          <div className="summaryBarCell">
            <p className="summaryBarCellTitle">Loss rate</p>
            <p className="summaryBarCellValue negative">
              {isNaN(loseRate) ? 0 : loseRate}%
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default SummaryBar;
