import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter, Switch, Route } from 'react-router-dom'

import { thunkVarifyUser } from '../store/user'
import SignIn from './SignIn'
import Portfolio from './Portfolio'
import Transactions from './Transactions'
import Header from './Header'
import { clearNote } from '../store/notification'

class Root extends Component {

    componentDidMount(){
        this.props.verifyUser()
    }
    render(){
        console.log(this.props.user)
        this.props.clearNote()
        return(
            <div>
                <nav>
                    {this.props.user.userName ? <Header /> : null}
                </nav>
                <main>
                <Switch>
                     <Route path='/signin' component={SignIn} />
                     {this.props.user.userName && (
                    <Switch>
                        <Route path='/portfolio' component={Portfolio} />
                        <Route path='/transactions' component={Transactions} />
                        <Route component={Portfolio} />
                    </Switch>
                     )}
                    <Route component={SignIn} />
                </Switch>
                </main>
            </div>
        )
    }
}



const mapState = (state) => {
    return {
        user: state.user,
    }
}

const mapDispatch = (dispatch) => {
    return {
        verifyUser: () => dispatch(thunkVarifyUser()),
        clearNote: () => dispatch(clearNote())
    }
}

export default withRouter(connect(mapState, mapDispatch)(Root))
// export default Root
