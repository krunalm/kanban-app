import React from 'react';
import Note from './Note';
import Editable from './Editable';

const noop = () => {};

export class NoteItem extends React.Component {
    handleNoteClick = () => {
        this.props.onNoteClick(this.props.id);
    }
    handleEdit = (task) => {
        this.props.onEdit(this.props.id, task);
    }
    handleDelete = (e) => {
        this.props.onDelete(this.props.id, e);
    }
    render() {
        const {task, editing} = this.props;

        return (
            <li>
                <Note className="note" onClick={this.handleNoteClick}>
                    <Editable
                        className="editable"
                        editing={editing}
                        value={task}
                        onEdit={this.handleEdit}
                    />
                    <button className="delete" onClick={this.handleDelete}>x</button>
                </Note>
            </li>
        );
    }
}

export default ({
    notes,
    onNoteClick = noop,
    onEdit = noop,
    onDelete = noop
}) => (
    <ul className="notes">
        {notes.map(({id, editing, task}) => (
            <NoteItem
                key={id}
                id={id}
                task={task}
                editing={editing}
                onNoteClick={onNoteClick}
                onEdit={onEdit}
                onDelete={onDelete}
            />
        ))}
    </ul>
);
