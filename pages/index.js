import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "../styles/app.module.css";

const API_KEY = "bdecce71774dcdd158c44f4096aa85bd";

export default function App() {
  const [day, setDay] = useState(0);
  const [data, setData] = useState(null);
  const [location, setLocation] = useState({
    lon: 121.47,
    lat: 31.23,
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLocation({
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      });
    });
  }, []);

  useEffect(async () => {
    const { daily, current, timezone } = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${location.lat}&lon=${location.lon}&appid=${API_KEY}`
    ).then((res) => res.json());

    setData({
      daily,
      current: parseInt(current.temp - 273.15),
      location: timezone,
    });
  }, [location]);

  if (!data) return <div>loading</div>;

  const { daily } = data;
  const range = [
    `${parseInt(daily[day].temp.max - 273.15)}°`,
    `${parseInt(daily[day].temp.min - 273.15)}°`,
  ];
  const description = daily[day].weather[0].description;
  const icon = daily[day].weather[0].icon;
  const items = daily.map((item) => {
    const date = new Date(item.dt * 1000);
    return {
      date: `${date.getMonth() + 1} / ${date.getDate()}`,
      weather: item.weather[0].main,
      icon: item.weather[0].icon,
      range: [
        `${parseInt(item.temp.max - 273.15)}°`,
        `${parseInt(item.temp.min - 273.15)}°`,
      ],
    };
  });

  return (
    <div className={styles.app}>
      <div className={styles.card}>
        <div className={styles.location}>{data.location}</div>
        <div className={styles.wrapper}>
          <div className={styles.icon}>
            <Image
              width={50}
              height={50}
              src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
            />
          </div>
          {day === 0 && <div className={styles.current}>{data.current}°</div>}
        </div>
        <div className={styles.range}>{range.join("/")}</div>
        <div className={styles.description}>{description}</div>
      </div>
      <div className={styles.week}>
        {items.map((item, index) => (
          <div
            key={item.date}
            onClick={() => setDay(index)}
            className={styles.day}
          >
            <div className={styles.item}>{item.date}</div>
            <div className={styles.item}>
              {" "}
              <Image
                width={50}
                height={50}
                src={`https://openweathermap.org/img/wn/${item.icon}@2x.png`}
              />
            </div>
            <div className={styles.item}>{item.weather}</div>
            <div className={styles.item}>{item.range.join("/")}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
