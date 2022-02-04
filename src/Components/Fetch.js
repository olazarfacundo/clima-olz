import React from "react"

class Fetch extends React.Component{
    constructor(props){
        super(props)
        this.state={

        }
    }

    componentDidMount(){

        const padLeft = (value, length) => {
            return (value.toString().length < length) ? padLeft("0" + value, length) : 
            value;
        }

        const normalizarHora = (string) => {
            const recortamos = string.substring(10,12)
            const numero = recortamos.slice(-1)
            if(recortamos.substring(0,1) === " "){
                return padLeft((numero),2)
            }else{
                return recortamos
            }
        }

        fetch(`http://api.weatherapi.com/v1/forecast.json?key=9658158b8c4544859d4194427210410&q=London&days=3&aqi=no&alerts=no&lang=es`)
        .then(res => res.json())
        .then(data => this.setState({
            horaLocal: normalizarHora(data.location.localtime)
        }))
    }

    render(){


        console.log((this.state.horaLocal))
        
        return(
            <h1>Holis</h1>
        )
    }
}

export default Fetch