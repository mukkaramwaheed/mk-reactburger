import React from 'react';
// import Aux from '../../hoc/Aux';
import './Input.css';
const input = (props) => {
    let inputElement = null;
    let inputClassess = ['InputElement'];

    if(props.invalid && props.shouldValidate && props.touched){
        inputClassess.push('Invalid');
    }
     switch (props.elementType) {
        case ('input'):
            inputElement = <input 
            className={inputClassess.join(' ')} 
             {...props.elementConfig}
             value={props.value}
             onChange={props.changed}  
             />;
            break;
        case('textarea'):
            inputElement = <textarea className={inputClassess.join(' ')}
            {...props.elementConfig}
             value={props.value}
             onChange={props.changed}
             />;
            break;
        case('select'):
        inputElement = (
            <select 
            className={inputClassess.join(' ')}
            value={props.value}
            onChange={props.changed}
            >
            {
                props.elementConfig.options.map(opt => 
                    (
                    <option key={opt.value} 
                            value={opt.value}>
                            {opt.displayValue}
                    </option>
                    )
                 )
            }  
            </select>
        );
        break;

        default:
            inputElement = <input className="InputElement" 
            {...props.elementConfig}
             value={props.value}
             onChange={props.changed}  
              />;
    }
    return (
        <div className="Input">
            <label className="Label">{props.label}</label>
            {inputElement}

        </div>
        )
};

export default input;