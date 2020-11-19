import React, { Component } from 'react';
import { connect } from 'react-redux';

import Button from '../../../components/UI/Button/Button';
import './ContactData.css';
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../../store/actions/index';
import {updateObject, checkValidity} from '../../../shared/utility';

class ContactData extends Component {

    state = {
        orderForm: {
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Name'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            street: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Street'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            zipCode: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'ZIP Code'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 5,
                    maxLength: 5
                },
                valid: false,
                touched: false
            },
            country: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Country'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Your E-Mail'
                },
                value: 'test@gmail.com',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            deliveryMethod: {
                elementType: 'select',
                elementConfig: {
                    options: [
                        {value: 'fastest', displayValue: 'Fastest'},
                        {value: 'cheapest', displayValue: 'Cheapest'}
                    ]
                },
                value: 'fastest',
                validation: {},
                valid: true
            }
        },
        formIsValid: false
        // ,
        // loading: false
    }
    // checkValidity(value, rules) {
    //     let isValid = true;
        
    //     if(!rules){
    //         return true;
    //     }
    //     if (rules.required) {
    //         isValid = value.trim() !== '' && isValid;
    //     }

    //     if (rules.minLength) {
    //         isValid = value.length >= rules.minLength && isValid
    //     }

    //     if (rules.maxLength) {
    //         isValid = value.length <= rules.maxLength && isValid
    //     }

    //     return isValid;
    // }

    handler = (event) => {
        event.preventDefault();        
        // this.setState({loading:true});
        // console.log( alert(this.props.userId));
        const formData = {};
        for (let formElementIdentifier in this.state.orderForm) {
            formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
        }
        const order = {
            ingredients: this.props.ings,
            price:this.props.price,
            orderData: formData,
            userId: this.props.userId
        
        }
        this.props.onOrderBurger(order,this.props.token);
        // axios.post('/orders.json',order)
        // .then(response => {

        //     this.setState({loading:false});
        //     this.props.history.push('/');
        
        // })
        // .catch(error => {
        //     this.setState({loading:false});
        // });
    }

    inputChangedHandler = (event,inputIdentifier) => {
        // const updateOrderForm = {
        //     ...this.state.orderForm
        // }
        // const updateFormElement = {
        //     ...updateOrderForm[inputIdentifier]
        // }
        // updateFormElement.value = event.target.value;

        // updateFormElement.valid = this.checkValidity(updateFormElement.value, updateFormElement.validation);
        // updateFormElement.touched = true;

        // updateOrderForm[inputIdentifier] = updateFormElement;

        const updatedFormElement = updateObject(this.state.orderForm[inputIdentifier], {
            value: event.target.value,
            valid: checkValidity(event.target.value, this.state.orderForm[inputIdentifier].validation),
            touched: true
        });
        const updateOrderForm = updateObject(this.state.orderForm, {
            [inputIdentifier]: updatedFormElement
        });


        let formIsValid = true;
        for (let inputIdentifier in updateOrderForm) {
            formIsValid = updateOrderForm[inputIdentifier].valid && formIsValid;
        }
        this.setState({orderForm: updateOrderForm, formIsValid: formIsValid});        
    }

render () {

    let formElementsArray = [];
    for(let key in this.state.orderForm){
        formElementsArray.push({
            id : key,
            config: this.state.orderForm[key]
        })
    }
    
    let form = (
        <form onSubmit={this.handler}>
            {formElementsArray.map(formElm => (

                <Input
                key={formElm.id}
                elementType={formElm.config.elementType} 
                elementConfig={formElm.config.elementConfig}
                value={formElm.config.value}
                invalid={!formElm.config.valid}
                shouldValidate={formElm.config.validation}
                touched={formElm.config.touched}
                changed={(event) => this.inputChangedHandler(event,formElm.id)}
                />
            ))}
       
    
        <Button btnType="Success"  disabled={!this.state.formIsValid}>ORDER</Button>
        </form>
    );
    if(this.props.loading){
        form = <Spinner/>
    }
        return(
            <div className="ContactData">
                <h4>Enter your contact detail</h4>
                {form}
            </div>
        )
    }
}


const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        loading: state.order.loading,
        token: state.auth.token,
        userId: state.auth.userId
    }
};
const mapDispatchToProps = dispatch => {
    return {
     onOrderBurger : (orderData,token) => dispatch(actions.purchaseBurger(orderData,token))
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(withErrorHandler(ContactData,axios));
// export default ContactData;