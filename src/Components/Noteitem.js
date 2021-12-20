import React,{useContext} from 'react'
import noteContext from '../context/notes/noteContext';

export default function Noteitem(props) {
    const context = useContext(noteContext);
    const { deletenote } = context;
    const { note,updateNote } = props;
    return (
        <div className="col-md-3">
            {/* {note.title}
            {note.description} */}
            <div className="card my-3">
                <div className="card-body">
                    <h4 className="card-title">{note.title}</h4>
                    <p className="card-text">{note.description}</p>
                    <h6 className="card-text">{note.tag}</h6>
                    <i className="far fa-trash-alt mx-2" onClick={()=>{deletenote(note._id); props.showAlert(`Note is deleted`, 'success');}}></i>
                    <i className="far fa-edit mx-2" onClick={()=>{updateNote(note)}}></i>
                </div>
            </div>
        </div>
    )
}
