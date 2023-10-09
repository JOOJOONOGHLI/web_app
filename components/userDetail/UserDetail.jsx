import React from 'react';
import './userDetail.css';
import { Link } from "react-router-dom";
import {
  List,
  ListItem,
  ListItemText,
  Grid,
}
from '@material-ui/core';
// import fetchModel from '../../lib/fetchModelData.js'
const axios = require('axios');

/**
 * Define UserDetail, a React componment of CS142 project #5
 */
class UserDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: undefined,
      photos: undefined,
      newest_photo_file_name: "",
      newest_photo_date: undefined,
      most_comments_photo_filename: "",
      most_comments_number: 0,
    }
  }

  setUpUserStory = () => {
    axios.get(`/userStoryMostRecent/${this.state.user._id}`).then(result => {
      this.setState({newest_photo_file_name: result.data.newest_photo_file_name});
      this.setState({newest_photo_date: result.data.newest_photo_date});
    })
    axios.get(`/userStoryMostCommented/${this.state.user._id}`).then(result => {
      this.setState({most_comments_photo_filename: result.data.most_comments_photo_filename});
      this.setState({most_comments_number: result.data.most_comments_number});
    })
  }

  componentDidMount() {
    console.log("called")
      axios.get(`/user/${this.props.match.params.userId}`).then(user => {
        this.setState({user: user.data}, () => {
          this.props.setToolBar(`${this.state.user.first_name}'s profile`)
          //see if you can .then the following instead of nesting it: 
          this.setUpUserStory()
        })
      }) 
      .catch(e => console.log("there was error with Axios fetching /users/:id inside of userDetail", e))
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.userId != prevProps.match.params.userId){
      axios.get(`/user/${this.props.match.params.userId}`).then(user => {
        this.setState({user: user.data}, () => {
          this.props.setToolBar(`${this.state.user.first_name}'s profile`);
          this.setUpUserStory();
        })
      })
      .catch(e => console.log("there was error with Axios fetching /users/:id inside of userDetail", e))
    }    
  }

  componentWillUnmount(){
    // const user = this.state.users.find((user) => user._id === this.props.match.params.userId );
    this.props.setToolBar('home')
  }


  render() {    
    console.log("userDetail render")
    if(!this.state.user) return <div></div>
    return (
      <List component="nav"> 
        <ListItem>
          <ListItemText primary={`${this.state.user.first_name} ${this.state.user.last_name}`} />
        </ListItem>
        <ListItem>
          <ListItemText primary={`Occupation: ${this.state.user.occupation}`}/>
        </ListItem>
        <ListItem>
          <ListItemText primary={`Location: ${this.state.user.location}`}/>
        </ListItem>
        <ListItem>
          <ListItemText primary={`Description: ${this.state.user.description}`}/>
        </ListItem>
        <ListItem component={Link} to={'/photos/' + this.state.user._id}>
          <ListItemText primary={`See ${this.state.user.first_name}'s photos`} />
        </ListItem>

        {/*Most recent photo  */}
        <ListItem component={Link} to={'/photos/' + this.state.user._id}>
          <Grid container direction="row">
            <Grid item xs={4}>
              <div>Check out {this.state.user.first_name}&apos;s most recent photo (posted on {this.state.newest_photo_date}):</div>
            </Grid>
            <Grid item xs={4}>
            {/* adjust the size of the image to be really small here, and add an onClick function that takes up to Photos */}
              {this.state.newest_photo_file_name ? <img src={'../../images/' + this.state.newest_photo_file_name} height="50%" width = "50%"/> 
                : 'no photos yet'}
            </Grid>
          </Grid>
        </ListItem>

       {/*Most commented on photo  */}
        <ListItem component={Link} to={'/photos/' + this.state.user._id}>
          <Grid container direction="row">
            <Grid item xs={4}>
              <div>Check out {this.state.user.first_name}&apos;s photo with the most comments ({this.state.most_comments_number}):</div>
            </Grid>
            <Grid item xs={4}>
            {/* adjust the size of the image to be really small here, and add an onClick function that takes up to Photos */}
             {this.state.most_comments_photo_filename ? <img src={'../../images/' + this.state.most_comments_photo_filename} height="50%" width = "50%"/> :
              `${this.state.user.first_name} has no photos yet`}
            </Grid>
          </Grid>
        </ListItem>

      

      </List>
    );
  }
}

export default UserDetail;