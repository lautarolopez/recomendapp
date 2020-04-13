import React from "react";
import { List, ListItem } from "@material-ui/core";
import CardItem from "../CardItem";
import withStyles from "@material-ui/core/styles/withStyles";
import { withRouter } from "react-router-dom";

const styles = (theme) => ({
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

function ContentList(props) {
  const { classes } = props;

  return (
    <List className={classes.itemsList}>
      {props.typeOfContent === "movies" ? (
        props.profileMovies.length !== 0 ? (
          props.profileMovies.map((movie) => (
            <ListItem key={movie.id} className={classes.item}>
              <CardItem
                id={movie.id}
                title={movie.title}
                overview={movie.overview}
                poster_path={movie.poster_path}
                isUserLoggedIn={props.isUserLoggedIn}
                onDeleteFromView={props.deleteFromView}
              />
            </ListItem>
          ))
        ) : (
          <ListItem className={classes.item}>
            No hay películas para mostrar :(
          </ListItem>
        )
      ) : props.profileSeries.length !== 0 ? (
        props.profileSeries.map((serie) => (
          <ListItem key={serie.id} className={classes.item}>
            <CardItem
              id={serie.id}
              title={serie.name}
              overview={serie.overview}
              poster_path={serie.poster_path}
              isUserLoggedIn={props.isUserLoggedIn}
              onDeleteFromView={props.deleteFromView}
            />
          </ListItem>
        ))
      ) : (
        <ListItem className={classes.item}>
          No hay series para mostrar :(
        </ListItem>
      )}
    </List>
  );
}

export default withRouter(withStyles(styles)(ContentList));
