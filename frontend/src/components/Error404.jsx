import { Component } from 'react'
import { Result, Button } from 'antd';

export default class Error404 extends Component {
  render() {
    return (
        <Result
            status="404"
            title="404"
            subTitle="Lo sentimos, la página que visitaste no existe."
            extra={<Button type="primary" onClick={() =>  window.location.href = `/`}>Volver al inicio</Button>}
        />
    )
  }
}