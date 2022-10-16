import moment from 'moment'
import React, { Component } from 'react'

export default class Footer extends Component {
  render() {
    return (
        <div>
        <footer className="main-footer">
            <strong>Copyright © {moment().format('YYYY')} <a href >Control Gastos</a>. </strong>
            Todos los derechos reservados.
            <div className="float-right d-none d-sm-inline-block">
            <b>Version</b> 1.0
            </div>
        </footer>
        </div>

    )
  }
}