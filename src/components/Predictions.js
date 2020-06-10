import React, { useState, useEffect } from "react"
import Geocode from "react-geocode";

const Predictions = (props) => {
  const [data, setData] = useState({ startUTC: null, endUTC: null, duration: null })
  const [error, setError] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const api_key_n2yo = process.env.REACT_APP_API_KEY_N2YO
  const PASS_TIMES_URL = `http://www.n2yo.com/rest/v1/satellite/visualpasses/25544/${props.lat}/${props.lng}/0/1/300/&apiKey=${api_key_n2yo}`
  const [address, setAddress] = useState(null)
  const { lat, lng } = props


  /*Get your current position*/

  useEffect(() => {
    const api_key = process.env.REACT_APP_API_KEY
    Geocode.setApiKey(api_key);
    if (lat && lng) {
      Geocode.fromLatLng(lat, lng).then(
        response => {
          const address = response.results[0].formatted_address;
          setAddress(address)
        },
        error => {
          console.error(error);
        }
      );
    }
  }, [lat, lng])

  /* Get nex time ISS is visible from your position */

  useEffect(() => {
    fetch(PASS_TIMES_URL)
      .then(res => res.json())
      .then(
        (data) => {
          setData({
            ...data,
            startUTC: new Date(data.passes[0].startUTC * 1000),
            endUTC: new Date(data.passes[0].endUTC * 1000),
            duration: data.passes[0].duration / 60
          })
          setIsLoaded(true)
        },
        (error) => {
          setIsLoaded(true);
          setError({
            ...error,
            code: error.code,
            message: error.message,
          })
        }
      )
  }, [PASS_TIMES_URL])

  if (error) {
    return <h2>Error Code =  {error.code} {error.message}</h2>
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <div>
        <h3>You current position is</h3>
        <div>{address}</div>
        <h3>Next time ISS is visible</h3>
        <div>Start: {data.startUTC.toString()}</div>
        <div>End: {data.endUTC.toString()}</div>
        <div>Duration: {data.duration.toFixed(2)}min.</div>
      </div>
    )
  }
}

export default Predictions