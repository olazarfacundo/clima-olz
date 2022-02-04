import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTimes } from "@fortawesome/free-solid-svg-icons"

export default function ModalError(props) {
    return (
        <div className="fondo-modal">
            <div className="error">
                <div className="error-header">
                    <span onClick={props.handleClick}>
                        <FontAwesomeIcon className="close" icon={faTimes}/>
                    </span>
                </div>
                <div className="error-contenido">
                        Esta ciudad ya esta en la lista.    
                </div>
            </div>
        </div>
    )
}