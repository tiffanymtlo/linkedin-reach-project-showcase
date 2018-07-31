import {Pie, Doughnut} from "react-chartjs-2";

class BreakDownChart extends React.Component {
  render() {
    const {data, options, title} = this.props;

    return (
      <div className={classnames("container winners")}>
        <div className="container-title">{title}</div>
        <Doughnut data={data} options={options} />
      </div>
    );
  }
}

export default BreakDownChart;
