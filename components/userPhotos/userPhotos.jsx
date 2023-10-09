import React from 'react';
import {Link } from "react-router-dom";
import {
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Grid,
  TextField,   
  Button
} from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import './userPhotos.css';
// import fetchModel from '../../lib/fetchModelData.js'
const axios = require('axios');


/**
 * Define UserPhotos, a React componment of CS142 project #5
 */
class UserPhotos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: undefined,
      users: undefined,
      user: undefined,
      newComments: [], //array to keep track of what the user has typed into any of the comment boxes
    }
  }

  submitComment = (photo_id, text) => {
    axios.post(`/commentsOfPhoto/${photo_id}`, {
      comment: text
    })
    .then(response => {
      //we need to 1. re-fetch model data then, update the newComments and re-render again
      axios.get(`/photosOfUser/${this.props.match.params.userId }`).then(photos => { 
        this.setState({photos: photos.data}, this.populateNewComments(photos.data));
      })
      .catch(e => console.log("there was error with Axios fetching /photosOfUser/:id inside of userPhotos", e))
      console.log(response)
    })
    .catch(err => {
      console.log("error in axios = ", err);
    });
  }

  populateNewComments(photos) {
    const newComments = photos.map((photo) => {
      return {photo_id: photo._id, newCommentText: ""}
    })
    this.setState({newComments: newComments}) 
  }

  //update the state variable, newComments, to reflect the text written into a single textBar
  updateNewComments(photo_id, text) {
    const newCommentsCopy = this.state.newComments;
      let newComment = newCommentsCopy.find(newComment => newComment.photo_id === photo_id); 
      if (!newComment){
        newCommentsCopy.push({photo_id: photo_id, newCommentText: text})
      } else {
        newComment.newCommentText = text;
      }
    this.setState({newComments: newCommentsCopy}, () => console.log("New comments = ", this.state.newComments))
  }

  componentDidMount() {
    axios.get(`/photosOfUser/${this.props.match.params.userId }`).then(photos => {
      this.setState({photos: photos.data}, this.populateNewComments(photos.data));
    })
    .catch(e => console.log("there was error with Axios fetching /photosOfUser/:id inside of userPhotos", e))

    //get the information for the owner of the photos, not the logged in user. The logged in user info is found from 
    axios.get(`/user/${this.props.match.params.userId}`).then(user => {
      this.setState({user: user.data}, () => {
        this.props.setToolBar(`Photos of ${this.state.user.first_name}`)
      })
    })
    .catch(e => console.log("there was error with Axios fetching /user/:id inside of userPhotos", e))
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.userId != prevProps.match.params.userId || this.props.newPhoto != prevProps.newPhoto) {
      //update the photos
      axios(`/photosOfUser/${this.props.match.params.userId}`)
      .then(photos => {
        this.setState({photos: photos.data});

        //update user
        axios(`/user/${this.props.match.params.userId}`)
        .then((user) => {
          this.setState({user: user.data}, () => {
            this.props.setToolBar(`Photos of ${this.state.user.first_name}`)
          })
        })
        .catch(e => console.log("there was error with Axios fetching /user/:id inside of userPhotos", e));
      })
      .catch(e => console.log("there was error with Axios fetching /photosOfUser/:id inside of userPhotos", e));    
    }
  }

  handleLikePressed = (event, photo) => {
    // setState({ ...state, [event.target.name]: event.target.checked });
    console.log("like pushed with ", event);
    console.log("photo = ", photo)
    axios.post('/likeButton', {
      photoId: photo._id,
      userId: this.props.user.id,
    })
    .then(response => {
      console.log(response);
      axios.get(`/photosOfUser/${this.props.match.params.userId }`).then(photos => {
        this.setState({photos: photos.data}, this.populateNewComments(photos.data));
      })
      .catch(e => console.log("there was error with Axios fetching /photosOfUser/:id inside of userPhotos", e))
    })
    .catch(err => {
      console.log("error of axios = ", err);
    });

  };

  render() {
    console.log("userPhoto's render");
    console.log("props for userPhoto = ", this.props);
    if (!this.state.photos || !this.state.user) return  <div></div>; 
    else return (
      <List>
        {
          this.state.photos.map((photo) => {
            const comments = photo.comments;
            return (
              <Paper key={photo._id} variant="outlined" style={{overflow: 'auto'}}>
                <img src={'../../images/' + photo.file_name} alt="Logo" />
                {/* date of the photo */}
                <Grid container justify="center" alignItems="center">           
                  <Grid item xs={6}>
                    <Typography align="center">{photo.date_time}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    {/* <Fab color="primary" aria-label="add">
                      <FavoriteBorderIcon />
                    </Fab> */
                    <FormControlLabel
                      control={<Checkbox icon={<FavoriteBorder />} onChange={(e) => this.handleLikePressed(e, photo)} checkedIcon={<Favorite />} 
                                                            checked={photo.likes.includes(this.props.user.id)} name="checkedH" />}
                      label={`Likes: ${photo.likes_number}`}
                    />}
                  </Grid>
                </Grid>

                {/* comments on the photo */}
                <List>
                {
                  !comments ? <div/> :
                    comments.map((comment) => {
                      return (
                        <div key={comment._id} >
                          <Grid container spacing ={8}>
                            <Grid item xs={4}>
                              <ListItem alignItems='flex-start' component={Link} to={'/users/' + comment.user._id}>
                                <ListItemText primary={`${comment.user.first_name} ${comment.user.last_name}:`} secondary={`${comment.date_time}`} />
                              </ListItem>
                            </Grid>
                            <Grid item xs={8}>
                              <ListItem>
                                <ListItemText primary={comment.comment}/>
                              </ListItem>
                            </Grid>
                          </Grid>
                          
                        </div>
                      );
                    })
                }
                <TextField
                  id="comment-bar"
                  // value={this.state.newComments.find(comment => comment.photo_id === photo._id).newCommentText}
                  multiline
                  label="add comment"
                  fullWidth
                  variant="outlined"
                  onChange = {(e) => {this.updateNewComments(photo._id, e.target.value)}}//{this.updateNewComments(e.target.value, photo._id)} //Will React pass in e here for us? no
                 />
                 <Grid container>
                   <Grid item >
                      {/* how do we assosciate this button with it's photo_id? */}
                      <Button variant="contained" onClick = {() => this.submitComment(photo._id, 
                                                                                      this.state.newComments.find(comment => comment.photo_id === photo._id).newCommentText)}>
                                                                                      submit comment</Button>
                                                                           
                   </Grid>
                 </Grid>
                 
                </List>
            </Paper>
          )})
        }
      </List>
    );
  }
}

export default UserPhotos;
