import React, { Component } from 'react'
import { Table, Card, Space, Button, Popconfirm } from 'antd'
import { getRandomuserParams } from '../utils/antd'

import ModalUsuario from '../components/Modales/ModalUsuario'
import { msnError, msnSuccess } from '../utils/msn'

class Perfiles extends Component {

    constructor(props){
        super(props)
        this.state = {
            datos: [],
            loading: false,
            pagination: {
                current: 1,
                pageSize: 20,
                showSizeChanger: true,
                pageSizeOptions: ['5', '10', '20', '30', '40', '50'],
                showTotal: (total, range) => {return `${range[0]}-${range[1]} de ${total} Resultados`},
            }
        }
        this.ModalUsuario = React.createRef();
    }

    async componentDidMount() {
        const { pagination } = this.state

        this.buscar({ pagination });
    }

    handleTableChange = (pagination, filters, sorter) => {
        this.buscar({
            sortField: sorter.field,
            sortOrder: sorter.order,
            pagination,
            ...filters,
        });
    };

    buscar = (params = {}) => {
       
        fetch(`api/listarUsuarios`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('tokenGastos')}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                data: getRandomuserParams(params)
            })
        })
        .then(response => response.json())
        .then(data => {
           
            this.setState({
                datos: data.results,
                loading: false,
                pagination: {
                    ...params.pagination,
                    total: data.info.total,
                    showTotal: (total, range) => {return `${range[0]}-${range[1]} de ${total} Resultados`},
                }
            })
        })
    };

    actualizarTabla = (item, id) => {
        if (id > 0) {
            const { datos } = this.state;
            const items = [...datos];
            const index = items.findIndex((x) => x.id === item.id);
            items[index] = item;
            this.setState({ datos: items});
            
        } else {
            const { datos } = this.state;
            this.setState({ datos: [...datos, item] });
        }
    };

    eliminarUsuario = async(id) => {
        try {
            const res = await fetch('api/eliminarUsuario', {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('tokenGastos')}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({id})
            });
            const respuesta = await res.json()
            if (res.status) {

                msnSuccess(respuesta.mensaje)    
                const { datos } = this.state
                const items = [...datos]
                const datosNuevo = items.filter(x => x.id !== id)
                this.setState({ datos: datosNuevo})
                
            } else {
                msnError(respuesta.mensaje)
            }
            
        } catch (error) {
            console.log(error);
            msnError('Ha ocurrido un error contacta al administrador')
        }
    };

    render() {

        const { datos, loading, pagination } = this.state

        const columns = [
            {
                title: <b>Nombre</b>,
                dataIndex: 'nombre',
                className: 'pl-1 pr-2 pt-1 pb-1',
                sorter: true,
            },
            {
                title: <b>Apellido</b>,
                dataIndex: 'apellido',
                className: 'pl-1 pr-2 pt-1 pb-1',
                sorter: true,
            },
            {
                title: <b>Correo</b>,
                dataIndex: 'correo',
                className: 'pl-1 pr-2 pt-1 pb-1',
                sorter: true,
            },
            {
                title: <b>Estado</b>,
                dataIndex: 'estado',
                className: 'pl-1 pr-2 pt-1 pb-1',
                filters: [
                    {
                      text: 'Activo',
                      value: '1',
                    },
                    {
                      text: 'Inactivo',
                      value: '2',
                    },
                  ],
                  filterMultiple: true,
            },
            {
                title: 'Acción',
                dataIndex: 'acciones',
                width: '5%',
                className: 'pl-1 pr-2 pt-1 pb-1 text-center',
                render: (text, record) => (
                    <Space size={[0, 0]}>
                       <Button
                            type="primary"
                            size="small"
                            title={`Editar Usuario ${record.nombre}`}
                            icon={<i className='fas fa-user-edit'/>}
                            onClick={() => this.ModalUsuario.current.getUsuario(record.id)}
                        />
                        <Popconfirm
                            title={`Realmente desea eliminar el usuario ${record.nombre}?`}
                            onConfirm={() => this.eliminarUsuario(record.id)}
                            okText="Si"
                            cancelText="No"                                        
                        >
                            <Button
                                type="danger"
                                size="small"
                                title={`Eliminar Usuario ${record.nombre}`}
                                icon={<i className='fas fa-user-times'/>}
                            />
                        </Popconfirm>
                    </Space>
                  ),
            }
        ]

        return (
            <div>
            <div className="content-wrapper" style={{minHeight: 297}}>
                <div className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1 className="m-0">Gestión Perfiles</h1>
                            </div>
                        </div>
                    </div>
                </div>
                <section className="content">
                <div className="container-fluid">
                    <div className="row">                        
                    </div>
                   
                        <Card
                        style={{ width: '97%', margin: 'auto'}}
                        /* cover={
                          <img
                            //style={{ width: 300, textAlign: 'center', margin: '20px auto'  }}
                            alt="example"
                            src="/helpdesk/logoPavasStay.png"
                          />
                        } */
                       /*  actions={[
                            <button className="btn btn-info btn-block" onClick={()=>this.sigPad.clear()}>Limpiar</button>,
                            <button className="btn btn-primary btn-block" onClick={this.Guardar}>Guardar</button>
                        ]} */
                      >
                           <div className="row">
                                <div className="col-md-12">                                
                                   
                                </div>
                                <div className="col-md-12">
                                    <ModalUsuario ref={this.ModalUsuario} actualizarTabla={this.actualizarTabla}  />
                                    <Table 
                                        size='small'
                                        className="table table-bordered table-striped dataTable dtr-inline" 
                                        columns={columns} 
                                        dataSource={datos} 
                                        pagination={pagination}
                                        loading={loading}
                                        onChange={this.handleTableChange}
                                        scroll={{ x: 800 }}
                                    /> 
                                </div>
                            </div>                        
                        </Card>
                    </div>
                </section>
            </div>
        </div>
        );
    }
}

export default Perfiles;