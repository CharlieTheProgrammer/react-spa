import React, { Component } from "react";

class AttendeesList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const attendees = this.props.attendees;
    const attendeesHtml = attendees.map(attendee => {
      return (
        <div
          className="col-8 col-sm-6 col-md-7 col-lg-5 my-2 p-0 px-1"
          key={attendee.attendeeID}
        >
          <div className="card">
            <div className="card-body px-3 py-2 d-flex align-items-center justify-content-center">
              <div>{attendee.attendeeName}</div>
            </div>
          </div>
        </div>
      );
    });

    return <div className="row justify-content-center align-items-center flex-column py-4">{attendeesHtml}</div>;
  }
}

export default AttendeesList;
