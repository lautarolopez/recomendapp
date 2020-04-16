import React, { useEffect, useState } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import CardRecommendation from "../CardRecommendation";
import { List, ListItem, Typography } from "@material-ui/core";
import HeadBar from "../HeadBar";
import firebase from "../firebase";
import { withRouter } from "react-router-dom";

const styles = (theme) => ({});

function Recommendations(props) {
  const { classes } = props;
  const [isUserLoggedIn, setUserLoggedIn] = useState(true);
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
      setUserLoggedIn(false);
    }
    firebase.userRecommendations().then((aux) => {
      setProfileRecommendations(aux);
    });
  }, []);

  return (
    <main className={classes.main}>
      <HeadBar isUserLoggedIn={isUserLoggedIn} />
      <List>
        {profileRecommendations.length !== 0 ? (
          profileRecommendations.map((item) => {
            return (
              <ListItem key={item.id}>
                <CardRecommendation
                  id={item.id}
                  itemType={item.data.type}
                  title={item.data.title}
                  overview={item.data.description}
                  poster_path={item.data.poster}
                  message={item.data.message}
                  user_name={item.data.user_name}
                  user_poster={item.data.user_avatar}
                  onDeleteFromView={deleteFromView}
                />
              </ListItem>
            );
          })
        ) : (
          <ListItem>
            <Typography component="p">
              No tenés recomendaciones perrón
            </Typography>
          </ListItem>
        )}
      </List>
    </main>
  );
}

export default withRouter(withStyles(styles)(Recommendations));
