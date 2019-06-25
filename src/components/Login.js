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
      formError: '',
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

      firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => {
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
      <form className="mt-3" onSubmit={this.onSubmit} noValidate>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="card bg-light">
                <div className="card-body">
                  <h3 className="font-weight-light mb-3">Login</h3>
                  <div className="form-row">
                    <section className="col-sm-12 form-group">
                    <div className={this.state.formError ? "alert-danger mb-2 p-1" : ""}>
                      {this.state.formError}
                    </div>
                      <label
                        className="form-control-label sr-only"
                        htmlFor="email"
                      >
                        Email
                      </label>
                      <input
                        className={this.state.emailError ? "form-control is-invalid" : "form-control"}
                        type="text"
                        id="email"
                        placeholder="Email"
                        name="email"
                        required
                        value={this.state.email}
                        onChange={this.handleChange}
                        onBlur={this.handleBlur}
                      />
                      <div className="valid-feedback">
                        Looks good!
                      </div>
                      <div className="invalid-feedback">
                        {this.state.emailError}
                      </div>
                    </section>
                  </div>
                  <section className="form-group">
                    <label
                      className="form-control-label sr-only"
                      htmlFor="password"
                    >
                      Passsword
                    </label>
                    <input
                      className={this.state.passwordError ? "form-control is-invalid" : "form-control"}
                      type="password"
                      id="password"
                      placeholder="Password"
                      required
                      name="password"
                      value={this.state.password}
                      onChange={this.handleChange}
                      onBlur={this.handleBlur}
                    />
                    <div className="invalid-feedback">
                      {this.state.passwordError}
                    </div>
                  </section>
                  <div className="form-group text-right mb-0">
                    <button className="btn btn-primary" type="submit">
                      Login
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
