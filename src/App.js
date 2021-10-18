import React from "react";
import "weather-icons/css/weather-icons.css";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Weather from "./components/weather.components";
import Form from "./components/form.component";

const API_key = "b62f4cb98943a2edfc7c19e573d33932";
/** api.openweathermap.org/data/2.5/weather?q=London,uk&appid={API key} */

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      city: undefined,
      country: undefined,
      icon: undefined,
      main: undefined,
      celsius: undefined,
      temp_max: undefined,
      temp_min: undefined,
      humidity: undefined,
      description: "",
      error: false,
      error2: false,
      days: undefined,
    };

    this.weathericon = {
      Thunderstorm: "wi-thunderstorm",
      Drizzle: "wi-sleet",
      Rain: "wi-storm-showers",
      Snow: "wi-snow",
      Atmosphere: "wi-fog",
      Clear: "wi-day-sunny",
      Clouds: "wi-day-fog",
    };
  }

  calCelsius(temp) {
    let cell = Math.floor(temp - 273.15);
    return cell;
  }

  get_Weathericon(icons, rangeID) {
    switch (true) {
      case rangeID >= 200 && rangeID <= 232:
        return this.weathericon.Thunderstorm;
      case rangeID >= 300 && rangeID <= 321:
        return this.weathericon.Drizzle;
      case rangeID >= 500 && rangeID <= 531:
        return this.weathericon.Rain;
      case rangeID >= 600 && rangeID <= 622:
        return this.setState({ icon: this.weathericon.Snow });
      case rangeID >= 701 && rangeID <= 781:
        return this.weathericon.Atmosphere;
      case rangeID === 800:
        return this.weathericon.Clear;
      case rangeID >= 801 && rangeID <= 804:
        return this.weathericon.Clouds;
      default:
        return this.weathericon.Clouds;
    }
  }

  // getWeather = async (e) => {
  //   e.preventDefault();

  //   const city = e.target.elements.city.value;
  //   const country = e.target.elements.country.value;

  //   if (city && country) {
  //     const api_call = await fetch(
  //       `http://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${API_key}`
  //     );
  //     if (api_call.ok) {
  //       const response = await api_call.json();

  //       console.log(response);

  //       this.setState({
  //         city: `${response.name}, ${response.sys.country}`,
  //         celsius: this.calCelsius(response.main.temp),
  //         temp_max: this.calCelsius(response.main.temp_max),
  //         temp_min: this.calCelsius(response.main.temp_min),
  //         description: response.weather[0].description,
  //         humidity: `Humidity: ${response.main.humidity}%`,
  //         error: false,
  //         error2: false,
  //       });
  //       this.get_Weathericon(this.weathericon, response.weather[0].id);
  //     } else {
  //       this.setState({ error2: true });
  //     }
  //   } else {
  //     this.setState({ error: true });
  //   }
  // };

  getWeather = async (e) => {
    e.preventDefault();

    const city = e.target.elements.city.value;
    const country = e.target.elements.country.value;

    if (city && country) {
      const api_call = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city},${country}&appid=${API_key}`
      );

      if (api_call.ok) {
        const response = await api_call.json();

        this.setState({
          city: `${response.city.name}, ${response.city.country}`,
        });

        let i = 0;
        let tab = [];

        while (i < response.list.length) {
          const raw = response.list[i];

          const day = {
            date: raw.dt_txt.split(" ")[0],
            celsius: this.calCelsius(raw.main.temp),
            temp_max: this.calCelsius(raw.main.temp_max),
            temp_min: this.calCelsius(raw.main.temp_min),
            description: raw.weather[0].description,
            humidity: `Humidity: ${raw.main.humidity}%`,
            icon: this.get_Weathericon(this.weathericon, raw.weather[0].id),
          };

          tab.push(day);

          i += 8;
        }

        this.setState({
          days: tab,
          error: false,
          error2: false,
        });
      } else {
        this.setState({ error2: true });
      }
    } else {
      this.setState({ error: true });
    }
  };

  componentDidMount() {
    // interval getWeather

    console.log("MOUNT");
  }

  componentWillUnmount() {
    // clearinteravl
  }

  render() {
    return (
      <div>
        <div className="App">
          <Form
            loadweather={this.getWeather}
            error={this.state.error}
            error2={this.state.error2}
          />
          {this.state.days && (
            <div className="row">
              <div className="name">{this.state.city}</div>
              {this.state.days.map((day, dayIndex) => (
                <div key={dayIndex} className="col">
                  <Weather
                    date={day.date}
                    city={day.city}
                    temp_celsius={day.celsius}
                    temp_max={day.temp_max}
                    temp_min={day.temp_min}
                    description={day.description}
                    weathericon={day.icon}
                    humidity={day.humidity}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default App;
