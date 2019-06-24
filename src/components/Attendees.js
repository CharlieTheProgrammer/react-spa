import React, { Component } from "react";
import firebase from "../services/firebase";
import AttendeesList from "./AttendeesList";

class Attendees extends Component {
  constructor(props) {
    super(props);
    this.state = {
      attendees: []
    };
  }

  componentDidMount() {
    const ref = firebase
      .database()
      .ref(`/meetings/${this.props.userID}/${this.props.meetingID}/attendees`);
    ref.on("value", snapshot => {
      let attendees = snapshot.val();
      let attendeesList = [];
      for (let key in attendees) {
        attendeesList.push({
          attendeeID: key,
          attendeeName: attendees[key].attendeeName,
          attendeeEmail: attendees[key].attendeeEmail
        });
      }

      this.setState({
        attendees: attendeesList
      });
    });
  }

  render() {
    return (
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-md-8 text-center">
            <h1 className="font-weight-light">Attendees</h1>
            <div className="card bg-light col-lg-10 mx-auto">
              <AttendeesList
                attendees={this.state.attendees}
                meetingID={this.props.meetingID}
                userID={this.props.userID}
                adminUser={this.props.adminUser}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Attendees;
