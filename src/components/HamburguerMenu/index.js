import React, { useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Menu, MenuItem, ListItemIcon, ListItemText } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import FaceIcon from "@material-ui/icons/Face";
import PowerSettingsNewIcon from "@material-ui/icons/PowerSettingsNew";
import LocalActivityIcon from "@material-ui/icons/LocalActivity";
import { withRouter } from "react-router-dom";

const styles = (theme) => ({
  menuItem: {
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: theme.palette.common.white,
      },
    },
  },
});

function HamburguerMenu(props) {
  const { classes } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRedirectToProfile = () => {
    props.history.push("/perfil/" + props.id);
    window.location.reload(true);
  };

  const handleRedirectToRecommendations = () => {
    props.history.push("/mis-recomendaciones");
    window.location.reload(true);
  };

  return (
    <div>
      <MenuIcon
        aria-controls="customized-menu"
        aria-haspopup="true"
        onClick={handleClick}
      ></MenuIcon>
      <Menu
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem
          className={classes.menuItem}
          onClick={handleRedirectToProfile}
        >
          <ListItemIcon>
            <FaceIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Mi perfil" />
        </MenuItem>
        <MenuItem
          className={classes.menuItem}
          onClick={handleRedirectToRecommendations}
        >
          <ListItemIcon>
            <LocalActivityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Mis recomendaciones" />
        </MenuItem>
        <MenuItem className={classes.menuItem} onClick={props.onLogout}>
          <ListItemIcon>
            <PowerSettingsNewIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Cerrar sesión" />
        </MenuItem>
      </Menu>
    </div>
  );
}
export default withRouter(withStyles(styles)(HamburguerMenu));
