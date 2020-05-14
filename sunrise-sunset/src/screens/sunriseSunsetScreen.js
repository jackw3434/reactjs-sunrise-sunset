import React from 'react';
import moment from 'moment';
const WEATHER_API_KEY = "78d5cbbdb2f834933b65513594c422f6";

export default class SunriseSunsetScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lat: "",
            lng: "",
            city: "",
            feelsLikeTempuratureC: "",
            feelsLikeTempuratureF: "",
            temperatureC: "",
            temperatureF: "",
            weatherDescription: "",
            icon: "",
            sunrise: "",
            sunset: "",
        };
    }

    componentDidMount() {
        this.getPosition()
            .then((position) => {
                this.getWeather(position.coords.latitude, position.coords.longitude)
            })
            .catch((err) => {
                console.log("err ", err);
            });
    }

    getPosition = () => {
        return new Promise(function (resolve, reject) {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
    }

    getWeather = async (latitude, longitude) => {
        const api_call = await fetch(`//api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}&units=metric`);
        const data = await api_call.json();              
        this.setState({
            lat: latitude,
            lng: longitude,
            city: data.name,
            feelsLikeTempuratureC: Math.round(data.main.feels_like),
            feelsLikeTempuratureF: Math.round(data.main.feels_like * 1.8 + 32),
            temperatureC: Math.round(data.main.temp),
            temperatureF: Math.round(data.main.temp * 1.8 + 32),
            weatherDescription: data.weather[0].description,
            icon: data.weather[0].icon,
            sunrise: moment.unix(data.sys.sunrise).format("hh:mm a"),
            sunset: moment.unix(data.sys.sunset).format("hh:mm a"),
        })
    }

    render() {
        const { city, temperatureC, temperatureF, icon, sunrise, sunset, weatherDescription, feelsLikeTempuratureC, feelsLikeTempuratureF } = this.state;

        if (city) {
            return (
                <div style={styles.pageContainer}>
                    <p style={styles.title}>Sunrise and Sunset times</p>
                    <div style={styles.locationTextContainer}>
                        <p style={styles.locationText}>Location: {city}</p>
                    </div>
                    <div style={styles.sunriseAndSunsetContainer}>
                        <div style={styles.sunTimeContainer}>
                            <p style={styles.sunTimeLableText}>Sunrise:</p>
                            <p style={styles.weatherValueText}>{sunrise}</p>
                        </div>
                        <div style={styles.sunTimeContainer}>
                            <p style={styles.sunTimeLableText}>Sunset:</p>
                            <p style={styles.weatherValueText}>{sunset}</p>
                        </div>
                    </div>
                    <div style={{ paddingTop: 20 }}>
                        <p style={styles.sunTimeLableText}>Weather Description: '{weatherDescription}'</p>
                        <img src={`http://openweathermap.org/img/w/${icon}.png`} alt="weather icon" />
                        <div style={styles.weatherValueText}>Feels like: {feelsLikeTempuratureC} &deg;C / {feelsLikeTempuratureF} &deg;F</div>
                        <div style={styles.weatherValueText}>Real Temp: {temperatureC} &deg;C / {temperatureF} &deg;F</div>
                    </div>
                </div>
            )
        } else {
            return (
                <h1>Loading...</h1>
            )
        }
    }
}

let styles = {
    pageContainer: {
        backgroundColor: "#36393F", //#5DE5FB
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        textAlign: 'center',
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        color: "white",
    },
    title: {
        fontSize: "48px"
    },
    locationText: {
        fontSize: "36px"
    },
    sunriseAndSunsetContainer: {
        marginTop: 20,
        justifyContent: 'space-evenly',
        width: "30%",
        display: "flex",
        flexDirection: "row"
    },
    sunTimeContainer: {
        width: "40%",
    },
    sunTimeLableText: {
        fontSize: "28px"
    },
    weatherValueText: {
        fontSize: "26px"
    }
}