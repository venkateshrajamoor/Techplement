// Search.js

import React, { useState } from 'react';

export const Search = () => {
  const [inputText, setInputText] = useState('');
  const [searchedQuotes, setSearchedQuotes] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  const fetchQuotes = async () => {
    try {
      const response = await fetch(`http://localhost:5500/api/quote/search?query=${encodeURIComponent(inputText)}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'GET',
      });
      if (response.ok) {
        const data = await response.json();
        const uniqueQuotes = data.filter((quote, index, self) =>
          index === self.findIndex((q) => (
            q.author === quote.author && q.quoteText === quote.quoteText
          ))
        );
        setErrorMessage(null);
        setSearchedQuotes(uniqueQuotes);
      } else {
        if (response.status === 400) {
          setErrorMessage("No quotes found with this query");
          setSearchedQuotes([]);
        } else if (response.status === 500) {
          setErrorMessage("Internal server error");
          setSearchedQuotes([]);
        }
        console.error('Failed to fetch quotes:', response.status);
      }
    } catch (error) {
      setErrorMessage("Error fetching quotes");
      setSearchedQuotes([]);
      console.error('Error fetching quotes:', error);
    }
  };

  const handleSearch = () => {
    if (inputText.trim() === '') {
      setErrorMessage("Please enter a search query");
      setSearchedQuotes([]);
      return;
    }

    fetchQuotes();
  };

  return (
    <div style={containerStyle} className={`container mt-7 ${searchedQuotes && searchedQuotes.length > 0 ? 'dark-background' : ''}`}>
      <div className="row">
        <div className="col">
          <input
            id="searchInput"
            type="text"
            style={inputStyle}
            className="form-control"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
            placeholder={inputText.trim() === '' ? 'Search by author or quote text...' : ''}
          />
        </div>
      </div>
      {errorMessage && <div className="row mt-3"><div className="col"><p className="text-danger">{errorMessage}</p></div></div>}
      <div className="container mt-3" style={quoteContainerStyle}>
        <div id="quoteResults" className="row" style={{ overflowY: 'auto', maxHeight: '500px' }}>
          {searchedQuotes && searchedQuotes.map((quote, index) => (
            <div key={index} className={`col-md-4 mb-3 card-container`} style={quoteCardStyle}>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title" style={authorStyle}>{quote.author}</h5>
                  <p className="card-text" style={quoteTextStyle}>{quote.quoteText}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const containerStyle = {
  fontFamily: 'Arial, sans-serif',
  maxWidth: '800px', // Adjusted for responsiveness
  width: '90% ', // Adjusted for responsiveness
  margin: '0 auto',
  padding: '20px',
  backgroundColor: 'white',
  position: 'relative',
  overflow: 'hidden',
  borderRadius: '8px',
  boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
  backgroundImage: 'linear-gradient(#ffffff00)',
};

const inputStyle = {
  marginBottom: '10px',
  width: '100%', // Adjusted for responsiveness
  maxWidth: '500px', // Adjusted for responsiveness
  borderRadius: '40px',
  padding: '10px',
  border: '1px solid #ccc',
};

const quoteContainerStyle = {
  marginBottom: '20px',
  maxWidth: '800px', // Adjusted for responsiveness
  width: '100%', // Adjusted for responsiveness
  overflow: 'hidden', // This is necessary to contain the scroll
};

const quoteCardStyle = {
  marginBottom: '20px',
  maxWidth: '300px', // Adjusted for responsiveness
  width: '100%', // Adjusted for responsiveness
};

const authorStyle = {
  fontSize: '18px',
  marginBottom: '10px',
  color: 'black',
};

const quoteTextStyle = {
  fontSize: '14px',
};
