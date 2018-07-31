import React from 'react';
import Dropzone from 'react-dropzone'
import Papa from 'papaparse';
import './FileUploader.css';

class FileUploader extends React.Component {
  onDrop(accepted, rejected) {
    const {onParseComplete, onFileProcessing} = this.props;
    onFileProcessing();

    Papa.parse(accepted[0], {
      header: true,
      skipEmptyLines: true,
    	complete: (results) => {
        onParseComplete(results);
    	}
    });
  }
  render() {
    return (
      <div className="fileUploader">
        <div className="instructionsPrompt">
          <h2>Analyze your investments on Robinhood in 2 steps:</h2>
          <p>1. Request a CSV export of your activity on Robinhood.</p>
          <p>2. Click <b>'Get Started'</b> to select the CSV file</p>
          <p>Your CSV file is parsed and processed only in your browser. We do not upload or store any of your data.</p>
        </div>
        <div className="uploadActions">
          <Dropzone
            className="dropArea"
            accept={['.xls', '.xlsx', '.csv']}
            onDrop={this.onDrop.bind(this)}
            multiple={false}>
            <button>Get started</button>
          </Dropzone>
          <button onClick={this.props.loadSampleData}>Load sample data</button>
        </div>
      </div>
    );
  }
}

export default FileUploader;
