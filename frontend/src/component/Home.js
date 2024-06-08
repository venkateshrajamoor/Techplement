// Home.js

import React, { useState, useEffect } from 'react';
import Autosuggest from 'react-autosuggest';
import { RandomQuote } from './RandomQuote';
import { Search } from './Search'; // Import the Search component
import { addPosts as fetchPosts } from './api';

export const Home = () => {
  const handleFetchPosts = async () => {
    const url = 'http://localhost:5500/api';

    try {
      const data = await fetch('https://api.quotable.io/quotes');
      const res = await data.json();
      const quotes = [];

      res.results.forEach(quote => {
        const {content, author} = quote;
        quotes.push({content, author});
      });

      const response = await fetch(`${url}/quote/uploadQuotes`, {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
        },
        body : JSON.stringify(quotes),
      });
      const data2 = await response.json();
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    handleFetchPosts();
  }, []);

  return (
    <div>
      <div style={bgStyle}></div>
      <div style={{...bgStyle, ...bg2Style}}></div>
      <div style={{...bgStyle, ...bg3Style}}></div>
      <div style={contentStyle}>
        {/* <Search /> Render the Search component */}
        <br />
        <br />
        <br />
        <RandomQuote />
      </div>
    </div>
  );
};

const bgStyle = {
  animation: 'slide 3s ease-in-out infinite alternate',
  backgroundColor: '#ADD8E6',
  backgroundImage: "url('abc.jpeg')",
  bottom: '0',
  left: '-50%',
  opacity: '0.5',
  position: 'fixed',
  right: '-50%',
  top: '0',
  zIndex: '-1',
};

const bg2Style = {
  animationDirection: 'alternate-reverse',
  animationDuration: '4s',
};

const bg3Style = {
  animationDuration: '5s',
};

const contentStyle = {
  backgroundColor: 'rgba(red)',
  
  borderRadius: '.25em',
  boxSizing: 'border-box',
  left: '50%',
  padding: '10vmin',
  position: 'fixed',
  textAlign: 'center',
  top: '50%',
  transform: 'translate(-50%, -50%)',
};