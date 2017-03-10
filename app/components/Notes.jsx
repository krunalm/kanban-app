import React from 'react';
import Note from './Note';

export default({notes, onDelete=()=>{}}) => (
    <ul>
        {
        notes.map(note => 
        <li key={note.id}>
            <Note task={note.task} onDelete={onDelete.bind(null, note.id)} />
        </li>)
        }
    </ul>
)