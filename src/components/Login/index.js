import React, { useState, useEffect } from "react";
import {
  Typography,
  Paper,
  Avatar,
  Button,
  FormControl,
  Input,
  InputLabel,
} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import withStyles from "@material-ui/core/styles/withStyles";
import { Link, withRouter } from "react-router-dom";
import firebase from "../firebase";

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
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(),
  },
  submit: {
    marginTop: theme.spacing() * 3,
  },
  facebook: {
    marginTop: theme.spacing() * 3,
    backgroundColor: "#3b5998",
  },
  google: {
    marginTop: theme.spacing() * 3,
    color: "",
  },
});

function SignIn(props) {
  const { classes } = props;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (firebase.getCurrentUsername()) {
      props.history.replace("/perfil/" + firebase.getCurrentUserId());
    }
  });

  return (
    <main className={classes.main}>
      <Paper className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Iniciar Sesión
        </Typography>
        <form
          className={classes.form}
          onSubmit={(e) => e.preventDefault() && false}
        >
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="email">Correo electrónico</InputLabel>
            <Input
              id="email"
              name="email"
              autoComplete="off"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="password">Contraseña</InputLabel>
            <Input
              name="password"
              type="password"
              id="password"
              autoComplete="off"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            onClick={login}
            className={classes.submit}
          >
            Ingresá
          </Button>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            component={Link}
            to="/register"
            className={classes.submit}
          >
            Registrate
          </Button>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            onClick={loginWithFacebook}
            className={classes.facebook}
          >
            Ingresá con Facebook
          </Button>
          <Button
            type="submit"
            fullWidth
            variant="outlined"
            color="primary"
            onClick={loginWithGoogle}
            className={classes.google}
          >
            Ingresá con Google
          </Button>
        </form>
      </Paper>
    </main>
  );

  async function login() {
    try {
      await firebase.login(email, password);
      props.history.replace("/perfil/" + firebase.getCurrentUserId());
    } catch (error) {
      alert(error.message);
    }
  }

  async function loginWithGoogle() {
    await firebase.loginWithGoogle().then((user) => {
      firebase.addNewUserToDatabase(user.photoURL, user.displayName);
      props.history.replace("/perfil/" + firebase.getCurrentUserId());
    });
  }

  async function loginWithFacebook() {
    await firebase.loginWithFacebook().then((user) => {
      firebase.addNewUserToDatabase(user.photoURL, user.displayName);
      props.history.replace("/perfil/" + firebase.getCurrentUserId());
    });
  }
}

export default withRouter(withStyles(styles)(SignIn));
