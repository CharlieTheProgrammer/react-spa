import React, { Component } from 'react';
import validate from '../features/errorHandling/Validation'
import firebase from "../services/firebase";

class Register extends Component {
  constructor() {
    super();
    this.state = {
      displayName: '',
      displayNameError: '',
      email: '',
      emailError: '',
      password: '',
      passwordError: '',
      passwordConfirm: '',
      passwordConfirmError: '',
      formError: '',
      onSubmitCheck: ['displayName', 'email', 'password', 'passwordConfirm']
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.submitUser = this.submitUser.bind(this);
    this.validateField = this.validateField.bind(this);
  }

  handleChange(evt) {
    this.setState({ [evt.target.name]: evt.target.value })
  }

  handleBlur(evt) {
    this.validateField(evt.target.name, evt.target.value)
  }

  submitUser(evt) {
    evt.preventDefault()
    let { onSubmitCheck, password, passwordConfirm } = this.state

    // This can probably be extracted to a utils file or validation helper
    var errs = []
    for (let i = 0; i < onSubmitCheck.length; i++) {
      let fieldName = onSubmitCheck[i]
      let valueToCheck = this.state[fieldName]

      if (this.validateField(fieldName, valueToCheck)) {
        let e = this.validateField(fieldName, valueToCheck)
        errs.push(e.message)
      }
    }

    // Add custom validation here
    if (password !== passwordConfirm) {
      errs.push("Password must match Confirm Password")
      this.setState({passwordConfirmError: "Password must match Confirm Password"})
    }

    if (errs.length === 0) {
      // No errors found proceed
      console.log(errs.length, "Submitting Form...")

      firebase.auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(() => this.props.registerUser(this.state.displayName))
        .then(result => console.log(result))
        .catch(error => {
          console.log(error)
          this.setState({formError: error.message})
        })
    } else {
      return
    }
  }

  validateField(fieldName, value) {
    let errs = validate[fieldName](value) //validate.displayName(value)
    if (errs) {
      this.setState({ [fieldName + "Error"]: errs.message })
      // this.setState({ displayNameError: errs.message })
      return errs
    } else {
      this.setState({ [fieldName + "Error"]: '' })
      return false
    }
  }

  // was-validated should not be used because 1. It can only really be applied at the end. 2. It only pays attention to HTML5 validity api and ignores
  // custom validation. Ie, if a required field is not empty, was-validated will mark that as valid, even if we have custom validation that's failing
  render() {
    return (
      <form className="mt-3" onSubmit={this.submitUser} noValidate>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="card bg-light">
                <div className="card-body">
                  <h3 className="font-weight-light mb-3">Register</h3>
                  <div className="form-row">
                    <section className="col-sm-12 form-group">
                    <div className={this.state.formError ? "alert-danger mb-2 p-1" : ""}>
                      {this.state.formError}
                    </div>
                      <label
                        className="form-control-label sr-only"
                        htmlFor="displayName"
                      >
                        Display Name
                      </label>
                      <input
                        className={this.state.displayNameError ? "form-control is-invalid" : "form-control"}
                        type="text"
                        id="displayName"
                        placeholder="Display Name"
                        name="displayName"
                        required
                        value={this.state.displayName}
                        onChange={this.handleChange}
                        onBlur={this.handleBlur}
                      />
                      <div className="valid-feedback">
                        Looks good!
                      </div>
                      <div className="invalid-feedback">
                        {this.state.displayNameError}
                      </div>
                    </section>
                  </div>
                  <section className="form-group">
                    <label
                      className="form-control-label sr-only"
                      htmlFor="email"
                    >
                      Email
                    </label>
                    <input
                      className={this.state.emailError ? "form-control is-invalid" : "form-control"}
                      type="email"
                      id="email"
                      placeholder="Email Address"
                      required
                      name="email"
                      value={this.state.email}
                      onChange={this.handleChange}
                      onBlur={this.handleBlur}
                    />
                    <div className="invalid-feedback">
                      {this.state.emailError}
                    </div>
                  </section>
                  <div className="form-row">
                    <section className="col-sm-6 form-group">
                      <input
                        className={this.state.passwordError ? "form-control is-invalid" : "form-control"}
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={this.state.password}
                        onChange={this.handleChange}
                      />
                      <div className="invalid-feedback">
                        {this.state.passwordError}
                      </div>
                    </section>
                    <section className="col-sm-6 form-group">
                      <input
                        className={this.state.passwordConfirmError ? "form-control is-invalid" : "form-control"}
                        type="password"
                        required
                        name="passwordConfirm"
                        placeholder="Confirm Password"
                        value={this.state.passwordConfirm}
                        onChange={this.handleChange}
                      />
                      <div className="invalid-feedback">
                        {this.state.passwordConfirmError}
                      </div>
                    </section>
                  </div>
                  <div className="form-group text-right mb-0">
                    <button className="btn btn-primary" type="submit">
                      Register
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

export default Register;