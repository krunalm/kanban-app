import assert from 'assert';
import {
    createNote,
    addNoteToList,
    setNoteEditing,
    updateNoteTask,
    removeNoteFromList
} from '../app/libs/note_utils';

describe('note_utils', function() {
    describe('createNote', function() {
        it('defaults the task text when none is supplied', function() {
            const note = createNote();
            assert.equal(note.task, 'NEW Todo');
            assert.ok(note.id);
        });

        it('assigns fresh ids per call', function() {
            const a = createNote('x');
            const b = createNote('x');
            assert.notEqual(a.id, b.id);
        });
    });

    describe('addNoteToList', function() {
        it('returns a new list with the new note appended', function() {
            const notes = [{id: 'a', task: 'one'}];
            const next = addNoteToList(notes, 'two');

            assert.equal(notes.length, 1, 'original list must not be mutated');
            assert.equal(next.length, 2);
            assert.equal(next[1].task, 'two');
        });
    });

    describe('setNoteEditing', function() {
        it('flags only the matching note', function() {
            const notes = [
                {id: 'a', task: 'one'},
                {id: 'b', task: 'two'}
            ];
            const next = setNoteEditing(notes, 'b', true);

            assert.equal(next[0].editing, undefined);
            assert.equal(next[1].editing, true);
        });

        it('does not mutate the original note objects (regression)', function() {
            const original = {id: 'a', task: 'one'};
            const notes = [original];

            const next = setNoteEditing(notes, 'a', true);

            assert.equal(original.editing, undefined);
            assert.notStrictEqual(next[0], original);
        });

        it('preserves referential equality for untouched notes', function() {
            const other = {id: 'b', task: 'two'};
            const notes = [{id: 'a', task: 'one'}, other];

            const next = setNoteEditing(notes, 'a', true);

            assert.strictEqual(next[1], other);
        });
    });

    describe('updateNoteTask', function() {
        it('updates the task and clears editing', function() {
            const notes = [{id: 'a', task: 'one', editing: true}];
            const next = updateNoteTask(notes, 'a', 'updated');

            assert.equal(next[0].task, 'updated');
            assert.equal(next[0].editing, false);
        });

        it('does not mutate the original note (regression)', function() {
            const original = {id: 'a', task: 'one', editing: true};
            const next = updateNoteTask([original], 'a', 'updated');

            assert.equal(original.task, 'one');
            assert.equal(original.editing, true);
            assert.notStrictEqual(next[0], original);
        });

        it('is a no-op when the id does not match', function() {
            const notes = [{id: 'a', task: 'one'}];
            const next = updateNoteTask(notes, 'missing', 'nope');

            assert.equal(next.length, 1);
            assert.equal(next[0].task, 'one');
        });
    });

    describe('removeNoteFromList', function() {
        it('removes the matching note', function() {
            const notes = [
                {id: 'a', task: 'one'},
                {id: 'b', task: 'two'}
            ];
            const next = removeNoteFromList(notes, 'a');

            assert.equal(next.length, 1);
            assert.equal(next[0].id, 'b');
        });

        it('is a no-op for an unknown id', function() {
            const notes = [{id: 'a', task: 'one'}];
            const next = removeNoteFromList(notes, 'missing');

            assert.equal(next.length, 1);
        });
    });
});
