import React from "react"
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export default function TarjetaBusqueda(props) {
    return (
        <li className="item-busqueda" >
            <div onClick={props.agregar}>
                <div>{props.name}</div>
                <div>
                    <small>{props.region}, {props.country}</small>
                </div>
            </div>
        </li>
    )
}