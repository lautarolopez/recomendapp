import React, { useState } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import SearchBar from "../SearchBar";
import {
  Modal,
  Backdrop,
  Fade,
  Button,
  TextareaAutosize,
  Paper,
  FormControl,
  InputLabel,
  RadioGroup,
  FormLabel,
  FormControlLabel,
  Radio,
  Typography,
} from "@material-ui/core";
import firebase from "../firebase";

const styles = (theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    maxWidth: "90%",
    margin: "auto",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    display: "flex",
    flexDirection: "column",
  },
  formInput: {
    marginTop: theme.spacing(2),
  },
  messageArea: {
    border: "none",
    borderBottom: "solid 1.5px " + theme.palette.primary.dark,
  },
  modalImage: {
    width: "50%",
    alignSelf: "center",
  },
  itemTitle: {
    alignSelf: "center",
    fontSize: "2rem",
  },
  error: {
    color: "red",
  },
});

function ModalButton(props) {
  const { classes } = props;
  const [open, setOpen] = useState(false);
  const [isOnNetflix, setIsOnNetflix] = useState("si");
  const [message, setMessage] = useState("");
  const [recommendedItem, setRecommendedItem] = useState({});
  const [messageError, setMessageError] = useState(false);
  const [itemError, setItemError] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setRecommendedItem({});
    setItemError(false);
    setMessageError(false);
  };

  const handleChange = (e) => {
    setIsOnNetflix(e.target.value);
  };

  const handleRecomendation = (e) => {
    e.preventDefault();
    if (Object.entries(recommendedItem).length !== 0 && message !== "") {
      firebase.db
        .collection("users")
        .doc(props.profileId)
        .collection("recommendations")
        .add({
          title: recommendedItem.title,
          poster: recommendedItem.poster,
          description: recommendedItem.description,
          message: message,
          isOnNetflix: isOnNetflix,
        });
      handleClose();
    } else {
      if (message === "") {
        setMessageError(true);
      }
      if (Object.entries(recommendedItem).length === 0) {
        setItemError(true);
      }
    }
  };

  async function fetchId(id, type) {
    await fetch(
      `https://api.themoviedb.org/3/${type}/${id}?api_key=8acf7117c6859db295df155d5626c31a&language=es-AR&include_image_language=es-AR`
    )
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        setRecommendedItem({
          title: data.title ? data.title : data.name,
          poster: data.poster_path ? data.poster_path : "",
          description: data.overview ? data.overview : "",
        });
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Recomendame algo!
      </Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Paper className={classes.paper}>
            {Object.entries(recommendedItem).length !== 0 ? (
              <>
                <Typography component="h2" className={classes.itemTitle}>
                  {recommendedItem.title}
                </Typography>
                <img
                  src={
                    "https://image.tmdb.org/t/p/w500" + recommendedItem.poster
                  }
                  alt={recommendedItem.title}
                  className={classes.modalImage}
                />
              </>
            ) : (
              <>
                <SearchBar dataFetcher={fetchId} store={false} />
                {itemError && (
                  <Typography component="p" className={classes.error}>
                    Por favor elegí algo para recomendar!
                  </Typography>
                )}
              </>
            )}
            <FormControl className={classes.formInput}>
              <InputLabel htmlFor="message"></InputLabel>
              <TextareaAutosize
                className={classes.messageArea}
                id="message"
                rowsMin={3}
                rowsMax={6}
                placeholder="Contame qué onda..."
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                }}
              ></TextareaAutosize>
              {messageError && (
                <Typography component="p" className={classes.error}>
                  Por favor ingresá un comentario!
                </Typography>
              )}
            </FormControl>
            <FormControl component="fieldset" className={classes.formInput}>
              <FormLabel component="legend">Está en Netflix?</FormLabel>
              <RadioGroup
                aria-label="netflix"
                name="isOnNetflix"
                value={isOnNetflix}
                onChange={handleChange}
              >
                <FormControlLabel
                  color="primary"
                  value="si"
                  control={<Radio color="primary" />}
                  label="Si"
                />
                <FormControlLabel
                  color="primary"
                  value="no"
                  control={<Radio color="primary" />}
                  label="No"
                />
              </RadioGroup>
            </FormControl>
            <Button
              variant="outlined"
              color="primary"
              onMouseDown={handleRecomendation}
            >
              Listo!
            </Button>
          </Paper>
        </Fade>
      </Modal>
    </>
  );
}
export default withStyles(styles)(ModalButton);
