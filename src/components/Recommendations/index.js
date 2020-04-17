import React, { useEffect, useState } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import CardRecommendation from "../CardRecommendation";
import { List, ListItem, Typography } from "@material-ui/core";
import firebase from "../firebase";
import { withRouter } from "react-router-dom";

const styles = (theme) => ({
  itemsList: {
    display: "flex",
    flexDirection: "column",
    flexWrap: "wrap",
    alignItems: "center",
    [theme.breakpoints.up(1350)]: {
      flexDirection: "row",
      justifyContent: "center",
    },
  },
  item: {
    width: "90%",
    [theme.breakpoints.up(800)]: {
      width: "80%",
      height: "400px",
      marginBottom: "30px",
    },
    [theme.breakpoints.up(1350)]: {
      width: "45%",
    },
  },
});

function Recommendations(props) {
  const { classes } = props;
  const [profileRecommendations, setProfileRecommendations] = useState([]);

  const deleteFromView = (id) => {
    let aux;
    firebase.db
      .collection("users")
      .doc(firebase.getCurrentUserId())
      .collection("recommendations")
      .doc(id)
      .delete();
    aux = profileRecommendations.filter((item) => {
      return item.id !== id;
    });
    setProfileRecommendations(aux);
  };

  //eslint-disable-next-line
  useEffect(() => {
    if (!firebase.getCurrentUsername()) {
      props.history.replace("/perfil/" + firebase.getCurrentUserId());
    }
    firebase.userRecommendations().then((aux) => {
      setProfileRecommendations(aux);
    });
    //eslint-disable-next-line
  }, []);

  return (
    <main className={classes.main}>
      <br />
      <Typography component="h1" variant="h6" align="center">
        Mis recomendaciones
      </Typography>
      <List className={classes.itemsList}>
        {profileRecommendations.length !== 0 ? (
          profileRecommendations.map((item) => {
            return (
              <ListItem key={item.id} className={classes.item}>
                <CardRecommendation
                  id={item.id}
                  itemType={item.data.type}
                  title={item.data.title}
                  overview={item.data.description}
                  poster_path={item.data.poster}
                  message={item.data.message}
                  user_name={item.data.user_name}
                  user_poster={item.data.user_avatar}
                  isOnNetflix={item.data.isOnNetflix}
                  onDeleteFromView={deleteFromView}
                />
              </ListItem>
            );
          })
        ) : (
          <ListItem>
            <Typography component="p" align="center">
              Todavía no te hicieron recomendaciones :(
            </Typography>
          </ListItem>
        )}
      </List>
    </main>
  );
}

export default withRouter(withStyles(styles)(Recommendations));
