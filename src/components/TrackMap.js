import React, { useState, useEffect } from "react";
import GoogleMapReact from 'google-map-react';
require('dotenv').config();

const ISS_URL = "https://api.wheretheiss.at/v1/satellites/25544"
const IMG = <img src='space-station2.svg' alt="iss" height="30px" />
const SpaceStation = ({ IMG }) => <div>{IMG}</div>
const api_key = process.env.REACT_APP_API_KEY


const TrackMap = () => {

  const [data, setData] = useState({ lat: 0, lng: 0, alt: 0, vel: 0, vis: '' })
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch(ISS_URL)
        .then(res => res.json())
        .then(
          (data) => {
            setIsLoaded(true);
            setData({
              ...data,
              lat: parseFloat(data.latitude),
              lng: parseFloat(data.longitude),
              alt: data.altitude,
              vel: data.velocity,
              vis: data.visibility
            })
          },
          (error) => {
            setIsLoaded(true);
            setError(error);
          }
        )
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const position = [data.lat, data.lng];

  if (error) {
    return <div>Error: {error.message}</div>
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <div>
        <p>Latitutde: {data.lat.toFixed(3)}°</p>
        <p>Longitude: {data.lng.toFixed(3)}°</p>
        <p>Altitude: {data.alt.toFixed(3)} km</p>
        <p>Speed: {data.vel.toFixed(3)} km/h</p>

        <div className="map" style={{ height: '500px', width: '100%' }}>
          <GoogleMapReact className="map"

            bootstrapURLKeys={{ key: api_key }}
            center={position}
            zoom={1}
          >
            <SpaceStation
              lat={data.lat}
              lng={data.lng}
              IMG={IMG}
            />

          </GoogleMapReact>
        </div>
      </div >
    )
  }


}

export default TrackMap