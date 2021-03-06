import React, { Component } from "react";
import validate from "../features/errorHandling/Validation";
import firebase from "../services/firebase";
import { navigate } from "@reach/router";

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displayName: "",
      displayNameError: "",
      email: "",
      emailError: "",
      onSubmitCheck: ["email", "displayName"]
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.validateField = this.validateField.bind(this);
  }

  handleChange(evt) {
    this.setState({ [evt.target.name]: evt.target.value });
  }

  handleBlur(evt) {
    this.validateField(evt.target.name, evt.target.value);
  }

  onSubmit(evt) {
    evt.preventDefault();
    let { onSubmitCheck } = this.state;

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
      // No errors found proceed

      const ref = firebase
        .database()
        .ref(`/meetings/${this.props.userID}/${this.props.meetingID}/attendees`);

      ref.push({
        attendeeName: this.state.displayName,
        attendeeEmail: this.state.email,
        star: false
      });

      navigate(`/attendees/${this.props.userID}/${this.props.meetingID}`);
    } else {
      return;
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
      <form className="mt-3" onSubmit={this.onSubmit} noValidate>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="card bg-light">
                <div className="card-body">
                  <h3 className="font-weight-light mb-3">Check In</h3>
                  <div className="form-row">
                    <section className="col-sm-12 form-group">
                      <label
                        className="form-control-label sr-only"
                        htmlFor="displayName"
                      >
                        Attendee Name
                      </label>
                      <input
                        className={
                          this.state.displayNameError
                            ? "form-control is-invalid"
                            : "form-control"
                        }
                        type="displayName"
                        id="displayName"
                        placeholder="Attendee Name"
                        required
                        name="displayName"
                        value={this.state.displayName}
                        onChange={this.handleChange}
                        onBlur={this.handleBlur}
                      />
                      <small id="displayNameHelp" className="form-text text-muted">This name will be visible to other attendees.</small>
                      <div className="invalid-feedback">
                        {this.state.passwordError}
                      </div>
                    </section>
                  </div>
                  <div className="form-row">
                    <section className="col-sm-12 form-group">
                      <div
                        className={
                          this.state.formError ? "alert-danger mb-2 p-1" : ""
                        }
                      >
                        {this.state.formError}
                      </div>
                      <label
                        className="form-control-label sr-only"
                        htmlFor="email"
                      >
                        Email
                      </label>
                      <input
                        className={
                          this.state.emailError
                            ? "form-control is-invalid"
                            : "form-control"
                        }
                        type="text"
                        id="email"
                        placeholder="Email"
                        name="email"
                        required
                        value={this.state.email}
                        onChange={this.handleChange}
                        onBlur={this.handleBlur}
                      />
                      <div className="valid-feedback">Looks good!</div>
                      <div className="invalid-feedback">
                        {this.state.emailError}
                      </div>
                    </section>
                  </div>
                  <div className="form-group text-right mb-0">
                    <button className="btn btn-primary" type="submit">
                      Check In
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    );
  }
}
