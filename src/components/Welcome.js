import React, { Component } from 'react'
import { Link } from '@reach/router'

class Welcome extends Component {
    render() {
        const { user, logOut } = this.props

        return (
            <div className="text-center my-4">
                { user &&
                <div>
                    <span className="text-secondary font-weight-bold pl-1 mx-2">
                        Welcome {' ' + user + ' '}
                    </span>
                    <Link to="/login" onClick={logOut}>Log Out</Link>
                </div>
                }
            </div>
        )
    }
}

export default Welcome