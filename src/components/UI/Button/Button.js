import React from 'react';

import './Button.css';

const button = (props) => {
   
    let classess =  ['Button',props.btnType];
    return(
        <button
        disabled={props.disabled}
        className={classess.join(' ')}
        onClick={props.clicked}>{props.children}</button>
    )

    };

export default button;