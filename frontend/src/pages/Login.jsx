import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import UseAuthContext from "../hooks/useAuthContext";

import { msnError } from '../utils/msn';

export default function Login() {
    const { Login } = UseAuthContext();

    const login = (values) => {

        fetch('api/iniciarSesion', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
                usuario: values.usuario, 
                clave: values.clave
            })
        }).then(async res => {
            const respuesta = await res.json();

            if (res.status === 200) {
                Login(respuesta);                
            } else {
                msnError(respuesta.mensaje)
            }
        });
    };

    return (
        <div className="sidebar-mini layout-fixed login-page" id="root">
            <div className="login-box bg-white">
                <div className="login-logo pt-4">                        
                    <img src="dist/img/logo.png" alt="Logo" className="img-logo" height="70px"/>                                              
                </div>
                <div className="login-box" style={{textAlign: 'center'}}>
                    <b className="font-weight-bold ml-12">Sistema de Control de Gastos</b>
                </div>
                    <div className="card">
                        <div className="card-body login-card-body" >
                            <div className="App">                
                                <Form
                                    name="normal_login"
                                    className="login-form"
                                    initialValues={{
                                        remember: true,
                                    }}
                                    onFinish={login}
                                    >
                                    <Form.Item
                                        name="usuario"
                                        hasFeedback
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Por favor ingrese su nombre de usuario',
                                            },
                                            {
                                                min: 3,
                                                message: 'Usuario debe ser de almenos 3 caracteres',
                                            }
                                        ]}
                                    >
                                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Usuario" />
                                    </Form.Item>
                                    <Form.Item
                                        name="clave"
                                        hasFeedback 
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Por favor ingrese su contraseña',
                                            },
                                            {
                                                min: 4,
                                                message: 'Contraseña debe ser de almenos 4 caracteres',
                                            }
                                        ]}
                                    >
                                        <Input
                                            prefix={<LockOutlined className="site-form-item-icon" />}
                                            type="password"
                                            placeholder="Contraseña"
                                        />
                                    </Form.Item>
                                {/*  <Form.Item>
                                        a< className="login-form-forgot" href>
                                        Forgot password
                                        </a>
                                    </Form.Item> */}
                                    <Form.Item>
                                        <Button type="primary" htmlType="submit" /* className="ant-input" */>
                                            Iniciar Sesion
                                        </Button>
                                    </Form.Item>
                                </Form>                
                            <div className="row">
                                <div className="col-12 mt-2 text-center">
                                    <p>Copyright © Todos los derechos reservados</p>
                                </div>
                            </div>   
                        </div>            
                    </div>
                </div>            
            </div>
        </div>
    )
    
}