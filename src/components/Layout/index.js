import React, { useEffect, useState } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { Container } from "@material-ui/core";
import HeadBar from "../HeadBar";
import Footer from "../Footer";
import firebase from "../firebase";
import { withRouter } from "react-router-dom";

const styles = (theme) => ({
  container: {
    margin: 0,
    padding: 0,
    maxWidth: "none",
  },
  content: {
    width: "100%",
    minHeight: "100vh",
    margin: 0,
    padding: 0,
    maxWidth: "none",
  },
});

function Layout(props) {
  const { classes } = props;
  const { children } = props;
  const [isUserLoggedIn, setUserLoggedIn] = useState(true);

  useEffect(() => {
    if (!firebase.getCurrentUsername()) {
      setUserLoggedIn(false);
    }
  }, []);

  return (
    <Container className={classes.container}>
      <HeadBar isUserLoggedIn={isUserLoggedIn} />
      <Container className={classes.content}>{children}</Container>
      <Footer />
    </Container>
  );
}

export default withRouter(withStyles(styles)(Layout));
