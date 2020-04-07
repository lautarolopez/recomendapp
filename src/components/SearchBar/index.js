import React, { useEffect, useState } from "react";
import "./styles.css";
import {
  Input,
  InputLabel,
  FormControl,
  List,
  ListItem,
  ListItemText,
  InputAdornment,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
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

function SearchBar(props) {
  const { classes } = props;
  const [querySearch, setQuerySearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // eslint-disable-next-line
  useEffect(() => {
    search();
    // eslint-disable-next-line
  });

  return (
    <>
      <List onBlur={(e) => setQuerySearch("")}>
        <form
          className={classes.form}
          onSubmit={(e) => e.preventDefault() && false}
        >
          <FormControl margin="normal" fullWidth>
            <InputLabel htmlFor="querySearch">
              Buscá una película o serie
            </InputLabel>
            <Input
              id="querySearch"
              name="querySearch"
              autoComplete="off"
              endAdornment={
                <InputAdornment position="end">
                  <SearchIcon></SearchIcon>
                </InputAdornment>
              }
              autoFocus
              value={querySearch}
              onChange={(e) => setQuerySearch(e.target.value)}
            />
          </FormControl>
        </form>
        {querySearch.length !== 0 ? (
          searchResults.map((item) => (
            <ListItem
              key={item.id}
              onMouseDown={(e) => {
                e.preventDefault();
                firebase.storeNewItem(item);
                setQuerySearch("");
              }}
            >
              <img
                src={
                  item.poster_path != null
                    ? "https://image.tmdb.org/t/p/w200" + item.poster_path
                    : "https://www.themoviedb.org/assets/2/v4/logos/208x226-stacked-green-9484383bd9853615c113f020def5cbe27f6d08a84ff834f41371f223ebad4a3c.png"
                }
                alt={item.title}
              />
              <ListItemText
                inset
                primary={
                  item.release_date
                    ? item.name
                      ? item.name
                      : item.title + " (" + item.release_date.slice(0, 4) + ")"
                    : item.name
                    ? item.first_air_date
                      ? item.name + " (" + item.first_air_date.slice(0, 4) + ")"
                      : item.name
                    : item.title
                }
              />
            </ListItem>
          ))
        ) : (
          <p className="noVisible">No buscaste nada cruck</p>
        )}
      </List>
    </>
  );

  async function search() {
    if (querySearch.length !== 0) {
      await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=8acf7117c6859db295df155d5626c31a&query=${querySearch}&language=es-AR&include_image_language=es-AR`
      )
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          let arrAux = [];
          data.results.slice(0, 50).forEach((item) => {
            if (!item.known_for_department) {
              arrAux.push(item);
            }
          });
          setSearchResults(arrAux.slice(0, 5));
        })
        .catch(function (err) {
          console.log(err);
        });
    }
  }
}

export default withRouter(withStyles(styles)(SearchBar));
