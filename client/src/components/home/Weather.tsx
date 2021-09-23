import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import { getLocation } from 'helpers/utils';

import Clock from 'components/clock/Clock';

interface IWeather {
  userFirstName: string;
}

const Weather = (props: IWeather) => {
  const [weatherData, setWeatherData] = useState({
    temp: localStorage.getItem('temp'),
    condition: localStorage.getItem('condition'),
    iconCode: localStorage.getItem('iconCode'),
    city: localStorage.getItem('city'),
    country: localStorage.getItem('country'),
  });
  const [greeting, setGreeting] = useState('');
  const [currentHour] = useState(
    new Date().getHours().toLocaleString(),
  );
  const [today] = useState(String(new Date().getDate()));

  const storeWeatherInfo = (
    temp,
    condition,
    iconCode,
    city,
    country,
  ) => {
    localStorage.setItem('temp', temp);
    localStorage.setItem('condition', condition);
    localStorage.setItem('iconCode', iconCode);
    localStorage.setItem('city', city);
    localStorage.setItem('country', country);
  };

  const storeLastSavedTime = () => {
    localStorage.setItem(
      'lastSavedHour',
      currentHour.toLocaleString(),
    );
    localStorage.setItem('lastSavedDate', today);
  };

  const getWeatherData = async () => {
    const locationData = await getLocation();
    const cityName = locationData.data.city;
    const url = `//api.openweathermap.org/data/2.5/weather?q=${
      weatherData.city ?? cityName
    }&units=metric&appid=668d583e0514e2243454322c367390ee`;

    const data = await axios.get(url);

    const temp = Math.ceil(data.data.main.temp).toLocaleString();
    const { main, icon } = data.data.weather[0];
    const city = data.data.name;
    const { country } = data.data.sys;
    if (data) {
      setWeatherData({
        temp,
        condition: main,
        iconCode: icon,
        city,
        country,
      });
      storeWeatherInfo(temp, main, icon, city, country);
      storeLastSavedTime();
    }
    return data;
  };

  useEffect(() => {
    const lastSavedHour = localStorage.getItem('lastSavedHour');
    const lastSavedDate = localStorage.getItem('lastSavedDate');
    if (lastSavedDate && lastSavedHour) {
      if (today > lastSavedDate || currentHour > lastSavedHour) {
        getWeatherData();
      }
    } else {
      getWeatherData();
    }
    if (currentHour < String(12)) {
      setGreeting('Good Morning');
    } else if (currentHour < String(17)) {
      setGreeting('Good Afternoon');
    } else setGreeting('Good Evening');
  }, [currentHour]);

  return (
    <div className='weather'>
      <div className='greeting flex flex-column items-start'>
        <div>
          <h3 className='ttc'>
            {greeting}
            ,
            {props.userFirstName}
          </h3>
          <p>Have a fruitful day ahead!</p>
        </div>
        <div className='time'>
          <Clock />
        </div>
      </div>
      <div className='weather-info flex flex-column items-center justify-center self-center'>
        <img
          src={
            weatherData.iconCode
              ? `http://openweathermap.org/img/wn/${weatherData.iconCode}.png`
              : ''
          }
          alt='weather'
        />
        <div className='flex flex-column w-100 tc'>
          <h3>
            {weatherData.temp}
            °c
          </h3>
          <p>{weatherData.condition}</p>
          <p>
            {weatherData.city}
            ,
            {weatherData.country}
          </p>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  userFirstName: state.userReducer.user.firstName,
});

export default connect(mapStateToProps)(Weather);
