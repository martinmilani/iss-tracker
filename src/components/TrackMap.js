import { CircularProgress, Typography, Box, Grid, Card, CardContent } from '@material-ui/core';
import React, { useState, useEffect } from "react";
import GoogleMapReact from 'google-map-react';
import PassTimes from './PassTimes'
require('dotenv').config();


const ISS_URL = "https://api.wheretheiss.at/v1/satellites/25544"
const IMG = <img src='space-station2.svg' alt="iss" height="30px" />
const SpaceStation = ({ IMG }) => <div>{IMG}</div>
const api_key = process.env.REACT_APP_API_KEY


const TrackMap = () => {

  const [data, setData] = useState({ lat: 0, lng: 0, alt: 0, vel: 0 })
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState(null);

  useEffect(() => {

    const fetchIss = () => {
      fetch(ISS_URL)
        .then(res => res.json())
        .then(
          (data) => {
            setData({
              ...data,
              lat: parseFloat(data.latitude),
              lng: parseFloat(data.longitude),
              alt: parseFloat(data.altitude),
              vel: parseFloat(data.velocity)
            })
            setIsLoaded(true);
          },
          (error) => {
            setIsLoaded(true);
            setError(error);
          }
        )
    }

    fetchIss()

    const interval = () => {
      setInterval(fetchIss, 3000)
    }

    interval()

    return () => clearInterval(interval);

  }, []);

  const position = [data.lat, data.lng];

  if (error) {
    return <div>Error: {error.message}</div>
  } else if (!isLoaded) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" width="100%" height="500px">
        <Box display="block" textAlign="center">
          <CircularProgress />
        </Box>
      </Box>
    )
  } else {
    return (
      <div>
        <Grid container spacing={2} style={{ marginTop: '8px' }} >
          <Grid item xs={12}>
            <Box width="100%" mt={2}>
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
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card style={{ paddingRight: '1em' }}>
              <CardContent>
                <Typography color="textSecondary" variant="subtitle1">
                  Latitude:
                  </Typography>
                <Typography variant="h4" style={{ textAlign: 'right', paddingTop: '0.5em' }}>
                  {data.lat.toFixed(3)}°
                  </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card style={{ paddingRight: '1em' }}>
              <CardContent>
                <Typography color="textSecondary" variant="subtitle1">
                  Longitude:
                  </Typography>
                <Typography variant="h4" style={{ textAlign: 'right', paddingTop: '0.5em' }}>
                  {data.lng.toFixed(3)}°
                  </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card style={{ paddingRight: '1em' }}>
              <CardContent>
                <Typography color="textSecondary" variant="subtitle1">
                  Altitude:
                  </Typography>
                <Typography variant="h4" style={{ textAlign: 'right', paddingTop: '0.5em' }}>
                  {data.alt.toFixed(1)}<span style={{ fontSize: '0.75em' }}> km</span>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card style={{ paddingRight: '1em' }}>
              <CardContent>
                <Typography color="textSecondary" variant="subtitle1">
                  Velocity:
                  </Typography>
                <Typography variant="h4" style={{ textAlign: 'right', paddingTop: '0.5em' }}>
                  {data.vel.toFixed(1)} <span style={{ fontSize: '0.75em' }}> km</span>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} >
            <PassTimes />
          </Grid>

        </Grid>
      </div >
    )
  }


}

export default TrackMap