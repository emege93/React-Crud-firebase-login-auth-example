import React, {useEffect, useState} from 'react'
import { auth } from "../firebase";
import { withRouter } from "react-router-dom";


const Admin = (props) => {

    const [user, setUser] = useState([])

    useEffect(() => {
        if (auth.currentUser) {
            console.log('Existe un usuario');
            setUser(auth.currentUser)
        }else{
            console.log('No existe el usuario');
            props.history.push('/login')
        }
    }, [props.history])

    return (
        <div>
            <h2>Ruta protegida</h2>
            {
                user && (
                    <h3>Sesion iniciada de {user.email}</h3>
                )
            }
        </div>
    )
}

export default withRouter(Admin)
