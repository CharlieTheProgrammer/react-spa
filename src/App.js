// Import React
import React, { Component } from 'react';
import Home from './components/Home'
import Welcome from './components/Welcome'
import Navigation from './components/Navigation'
import Meetings from './components/Meetings'
import Login from './components/Login'
import Register from './components/Register'
import Checkin from './components/Checkin'
import Attendees from './components/Attendees'

import { Router, navigate } from '@reach/router'

import firebase from './services/firebase'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: null,
      displayName: '',
      userName: '',
      userID: null,
      meetings: []
    }

    this.logIn = this.logIn.bind(this)
    this.logOut = this.logOut.bind(this)
    this.registerUser = this.registerUser.bind(this)
    this.addMeeting = this.addMeeting.bind(this)
    this.deleteMeeting = this.deleteMeeting.bind(this)
  }

  registerUser(userName) {
    firebase.auth().onAuthStateChanged(User => {
      User.updateProfile({
        displayName: userName
      })
        .then((result) => {
          this.setState({
            user: User,
            displayName: User.displayName,
            userID: User.userID
          })
          navigate('./meetings')
        }).catch((err) => {
          console.log("Error occurred while saving user", err)
        })
    })
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(FirebaseUser => {
      if (FirebaseUser) {
        this.setState({
          user: FirebaseUser,
          displayName: FirebaseUser.displayName,
          userID: FirebaseUser.uid
        })

        const meetingsRef = firebase.database().ref(`/meetings/${FirebaseUser.uid}`)
        meetingsRef.on('value', snapshot => {
          let meetings = snapshot.val()
          let meetingsList = []

          for (let key in meetings) {
            meetingsList.push({
              meetingID: key,
              meetingName: meetings[key].meetingName
            })
          }

          this.setState({
            meetings: meetingsList,
            howManyMeetings: meetingsList.length
          })
        })
      } else {
        this.setState({ user: null })
      }
    })
  }

  logIn(user) {
    // Add Firebase logic here

  }

  logOut(evt) {
    this.setState({
      user: null,
      displayName: null,
      userID: null
    })

    evt.preventDefault()
    firebase.auth().signOut().then(() => navigate('/login'))

  }

  addMeeting(meetingName) {
    const ref = firebase.database().ref(`meetings/${this.state.user.uid}`)
    ref.push({ meetingName: meetingName })
  }

  async deleteMeeting(meetingID) {
    const ref = firebase.database().ref(`/meetings/${this.state.user.uid}/${meetingID}`)
    await ref.remove()
  }

  render() {
    return (
      <React.Fragment>
        <Navigation user={this.state.user} logOut={this.logOut}></Navigation>
        <Welcome user={this.state.displayName} logOut={this.logOut}></Welcome>
        {/* This actually switches the path and refreshes the page which means state is lost. UNLESS Link component is used */}
        <Router>
          <Home path='/' user={this.state.user} />
          <Login path='/login' logIn={this.logIn} />
          <Meetings path='/meetings' user={this.state.user} addMeeting={this.addMeeting} deleteMeeting={this.deleteMeeting} meetings={this.state.meetings}/>
          <Register path='/register' user={this.state.user} registerUser={this.registerUser} />
          <Checkin path='/checkin/:userID/:meetingID' />
          <Attendees path='/attendees/:userID/:meetingID' adminUser={this.state.userID}/>
        </Router>
      </React.Fragment>
    );
  }
}

export default App;
