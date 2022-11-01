
import React from "react";

export default function SliderItem (props?: any) {
    return (
        <div className='slip-item' {...props}>
            {props?.children}
        </div>
    )
}