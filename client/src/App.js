import React, { Component } from 'react';
import axios from 'axios';
import Loader from './Loader';

// import dragndrop from './dragndrop';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      baseURL: 'http://localhost:3001', // change when deploy to glitch
      activeUpload: false,
      data: '',
      error: false,
      errorMsg: '',
      loading: false,
      percentCompleted: 0,
      output: false,
    };

    this.upload = this.upload.bind(this);
  }

  componentDidMount() {
    // add drag & drop support
    const form = document.getElementById('form');
    form.classList.remove('is-error', 'is-success');
    const events = ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'];
    events.forEach((event) => {
      form.addEventListener(event, (e) => {
        e.preventDefault();
        e.stopPropagation();
      });
    });
    ['dragover', 'dragenter'].forEach((event) => {
      form.addEventListener(event, () => {
        form.classList.add('is-dragover');
      });
    });
    ['dragleave', 'dragend', 'drop'].forEach((event) => {
      form.addEventListener(event, () => {
        form.classList.remove('is-dragover');
      });
    });
    form.addEventListener('drop', (e) => {
      this.upload(e.dataTransfer.files[0]);
    });

    // Firefox focus bug fix for file input
    const input = document.getElementById('file');
    input.addEventListener('focus', () => { input.classList.add('has-focus'); });
    input.addEventListener('blur', () => { input.classList.remove('has-focus'); });
  }

  reset(e) {
    e.preventDefault();
    e.stopPropagation();
    document.getElementById('form').classList.remove('is-error', 'is-success', 'is-uploading');
    const newState = { ...this.state }
    newState.output = false;
    newState.data = '';
    this.setState(newState);
  }

  upload(droppedFile) {
    const form = document.getElementById('form');
    form.classList.remove('is-error', 'is-success');
    if (form.classList.contains('is-uploading')) return false;
    form.classList.add('is-uploading');
    const output = document.getElementById('output');
    const config = {
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
        const newState = { ...this.state };
        newState.percentCompleted = percentCompleted;
        this.setState({ ...newState }, () => {
          if (this.state.percentCompleted === 100) {
            form.classList.remove('is-uploading');
          }
        });
      }
    };
    const fileInput = document.getElementById('file');

    if (fileInput.files.length > 0 || droppedFile) {
      const file = fileInput.files[0] || droppedFile;
      const data = new FormData();
      data.append('file', file);
      axios.post(`${this.state.baseURL}/upload`, data, config)
      .then((res) => {
        form.classList.add('is-success');
        const newState = { ...this.state }
        newState.output = true;
        newState.data = res.data;
        this.setState(newState);
      })
      .catch(function (err) {
        form.classList.add('is-error');
        form.classList.remove('is-uploading');
        const errorMsg = form.querySelector('.box__error span');
        errorMsg.textContent = err.message;
        output.className = 'card error';
        output.innerHTML = err.message;
      });
    } else {
      console.log('no files uploaded');
    }
  }

  render() {
    const { error, errorMsg, loading, data } = this.state;
    return (
      <div className="App">
        {loading && <Loader />}
        <header className="head">
          <h1 className="header">
            File Metadata Microservice
          </h1>
          <h2 className="subhead">
            FreeCodeCamp Back End Certification API project #5
          </h2>
        </header>
        <main className="container">
          <div className="row">
            <div className='card' id="user_stories">
              <h3 className="card__title">User stories:</h3>
              <ul>
                <li>I can submit a FormData object that includes a file upload.</li>
                <li>When I submit something, I will receive the file size in bytes within the JSON response</li>
              </ul>
            </div>
          </div>
          <div className="row">
            <div className="card">
              <form
                action={`${this.state.baseURL}/upload`}
                method="post"
                encType="multipart/form-data"
                noValidate
                className="box has-advanced-upload"
                id="form"
              >
                <div className="box__input">
                  <svg className="box__icon" xmlns="http://www.w3.org/2000/svg" width="50" height="43" viewBox="0 0 50 43"><path d="M48.4 26.5c-.9 0-1.7.7-1.7 1.7v11.6h-43.3v-11.6c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v13.2c0 .9.7 1.7 1.7 1.7h46.7c.9 0 1.7-.7 1.7-1.7v-13.2c0-1-.7-1.7-1.7-1.7zm-24.5 6.1c.3.3.8.5 1.2.5.4 0 .9-.2 1.2-.5l10-11.6c.7-.7.7-1.7 0-2.4s-1.7-.7-2.4 0l-7.1 8.3v-25.3c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v25.3l-7.1-8.3c-.7-.7-1.7-.7-2.4 0s-.7 1.7 0 2.4l10 11.6z"/></svg>
                  <input
                    type="file"
                    name="file"
                    id="file"
                    className="box__file"
                    onChange={() => this.upload()}
                  />
                  <label htmlFor="file">
                    <strong>Choose a file</strong>
                    <span className="box__dragndrop"> or drag it here</span>.
                  </label>
                  <button type="submit" className="box__button">Upload</button>
                </div>
                <div className="box__uploading">Uploading&hellip;</div>
                <div className="box__success">Done!<br/ >
                  <button
                    className="box__restart card__action"
                    onClick={(e) => this.reset(e)}
                    >
                    Upload another?
                  </button>
                </div>
                <div className="box__error">Error! <span></span>.
                  <button
                    className="box__restart card__action"
                    onClick={(e) => this.reset(e)}
                    >
                    Try Again?
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div
            id="output"
            className={this.state.output ? 'card left' : 'hidden'}
          >
            <h3 className="card__title center">File Metadata</h3>
            <pre>
              &#123;<br />
              &nbsp;&nbsp;"filename": {data.filename},<br />
              &nbsp;&nbsp;"size": {data.size},<br />
              &nbsp;&nbsp;"type": {data.type}<br />
              &#125;
            </pre>
          </div>
          {error &&
            <div className="row">
              <div className="card">
                  <div className="center error">
                    {errorMsg}
                  </div>
              </div>
            </div>
          }
        </main>
        <footer className="foot">
          <div className="icon__wrap">
            <a className="github" href="https://github.com/rifkegribenes/file-metadata-microservice" target="_blank" rel="noopener noreferrer">
              <img className="github" src="https://cdn.glitch.com/22a70955-ef8c-44b6-9fd7-5377da7be776%2Ficon-github.png?1516058791588" alt="view code on github" />
            </a>
          </div>
        </footer>
      </div>
    );
  }
}

export default App;
