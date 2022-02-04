import React from "react"

export default function TarjetasHora(props) {
    return (
        <li>
            <div className="item-hora">
                <div className="hora">
                    {props.time.substring(11, 13)} Hs
                </div>
                <div className="icono">
                    <div><img src={props.icon} /></div>
                </div>
                <div className="probabilidades">
                    <div>{props.chance_of_rain}%</div>
                    <div>
                        <small>Lluvia</small>
                    </div>
                </div>
                <div className="humedad">
                    <div>
                        {props.humidity}%
                    </div>
                    <div>
                        <small>Humedad</small>
                    </div>
                </div>
                <div className="temperatura">
                    {props.temp_c}°C
                </div>
            </div>
        </li>
    )
}