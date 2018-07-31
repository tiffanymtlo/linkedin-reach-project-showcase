import React, { Component } from 'react';
import Dashboard from './components/Dashboard/Dashboard';
import FileUploader from './components/FileUploader/FileUploader';
import ProgressLoader from './components/ProgressLoader/ProgressLoader';
import cleanUpData from '../utils/cleanUpData';
import './app.css';
import './shared/table.css';
import './shared/container.css';

class AppHeader extends Component {
  render() {
    return (
      <div className="appHeader">
        <a className="logo" href="/"><b>Merry</b>Men</a>
        <p className="tagline">Your Robinhood companion</p>
      </div>
    );
  }
}

class AppFooter extends Component {
  render() {
    return (
      <div className="appFooter">
        MerryMen © 2017<br/><br/>
        Built with &hearts; by <a target="blank" href="https://www.linkedin.com/in/tiffanymtlo/">Tiffany</a> & <a target="blank" href="https://www.linkedin.com/in/sipham/">Si</a>.
      </div>
    );
  }
}

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      processingFile: false,
    };
  }

  onFileProcessing() {
    this.setState({
      processingFile: true,
    });
  }

  loadSampleData() {
    this.onFileProcessing();
    fetch("/data")
      .then(res => res.json())
      .then(data => this.onFileUploadSuccess(data));
  }

  onFileUploadSuccess(parsedResult) {
    if (!parsedResult.errors.length) {
      const events = cleanUpData(parsedResult);

      this.setState({
        processingFile: false,
        data: {
          events,
        },
      });
    } else {
      this.setState({
        processingFile: false,
        data: null,
        errors: parsedResult.errors,
      });
    }
  }

  render() {
    const {data, processingFile} = this.state;
    return (
      <div className="appContainer">
        <AppHeader/>
        <div className="content">
          {processingFile && <ProgressLoader/>}
          {!processingFile && data && (<Dashboard data={data}/>)}
          {!processingFile && !data &&
            (<FileUploader
              loadSampleData={this.loadSampleData.bind(this)}
              onFileProcessing={this.onFileProcessing.bind(this)}
              onParseComplete={this.onFileUploadSuccess.bind(this)} />)
          }
        </div>
        <AppFooter/>
      </div>
    );
  }
}
