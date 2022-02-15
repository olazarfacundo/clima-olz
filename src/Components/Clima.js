import React from "react"
import Cargador from "./Cargador"
import TarjetaBusqueda from "./TarjetaBusqueda"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTimes } from "@fortawesome/free-solid-svg-icons"
import { faBars } from "@fortawesome/free-solid-svg-icons"
import { faLocationArrow } from "@fortawesome/free-solid-svg-icons"
import { faCircle } from "@fortawesome/free-solid-svg-icons"
import { faSearch } from "@fortawesome/free-solid-svg-icons"
import TarjetasHora from "./TarjetasHora"
import ModalError from "./ModalError"
import CiudadesFavs from "./CiudadesFavs"

class Clima extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            lat: "",
            long: "",
            clima: {},
            pronostico: {},
            esDia: {},
            ciudadPorBuscar: "Buenos Aires",
            ubicacionActual: "",
            pais: "",
            ciudadesEncontradas: {},
            ciudadesDisponibles: [],
            modalBusqueda: false,
            modalFavs: false,
            modalError: false,
            datosCargados: false
        }
    }

    componentDidMount() {
        const conseguirData = async () => {

            const getCoords = async () => {
                const pos = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject);
                });

                this.setState({
                    long: pos.coords.longitude,
                    lat: pos.coords.latitude,
                })
            };

            const coords = await getCoords();
            fetch(`https://api.weatherapi.com/v1/forecast.json?key=9658158b8c4544859d4194427210410&q=${this.state.lat},${this.state.long}&days=3&aqi=no&alerts=no&lang=es`)
                .then(res => res.json())
                .then(data => this.setState({
                    clima: data.current,
                    pronostico: data.forecast.forecastday,
                    condiciones: data.current.condition.text,
                    esDia: data.current.is_day,
                    ciudadPorBuscar: data.location.name,
                    ciudadActual: data.location.name,
                    ubicacionActual: data.location.name,
                    pais: data.location.country,
                    localtime: (data.location.localtime),
                    horaLocalEspecifica: Number((data.location.localtime).substring(11, 13)),
                    //horaLocalEspecifica: data.location.localtime,
                    horaLocal: (data.location.localtime).substring(11, 17),
                    datosCargados: true
                }))
        }

        conseguirData()
    }


    render() {
        const nombresDias = ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"]
        const hoy = new Date()
        const diaIndice = hoy.getDay()
        const mañana = new Date(hoy)
        mañana.setDate(mañana.getDate() + 1)
        const diaMañana = mañana.getDate()
        const diaHoy = hoy.getDate()
        const todasLasHorasHoy = []
        const todasLasHorasMañana = []
        const todasLasHorasPasado = []
        const array = Array.from(this.state.pronostico)

        const limpiarInfo = () => {
            const data = []
            array.forEach(e => {
                data.push(e.hour)
            })
            return data.flat()
        }

        todasLasHorasHoy.push(limpiarInfo().filter(e => e.time.includes(diaHoy)))
        todasLasHorasMañana.push(limpiarInfo().filter(e => e.time.includes(diaMañana)))
        todasLasHorasPasado.push(limpiarInfo().filter(e => e.time.includes(diaHoy + 2)))

        const listaHorasHoy = []

        for (let i = (this.state.horaLocalEspecifica + 1); i < (this.state.horaLocalEspecifica + 12); i++) {
            if (i === 24) {
                break;
            } else {
                listaHorasHoy.push(todasLasHorasHoy[0][i])
            }
        }
        if (listaHorasHoy.length < 11) {
            for (let j = 0; listaHorasHoy.length < 12; j++) {
                listaHorasHoy.push(todasLasHorasMañana[0][j])
            }
        }


        const tarjetas = listaHorasHoy.map(e => {
            if (e) {
                return (
                    <TarjetasHora
                        time={e.time}
                        icon={e.condition.icon}
                        chance_of_rain={e.chance_of_rain}
                        humidity={e.humidity}
                        temp_c={e.temp_c}
                    />
                )
            }
        })

        function disableScroll() {
            var x = window.scrollX;
            var y = window.scrollY;
            window.onscroll = function () { window.scrollTo(x, y) };
        }

        function enableScroll() {
            window.onscroll = null;
        }

        const toggleModalBusqueda = () => {
            this.setState(prevState => ({
                modalBusqueda: !prevState.modalBusqueda
            }))
            if (this.state.modalBusqueda) {
                enableScroll()
            } else {
                disableScroll()
            }
        }

        const toggleModalError = () => {
            this.setState(prevState => ({
                modalError: !prevState.modalError
            }))
        }

        const buscarCiudades = (event) => {
            fetch(`https://api.weatherapi.com/v1/search.json?key=9658158b8c4544859d4194427210410&q=${event.target.value}`)
                .then(res => res.json())
                .then(data => this.setState({ ciudadesEncontradas: data }))
        }

        const actualizarCiudad = (ciudad) => {
            fetch(`https://api.weatherapi.com/v1/forecast.json?key=9658158b8c4544859d4194427210410&q=${ciudad}&days=7&aqi=no&alerts=no&lang=es`)
                .then(res => res.json())
                .then(data => this.setState({
                    clima: data.current,
                    pronostico: data.forecast.forecastday,
                    condiciones: data.current.condition.text,
                    esDia: data.current.is_day,
                    ciudadPorBuscar: data.location.name,
                    pais: data.location.country,
                    localtime: new Date(data.location.localtime),
                    horaLocal: (data.location.localtime).substring(11, 17),
                    horaLocalEspecifica: Number((data.location.localtime).substring(11, 13)),
                    datosCargados: true
                }))
            if (this.state.modalBusqueda) {
                toggleModalBusqueda()
            }
        }


        const resultadosBusqueda = Array.from(this.state.ciudadesEncontradas)

        const tarjetasBusquedas = resultadosBusqueda.map(e => {
            return (
                <TarjetaBusqueda
                    name={e.name}
                    region={e.region}
                    country={e.country}
                    handleClick={() => actualizarCiudad(e.name)}
                    agregar={() => agregarAFavs(e)}
                />
            )
        })

        const agregarAFavs = (e) => {
            if (this.state.ciudadesDisponibles.includes(e)) {
                toggleModalError()
            } else {
                this.setState(this.state.ciudadesDisponibles = [
                    ...this.state.ciudadesDisponibles, e
                ])
                actualizarCiudad(e.name)
                this.setState(() => ({
                    modalBusqueda: false
                }))
            }
            actualizarStorage()
        }

        const eliminarFav = (e) => {
            const ciudad = e.ciudadActual
            this.setState({
                ciudadesDisponibles: this.state.ciudadesDisponibles.filter(e => e.name !== ciudad)
            })
            actualizarCiudad(this.state.ciudadActual)
            actualizarStorage()
        }

        const infoLocal = () => {
            return JSON.parse(localStorage.ciudadesDisponibles).map(e => {
                return (
                    <FontAwesomeIcon icon={faCircle} className="item-fav" onClick={() => actualizarCiudad(e.name)} />
                )
            })
        }

        const favoritos = this.state.ciudadesDisponibles.map(e => {
            return (
                <FontAwesomeIcon icon={faCircle} className={`item-favs ${this.state.datosCargados ? "" : "ocultar"}`} onClick={() => actualizarCiudad(e.name)} />
            )
        })

        const toggleModalFavs = () => {
            this.setState(prevState => ({
                modalFavs: !prevState.modalFavs
            }))
        }

        const actualizarStorage = () => {
            if (this.state.ciudadesDisponibles.length === 0) {
                localStorage.removeItem("ciudadesDisponibles")
            } else {
                localStorage.setItem("ciudadesDisponibles", JSON.stringify(this.state.ciudadesDisponibles))
            }
        }

        
        const almacenarLocalmente = () => {
            const ciudadesAlmacendasLocal = []
            if(localStorage.ciudadesDisponibles){
                JSON.parse(localStorage.ciudadesDisponibles).map(e => {
                    ciudadesAlmacendasLocal.push(e)
                })
                return ciudadesAlmacendasLocal
            }else{
                return false
            }
        }


        return (
            <>
                {this.state.datosCargados === false ? <Cargador /> : ""}
                {this.state.modalFavs ?
                    <CiudadesFavs
                        ubicacionActual={this.state.ubicacionActual}
                        ciudadesDisponibles={almacenarLocalmente() ? almacenarLocalmente() : this.state.ciudadesDisponibles}
                        handleClick={() => toggleModalFavs()}
                        eliminarFav={(e) => eliminarFav(e)}
                        actualizarStorage={() => actualizarStorage()}
                    />
                    : ""}
                <div className={this.state.modalBusqueda ? "fondo-modal" : "fondo-modal ocultar"}>
                    <div className={this.state.modalBusqueda ? "cuerpo-opciones" : "cuerpo-opciones ocultar"}>
                        <div className="opciones">
                            <div className="header-buscar">
                                <div>
                                    <h4>Buscar por ciudad</h4>
                                </div>
                                <div>
                                    <span onClick={toggleModalBusqueda} className="close">
                                        <FontAwesomeIcon icon={faTimes} />
                                    </span>
                                </div>
                            </div>
                            <div className="input-buscar">
                                <div>
                                    <form>
                                        <input placeholder="Buscar ciudad" onChange={buscarCiudades} />
                                    </form>
                                </div>
                            </div>
                            <div className="lista-buscar">
                                <ul>
                                    {tarjetasBusquedas}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                {this.state.modalError ? <ModalError handleClick={() => toggleModalError()} /> : ""}
                <div className={`contenedor-principal ${this.state.esDia === 1 ? "fondo-dia" : "fondo-noche"}`}>

                    <div className="barra-nav">
                        <div className="nombre-logo">
                            <p>Weather App</p>
                        </div>
                        <div className={`boton-desplegar ${this.state.esDia === 1 ? "desplegar-dia" : "desplegar-noche"}`} >
                            <div>
                                <FontAwesomeIcon icon={faSearch} onClick={toggleModalBusqueda} />
                            </div>
                            <div>
                                <FontAwesomeIcon icon={faBars} onClick={toggleModalFavs} />
                            </div>
                        </div>
                    </div>

                    <div className="contenedor-escritorio">
                        <div className="contenedor-uno">
                            <div className="ubicacion">
                                {this.state.ciudadPorBuscar}
                            </div>
                            <small>{this.state.pais}</small>
                            <small>{nombresDias[diaIndice]} {this.state.horaLocal}</small>
                            <div className="temperatura-actual">
                                {this.state.clima.temp_c}°C
                            </div>
                            <div className="condiciones-actual">
                                {this.state.condiciones}
                            </div>
                            <div className="disponibles">
                                {/* {this.state.datosCargados === false ? "" : <FontAwesomeIcon icon={faLocationArrow} className="item-fav" onClick={() => actualizarCiudad(this.state.ciudadActual)} />} */}
                                {/* {this.state.datosCargados ? favoritos : ""} */}
                                <FontAwesomeIcon icon={faLocationArrow} className={`item-fav ${this.state.datosCargados ? "" : "ocultar"}`} onClick={() => actualizarCiudad(this.state.ciudadActual)} />
                                {localStorage.ciudadesDisponibles ? infoLocal() : favoritos}
                            </div>
                        </div>
                        <div className="contenedor-dos">
                            <div className="contenedor-lista">
                                <ul className="lista">
                                    {tarjetas}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default Clima
