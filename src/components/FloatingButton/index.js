import React, { useState } from "react";
import { Typography, Fab, Popover } from "@material-ui/core";
import ShareIcon from "@material-ui/icons/Share";
import withStyles from "@material-ui/core/styles/withStyles";
import { CopyToClipboard } from "react-copy-to-clipboard";

const styles = (theme) => ({
  floatFab: {
    position: "fixed",
    bottom: "25px",
    right: "25px",
    zIndex: 15,
  },
  none: {
    display: "none",
  },
});

function FloatingButton(props) {
  const { classes } = props;
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <CopyToClipboard text={window.location.href}>
      <Fab size="medium" color="primary" className={classes.floatFab}>
        <ShareIcon onClick={handleClick}></ShareIcon>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <Typography component="p">Copiado al portapapeles.</Typography>
        </Popover>
      </Fab>
    </CopyToClipboard>
  );
}

export default withStyles(styles)(FloatingButton);
