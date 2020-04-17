import React, { useEffect, useState } from "react";
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
  listItem: {
    height: "12vh",
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

  const formatName = (name, date) => {
    if (name && date) {
      let auxName = name.length >= 13 ? name.slice(0, 13) + "..." : name;
      let auxDate = "(" + date.slice(0, 4) + ")";
      return auxName + " " + auxDate;
    }
  };

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
        {querySearch.length !== 0 &&
          searchResults.map((item) => (
            <ListItem
              key={item.id}
              className={classes.listItem}
              onMouseDown={(e) => {
                e.preventDefault();
                if (props.store) {
                  firebase.storeNewItem(item);
                }
                props.dataFetcher(item.id, item.title ? "movie" : "tv");
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
                primary={formatName(
                  item.title ? item.title : item.name,
                  item.release_date ? item.release_date : item.first_air_date
                )}
              />
            </ListItem>
          ))}
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
