import NoteContext from "./noteContext";
import { useState } from 'react'

const NoteState = (props) => {
  let host = "http://localhost:5000"
  const notesInitial = []
  const [notes, setNotes] = useState(notesInitial)
  //Add a note
  const getNotes = async () => {
    const response = await fetch(`${host}/api/notes/fetchallnotes/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token')
      }
    });
    const json = await response.json();
    // console.log(json);
    setNotes(json);
  }
  const addNote = async (title, description, tag) => {

    const response = await fetch(`${host}/api/notes/addnote/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token')
      },
      body: JSON.stringify({ title, description, tag })
    });
    const json= await response.json();
    // console.log(json); 
    let newaddnote=notes.concat(json);
    setNotes(newaddnote);
  }
  //Delete a note
  const deletenote =  async(id) => {
    // console.log("Deleting the note :"+id)
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token')
      },
    });
    // const json = response.json();
    // console.log(json);

    let newNotes = notes.filter((note) => { return note._id !== id })
    setNotes(newNotes);
  }
  //Edit a note
  const editnote = async (id, title, description, tag) => {
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token')
      },
      body: JSON.stringify({ title, description, tag })
    });
    

    let updatesNotes=JSON.parse(JSON.stringify(notes))
    for (let index = 0; index < updatesNotes.length; index++) {
      const element = updatesNotes[index];
      if (element._id === id) {
        updatesNotes[index].title = title;
        updatesNotes[index].description = description;
        updatesNotes[index].tag = tag;
        break;
      }
    }
    setNotes(updatesNotes);
  }

  return (

    <NoteContext.Provider value={{ notes, setNotes, addNote, deletenote, editnote, getNotes }}>
      {props.children}
    </NoteContext.Provider>
  )
}


export default NoteState;