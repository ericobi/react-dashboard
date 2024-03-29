import React from "react";
import PropTypes from "prop-types";

import { withStyles } from "@material-ui/core/styles";
import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  Grid,
  Button,
  IconButton
} from "@material-ui/core";
import { Done as DoneIcon, NotInterested } from "@material-ui/icons";

const styles = theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap"
  },
  input: {
    width: "100%"
  },
  margin: {
    margin: theme.spacing(1)
  },
  withoutLabel: {
    marginTop: theme.spacing(3)
  },
  textField: {
    flexBasis: 200
  }
});

class OptionEdit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ...props.option,
      showAlert: false,
      title: "",
      message: ""
    };
  }

  handleSave = () => {
    if (
      this.state.name.length === 0 ||
      this.state.description.length === 0 ||
      this.state.value.length === 0
    ) {
      this.setState({
        showAlert: true,
        title: "Error",
        message: "Fill in all the items"
      });
      return;
    } else if (
      isNaN(parseInt(this.state.budget, 10)) ||
      parseInt(this.state.budget, 10) === 0 ||
      isNaN(parseInt(this.state.duration, 10)) ||
      parseInt(this.state.duration, 10) === 0
    ) {
      this.setState({
        showAlert: true,
        title: "Error",
        message: "Fill in valid values"
      });
      return;
    }

    const { showAlert, title, message, ...data } = this.state;
    this.props.handleSave(data);
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handlePop = () => {
    this.setState({ showAlert: false });
  };

  render() {
    const { classes } = this.props;
    return (
      <>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              className={classes.input}
              label="Option name"
              placeholder="Option"
              margin="none"
              onChange={this.handleChange}
              value={this.state.name}
              name="name"
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              className={classes.input}
              label="Option value"
              placeholder="Value"
              margin="none"
              onChange={this.handleChange}
              value={this.state.value}
              name="value"
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              className={classes.input}
              label="Budget"
              placeholder="1000"
              margin="none"
              onChange={this.handleChange}
              value={this.state.budget}
              name="budget"
              type='number'
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              className={classes.input}
              label="Duration"
              placeholder="10"
              margin="none"
              onChange={this.handleChange}
              value={this.state.duration}
              type='number'
              name="duration"
              required
            />
          </Grid>
          <Grid container item xs={12}>
            <Grid item xs={9} sm={10}>
              <TextField
                className={classes.input}
                multiline
                label="Description"
                placeholder="description"
                margin="none"
                onChange={this.handleChange}
                value={this.state.description}
                name="description"
                required
              />
            </Grid>
            <Grid
              item
              xs={3}
              sm={2}
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-around",
                alignContent: "center"
              }}
            >
              <IconButton style={{ padding: "6px" }} onClick={this.handleSave}>
                <DoneIcon />
              </IconButton>
              <IconButton
                style={{ padding: "6px" }}
                onClick={this.props.handleCancel}
              >
                <NotInterested />
              </IconButton>

              {/* <Button
                color="primary"
                className={classes.margin}
                onClick={this.handleSave}
              >
                Save
              </Button>
              <Button
                color="primary"
                className={classes.margin}
                onClick={this.handleSave}
              >
                Cancel
              </Button> */}
            </Grid>
          </Grid>
        </Grid>
        <Dialog
          open={this.state.showAlert}
          onClose={this.showAlert}
          aria-labelledby="alert-dialog-title"
        >
          <DialogTitle id="alert-dialog-title">{this.state.title}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {this.state.message}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handlePop} color="primary" autoFocus>
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}

OptionEdit.propTypes = {
  option: PropTypes.object.isRequired,
  handleSave: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired
};

export default withStyles(styles)(OptionEdit);
