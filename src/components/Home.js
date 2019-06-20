import React,{ Component } from 'react';
import { Link } from '@reach/router'

class Home extends Component {
  render() {
    const { user } = this.props
    return (
      <div className="container text-center">
        <div className="row justify-content-center">
          <div className="col-10 col-md-10 col-lg-8 col-xl-7">
            <div className="display-4 text-primary mt-3 mb-2">
              Meeting Log
            </div>
            <p className="lead">
              This simple app creates meetings, allows people to check in, and picks random users to award giveaways.
            </p>
            { !user &&
                <React.Fragment>
                <Link
                to="/register"
                className="btn btn-outline-primary mr-2"
                >
                Register
                </Link>
                <Link to="/login" className="btn btn-outline-primary mr-2">
                Log In
                </Link>
                </React.Fragment>
            }
            { user &&
                <Link to="/meetings" className="btn btn-primary">
                Meetings
                </Link>
            }
          </div>
        </div>
      </div>
    );
  }
}

export default Home;