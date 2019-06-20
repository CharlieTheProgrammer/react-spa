import React, { Component } from "react";
import { FaTrash } from "react-icons/fa";

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
                      <FaTrash
                        className="text-danger"
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
