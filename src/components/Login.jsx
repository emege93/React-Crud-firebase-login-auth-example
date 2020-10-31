import React, {useState} from 'react'

const Login = () => {

const [email, setEmail] = useState('')
const [pass, setPass] = useState('')

const procesarDatos = e => {
    e.preventDefault()
    if(!email.trim()){
        console.log('Ingrese Email');
    }
    if(!pass.trim()){
        console.log('Ingrese Contraseña');
    }
    if(pass.length < 6){
        console.log('Contraseña mayor a 6 caracteres');
    }
    console.log('Todo OK');
}

    return (
        <div className="mt-5">
            <h3 className="text-center">Acceso o Registros de usuarios</h3>
            <hr/>
            <div className="row justify-content-center">
                <div className="col-12 col-sm-8 col-md-6-col-xl-4">
                    <form onSubmit={procesarDatos}>
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
                        <button className="btn btn-dark btn-lg btn-block">
                            Registrar
                        </button>
                        <button className="btn btn-info btn-sm btn-block">
                            ¿Ya tienen cuenta?
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login
