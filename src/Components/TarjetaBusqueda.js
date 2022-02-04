import React from "react"
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export default function TarjetaBusqueda(props) {
    return (
        <li className="item-busqueda" >
            <div onClick={props.handleClick}>
                <div>{props.name}</div>
                <div>
                    <small>{props.region}, {props.country}</small>
                </div>
            </div>
            <div className="sumar" onClick={props.agregar}>
                <FontAwesomeIcon icon={faPlusCircle}/>
            </div>
        </li>
    )
}