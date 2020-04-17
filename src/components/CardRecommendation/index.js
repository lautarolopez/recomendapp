import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Avatar,
  Chip,
} from "@material-ui/core";
import ReadMoreReact from "read-more-react";
import PersonIcon from "@material-ui/icons/Person";
import withStyles from "@material-ui/core/styles/withStyles";
import { withRouter } from "react-router-dom";

const styles = (theme) => ({
  card: {
    [theme.breakpoints.up(800)]: {
      height: "400px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    },
  },
  cardImage: {
    width: "60%",
    margin: "25px auto",
    [theme.breakpoints.up(500)]: {
      width: "20%",
      margin: 0,
      padding: "0 10px",
    },
  },
  cardContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    [theme.breakpoints.up(500)]: {
      flexDirection: "row",
    },
  },
  button: {
    marginTop: "10px",
  },
  userContent: {
    marginTop: "10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    [theme.breakpoints.up(500)]: {
      width: "40%",
      padding: "0 10px",
    },
  },
  itemContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBotton: "10px",
    borderBottom: "solid 1.5px lightgray",
    [theme.breakpoints.up(500)]: {
      width: "40%",
      padding: "0 10px",
      borderBottom: "none",
    },
    "& div.display-text-group": {
      overflow: "scroll",
      maxHeight: "160px",
    },
  },
  netflix: {
    width: "35px",
    height: "35px",
    margin: "5px",
  },
  netflixMessage: {
    margin: "15px auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  titleChip: {
    maxWidth: "30%",
    marginBottom: "15px",
    "& span": {
      overflow: "visible",
    },
  },
  divider: {
    display: "none",
    [theme.breakpoints.up(500)]: {
      display: "block",
      width: "1.5px",
      height: "250px",
      backgroundColor: "lightgray",
    },
  },
});

function CardRecommendation(props) {
  const { classes } = props;

  return (
    <Card variant="outlined" className={classes.card}>
      <CardContent className={classes.cardContent}>
        <img
          src={
            props.poster_path !== null
              ? "https://image.tmdb.org/t/p/w500" + props.poster_path
              : "https://www.themoviedb.org/assets/2/v4/logos/208x226-stacked-green-9484383bd9853615c113f020def5cbe27f6d08a84ff834f41371f223ebad4a3c.png"
          }
          alt={props.title}
          className={classes.cardImage}
        />
        <section className={classes.itemContent}>
          <Typography component="h2" variant="h5" align="center">
            {props.title}
          </Typography>
          <Chip
            variant="outlined"
            color="primary"
            label={props.itemType === "movie" ? "Peli" : "Serie"}
            size="small"
            className={classes.titleChip}
          />
          <ReadMoreReact
            text={props.overview}
            min={100}
            ideal={200}
            max={450}
            readMoreText={"ver más"}
          />
          {props.isOnNetflix === "si" && (
            <span className={classes.netflixMessage}>
              <Typography component="p">{"La podés ver en "}</Typography>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Netflix_icon.svg/1200px-Netflix_icon.svg.png"
                alt="Netflix icon"
                className={classes.netflix}
              />
            </span>
          )}
          <br />
        </section>
        <div className={classes.divider}></div>
        <br />
        <section className={classes.userContent}>
          {props.user_poster !== "" ? (
            <Avatar
              alt="profile"
              src={props.user_poster}
              className={classes.large}
            />
          ) : (
            <Avatar>
              <PersonIcon />
            </Avatar>
          )}
          <Typography component="h2" variant="h5" align="center">
            {props.user_name}
          </Typography>
          <ReadMoreReact
            className={classes.movieOverview}
            text={props.message}
            min={100}
            ideal={200}
            max={400}
            readMoreText={"ver más"}
          />
          <CardActions>
            <Button
              variant="outlined"
              className={classes.button}
              color="secondary"
              onClick={removeFromList}
            >
              Eliminar
            </Button>
          </CardActions>
        </section>
      </CardContent>
    </Card>
  );

  function removeFromList(e) {
    e.preventDefault();
    props.onDeleteFromView(props.id);
  }
}

export default withRouter(withStyles(styles)(CardRecommendation));
