import React, {Component} from 'react';
import { Modal, Button, Form, Input, Switch } from 'antd';
import { msnSuccess, msnError, msnInfo } from '../../utils/msn';

export default class ModalUsuario extends Component {

    constructor(props) {
        super(props)
        this.state = {
            modal: false,
            editar: false,
            id: 0
        }
        this.formRef = React.createRef();
    };

    guardar = (values) => {
        //console.log(values)
        const { editar, datos, id } = this.state
        const { nombre, apellido, correo, usuario, clave, estado } = values

        if (editar && nombre === datos.nombre && apellido === datos.apellido && correo === datos.correo && usuario === datos.usuario && estado === datos.estado && clave === undefined) {
            msnInfo('No has hecho ninguna actualización');
        } else {

            fetch(`api/guardarUsuario`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('tokenGastos')}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nombre,
                    apellido,
                    correo,
                    usuario,
                    clave,
                    estado: estado === true || estado === 1 ? estado : 2,
                    id
                }),
            }).then(async(res) => {
                const respuesta = await res.json()
                if (res.status === 200) {
                    const { actualizarTabla } = this.props;
                    msnSuccess(respuesta.mensaje);          
                    actualizarTabla({
                        id: respuesta.id,
                        nombre,
                        apellido,
                        correo,
                        estado: estado === true || estado === 1 ? 'Activo' : 'Inactivo',
                    }, id);           
                   
                    this.formRef.current.resetFields();
                    this.setState({modal: false});
                } else {
                    msnError(respuesta.mensaje);
                }
            });          
        }
    };

    getUsuario = async(id) => {
        try {
            const res = await fetch(`api/getUsuario?${new URLSearchParams({id})}`, {
                headers: { "Authorization": `Bearer ${localStorage.getItem('tokenGastos')}`}
            });
            const datos = await res.json()
            this.setState({datos: datos, modal: true, editar: true, id})
            this.formRef.current.setFieldsValue({
                nombre: datos.nombre,
                apellido: datos.apellido,
                correo: datos.correo,
                usuario: datos.usuario,
                clave: datos.clave,
                estado: datos.estado === 1 ? datos.estado : 0,
            })            
            
        } catch (error) {
            console.log(error);
            msnError('Ha ocurrido un error contacta al administrador')
        }
    };

    render () {
        const { modal, editar } = this.state;

        return (
            <>
                <Modal
                    title={editar ? 'Edición Usuario' : 'Nuevo Usuario'}
                    visible={modal}
                    onOk={() => this.formRef.current.submit()} 
                    onCancel={() => {
                        this.setState({
                            modal: false,
                            editar: false,
                            id: 0
                        });
                        this.formRef.current.resetFields()                        
                        
                    }}
                    okText={editar ? 'Guardar Cambios' : 'Guardar'}
                    cancelText="Cerrar"
                >
                    <Form
                        ref={this.formRef}
                        layout="vertical"
                        initialValues={{
                            nombre: '',
                            apellido: '',
                            correo: '',
                            usuario: '',
                            clave: '',
                            estado: 1,
                        }}
                        onFinish={this.guardar}
                    >
                        <div className="row contenedor">
                            <div className="col-md-6">
                                <Form.Item
                                    label="Nombre"
                                    name="nombre"
                                    hasFeedback
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Por favor ingrese su nombre',
                                        },
                                        {
                                            min: 3,
                                            message: 'Nombre debe ser de almenos 3 caracteres',
                                        }
                                    ]}
                                    
                                >
                                    <Input placeholder="Nombre" />
                                </Form.Item>
                            </div>
                            <div className="col-md-6">
                                <Form.Item
                                    label="Apellido"
                                    name="apellido"
                                    hasFeedback
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Por favor ingrese su apellido',
                                        },
                                        {
                                            min: 3,
                                            message: 'Apellido debe ser de almenos 3 caracteres',
                                        }
                                    ]}                                    
                                >
                                    <Input placeholder="Apellido" />
                                </Form.Item>
                            </div>
                            <div className="col-md-6">
                                <Form.Item
                                    label="Correo"
                                    name="correo"
                                    hasFeedback
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Por favor ingrese su correo',
                                        },
                                        {
                                            type: 'email',
                                            message: 'El correo electrónico no es válido',
                                        }
                                    ]}                                    
                                >
                                    <Input placeholder="Correo" />
                                </Form.Item>
                            </div>
                            <div className="col-md-6">
                                <Form.Item
                                    label="Usuario"
                                    name="usuario"                                                                   
                                >
                                    <Input placeholder="Usuario" />
                                </Form.Item>
                            </div>
                                    <div className="col-md-6">                                
                                        <Form.Item
                                            name="clave"
                                            label="Contraseña"
                                            hasFeedback
                                            rules={[
                                                {
                                                    required: editar===false,
                                                    message: 'Por favor ingrese su contraseña',
                                                },
                                                {
                                                    min: 4,
                                                    message: 'Contraseña debe ser de almenos 4 caracteres',
                                                }
                                            ]}                                            
                                        >
                                            <Input.Password />
                                        </Form.Item>
                                    </div>
                                    <div className="col-md-6">
                                        <Form.Item
                                            name="confirmar"
                                            label="Confirmar Contraseña"
                                            dependencies={['clave']}
                                            hasFeedback
                                            rules={[
                                                {
                                                    required: editar===false,
                                                    message: 'Por favor confirme su contraseña',
                                                },
                                                ({ getFieldValue }) => ({
                                                    validator(_, value) {
                                                        console.log(getFieldValue('clave'))
                                                    if (getFieldValue('clave') === value) {
                                                        return Promise.resolve();
                                                    }

                                                    return Promise.reject(new Error('Las contraseñas no coiciden'));
                                                    },
                                                }),
                                            ]}
                                        >
                                            <Input.Password />
                                        </Form.Item>                                   
                                    </div>
                                                               
                            <div className="col-md-6">                                
                                <Form.Item
                                    name="estado"
                                    label="Estado"
                                    valuePropName="checked"
                                >
                                    <Switch
                                        checkedChildren="Activo" 
                                        unCheckedChildren="Inactivo"
                                    />
                                </Form.Item>
                            </div>
                        </div>                                                                
                    </Form>    
                </Modal>               
                <Button
                    type="success"
                    size="small"
                    title="Crear Usuario"
                    icon={<i className='fas fa-user-plus mr-2'/>}
                    onClick={() => this.setState({modal: true})}
                >
                    Nuevo
                </Button>                
           </>
        )
    }
}