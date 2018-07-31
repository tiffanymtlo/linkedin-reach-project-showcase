import {Bar} from "react-chartjs-2";

export default class DailyGainLoss extends React.Component {
  render() {
    const {data, options, title} = this.props;

    return (
      <div className={classnames("container winners")}>
        <div className="container-title">{title}</div>
        <Bar data={data} options={options} />
      </div>
    );
  }
}
