import { useState, useEffect } from "react";
import axios from "axios";

let key = "e7c5b11da593d4107e43a6907c8f2f61";

const Info = ({ country, weatherData }) => {
  return (
    <div>
      <h1>{country.name}</h1>

      <h2>Country Info</h2>
      <p>Capital: {country.capital}</p>
      <p>Population: {country.population}</p>
      <p>Languages</p>
      <ul>
        {country.languages.map((language) => (
          <li key={language.iso639_1}>{language.name}</li>
        ))}
      </ul>
      <br />
      <img
        src={country.flag}
        alt="flag"
        width="100px"
        style={{ border: 1 + "px solid black" }}
      />
      <h2>Weather Data</h2>
      <p>Temperature: {weatherData.temperature} °C</p>
      <p>Local Time: {weatherData.observation_time}</p>
      <img src={weatherData.weather_icons} alt="icon" />
    </div>
  );
};

const App = () => {
  const [query, setQuery] = useState("");
  const [allCountries, setAlCountries] = useState([]);
  const [countries, setCountries] = useState([]);
  const [weatherData, setWeatherData] = useState({});

  useEffect(() => {
    axios.get("https://restcountries.eu/rest/v2/all").then((res) => {
      setAlCountries(res.data);
    });
  }, []);

  useEffect(() => {
    if (countries.length === 1) {
      axios
        .get(
          `http://api.weatherstack.com/current?access_key=${key}&query=${countries[0].name}`
        )
        .then((res) => {
          setWeatherData(res.data.current);
          console.log(res.data.current);
        });
      console.log("render");
    }
  }, [countries]);

  const handleChange = (e) => {
    setQuery(e.target.value);

    setCountries(
      allCountries.filter((countryData) => {
        if (e.target.value.trim() !== "") {
          return (
            countryData.name
              .substring(0, e.target.value.length)
              .toUpperCase() === e.target.value.toUpperCase()
          );
        }
        return false;
      })
    );
  };

  const show = (e) => {
    setQuery(e.target.id);
    setCountries(
      allCountries.filter((countryData) => {
        if (e.target.id.trim() !== "") {
          return (
            countryData.name.substring(0, e.target.id.length).toUpperCase() ===
            e.target.id.toUpperCase()
          );
        }
        return false;
      })
    );
  };

  return (
    <div className="App">
      <h1>Find Country</h1>

      <label htmlFor="find">Find Country </label>
      <input type="text" id="find" value={query} onChange={handleChange} />
      <ul>
        {countries.length === 0 ? (
          <h3>Type something to search</h3>
        ) : countries.length > 10 ? (
          <h3>Too many results</h3>
        ) : countries.length > 1 ? (
          countries.map((country) => (
            <div key={country.alpha2Code}>
              <li>{country.name}</li>
              <button onClick={show} id={country.name}>
                Show
              </button>
            </div>
          ))
        ) : (
          <Info country={countries[0]} weatherData={weatherData} />
        )}
      </ul>
    </div>
  );
};

export default App;
