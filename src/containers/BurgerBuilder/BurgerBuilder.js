import React, {Component} from 'react';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls  from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';

import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import * as actions from '../../store/actions/index';
import {connect} from 'react-redux';

// const INGREDIENTS_PRICE = {

//     salad: 0.5,
//     bacon: 2.5,
//     cheese: 3.5,
//     meat: 2
// };

export class BurgerBuilder extends Component{

        // constructor(props) {
    //     super(props);
    //     this.state = {...}
    // }
    state = {
        // ingredients: null,
        // totalPrice:4,
        // purchaseable: false,
        purchasing: false,
        // loading:false,
        // error: false
    };

    componentDidMount(){
        this.props.onInitIngredients();

        // axios.get('https://angularbasic-8649d.firebaseio.com/ingredients.json').then(response => {
        //     this.setState({ingredients: response.data})
        // })
        // .catch(erro => {
        //     this.setState({error:true})
        // })
    }
    updatePurchaseState (ingredients) {
        const sum = Object.keys( ingredients )
            .map( igKey => {
                return ingredients[igKey];
            } )
            .reduce( ( sum, el ) => {
                return sum + el;
            }, 0 );
            return sum > 0
        // this.setState( { purchasable: sum > 0 } );
    }
    
    // ingredientAdded = (type) => {
    //     const oldCount = this.props.ings[type];
    //     const updatedCount = oldCount + 1;
    //     const updatedIngredients = {
    //         ...this.props.ings
    //     }
    //     updatedIngredients[type] = updatedCount;
    //     const oldPrice = this.state.totalPrice;
    //     const newPrice = INGREDIENTS_PRICE[type] + oldPrice;
    //     this.setState({totalPrice: newPrice, ingredients:updatedIngredients})
    //     this.updatePurchaseState(updatedIngredients);

    // }

    // ingredientRemoved = (type) => {
    //     const oldCount = this.props.ings[type];
    //     if(oldCount <= 0) {
    //         return;
    //     }
    //     const updatedCount = oldCount - 1;
    //     const updatedIngredients = {
    //         ...this.props.ings
    //     }
    //     updatedIngredients[type] = updatedCount;
    //     const oldPrice = this.state.totalPrice;
    //     const newPrice = INGREDIENTS_PRICE[type] - oldPrice;
    //     this.setState({totalPrice: newPrice, ingredients:updatedIngredients});
    //     this.updatePurchaseState(updatedIngredients);

    // }

    
    purchaseHandler = () => {
        // this.setState({purchasing: true});

        if (this.props.isAuthenticated) {
            this.setState( { purchasing: true } );
        } else {
            this.props.onSetAuthRedirectPath('/checkout');
            this.props.history.push('/auth');
        }
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    }

    purchaseContinueHandler = () => {
        
        this.props.onInitPurchase();
        this.props.history.push('/checkout');
        // const queryParams = [];
        // for(let i in this.props.ings){
        //     queryParams.push(encodeURIComponent(i)+ '=' + this.props.ings[i]);
        // }
        
        // queryParams.push('price='+ this.state.totalPrice);

        // const queryString = queryParams.join('&');
        // this.props.history.push({
        //     pathname:'checkout',
        //     search :'?' + queryString
        // });

    } 

    
    render(){
        const disabledInfo = {
            ...this.props.ings
        };
        for (let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0;
        }
        let orderSummary = null;
        
        let burger = this.props.error ? <p>Error</p> : <Spinner/>
        if(this.props.ings){
            burger = (
                    <Aux>
                         <Burger ingredients={this.props.ings}/>
                        <BuildControls
                        ingredientAdded={this.props.onIngredientAdded}
                        ingredientRemoved={this.props.onIngredientRemoved}
                        disabled={disabledInfo}
                        price={this.props.price}
                        isAuth={this.props.isAuthenticated}
                        purchasable={this.updatePurchaseState(this.props.ings)}
                            ordered={this.purchaseHandler}
                        />
                       
                    </Aux>
                    )
                    orderSummary =  <OrderSummary 
                    ingredients={this.props.ings}
                    price={this.props.price}
                    purchaseCancelled={this.purchaseCancelHandler}
                    purchaseContinued={this.purchaseContinueHandler} />
                   
        }
        // if(this.state.loading){
        //     orderSummary = <Spinner/>
        // }
        return(
            <Aux>
                 <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}           
                </Modal>
                    {burger}
            </Aux>
        )
    }
}

const mapStateToProps = state => {
    return {
        ings : state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error,
        isAuthenticated: state.auth.token !== null
    }
}
const mapDispatchToProps = dispatch => {

    return {
        onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
        onIngredientRemoved: (ingName) => dispatch(actions.removeIngredient(ingName)),
        onInitIngredients: () =>  dispatch(actions.initIngredients()),
        onInitPurchase: () => dispatch(actions.purchaseInit()),
        onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(withErrorHandler(BurgerBuilder,axios));