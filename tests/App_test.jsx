import assert from 'assert';
import {App} from '../app/components/App';

// Helper: construct an App instance without React mounting, and stub
// setState so mutations are synchronous and observable.
function makeApp(initialNotes) {
    const app = new App({});
    app.state = {notes: initialNotes};
    app.setState = (update) => {
        app.state = Object.assign({}, app.state, update);
    };
    return app;
}

describe('App', function() {
    describe('activateNoteEdit', function() {
        it('flags the matching note as editing', function() {
            const app = makeApp([
                {id: 'a', task: 'one'},
                {id: 'b', task: 'two'}
            ]);

            app.activateNoteEdit('b');

            assert.equal(app.state.notes[0].editing, undefined);
            assert.equal(app.state.notes[1].editing, true);
        });

        it('does not mutate the original note objects (regression)', function() {
            const original = {id: 'a', task: 'one'};
            const app = makeApp([original]);

            app.activateNoteEdit('a');

            // Original object reference must remain unchanged; a new object
            // should have been produced instead.
            assert.equal(original.editing, undefined);
            assert.notStrictEqual(app.state.notes[0], original);
        });

        it('leaves unrelated notes untouched by reference', function() {
            const other = {id: 'b', task: 'two'};
            const app = makeApp([{id: 'a', task: 'one'}, other]);

            app.activateNoteEdit('a');

            assert.strictEqual(app.state.notes[1], other);
        });
    });

    describe('editNote', function() {
        it('updates the task text and clears editing', function() {
            const app = makeApp([{id: 'a', task: 'one', editing: true}]);

            app.editNote('a', 'updated');

            assert.equal(app.state.notes[0].task, 'updated');
            assert.equal(app.state.notes[0].editing, false);
        });

        it('does not mutate the original note (regression)', function() {
            const original = {id: 'a', task: 'one', editing: true};
            const app = makeApp([original]);

            app.editNote('a', 'updated');

            assert.equal(original.task, 'one');
            assert.equal(original.editing, true);
            assert.notStrictEqual(app.state.notes[0], original);
        });

        it('ignores unknown ids', function() {
            const app = makeApp([{id: 'a', task: 'one'}]);

            app.editNote('missing', 'nope');

            assert.equal(app.state.notes.length, 1);
            assert.equal(app.state.notes[0].task, 'one');
        });
    });

    describe('deleteNote', function() {
        it('removes the target note and stops event propagation', function() {
            const app = makeApp([
                {id: 'a', task: 'one'},
                {id: 'b', task: 'two'}
            ]);
            let stopped = false;
            const evt = {stopPropagation: () => { stopped = true; }};

            app.deleteNote('a', evt);

            assert.equal(stopped, true);
            assert.equal(app.state.notes.length, 1);
            assert.equal(app.state.notes[0].id, 'b');
        });

        it('is a no-op when the id does not match', function() {
            const app = makeApp([{id: 'a', task: 'one'}]);
            const evt = {stopPropagation: () => {}};

            app.deleteNote('missing', evt);

            assert.equal(app.state.notes.length, 1);
        });
    });

    describe('addNote', function() {
        it('appends a new note with a fresh id', function() {
            const app = makeApp([{id: 'a', task: 'one'}]);

            app.addNote();

            assert.equal(app.state.notes.length, 2);
            assert.equal(app.state.notes[1].task, 'NEW Todo');
            assert.ok(app.state.notes[1].id);
            assert.notEqual(app.state.notes[1].id, 'a');
        });
    });
});
