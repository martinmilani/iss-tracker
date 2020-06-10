import React, { useState, useEffect } from "react";
import Predictions from "./Predictions"

const PassTimes = () => {
  const [geolocationAvailable, setIsGeolocationAvailable] = useState(null)
  const [position, setPosition] = useState({ lat: null, lng: null })
  const [error, setError] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [clicked, setClicked] = useState(false)

  const handleClick = () => {
    return (
      setClicked(true)
    )
  }

  useEffect(() => {
    if (clicked) {
      "geolocation" in navigator ? setIsGeolocationAvailable(true) : setIsGeolocationAvailable(false)
      if (geolocationAvailable) {
        navigator.geolocation.getCurrentPosition(
          function (position) {
            setPosition({
              ...position,
              lat: position.coords.latitude,
              lng: position.coords.longitude
            })
            setIsLoaded(true);
          },
          function (error) {
            setIsLoaded(true);
            setError({
              ...error,
              code: error.code,
              message: error.message,
            })
          }
        )
      }
    }
  }, [clicked, geolocationAvailable])

  if (clicked) {
    if (geolocationAvailable) {
      if (error) {
        return <h2>Error Code =  {error.code} - {error.message}</h2>
      } else if (!isLoaded) {
        return <div>Loading...</div>;
      } else {
        return (
          <div>
            {<Predictions {...position} />}
          </div>
        )
      }
    } else {
      return <h2>Geolocalization Not Available</h2>
    }
  } else {
    return (
      <div>
        <p>The international space station (ISS) is an orbital outpost circling high above out heads.
        Sometimes it’s overhead, but when? It depends on your location.
        Allow to get your location to show the next time that the ISS will be over your head.
        </p>
        <button onClick={handleClick}>Get you current location</button>
      </div>
    )

  }

}


export default PassTimes
