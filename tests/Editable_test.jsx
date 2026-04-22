import assert from 'assert';
import {Edit} from '../app/components/Editable';

// Build an Edit instance without mounting React. Replace setState with a
// synchronous assignment so we can drive the component's state directly.
function makeEdit(props) {
    const edit = new Edit(props);
    edit.setState = (update) => {
        const patch = typeof update === 'function' ? update(edit.state) : update;
        edit.state = Object.assign({}, edit.state, patch);
    };
    return edit;
}

describe('Editable <Edit>', function() {
    it('initializes its local draft from the value prop', function() {
        const edit = makeEdit({value: 'hello'});
        assert.equal(edit.state.value, 'hello');
    });

    it('reports the trimmed value when finishing a non-empty edit', function() {
        const calls = [];
        const edit = makeEdit({value: 'old', onEdit: v => calls.push(v)});
        edit.handleChange({target: {value: '  new value  '}});

        edit.finishEdit();

        assert.deepEqual(calls, ['new value']);
    });

    it('reverts to the original value on an empty/whitespace edit (regression)', function() {
        const calls = [];
        const edit = makeEdit({value: 'keep me', onEdit: v => calls.push(v)});
        edit.handleChange({target: {value: '   '}});

        edit.finishEdit();

        assert.deepEqual(calls, ['keep me']);
    });

    it('only fires onEdit once even if blur and Enter both trigger it', function() {
        const calls = [];
        const edit = makeEdit({value: 'old', onEdit: v => calls.push(v)});
        edit.handleChange({target: {value: 'final'}});

        edit.checkEnter({key: 'Enter'});
        edit.finishEdit();

        assert.deepEqual(calls, ['final']);
    });

    it('ignores non-Enter keys', function() {
        const calls = [];
        const edit = makeEdit({value: 'old', onEdit: v => calls.push(v)});

        edit.checkEnter({key: 'a'});

        assert.deepEqual(calls, []);
    });
});
