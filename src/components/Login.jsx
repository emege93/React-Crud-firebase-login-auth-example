import React, {useState} from 'react'

const Login = () => {

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
                        </form>
                    </div>
                </div>
            </div>
        )
}

export default Login
