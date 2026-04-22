import uuid from 'uuid';

export function createNote(task = 'NEW Todo') {
    return {id: uuid.v4(), task};
}

export function addNoteToList(notes, task) {
    return notes.concat(createNote(task));
}

export function setNoteEditing(notes, id, editing) {
    return notes.map(note =>
        note.id === id ? {...note, editing} : note
    );
}

export function updateNoteTask(notes, id, task) {
    return notes.map(note =>
        note.id === id ? {...note, editing: false, task} : note
    );
}

export function removeNoteFromList(notes, id) {
    return notes.filter(note => note.id !== id);
}
