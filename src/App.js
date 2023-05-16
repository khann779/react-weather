import React, { useState } from 'react';
import './Components/style.css';
import moment from 'moment';

const App = () => {
  const [data, setData] = useState({});
  const [location, setLocation] = useState('');

  const searchLocation = async (e) => {
    e.preventDefault();
    const url = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${location}&APPID=6557810176c36fac5f0db536711a6c52`
    );
    if (url) {
      const data = await url.json();
      setData(data);
    }
    setLocation('');
  };

  const week = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  let allDays = [];
  for (let i in data.list) {
    let row = data.list[i];
    if (row.dt_txt.slice(11, 13) === '12') {
      allDays.push(row);
    }
  }

  const days = allDays.slice(1);

  return (
    <div className='App'>
      <div className='container'>
        <div className='h2'>
          {data.city ? <h2>Weather in {data.city.name}</h2> : null}
        </div>

        <form className='search' onSubmit={searchLocation}>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            //onKeyPress={searchLocation}
            type='text'
            placeholder='please, input your city'
          />
          <button className='btn search' onClick={(e) => searchLocation(e)}>
            <i className='bi bi-search'></i>
          </button>
        </form>

        <div className='weather'>
          <div className='weather_today'>
            <div className='today_icon'>
              {data.city ? <i className='bi bi-cloud-drizzle' /> : null}
            </div>
            <div className='today_info'>
              <div className='info_h4'>{data.city ? <h4>Today</h4> : null}</div>
              <div className='city'>
                {data.city ? <h3>{data.city.name}</h3> : null}
              </div>
              <div className='temprature'>
                {allDays.length ? (
                  <h4>
                    Temprature: {Math.ceil(allDays[0].main.temp - 273)} °C
                  </h4>
                ) : null}
              </div>
              <div className='temp_desc'>
                <h4>
                  {allDays.length ? allDays[0].weather[0].description : null}
                </h4>
              </div>
            </div>
          </div>
          <div className='weather_week row'>
            {days.map((item, key) => (
              <div className='col-md-4' key={key}>
                <div className='week_day'>
                  <h4>{week[moment(item.dt_txt).day()]}</h4>
                  <div className='week_icon'>
                    <i className='bi bi-cloud-lightning'></i>
                  </div>
                  <div>
                    <p>{Math.ceil(item.main.temp - 273)} °C</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
