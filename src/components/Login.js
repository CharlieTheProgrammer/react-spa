import React, { Component } from "react";
import validate from "../features/errorHandling/Validation";
import firebase from '../services/firebase'
import { navigate } from "@reach/router";

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      emailError: "",
      password: '',
      passwordError: '',
      onSubmitCheck: ['email', 'password']
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
      console.log(errs.length, "Submitting Form...");

      firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => {
        console.log("Signed In successfully")
        navigate('/meetings')
      })
      .catch((err) => {
        console.log("Error signing in", err)
        this.setState({ formError: "Login Failed"})
      })
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
      <div className="container">
        <form onSubmit={this.onSubmit} noValidate>
          <div className="form-group">
            <div className={this.state.formError ? "alert-danger mb-2 p-1" : ""}>
              {this.state.formError}
            </div>
            <label htmlFor="email">Email</label>
            <input
              type="text"
              className={this.state.usernameError ? "form-control is-invalid" : "form-control"}
              id="email"
              name="email"
              aria-describedby="emailHelp"
              placeholder="Enter email"
              value={this.state.email}
              onChange={this.handleChange}
              onBlur={this.handleBlur}
            />
            <div className="invalid-feedback">
              {this.state.emailError}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className={this.state.passwordError ? "form-control is-invalid" : "form-control"}
              id="password"
              name="password"
              placeholder="Password"
              value={this.state.password}
              onChange={this.handleChange}
              onBlur={this.handleBlur}
            />
            <div className="invalid-feedback">
              {this.state.passwordError}
            </div>
          </div>
          <button type="submit" className="btn btn-primary">
            Log In
          </button>
        </form>
      </div>
    );
  }
}
