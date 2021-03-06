import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './styles.css';

const loadingIcon = require('../../assets/configuration.png');

function App() {
  const [url, setUrl] = useState('');
  const [slug, setSlug] = useState('');
  const [shortLink, setShortLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const qParams = window.location.search;
    if(qParams.includes('?q=')){
      window.location.href = `https://shmag.herokuapp.com/${qParams.split('?q=')[1]}`;
    }
  });

  const createUrl = async (e) => {
    e.preventDefault();
    const bt = document.querySelector('#short-link-holder button');
    bt.innerText = 'copy';
    const dataToSend = {}
    dataToSend["url"] = url;
    if(slug !== ''){
      dataToSend["slug"] = slug;
    }
    
    let api_url = process.env.NODE_ENV === 'production' ? 'https://shmag.herokuapp.com/url' : 'http://192.168.31.152:5000/url';
    let shortlink_base_url = process.env.NODE_ENV === 'production' ? 'https://shmag.netlify.app' : 'localhost:5000';

    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url,
      headers: {
        'Content-Type': 'application/json'
      },
      data: dataToSend})
      .then(res => {
        setShortLink(`${shortlink_base_url}?q=${res.data.slug}`);
        setIsLoading(false);
      })
      .catch(error => {
        setShortLink('Link is Invalid');
        setIsLoading(false);
        console.log(`error: ${error}`);
      });
  }

  const changeUrl = (e) => {
    setUrl(e.target.value);
  }

  const changeSlug = (e) => {
    setSlug(e.target.value);
  }

  const copy = (e) => {
    e.target.innerHTML = 'copied';
    navigator.clipboard.writeText(shortLink);
  }

  return (
    <div id="app">
      <div className="logo">
        <h1><a href="https://raymag.github.io">SHMAG</a></h1>
        <p>URL Shortener</p>
      </div>
    <form id="formHolder" onSubmit={createUrl}>
      
      <div className="input-block">
        <label htmlFor="url">
          URL
        </label>
        <input type="text" onChange={changeUrl} id="url" placeholder="https://example.com" required />
      </div>
      <div className="input-block">
        <label htmlFor="slug">
          Alias <span>*optional</span>
        </label>
        <input type="text" onChange={changeSlug} id="slug" placeholder="example: rxc" />
      </div>
        <button>{ isLoading ? (<img src={loadingIcon} className="loading-icon" alt="loading"/>) : 'Shorten' }</button>
      <div id="short-link-holder" >
        <input type="text" value={shortLink} disabled/>
        <button type="button" onClick={copy}>copy</button>
      </div>
    </form>
    </div>
  );
}

export default App;
