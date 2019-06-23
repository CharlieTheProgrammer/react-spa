import React, { Component } from "react";
import { FaTrash, FaSignInAlt, FaList } from "react-icons/fa";
import { navigate } from "@reach/router";

export default class MeetingList extends Component {
  render() {
    return (
      <div>
        {this.props.meetings && this.props.meetings.length
          ? this.props.meetings.map(meeting => {
            return (
              <div className="list-group-item d-flex" key={meeting.meetingID}>
                <section className="pl-3 text-left d-flex align-items-center justify-content-between w-100">
                  <div>{meeting.meetingName}</div>
                  <div>
                    <ul className="list-group list-group-horizontal">
                      <li className="list-group-item border"
                      style={
                          {
                            cursor: 'pointer'
                          }
                        }
                        onClick={() => navigate(`/checkin/${this.props.user.uid}/${meeting.meetingID}`, { state: { meetingID: meeting.meetingID } })}>
                        <FaSignInAlt
                          className="text-primary"
                        />
                      </li>
                      <li className="list-group-item border"
                      style={
                        {
                          cursor: 'pointer'
                        }
                      }
                      onClick={() => navigate(`/attendees/${this.props.user.uid}/${meeting.meetingID}`)}
                      >
                        <FaList />
                      </li>
                      <li className="list-group-item border"
                        style={
                          {
                            cursor: 'pointer'
                          }
                        }
                        onClick={() => this.props.deleteMeeting(meeting.meetingID)}>
                      <FaTrash className="text-danger" />
                      </li>
                    </ul>
                  </div>
                </section>
              </div>
            );
          })
          : null}
      </div>
    );
  }
}
