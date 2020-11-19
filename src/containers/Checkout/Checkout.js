import React, { Component } from 'react';
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import {Route, Redirect} from 'react-router-dom';
import ContactData from './ContactData/ContactData';
import {connect} from 'react-redux';
// import * as actions from '../../store/actions/index';
class Checkout extends Component {

    // state = {
    //     ingredients : null,
    //     totalPrice : 0
    // }

    // componentWillMount(){
    //     const query = new URLSearchParams(this.props.location.search);
    //     const ingredients = {};
    //     let price = '';
    //     for (let params of query.entries())     {

    //         if(params[0] === 'price'){
    //             price = params[1];
    //         }
    //         else{

    //             ingredients[params[0]] = +params[1];
    //         }
    //     }
    //     this.setState({ingredients: ingredients, totalPrice:price});
    // }

    checkoutCancelled = () => {
        this.props.history.goBack();
    }
    
    checkoutContinue = () => {
        this.props.history.push('/checkout/contact-data');
    }
    render () {
        
        let summary = <Redirect to="/" />
        if ( this.props.ings ) {
            const purchasedRedirect = this.props.purchased ? <Redirect to="/"/> : null;
            summary = (
                <div>
                    {purchasedRedirect}
                    <CheckoutSummary
                        ingredients={this.props.ings}
                        checkoutContinue={this.checkoutContinue}
                        checkoutCancelled={this.checkoutCancelled}/>
                    <Route
                        path={this.props.match.path + '/contact-data'}
                        component={ContactData} />
                </div>
            );
        }
        return summary;

        
    }
}

const mapStateToProps = state => {
    return {
        ings : state.burgerBuilder.ingredients,
        // price: state.totalPrice,
        purchased: state.order.purchased
    }
}



export default connect(mapStateToProps)(Checkout);
