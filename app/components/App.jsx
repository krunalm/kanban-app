import React from 'react';
import uuid from 'uuid';
import Notes from './Notes';

export default class App extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            notes: [
                {
                    id: uuid.v4(),
                    task: 'Learn react'
                },
                {
                    id: uuid.v4(),
                    task: 'buy xbox one!'
                }
            ]
        };
    }

    addNote = () => {
        this.setState({
            notes: this.state.notes.concat({
                id: uuid.v4(),
                task: 'NEW Todo'
            })
        });
    }

    render() {
        const {notes} = this.state;

        return (
            <div>
                <button onClick={this.addNote}>+</button>
                <Notes notes={notes}/>
            </div>
        );
    }
}