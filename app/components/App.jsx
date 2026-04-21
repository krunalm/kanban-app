import React from 'react';
import uuid from 'uuid';
import Notes from './Notes';
import connect from '../libs/connect';

export class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            notes: [
                {
                    id: uuid.v4(),
                    task: 'Learn react'
                }, {
                    id: uuid.v4(),
                    task: 'buy xbox one!'
                }
            ]
        };
    }

    addNote = () => {
        this.setState({
            notes: this
                .state
                .notes
                .concat({
                    id: uuid.v4(),
                    task: 'NEW Todo'
                })
        });
    }

    render() {
        const {notes} = this.state;

        return (
            <div>
                {this.props.test}
                <button className="add-note" onClick={this.addNote}>+</button>
                <Notes
                    notes={notes}
                    onNoteClick={this.activateNoteEdit}
                    onEdit={this.editNote}
                    onDelete={this.deleteNote}/>
            </div>
        );
    }

    activateNoteEdit = (id) => {
        this.setState({
            notes: this
                .state
                .notes
                .map(note => (
                    note.id === id ? {...note, editing: true} : note
                ))
        });
    }

    editNote = (id, task) => {
        this.setState({
            notes: this
                .state
                .notes
                .map(note => (
                    note.id === id ? {...note, editing: false, task} : note
                ))
        });
    }

    deleteNote = (id, e) => {
        e.stopPropagation();

        this.setState({
            notes: this
                .state
                .notes
                .filter(note => note.id !== id)
        });
    }
}

export default connect(() => ({
    test: 'km-test'
}))(App);