import { notification } from "antd";

export const msnSuccess = (msn)=>{
    let posicion = 'topRight'
    
    notification.success({
        message: `Notification`,
        description:msn,
        posicion,
        duration: 3,
      });
}

export const msnError = (msn)=>{

    let posicion = 'topRight'
    
    notification.error({
        message: `Notification`,
        description:msn,
        posicion,
        duration: 3,
    });
}

export const msnInfo = (msn)=>{
    let posicion = 'topRight'

    notification.info({
        message: `Notification`,
        description:msn,
        posicion,
        duration: 3,
    })
}