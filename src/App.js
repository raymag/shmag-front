import React, { useState } from 'react';
import axios from 'axios';

import './App.css';

function App() {
  const [url, setUrl] = useState('');
  const [slug, setSlug] = useState('');
  const [shortLink, setShortLink] = useState('');

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

    await axios({
      method: 'post',
      url: api_url,
      headers: {
        'Content-Type': 'application/json'
      },
      data: dataToSend})
      .then(res => {
        setShortLink(`${shortlink_base_url}/${res.data.slug}`);
      })
      .catch(error => {
        setShortLink('Link is Invalid')
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
        <h1>SHMAG</h1>
        <p>Link Shortener</p>
      </div>
    <form id="formHolder" onSubmit={createUrl}>
      
      <div className="input-block">
        <label htmlFor="url">
          Url
        </label>
        <input type="text" onChange={changeUrl} id="url" placeholder="https://example.com" required />
      </div>
      <div className="input-block">
        <label htmlFor="slug">
          Alias <span>*optional</span>
        </label>
        <input type="text" onChange={changeSlug} id="slug" placeholder="example: rxc" />
      </div>
      <button>Shorten</button>
      <div id="short-link-holder" >
        <input type="text" value={shortLink} disabled/>
        <button type="button" onClick={copy}>copy</button>
      </div>
    </form>
    </div>
  );
}

export default App;
