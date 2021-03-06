import React, { useEffect, useState } from "react";
import { Typography, Paper, Avatar } from "@material-ui/core";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import HeadBar from "../HeadBar";
import SearchBar from "../SearchBar";
import ContentList from "../ContentList";
import ModalButton from "../ModalButton";
import FloatingButton from "../FloatingButton";
import PersonIcon from "@material-ui/icons/Person";
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
  none: {
    display: "none",
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
    let aux;
    await fetch(
      `https://api.themoviedb.org/3/${type}/${id}?api_key=${process.env.REACT_APP_API_KEY_TMDB}&language=es-AR&include_image_language=es-AR`
    )
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        if (type === "movie" && !profileMovies.includes(data)) {
          aux = data;
        } else if (!profileSeries.includes(data)) {
          aux = data;
        }
      })
      .catch(function (err) {
        console.log(err);
      });
    return aux;
  }

  const dataFetcher = (id, type) => {
    setDataFetched(false);
    let auxMovies = [...profileMovies];
    let auxSeries = [...profileSeries];
    fetchId(id, type).then((item) => {
      if (type === "movie") {
        auxMovies.push(item);
        setProfileMovies(auxMovies);
      } else {
        auxSeries.push(item);
        setProfileSeries(auxSeries);
      }
    });
    setDataFetched(true);
  };

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
    let auxMovies = [];
    let auxSeries = [];
    if (moviesList.length !== 0) {
      moviesList.forEach((movie_id) => {
        fetchId(movie_id, "movie").then((movie) => {
          auxMovies.push(movie);
        });
      });
    }
    if (seriesList.length !== 0) {
      seriesList.forEach((serie_id) => {
        fetchId(serie_id, "tv").then((serie) => {
          auxSeries.push(serie);
        });
      });
    }
    return { movies: auxMovies, series: auxSeries };
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
      fetchItemsData(lists.movies, lists.series).then((listsFetched) => {
        setProfileMovies(listsFetched.movies);
        setProfileSeries(listsFetched.series);
      });
      firebase.getUserAvatarWithId(props.match.params.id).then((photoURL) => {
        setProfilePicture(photoURL);
      });
      firebase
        .getUserDisplayNameWithId(props.match.params.id)
        .then((displayName) => {
          setProfileName(displayName);
        });
    });
    setDataFetched(true);
    deleteRepeatedItems();
    // eslint-disable-next-line
  }, []);

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
          {profileName !== "" ? profileName : "Usuario"}
        </Typography>
        {isUserLoggedIn &&
        firebase.getCurrentUserId() === props.match.params.id ? (
          <SearchBar dataFetcher={dataFetcher} store={true} />
        ) : (
          isUserLoggedIn && <ModalButton profileId={props.match.params.id} />
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
            <ContentList
              typeOfContent={typeOfContent}
              profileMovies={profileMovies}
              profileSeries={profileSeries}
              isUserLoggedIn={isUserLoggedIn}
              ownProfile={firebase.getCurrentUserId() === props.match.params.id}
              deleteFromView={deleteFromView}
            />
          </>
        ) : (
          <Typography> Cargando contenido </Typography>
        )}
        <FloatingButton />
      </Paper>
    </main>
  );
}

export default withRouter(withStyles(styles)(Profile));
