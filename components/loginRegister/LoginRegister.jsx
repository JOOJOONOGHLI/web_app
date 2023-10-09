import React from 'react';

import Avatar from '@material-ui/core/Avatar';

import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';


import './loginRegister.css';
// import { LoaderOptionsPlugin } from 'webpack';
const axios = require('axios');

class LoginRegister extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            view: 'login',
            login_name: '',
            password: '',
            new_login_name: '',
            password1: '',
            password2: '',
            first_name: '',
            last_name: '',
            location: '',
            description: '',
            occupation: ''
        }
        this.loginHandler = this.loginHandler.bind(this);
        this.switchView = this.switchView.bind(this);

    }

    switchView = (new_view) => {
        this.setState({view: new_view});
    } 

    loginHandler = (e) => {
        e.preventDefault();
        // const event = e.target.value;
        axios.post('/admin/login', {
            login_name: this.state.login_name,
            password: this.state.password
          })
          .then(response => {
            this.props.setUser(response.data._id, response.data.first_name);
          })
          .catch(err => {
            console.log("error of axios = ", err);
            // this.props.setUser(null, null);
          });
    }

    registerUserHandler = (e) => {
        e.preventDefault();
        //validate the data
        if (!this.state.new_login_name || !this.state.password1 || !this.state.password2 || !this.state.first_name || !this.state.last_name || 
            !this.state.location || !this.state.description || !this.state.occupation){
            console.log("ERROR. Please fill in all fields.")
        } else if(this.state.password1 != this.state.password2) {
            console.log("ERROR. Passwords must match.")
        } else {
            axios.post('/user', {
                login_name: this.state.new_login_name, 
                password: this.state.password1, 
                first_name: this.state.first_name,  
                last_name: this.state.last_name,
                location: this.state.location,
                description: this.state.description,
                occupation: this.state.occupation
            })
            .then(response => {
                console.log('response from registering a user: ', response);
            })
            .catch(err => {
                console.log("error in axios trying to register a new user: ", err);
            })
        }
    }

    render() {
        console.log("render for loginRegister")
        return (
            this.state.view === 'login' ? 
                <Grid container component="main" direction="row">
                    <Grid container justify="center" alignItems="center" sm={6}>
                        <Avatar>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign in
                        </Typography>
                        {/* <form> */}
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="login_name"
                                label="login name"
                                name="login"
                                onChange = {(e) => this.setState({login_name: e.target.value})}
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                onChange = {(e) => this.setState({password: e.target.value})}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                onClick={this.loginHandler}
                            >
                            Sign In
                            </Button>
                        {/* </form> */}
                    </Grid>
                    <Grid container>
                        <Grid item>
                            <Link component="button" variant="body2" onClick={() => this.switchView('register')}>
                            {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                    </Grid>
                </Grid>
            :
            <Grid container component="main" direction="row">
                    <Grid container justify="center" alignItems="center" sm={6}>
                        <Avatar>
                            <AccountCircleIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Create an account
                        </Typography>
                        <form>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="first_name"
                                label="first name"
                                onChange = {(e) => this.setState({first_name: e.target.value})}
                            />
                           <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="last_name"
                                label="last name"
                                onChange = {(e) => this.setState({last_name: e.target.value})}
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="location"
                                label="location"
                                onChange = {(e) => this.setState({location: e.target.value})}
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="description"
                                label="description"
                                onChange = {(e) => this.setState({description: e.target.value})}
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="occupation"
                                label="occupation"
                                onChange = {(e) => this.setState({occupation: e.target.value})}
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="new_login_name"
                                label="login name"
                                onChange = {(e) => this.setState({new_login_name: e.target.value})}
                            />
                              <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="new_password"
                                type="password"
                                label="password"
                                onChange = {(e) => this.setState({password1: e.target.value})}
                            />
                              <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                type="password"
                                id="re-enter password"
                                label="re-enter password"
                                onChange = {(e) => this.setState({password2: e.target.value})}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                onClick = {this.registerUserHandler}
                            >
                            Register me
                            </Button>
                        </form>
                    </Grid>
                    <Grid container>
                        <Grid item>
                            <Link component="button"  variant="body2" onClick={() => this.switchView('login')}>
                            {"Already have an account? Sign in here"}
                            </Link>
                        </Grid>
                    </Grid>
                </Grid>
        );
    }
}

export default LoginRegister;
