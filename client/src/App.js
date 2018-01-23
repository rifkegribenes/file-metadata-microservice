import React, { Component } from 'react';
import Loader from './Loader';

import dragndrop from './dragndrop';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeUpload: false,
      data: '',
      error: false,
      errorMsg: '',
      loading: false
    };

    this.upload = this.upload.bind(this);
  }

  componentDidMount() {
    dragndrop(document, window, 0);
  }

  upload(e) {

  }

  render() {
    const { activeUpload, error, errorMsg, loading, data } = this.state;
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
                action="/upload"
                method="post"
                enctype="multipart/form-data"
                novalidate
                className="box"
              >
                <div class="box__input">
                  <svg class="box__icon" xmlns="http://www.w3.org/2000/svg" width="50" height="43" viewBox="0 0 50 43"><path d="M48.4 26.5c-.9 0-1.7.7-1.7 1.7v11.6h-43.3v-11.6c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v13.2c0 .9.7 1.7 1.7 1.7h46.7c.9 0 1.7-.7 1.7-1.7v-13.2c0-1-.7-1.7-1.7-1.7zm-24.5 6.1c.3.3.8.5 1.2.5.4 0 .9-.2 1.2-.5l10-11.6c.7-.7.7-1.7 0-2.4s-1.7-.7-2.4 0l-7.1 8.3v-25.3c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v25.3l-7.1-8.3c-.7-.7-1.7-.7-2.4 0s-.7 1.7 0 2.4l10 11.6z"/></svg>
                  <input
                    type="file"
                    name="files[]"
                    id="file"
                    class="box__file"
                    data-multiple-caption="{count} files selected"
                    multiple
                  />
                  <label for="file">
                    <strong>Choose a file</strong>
                    <span class="box__dragndrop"> or drag it here</span>.
                  </label>
                  <button type="submit" class="box__button">Upload</button>
                </div>
                <div class="box__uploading">Uploading&hellip;</div>
                <div class="box__success">Done!
                  <a href="/upload" class="box__restart" role="button">
                    Upload another?
                  </a>
                </div>
                <div class="box__error">Error! <span></span>.
                  <a href="/upload" class="box__restart" role="button">
                    Try again!</a>
                </div>
              </form>
            </div>
          </div>
          {this.state.data &&
            <div className="row">
              <div className={error ? 'card' : 'card results'}>
                {error ?
                  <div className="center error">
                    {errorMsg}
                  </div> :
                  <div className="json">
                    <pre>{data}</pre>
                  </div>
                }
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
