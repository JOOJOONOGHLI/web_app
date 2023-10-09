import React from 'react';
import {Link } from "react-router-dom";
import {
  Divider,
  List,
  ListItem,
  ListItemText,
}
from '@material-ui/core';
import './userList.css';
const axios = require('axios');


/**
 * Define UserList, a React componment of CS142 project #5
 */
class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: undefined,
    }
  }

  componentDidMount() {
    axios.get('/user/list').then(users => {
      this.setState({users: users.data});
      if (this.props.setToolBar) this.props.setToolBar('List of users');
    })
    .catch(e => console.log("there was error with Axios fetching /user/list inside of userList", e))
  }

  render() {
    console.log("userList render")
    return (
      <div>
        <List component="nav">
        {
          !this.state.users ? <div></div> :
          this.state.users.map((user, i) => { 
            return (<div key = {i}>
                <ListItem component={Link} to={'/users/' + user._id}>
                    <ListItemText primary={user.first_name + " " + user.last_name} />
                </ListItem>
                <Divider />
              </div>)})
          }
        </List>
      </div>
    );
  } 
}

export default UserList;
