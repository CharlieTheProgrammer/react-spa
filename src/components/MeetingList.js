import React, { Component } from "react";
import { FaTrash, FaSignInAlt } from "react-icons/fa";
import { navigate } from "@reach/router";

export default class MeetingList extends Component {
  render() {
    return (
      <div>
        {this.props.meetings && this.props.meetings.length
          ? this.props.meetings.map(meeting => {
              return (
                <div className="list-group-item d-flex" key={meeting.meetingID}>
                  <section className="pl-3 text-left d-flex align-self-center justify-content-between w-100">
                    <div>{meeting.meetingName}</div>
                    <div>
                        <FaSignInAlt
                          className="text-primary mx-2"
                          style={
                            {
                              cursor: 'pointer'
                            }
                          }
                          onClick={() => navigate(`/checkin/${this.props.user.uid}/${meeting.meetingID}`, {state:{meetingID: meeting.meetingID}})}
                        />
                      <FaTrash
                        className="text-danger mx-2"
                        style={
                          {
                            cursor: 'pointer'
                          }
                        }
                        onClick={() => this.props.deleteMeeting(meeting.meetingID)}
                      />
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
