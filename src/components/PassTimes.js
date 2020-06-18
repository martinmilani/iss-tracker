import React, { useState, useEffect } from "react";
import Predictions from "./Predictions"
import { Button, CardContent, CardActions, Typography, Card, Box, CircularProgress } from "@material-ui/core";

const PassTimes = () => {
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
      if ("geolocation" in navigator) {
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
  }, [clicked])

  if (clicked) {
    if ("geolocation" in navigator) {
      if (error) {
        return <Typography variant="h4" color='secondary' style={{ textAlign: 'center', marginTop: '2.25em', marginBottom: '1em' }}> Error Code =  {error.code} - {error.message}</Typography>
      } else if (!isLoaded) {
        return (
          <Box display="flex" justifyContent="center" alignItems="center" m={2}>
            <CircularProgress />
          </Box>
        )
      } else {
        return (
          <div>
            {<Predictions {...position} />}
          </div>
        )
      }
    } else {
      return <Typography variant="h4" color='secondary' style={{ textAlign: 'center', marginTop: '2.25em', marginBottom: '1em' }}> Geolocalization Not Available</Typography>

    }
  } else {
    return (
      <Card >
        <CardContent >
          <Typography variant="body2" color="textSecondary">The international space station (ISS) is an orbital outpost circling high above out heads.
          Sometimes it’s overhead, but when?
          Allow to get your location to show the next time the ISS will be visible.
          </Typography>
        </CardContent>
        <CardActions >
          <Button onClick={handleClick}>Get you current location</Button>
        </CardActions>
      </Card>
    )

  }

}


export default PassTimes
