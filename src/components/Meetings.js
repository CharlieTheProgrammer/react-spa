import React, { Component } from "react";
import validate from "../features/errorHandling/Validation";
import { FaCentercode } from "react-icons/fa";

class Meetings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      meetingName: "",
      meetingNameError: "",
      onSubmitCheck: ["meetingName"]
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.validateField = this.validateField.bind(this);
  }

  handleChange(evt) {
    this.setState({ [evt.target.name]: evt.target.value });
  }

  handleBlur(evt) {
    this.validateField(evt.target.name, evt.target.value);
  }

  handleSubmit(evt) {
    evt.preventDefault();

    const { onSubmitCheck } = this.state;

    // Validate before submitting
    // This can probably be extracted to a utils file or validation helper
    var errs = [];
    for (let i = 0; i < onSubmitCheck.length; i++) {
      let fieldName = onSubmitCheck[i];
      let valueToCheck = this.state[fieldName];

      if (this.validateField(fieldName, valueToCheck)) {
        let e = this.validateField(fieldName, valueToCheck);
        errs.push(e.message);
      }
    }

    if (errs.length === 0) {
      this.props.addMeeting(this.state.meetingName);
      this.setState({ meetingName: "" });
    }
  }

  validateField(fieldName, value) {
    let errs = validate[fieldName](value);
    if (errs) {
      this.setState({ [fieldName + "Error"]: errs.message });
      return errs;
    } else {
      this.setState({ [fieldName + "Error"]: "" });
      return false;
    }
  }

  render() {
    return (
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-md-8 text-center">
            <h1 className="font-weight-light">Add a Meeting</h1>
            <div className="card bg-light">
              <div className="card-body text-center">
                <form className="formgroup" onSubmit={this.handleSubmit}>
                  <div className="input-group input-group-lg">
                    <input
                      type="text"
                      className={
                        this.state.meetingNameError
                          ? "form-control is-invalid"
                          : "form-control"
                      }
                      id="meetingName"
                      name="meetingName"
                      placeholder="Meeting name"
                      aria-describedby="buttonAdd"
                      value={this.state.meetingName}
                      onChange={this.handleChange}
                      onBlur={this.handleBlur}
                    />
                    <div className="input-group-append">
                      <button
                        type="submit"
                        className="btn btn-sm btn-info"
                        id="buttonAdd"
                      >
                        +
                      </button>
                    </div>
                    <div className="invalid-feedback">
                      {this.state.meetingNameError}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
           <div className="col-11 col-md-6 text-center">
            <div className="card border-top-0 rounded-0">
              {this.props.meetings && this.props.meetings.length ? (
                <div className="card-body py-2">
                  <h4 className="card-title font-weigth-light m-0">
                    Your Meetings
                  </h4>
                </div>
              ) : null}
              {this.props.meetings && (
                <div className="list-group list-group-flush">

                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Meetings;
