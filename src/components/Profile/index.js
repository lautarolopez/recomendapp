import React, { useEffect, useState } from "react";
import "./styles.css";
import {
  Typography,
  Paper,
  Avatar,
  List,
  ListItem,
  Fab,
} from "@material-ui/core";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import SearchBar from "../SearchBar";
import CardItem from "../CardItem";
import HeadBar from "../HeadBar";
import PersonIcon from "@material-ui/icons/Person";
import ShareIcon from "@material-ui/icons/Share";
import withStyles from "@material-ui/core/styles/withStyles";
import firebase from "../firebase";
import { withRouter } from "react-router-dom";

const styles = (theme) => ({
  main: {
    width: "100%",
    display: "block",
  },
  paper: {
    display: "flex",
    height: "auto",
    flexDirection: "column",
    alignItems: "center",
    padding: "30px 24px 24px",
  },
  avatar: {
    margin: theme.spacing(),
    backgroundColor: theme.palette.secondary.main,
  },
  submit: {
    marginTop: theme.spacing() * 3,
  },
  toggleSticky: {
    position: "sticky",
    top: "15px",
    zIndex: 15,
  },
  floatFab: {
    position: "fixed",
    bottom: "25px",
    right: "25px",
    zIndex: 15,
  },
  itemsList: {
    width: "100%",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  item: {
    width: "33%",
    justifyContent: "center",
    [theme.breakpoints.down(1200)]: {
      width: "50%",
    },
    [theme.breakpoints.down(850)]: {
      width: "100%",
    },
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
        if (type === "movie" && !profileMovies.includes(data)) {
          let aux = profileMovies;
          aux.push(data);
          setProfileMovies(aux);
        } else if (!profileSeries.includes(data)) {
          let aux = profileSeries;
          aux.push(data);
          setProfileSeries(aux);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  function deleteFromView(id) {
    let aux;
    if (typeOfContent === "movies") {
      aux = profileMovies.filter((item) => {
        return item.id !== id;
      });
      setProfileMovies(aux);
    } else {
      aux = profileSeries.filter((item) => {
        return item.id !== id;
      });
      setProfileSeries(aux);
    }
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
  }

  function deleteRepeatedItems() {
    if (profileMovies.length !== 0) {
      let uniqueMovies = profileMovies.filter(
        (currentValue, currentIndex, itemsArray) => {
          return (
            itemsArray.findIndex(
              (valorDelArreglo) =>
                JSON.stringify(valorDelArreglo) === JSON.stringify(currentValue)
            ) === currentIndex
          );
        }
      );
      if (uniqueMovies.length !== profileMovies.length) {
        setProfileMovies(uniqueMovies);
      }
    }
    if (profileSeries.length !== 0) {
      let uniqueSeries = profileSeries.filter(
        (currentValue, currentIndex, itemsArray) => {
          return (
            itemsArray.findIndex(
              (valorDelArreglo) =>
                JSON.stringify(valorDelArreglo) === JSON.stringify(currentValue)
            ) === currentIndex
          );
        }
      );
      if (uniqueSeries.length !== profileSeries.length) {
        setProfileMovies(uniqueSeries);
      }
    }
  }

  // eslint-disable-next-line
  useEffect(() => {
    if (!firebase.getCurrentUsername()) {
      setUserLoggedIn(false);
    }
    firebase.getUserLists(props.match.params.id).then((lists) => {
      if (!dataFetched) {
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
    setDataFetched(true);
    deleteRepeatedItems();
  });

  return (
    <main className={classes.main}>
      <HeadBar isUserLoggedIn={isUserLoggedIn} />
      <Paper className={classes.paper}>
        {profilePicture !== "" ? (
          <Avatar alt="profile" src={profilePicture} className={props.large} />
        ) : (
          <Avatar>
            <PersonIcon />
          </Avatar>
        )}
        <Typography component="h1" variant="h5" align="center">
          {profileName !== "" ? profileName : "User"}
        </Typography>
        {isUserLoggedIn ? (
          <SearchBar dataFetcher={fetchId} />
        ) : (
          <Typography> No estás logueado cruck</Typography>
        )}
        <br />
        {dataFetched ? (
          <>
            <ToggleButtonGroup
              value={typeOfContent}
              exclusive
              onChange={handleTypeOfContent}
              className={classes.toggleSticky}
            >
              <ToggleButton value="movies" aria-label="Movies">
                Pelis
              </ToggleButton>
              <ToggleButton value="series" aria-label="Series">
                Series
              </ToggleButton>
            </ToggleButtonGroup>
            <List className={classes.itemsList}>
              {typeOfContent === "movies" ? (
                profileMovies.length !== 0 ? (
                  profileMovies.map((movie) => (
                    <ListItem key={movie.id} className={classes.item}>
                      <CardItem
                        id={movie.id}
                        title={movie.title}
                        overview={movie.overview}
                        poster_path={movie.poster_path}
                        isUserLoggedIn={isUserLoggedIn}
                        onDeleteFromView={deleteFromView}
                      />
                    </ListItem>
                  ))
                ) : (
                  <ListItem className={classes.item}>
                    No hay películas para mostrar :(
                  </ListItem>
                )
              ) : profileSeries.length !== 0 ? (
                profileSeries.map((serie) => (
                  <ListItem key={serie.id} className={classes.item}>
                    <CardItem
                      id={serie.id}
                      title={serie.name}
                      overview={serie.overview}
                      poster_path={serie.poster_path}
                      isUserLoggedIn={isUserLoggedIn}
                      onDeleteFromView={deleteFromView}
                    />
                  </ListItem>
                ))
              ) : (
                <ListItem className={classes.item}>
                  No hay series para mostrar :(
                </ListItem>
              )}
            </List>
          </>
        ) : (
          <Typography> Cargando contenido </Typography>
        )}
        <Fab size="medium" color="primary" className={classes.floatFab}>
          <ShareIcon></ShareIcon>
        </Fab>
      </Paper>
    </main>
  );
}

export default withRouter(withStyles(styles)(Profile));
