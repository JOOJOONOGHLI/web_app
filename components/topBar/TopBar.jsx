import React from 'react';
import {
  AppBar, Toolbar, Typography, Grid, Button
} from '@material-ui/core';
import './TopBar.css';
// import fetchModel from '../../lib/fetchModelData.js'
const axios = require('axios');
/**
 * Define TopBar, a React componment of CS142 project #5
 */
class TopBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      version: undefined
    }
  }

  //this function is called when user presses the upload photo button
  handleUploadButtonClicked = (e) => {
    e.preventDefault();
    if (this.uploadInput.files.length > 0) {

     // Create a DOM form and add the file to it under the name uploadedphoto
     const domForm = new FormData();
     domForm.append('uploadedphoto', this.uploadInput.files[0]);
     axios.post('/photos/new', domForm)
       .then((res) => {
         console.log(res);
         this.props.newPhotoAdded();
       })
       .catch(err => console.log(`POST ERR: ${err}`));
    }
  }
  
  componentDidMount() {
    axios.get('/test/info').then(info => {
      this.setState({version: info.data.__v});
    })
    .catch(e => console.log("there was error with axios fetching /test/info inside of TopBar", e))
  }

  render() {
    console.log("Top Bar render")
    return (
      <AppBar className="cs142-topbar-appBar" position="absolute">
        <Toolbar>
          <Grid container justify="space-between" direction="row">
            <Grid item sm={3}>
              <Typography variant="h5" color="inherit">
                {`Hi ${this.props.first_name}`}
              </Typography>
              <input type="file" accept="image/*" ref={(domFileRef) => { this.uploadInput = domFileRef; }} />
              <Button varient="contained" onClick = {(e) => this.handleUploadButtonClicked(e)}>Upload image</Button>
            </Grid>
            <Grid item sm={3}>
              <Typography variant="h5" color="inherit">
              Version {this.state.version}
              </Typography>
            </Grid>
            <Grid item sm={3}>
              <Typography varient="h5"a color="inherit">
                 {this.props.view}
              </Typography>
            </Grid>
            <Grid item sm ={3}> 
              <Button variant="outlined" onClick={this.props.logoutHandler}>Log Out</Button>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    );
  }
}
export default TopBar;
