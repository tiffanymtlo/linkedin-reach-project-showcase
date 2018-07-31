import React from 'react';
import './Filters.css'
import moment from 'moment';

class Filters extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        fromDate: null,
        toDate: null,
        ticker: null,
      };
  }

  onFiltersApply() {
    this.props.onFiltersChange(this.state);
  }

  onFromDateChange(e) {
    this.setState({
      fromDate: e.target.value ? moment(e.target.value) : null,
    });
  }

  onToDateChange(e) {
    this.setState({
      toDate: e.target.value ? moment(e.target.value) : null,
    });
  }

  onTickerChange(e) {
    this.setState({
      ticker: e.target.value ? e.target.value : null,
    });
  }

  render() {
    return (
      <div className="filtersContainer">
        <div className="filterBox">
          <input placeholder="From date" onChange={this.onFromDateChange.bind(this)} />
        </div>
        <div className="filterBox">
          <input placeholder="To date" onChange={this.onToDateChange.bind(this)} />
        </div>
        <div className="filterBox">
          <input placeholder="Ticker" onChange={this.onTickerChange.bind(this)} />
        </div>
        <div className="filterBox">
          <button onClick={this.onFiltersApply.bind(this)}>Filter</button>
        </div>
    </div>
    );
  }
}

export default Filters;
