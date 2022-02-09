import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTimes } from "@fortawesome/free-solid-svg-icons"
import { faPen } from "@fortawesome/free-solid-svg-icons"
import { faTrash } from "@fortawesome/free-solid-svg-icons"

class CiudadesFavs extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            infoCiudades: [],
            infoLocal: this.props.infoLocal,
            ciudadActual: {
                datosCargados: false
            },
            eliminar: false
        }
    }

    componentDidMount() {

        fetch(`https://api.weatherapi.com/v1/current.json?key=9658158b8c4544859d4194427210410&q=${this.props.ubicacionActual}&aqi=no&lang=es`)
            .then(res => res.json())
            .then(data => this.setState({
                ciudadActual: {
                    clima: data.current,
                    temperatura: data.current.temp_c,
                    icono: data.current.condition.icon,
                    condiciones: data.current.condition.text,
                    ciudadActual: data.location.name,
                    pais: data.location.country,
                    localtime: data.location.localtime,
                    datosCargados: true
                }
            }))

        for (let i = 0; i < this.props.ciudadesDisponibles.length; i++) {
            fetch(`https://api.weatherapi.com/v1/current.json?key=9658158b8c4544859d4194427210410&q=${this.props.ciudadesDisponibles[i].name}&aqi=no&lang=es`)
                .then(res => res.json())
                .then(data => this.setState(prevState => ({
                    infoCiudades: [...prevState.infoCiudades, {
                        clima: data.current,
                        condiciones: data.current.condition.text,
                        esDia: data.current.is_day,
                        ciudadPorBuscar: data.location.name,
                        ciudadActual: data.location.name,
                        pais: data.location.country,
                        localtime: data.location.localtime
                    }]
                })))
        }


    }

    render() {
        const eliminarFav = (e) => {
            const ciudad = e.ciudadActual
            this.setState({
                infoCiudades: this.state.infoCiudades.filter(e => e.ciudadActual !== ciudad)
            })
            this.props.eliminarFav(e)
        }



        const listaFavoritos = this.state.infoCiudades.map(e => {
            return (
                <li>
                    {this.state.eliminar ? <div className="item-fav-eliminar">
                        <div className="item-fav-eliminar-icono">
                            <FontAwesomeIcon icon={faTrash} onClick={() => eliminarFav(e)} />
                        </div>
                    </div> : ""}
                    <div className="item-favs">
                        <div className="item-favs-uno">
                            <div className="item-favs-uno-uno">
                                <span>{e.ciudadActual}</span>
                                <small>{e.pais}</small>
                            </div>
                            <div className="item-favs-uno-dos">
                                <small>{e.condiciones}</small>
                            </div>
                        </div>
                        <div className="item-favs-dos">
                            <div>
                                <div className="item-fav-temp">{e.clima.temp_c}°C</div>
                                <div className="item-fav-icono">
                                    <img src={e.clima.condition.icon} />
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
            )
        })

        const toggleEliminar = () => {
            this.setState(prevState => ({
                eliminar: !prevState.eliminar
            }))
        }

        const quitarSeleccion = () => {
            toggleEliminar()
        }

        console.log(this.props.ciudadesDisponibles)

        return (
            <>
                <div className="fondo-modal">
                    <div className="cuerpo-opciones">
                        <div className="header-favs">
                            <div>Tus ciudades</div>
                            <div>
                                <FontAwesomeIcon icon={faPen} className="header-favs-icono" onClick={quitarSeleccion} />
                                <FontAwesomeIcon icon={faTimes} onClick={this.props.handleClick} className="header-favs-icono" onClick={this.props.handleClick} />
                            </div>
                        </div>
                        <div className="lista-favs">
                            <ul>
                                <li>
                                    <div className="item-favs">
                                        <div className="item-favs-uno">
                                            <div className="item-favs-uno-uno">
                                                <span>{this.state.ciudadActual.ciudadActual}</span>
                                                <small>{this.state.ciudadActual.pais}</small>
                                            </div>
                                            <div className="item-favs-uno-dos">
                                                <small>{this.state.ciudadActual.condiciones}</small>
                                            </div>
                                        </div>
                                        <div className="item-favs-dos">
                                            <div>
                                                <div>{this.state.ciudadActual.temperatura} °C</div>
                                                <div className="item-fav-icono">
                                                    <img src={this.state.ciudadActual.icono} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                {listaFavoritos}
                            </ul>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default CiudadesFavs