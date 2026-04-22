import React from 'react';
import Notes from './Notes';
import connect from '../libs/connect';
import NoteActions from '../actions/NoteActions';

export const App = ({notes, onAdd, onNoteClick, onEdit, onDelete}) => (
    <div>
        <button className="add-note" onClick={onAdd}>+</button>
        <Notes
            notes={notes}
            onNoteClick={onNoteClick}
            onEdit={onEdit}
            onDelete={onDelete}
        />
    </div>
);

export const mapState = ({notes = []}) => ({notes});

export const actions = {
    onAdd: () => NoteActions.create('NEW Todo'),
    onNoteClick: (id) => NoteActions.activateEdit(id),
    onEdit: (id, task) => NoteActions.update({id, task}),
    onDelete: (id, e) => {
        if (e && typeof e.stopPropagation === 'function') {
            e.stopPropagation();
        }
        NoteActions.delete(id);
    }
};

export default connect(mapState, actions)(App);
