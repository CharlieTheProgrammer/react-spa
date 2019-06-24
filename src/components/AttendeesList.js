import React, { Component } from "react";
import { FaTrash, FaStar, FaEnvelope } from "react-icons/fa";
import firebase from '../services/firebase'

class AttendeesList extends Component {
  constructor(props) {
    super(props);

    this.deleteAttendee = this.deleteAttendee.bind(this)
  }

  async deleteAttendee(e, meetingID, attendeeID) {
    e.preventDefault()
    const adminUser = this.props.adminUser
    const ref = firebase.database().ref(`/meetings/${adminUser}/${meetingID}/attendees/${attendeeID}`)
    await ref.remove()
  }

  toggleStar(e, star, meetingID, attendeeID) {
    e.preventDefault()
    const adminUser = this.props.adminUser
    const ref = firebase.database().ref(`/meetings/${adminUser}/${meetingID}/attendees/${attendeeID}/star`)

    if (!star) {
      ref.set(true)
    } else {
      ref.set(!star)
    }
  }

  render() {
    const admin = this.props.adminUser === this.props.userID ? true : false;
    const attendees = this.props.attendees;
    const attendeesHtml = attendees.map(attendee => {
      return (
        <div
          className="col-8 col-sm-6 col-md-7 col-lg-7 my-2 p-0 px-1"
          key={attendee.attendeeID}
        >
          <div className="card">
            <div
              className={
                "card-body px-3 py-2 d-flex align-items-center " +
                (admin ? "" : "justify-content-center")
              }
            >
              <div>{attendee.attendeeName}</div>
              {admin && (
                <div className="btn-group pl-2 ml-auto">
                  <button
                    className={"btn btn-sm " + (attendee.star ? 'btn-info' : 'btn-outline-secondary ')}
                    title="Star Attendee"
                    onClick={e => this.toggleStar(e, attendee.star, this.props.meetingID, attendee.attendeeID)
                    }
                  >
                    <FaStar className="" />
                  </button>
                  <a className="btn btn-sm btn-outline-secondary" href={`mailto:${attendee.attendeeEmail}`} title="Mail Attendee"><FaEnvelope></FaEnvelope> </a>
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    title="Delete Attendee"
                    onClick={e => this.deleteAttendee(e, this.props.meetingID, attendee.attendeeID)
                    }
                  >
                    <FaTrash className="text-danger" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    });

    return (
      <div className="row justify-content-center align-items-center flex-column py-4">
        {attendeesHtml}
      </div>
    );
  }
}

export default AttendeesList;
