import alt from '../libs/alt';
import NoteActions from '../actions/NoteActions';
import {
    createNote,
    addNoteToList,
    setNoteEditing,
    updateNoteTask,
    removeNoteFromList
} from '../libs/note_utils';

export class NoteStoreUnbound {
    constructor() {
        this.bindActions(NoteActions);

        this.notes = [
            createNote('Learn react'),
            createNote('buy xbox one!')
        ];
    }

    create(task) {
        this.setState({notes: addNoteToList(this.notes, task)});
    }

    update({id, task}) {
        this.setState({notes: updateNoteTask(this.notes, id, task)});
    }

    delete(id) {
        this.setState({notes: removeNoteFromList(this.notes, id)});
    }

    activateEdit(id) {
        this.setState({notes: setNoteEditing(this.notes, id, true)});
    }
}

export default alt.createStore(NoteStoreUnbound, 'NoteStore');
