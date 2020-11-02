import React, {useState, useEffect} from 'react'
import {db} from "../firebase";

import moment from 'moment';
import 'moment/locale/es'



function Firestore(props) {

  const [tareas, setTareas] = useState([])
  const [tarea, setTarea] = useState('')
  const [modoEdicion, setModoEdicion] = useState(false)
  const [id, setId] = useState('')

  const [ultimo, setUltimo] = useState(null)
  const [desactivar, setDesactivar] = useState(false)

  useEffect(() => {

    const obtenerDatos = async () => {
      setDesactivar(true)

      try {
        const data = await db.collection(props.user.uid)
          .limit(2)
          .orderBy('fecha','desc')
          .get()
        const arrayData = data.docs.map(doc => ({id: doc.id, ...doc.data()}))

        setUltimo(data.docs[data.docs.length - 1])

        console.log(arrayData)
        setTareas(arrayData)

        const query = await db.collection(props.user.uid)
        .limit(2)
        .orderBy('fecha','desc')
        .startAfter(data.docs[data.docs.length - 1])
        .get()
        if(query.empty){
          console.log('no hay mas documentos');
          setDesactivar(true)
        }else{
          setDesactivar(false)
        }

      } catch (error) {
        console.log(error);
      }
    }

    obtenerDatos()

  }, [props.user.uid])

  const siguiente = async() => {
    console.log('siguiente');
    try {
      const data = await db.collection(props.user.uid)
        .limit(2)
        .orderBy('fecha','desc')
        .startAfter(ultimo)
        .get()
      const arrayData = data.docs.map(doc => ({id: doc.id, ...doc.data()}))
      setTareas([
        ...tareas,
        ...arrayData
      ])
      setUltimo(data.docs[data.docs.length - 1])

      const query = await db.collection(props.user.uid)
      .limit(2)
      .orderBy('fecha','desc')
      .startAfter(data.docs[data.docs.length - 1])
      .get()
      if(query.empty){
        console.log('no hay mas documentos');
        setDesactivar(true)
      }else{
        setDesactivar(false)
      }

    } catch (error) {
      console.log(error);
    }
  }

  const agregar = async (e) => {
    e.preventDefault()

    if(!tarea.trim()){
      console.log('Está vacio');
      return
    }

    try {

      const nuevaTarea = {
        name: tarea,
        fecha: Date.now()
      }
      const data = await db.collection(props.user.uid).add(nuevaTarea)

      setTareas([
        ...tareas,
        {...nuevaTarea, id: data.id}
      ])

      setTarea('')

    } catch (error) {

      console.log(error);
    }

    console.log(tarea);
  }

  const eliminar = async (id) => {
    try {

      await db.collection(props.user.uid).doc(id).delete()

      const arrayFiltrado = tareas.filter(item => item.id !== id)
      setTareas(arrayFiltrado)

    } catch (error) {
      console.log(error);
    }
  }

  const activarEdicion = (item) => {
    setModoEdicion(true)
    setTarea(item.name)
    setId(item.id)
  }

  const editar = async (e) => {
    e.preventDefault()

    if(!tarea.trim()){
      console.log('Está vacio');
      return
    }

    try {

      await db.collection(props.user.uid).doc(id).update({
        name: tarea
      })
      const arrayEditado = tareas.map(item => (
        item.id === id ? {id: item.id, fecha: item.fecha, name: tarea} : item
      ))
      setTareas(arrayEditado)
      setModoEdicion(false)
      setTarea('')
      setId('')

    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="container mt-3">
      <div className="row">
        <div className="col-md-6">
          <ul className="list-group">
            {
              tareas.map(tarea => (
                <li className="list-group-item" key={tarea.id}>{tarea.name} - {moment(tarea.fecha).format('LLL')}
                  <button
                    className="btn btn-danger btn-sm float-right"
                    type="submit"
                    onClick={() => eliminar(tarea.id)}
                  >
                    Eliminar
                  </button>
                  <button
                    className="btn btn-warning btn-sm float-right mr-2"
                    type="submit"
                    onClick={() => activarEdicion(tarea)}
                  >
                    Editar
                  </button>
                </li>
              ))
            }
          </ul>
          <button 
            className="btn btn-info btn-block mt-2 btn-sm"
            onClick={() => siguiente()}
            disabled={desactivar}
          >
            Siguientes...
          </button>
        </div>
        <div className="col-md-6">
          <h3>
            {
              modoEdicion ? 'Editar Tarea' : 'Agregar tarea'
            }
          </h3>
          <form onSubmit={ modoEdicion ? editar : agregar}>
            <input
              type="text"
              placeholder="Ingrese Tarea"
              className="form-control mb-2"
              value={tarea}
              onChange={e => setTarea(e.target.value)}
            />
            <button
              className={
                modoEdicion ? 'btn btn-warning btn-block' : 'btn btn-dark btn-block'
              }
              type="submit"
            >
                {
                  modoEdicion ? 'Guardar' : 'Agregar'
                }
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Firestore;

