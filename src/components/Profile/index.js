import React, { useEffect, useState } from "react";
import "./styles.css";
import {
  Typography,
  Paper,
  Avatar,
  List,
  ListItem,
  Button,
} from "@material-ui/core";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import SearchBar from "../SearchBar";
import CardItem from "../CardItem";
import PersonIcon from "@material-ui/icons/Person";
import withStyles from "@material-ui/core/styles/withStyles";
import firebase from "../firebase";
import { withRouter } from "react-router-dom";

const styles = (theme) => ({
  main: {
    width: "auto",
    display: "block", // Fix IE 11 issue.
    marginLeft: theme.spacing() * 3,
    marginRight: theme.spacing() * 3,
    [theme.breakpoints.up(400 + theme.spacing() * 3 * 2)]: {
      width: 400,
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
  paper: {
    marginTop: theme.spacing() * 8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: `${theme.spacing() * 2}px ${theme.spacing() * 3}px ${
      theme.spacing() * 3
    }px`,
  },
  avatar: {
    margin: theme.spacing(),
    backgroundColor: theme.palette.secondary.main,
  },
  submit: {
    marginTop: theme.spacing() * 3,
  },
});

function Profile(props) {
  const { classes } = props;
  const [isUserLoggedIn, setUserLoggedIn] = useState(true);
  const [typeOfContent, setTypeOfContent] = useState("movies");
  const [profileMovies, setProfileMovies] = useState([]);
  const [profileSeries, setProfileSeries] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);
  const [profilePicture, setProfilePicture] = useState("");
  const [profileName, setProfileName] = useState("");

  const handleTypeOfContent = (event, newTypeOfContent) => {
    setTypeOfContent(newTypeOfContent);
  };

  async function fetchId(id, type) {
    await fetch(
      `https://api.themoviedb.org/3/${type}/${id}?api_key=8acf7117c6859db295df155d5626c31a&language=es-AR&include_image_language=es-AR`
    )
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        if (type === "movie") {
          let aux = profileMovies;
          aux.push(data);
          setProfileMovies(aux);
        } else {
          let aux = profileSeries;
          aux.push(data);
          setProfileSeries(aux);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  async function fetchItemsData(moviesList, seriesList) {
    if (moviesList.length !== 0) {
      moviesList.forEach((movie_id) => {
        fetchId(movie_id, "movie");
      });
    }
    if (seriesList.length !== 0) {
      seriesList.forEach((serie_id) => {
        fetchId(serie_id, "tv");
      });
    }
    setDataFetched(true);
  }

  // eslint-disable-next-line
  useEffect(() => {
    if (!firebase.getCurrentUsername()) {
      setUserLoggedIn(false);
    }
    firebase.getUserLists(props.match.params.id).then((lists) => {
      if (
        !dataFetched &&
        profileMovies.length === 0 &&
        profileSeries.length === 0
      ) {
        fetchItemsData(lists.movies, lists.series);
        firebase.getUserAvatarWithId(props.match.params.id).then((photoURL) => {
          setProfilePicture(photoURL);
        });
        firebase
          .getUserDisplayNameWithId(props.match.params.id)
          .then((displayName) => {
            setProfileName(displayName);
          });
      }
    });

    // eslint-disable-next-line
  });

  async function logout() {
    await firebase.logout();
    props.history.push("/");
  }

  return (
    <main className={classes.main}>
      <Paper className={classes.paper}>
        {profilePicture !== "" ? (
          <Avatar alt="profile" src={profilePicture} className={props.large} />
        ) : (
          <Avatar className={props.purple}>
            <PersonIcon />
          </Avatar>
        )}
        <Typography component="h1" variant="h5" align="center">
          {profileName !== "" ? profileName : "User"}
        </Typography>
        <SearchBar dataFetcher={dataFetched} />
        <br />
        {dataFetched ? (
          <>
            <ToggleButtonGroup
              value={typeOfContent}
              exclusive
              onChange={handleTypeOfContent}
            >
              <ToggleButton value="movies" aria-label="Movies">
                Pelis
              </ToggleButton>
              <ToggleButton value="series" aria-label="Series">
                Series
              </ToggleButton>
            </ToggleButtonGroup>
            <List>
              {typeOfContent === "movies"
                ? profileMovies.map((movie) => (
                    <ListItem key={movie.id}>
                      <CardItem
                        id={movie.id}
                        title={movie.title}
                        overview={movie.overview}
                        poster_path={movie.poster_path}
                        isUserLoggedIn={isUserLoggedIn}
                      />
                    </ListItem>
                  ))
                : profileSeries.map((serie) => (
                    <ListItem key={serie.id}>
                      <CardItem
                        id={serie.id}
                        title={serie.name}
                        overview={serie.overview}
                        poster_path={serie.poster_path}
                        isUserLoggedIn={isUserLoggedIn}
                      />
                    </ListItem>
                  ))}
            </List>
          </>
        ) : (
          <Typography> Cargando contenido </Typography>
        )}
        <Button onClick={logout}> Cerrar Sesión </Button>
      </Paper>
    </main>
  );
}

export default withRouter(withStyles(styles)(Profile));
