import assert from 'assert';
import {mapState, actions} from '../app/components/App';

describe('App bindings', function() {
    describe('mapState', function() {
        it('extracts notes from the composed store state', function() {
            const notes = [{id: 'a', task: 'one'}];
            assert.deepEqual(mapState({notes}), {notes});
        });

        it('defaults to an empty list when notes is absent', function() {
            assert.deepEqual(mapState({}), {notes: []});
        });
    });

    describe('actions.onDelete', function() {
        it('calls stopPropagation when the event supports it', function() {
            let stopped = false;
            const evt = {stopPropagation: () => { stopped = true; }};

            actions.onDelete('some-id', evt);

            assert.equal(stopped, true);
        });

        it('does not throw when the event is missing or malformed', function() {
            assert.doesNotThrow(() => actions.onDelete('id'));
            assert.doesNotThrow(() => actions.onDelete('id', {}));
            assert.doesNotThrow(() => actions.onDelete('id', null));
        });
    });
});
