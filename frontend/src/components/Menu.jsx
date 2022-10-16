import React, { useEffect, useState } from "react";
import UseAuthContext from "../hooks/useAuthContext";

export default function Menu() {
    const { Logout } = UseAuthContext();
    const [ ventanas, setVentanas ] = useState([])

    useEffect(() => {
        const cargarMenu = async() => {

            const res = await fetch('api/cargarMenu', {
                headers: { "Authorization": `Bearer ${localStorage.getItem('tokenGastos')}`}
            });

            setVentanas(await res.json());
        }
        cargarMenu()
    }, []);

    return (
        <div>
            <aside className="main-sidebar sidebar-dark-primary elevation-4">    
                <a href="/" className="brand-link">
                    <img src="dist/img/logo.png" alt="AdminLTE Logo" className="brand-image elevation-3" />
                    <span className="brand-text font-weight-light">Control Gastos</span>
                </a>
                <div className="sidebar os-host os-theme-light os-host-overflow os-host-overflow-y os-host-resize-disabled os-host-scrollbar-horizontal-hidden os-host-transition">
                    <div className="os-content-glue" style={{margin: '0px -8px', width: 249, height: 353}} />
                    <div className="os-padding">
                        <div className="os-viewport os-viewport-native-scrollbars-invisible" style={{overflowY: 'scroll'}}>
                            <div className="os-content" style={{padding: '0px 8px', height: '100%', width: '100%'}}>
                                <div className="user-panel mt-3 pb-3 mb-3 d-flex">
                                    <div className="image">
                                        {/* <img src="dist/img/user2-160x160.jpg" className="img-circle elevation-2" alt="User Image" /> */}
                                    </div>
                                    <div className="info">
                                        <a href className="d-block">{localStorage.getItem('usuarioGastos')}</a>
                                    </div>
                                </div>
                                <nav className="mt-2">
                                    <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                                    {
                                        ventanas.filter(l => l.tipo === 1).map(item =>
                                                
                                            <li className="nav-item menu-is-opening menu-open" key={item.id}>
                                                <a className="nav-link active" href={item.can > 0 ? '' : `${item.url}`}>
                                                    <i className={item.icono}></i>
                                                    
                                                <p>
                                                    {item.nombre}
                                                    <i className="right fas fa-angle-left" />
                                                </p>
                                                </a>
                                                {
                                                item.can > 0 ?
                                                    <ul className="nav nav-treeview">
                                                    {
                                                        ventanas.filter(x => x.padre === item.id).map(item2 =>
                                                        <li className="nav-item " key={item2.id}>
                                                            <a  className="nav-link" href={`${item2.url}`}>
                                                                <i className={item2.icono}></i>
                                                                <p>{item2.nombre}</p>
                                                            </a>
                                                        </li>
                                                        )
                                                    }
                                                    </ul>:  ''
                                                }
                                            </li>
                                        )
                                    }
                                        {/* <li className="nav-item menu-is-opening menu-open">
                                            <a href className="nav-link active">
                                                <i className="nav-icon fas fa-cogs"></i>
                                                <p>
                                                    Administración
                                                    <i className="right fas fa-angle-left" />
                                                </p>
                                            </a>
                                            <ul className="nav nav-treeview" style={{display: 'flex'}}>            
                                                <li className="nav-item ">
                                                    <a className="nav-link" href={``}> 

                                                    <p>Perfiles</p>
                                                    </a>
                                                </li>
                                                <li className="nav-item ">
                                                    <a className="nav-link" href='/usuarios'>
                                                        <i className='nav-icon fas fa-user-cog'></i>
                                                        <p>Usuarios</p>
                                                    </a>
                                                </li>                                                
                                            </ul>
                                        </li> */}
                                        <li className="nav-item">
                                            <a href onClick={()=>Logout()} className="nav-link text-danger">
                                                <i className="nav-icon fas fa-sign-out-alt" />
                                                <p>Cerrar Sesión</p>
                                            </a>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </div> 
                    </div>
                </div>    
            </aside>
        </div>
    )
  
}
