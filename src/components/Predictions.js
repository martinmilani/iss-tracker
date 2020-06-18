import React, { useState, useEffect } from "react"
import Geocode from "react-geocode";
import { Box, CircularProgress, Card, CardContent, Typography, Paper } from "@material-ui/core"

const Predictions = (props) => {
  const [data, setData] = useState({ startUTC: 0, endUTC: 0, duration: 0 })
  const [error, setError] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const PASS_TIMES_URL = `http://www.n2yo.com/rest/v1/satellite/visualpasses/25544/${props.lat}/${props.lng}/0/5/300/&apiKey=${process.env.REACT_APP_API_KEY_N2YO}`
  const [address, setAddress] = useState(null)
  const { lat, lng } = props
  const [passesCount, setPassesCount] = useState(0)


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
    console.log(PASS_TIMES_URL)
    fetch(PASS_TIMES_URL)
      .then(res => res.json())
      .then(
        (data) => {
          if (data.info.passescount > 0) {
            setPassesCount(data.info.passescount)
            setData({
              ...data,
              startUTC: new Date(data.passes[0].startUTC * 1000),
              endUTC: new Date(data.passes[0].endUTC * 1000),
              duration: data.passes[0].duration / 60
            })
          }
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
    return (
      <Box display="flex" justifyContent="center" alignItems="center" m={2}>
        <CircularProgress />
      </Box>
    )
  } else if (passesCount === 0) {
    return (
      <Paper>
        <Typography variant="h4" color='secondary' style={{ textAlign: 'center', padding: '2em' }}>No visual passes on the next 5 days</Typography>
      </Paper>
    )
  } else {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" color="textSecondary">You current position is:</Typography>
          <Typography paragraph={true} variant="body1" color="textSecondary">{address}</Typography>
          <Typography variant="h6" color="textSecondary">Next time ISS is visible</Typography>
          <Typography variant="body1" color="textSecondary">Start: {data.startUTC.toString()} </Typography>
          <Typography variant="body1" color="textSecondary">End:  {data.endUTC.toString()} </Typography>
          <Typography variant="body1" color="textSecondary">Duration: {data.duration} min.</Typography>
        </CardContent>
      </Card>
    )
  }
}

export default Predictions