import React, {useState} from 'react'
import { auth, db } from "../firebase";
import { withRouter } from "react-router-dom";

const Login = (props) => {

    const [email, setEmail] = useState('')
    const [pass, setPass] = useState('')
    const [error, setError] = useState(null)

    const [esRegistro, setEsRegistro] = useState(true)


    const procesarDatos = e => {
        e.preventDefault()
        if(!email.trim()){
            //console.log('Ingrese Email');
            setError('Ingrese Email')
            return
        }
        if(!pass.trim()){
            //console.log('Ingrese Contraseña');
            setError('Ingrese Contraseña')
            return
        }
        if(pass.length < 6){
            //console.log('Contraseña de 6 caracteres o mas');
            setError('Contraseña de 6 caracteres o mas')
            return
        }
        setError(null)
        console.log('Todo OK');

        if (esRegistro) {
            registrar()
        }else{
            login()
        }
    }

    const login = React.useCallback(async() => {
        try {
            const res = await auth.signInWithEmailAndPassword(email, pass)
            console.log(res.user);
            limpiarCampos()
            props.history.push('/admin')
        } catch (error) {
            if (error.code === 'auth/user-not-found') {
                setError('Email no válido')
            }
            if (error.code === 'auth/wrong-password') {
                setError('Contraseña no válida')
            }
        }
    }, [email,pass, props.history])

    const registrar = React.useCallback(async() => {

        try {
            const res = await auth.createUserWithEmailAndPassword(email, pass)
            console.log(res.user);
            await db.collection('usuarios').doc(res.user.email).set({
                email: res.user.email,
                uid: res.user.uid
            })
            await db.collection(res.user.uid).add({
                name: 'Tarea de ejemplo',
                fecha: Date.now()
            })
            limpiarCampos()
            props.history.push('/admin')

        } catch (error) {
            console.log(error);
            if (error.code === 'auth/invalid-email') {
                setError('Email no válido')
            }
            if (error.code === 'auth/email-already-in-use') {
                setError('Email ya registrado')
            }
        }

    }, [email,pass, props.history])

    const limpiarCampos = () => {
        setEmail('')
        setPass('')
        setError(null)
    }

        return (
            <div className="mt-5">
                <h3 className="text-center">
                    {
                        esRegistro ? 'Registro de usuario' : 'Login de acceso'
                    }
                </h3>
                <hr/>
                <div className="row justify-content-center">
                    <div className="col-12 col-sm-8 col-md-6-col-xl-4">
                        <form onSubmit={procesarDatos}>
                            {
                                error && (
                                    <div className="alert alert-danger">
                                        {error}
                                    </div>
                                )
                            }
                            <input
                                type="email"
                                className="form-control mb-2"
                                placeholder="Ingrese su email"
                                onChange={e => setEmail(e.target.value)}
                                value={email}
                            />
                            <input
                                type="password"
                                className="form-control mb-2"
                                placeholder="Ingrese su contraseña"
                                onChange={e => setPass(e.target.value)}
                                value={pass}
                            />
                            <button className="btn btn-dark btn-lg btn-block" type="submit">
                                {
                                    esRegistro ? 'Registrarse' : 'Acceder'
                                }
                            </button>
                            <button
                                className="btn btn-info btn-sm btn-block"
                                onClick={() => setEsRegistro(!esRegistro)}
                                type="button"
                            >
                                {
                                    esRegistro ? '¿Ya estas registrado?' : '¿No tienes cuenta?'
                                }
                            </button>
                            {
                                !esRegistro ? (
                                    <button 
                                    className="btn btn-danger btn-sm mt-1" 
                                    type="button"
                                    onClick={() => props.history.push('/reset')}
                                    >
                                    Recuperar contraseña
                                </button>
                                ) : null
                            }
                        </form>
                    </div>
                </div>
            </div>
        )
}

export default withRouter(Login)
