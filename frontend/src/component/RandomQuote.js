import React, { useState, useEffect } from 'react';
import Autosuggest from 'react-autosuggest';

export const RandomQuote = () => {
  const [quote, setQuote] = useState(null);
  const [authors, setAuthors] = useState([]);
  const [authorQuotes, setAuthorQuotes] = useState([]);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const fetchRandomQuote = async () => {
    try {
      let data = null;
      let storedQuote = localStorage.getItem('randomQuote');

      do {
        const response = await fetch('http://localhost:5500/api/quote/randomQuote');
        if (response.ok) {
          data = await response.json();
          // Check if the fetched quote is different from the stored one
          if (data["quoteText"] !== storedQuote) {
            setQuote(data);
            localStorage.setItem('randomQuote', data["quoteText"]);
          }
        } else {
          console.error('Failed to fetch random quote:', response.status);
        }
      } while (data && data["quoteText"] === storedQuote); // Fetch a new quote until it's different from the stored one
    } catch (error) {
      console.error('Error fetching random quote:', error);
    }
  };

  const fetchAuthors = async () => {
    try {
      const response = await fetch('http://localhost:5500/api/quote/authors');
      if (response.ok) {
        const data = await response.json();
        setAuthors(data);
      } else {
        console.error('Failed to fetch authors:', response.status);
      }
    } catch (error) {
      console.error('Error fetching authors:', error);
    }
  };

  useEffect(() => {
    fetchRandomQuote();
    fetchAuthors();
  }, []);

  const handleFetchRandomQuote = () => {
    fetchRandomQuote();
  };

  const fetchQuotesByAuthor = async (author) => {
    try {
      const response = await fetch(`http://localhost:5500/api/quote/getQuoteFromAuthor?authorName=${encodeURIComponent(author)}`);
      if (response.ok) {
        const data = await response.json();
        // Filter out duplicate quotes
        const uniqueQuotes = data.filter((quote, index, self) =>
          index === self.findIndex((q) => (
            q["quoteText"] === quote["quoteText"] && q["author"] === quote["author"]
          ))
        );
        setAuthorQuotes(uniqueQuotes);
        setSelectedAuthor(author);
      } else {
        console.error('Failed to fetch quotes by author:', response.status);
      }
    } catch (error) {
      console.error('Error fetching quotes by author:', error);
    }
  };

  const getSuggestions = (value) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
  
    return inputLength === 0 ? [] : authors.filter(author =>
      author.toLowerCase().includes(inputValue)
    );
  };

  const renderSuggestion = (suggestion) => (
    <div>{suggestion}</div>
  );

  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const onChange = (event, { newValue }) => {
    setValue(newValue);
  };

  const onSuggestionSelected = (event, { suggestionValue }) => {
    fetchQuotesByAuthor(suggestionValue);
  };

  const getSuggestionValue = (suggestion) => suggestion;

  const inputProps = {
    placeholder: 'Search authors...',
    value,
    onChange: onChange,
    style: {
      marginBottom: '10px',
      width: '70%',
      borderRadius: '40px',
      padding: '10px',
      border: '1px solid #ccc'
    }
  };

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#f4f4f4',
      boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.8)',
      borderRadius: '8px',
      maxHeight: '400px',
      overflowY: 'auto',
    }}>
      <h2>Quote of the Day</h2>
      {quote && (
        <div style={{
          marginBottom: '20px',
        }}>
          <p>"{quote["quoteText"]}"</p>
          <p>- {quote["author"]}</p>
        </div>
      )}
      <button onClick={handleFetchRandomQuote} style={{
        cursor: 'pointer',
        backgroundColor: '#007bff',
        color: '#ffffff',
        border: 'none',
        borderRadius: '4px',
        padding: '10px 20px',
        marginBottom: '10px',
        transition: 'background-color 0.3s ease',
      }}>Get New Quote</button>
      <div style={{
        marginBottom: '20px',
      }}>
        <h3>Authors</h3>
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={onSuggestionsFetchRequested}
          onSuggestionsClearRequested={onSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          inputProps={inputProps}
          onSuggestionSelected={onSuggestionSelected}
        />
        {value === '' && (
          <ul style={{
            listStyleType: 'none',
            padding: '0',
          }}>
            {authors.map((author, index) => (
              <li
                key={index}
                onClick={() => fetchQuotesByAuthor(author)}
                style={{
                  cursor: 'pointer',
                  color: 'blue',
                }}
              >
               - {author}
              </li>
            ))}
          </ul>
        )}
      </div>
      {selectedAuthor && (
        <div style={{
          marginBottom: '20px',
        }}>
          <h3>Quotes by Selected Author: {selectedAuthor}</h3>
          {authorQuotes.length > 0 ? (
            <ul style={{
              listStyleType: 'none',
              padding: '0',
            }}>
              {authorQuotes.map((quote, index) => (
                <li key={index} style={{ marginBottom: '10px' }}>
                  "{quote["quoteText"]}"
                </li>
              ))}
            </ul>
          ) : (
            <p>No quotes available for the selected author.</p>
          )}
        </div>
      )}
    </div>
  );
};
