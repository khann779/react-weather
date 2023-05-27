import React, { useState } from 'react';
import './Components/style.css';
import moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  Title,
  Tooltip,
  LineElement,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement
);

const App = () => {
  const [data, setData] = useState({});
  const [location, setLocation] = useState('');
  const notify = (res) => toast(`${res.statusText}`);

  const [date, setDate] = useState({
    labels: ['12:00', '15:00', '18:00', '21:00', '00:00'],
    datasets: [{ label: 'First Dataset', data: [] }],
  });

  const searchLocation = async (e) => {
    e.preventDefault();
    await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${location}&APPID=6557810176c36fac5f0db536711a6c52`
    ).then(async (res) => {
      console.log(res);
      if (res.status === 200) {
        const data = await res.json();
        setData(data);
        setDate({
          ...date,
          datasets: [
            { data: data.list?.slice(0, 5).map((row) => row.main.temp - 273) },
          ],
        });
      } else {
        notify(res);
      }
    });
  };
  console.log('date => ', date);
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
          <h2>Weather forecast</h2>
        </div>
        <form className='search' onSubmit={searchLocation}>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            type='text'
            placeholder='please, input your city'
          />
          <button className='btn search' onClick={(e) => searchLocation(e)}>
            <i className='bi bi-search'></i>
          </button>
        </form>

        {data.city ? (
          <div className='weather'>
            <div className='weather_today'>
              <div className='today_icon'>
                {data.city ? <i className='bi bi-cloud-drizzle' /> : null}
              </div>
              <div className='today_info'>
                <div className='info_h4'>
                  {data.city ? <h4>Today</h4> : null}
                </div>
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
            <div className='stat'>
              <Line data={date} />
            </div>
          </div>
        ) : null}
      </div>
      <ToastContainer />
    </div>
  );
};

export default App;
