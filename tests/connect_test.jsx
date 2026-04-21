import assert from 'assert';
import React from 'react';
import connect from '../app/libs/connect';

describe('connect', function() {
    // Regression: when no state selector is supplied, connect previously
    // rendered `<target>` (a lowercase JSX identifier) which React treats
    // as an HTML element, dropping the wrapped component entirely.
    it('actions-only path renders the target component', function() {
        const Target = () => React.createElement('span', null, 'ok');
        const actions = {onFoo: () => {}};

        const Wrapped = connect(null, actions)(Target);
        const element = Wrapped({});

        assert.equal(element.type, Target);
    });

    it('actions-only path merges actions into props', function() {
        const Target = () => null;
        const onFoo = () => {};

        const Wrapped = connect(null, {onFoo})(Target);
        const element = Wrapped({existing: 1});

        assert.equal(element.props.onFoo, onFoo);
        assert.equal(element.props.existing, 1);
    });

    it('does not crash when state is null', function() {
        // Previously `Object.keys(null)` would throw because `typeof null`
        // is 'object'.
        const Target = () => null;
        assert.doesNotThrow(() => connect(null, {})(Target));
    });

    it('returns a HOC factory when state is a selector function', function() {
        const selector = () => ({value: 1});
        const hoc = connect(selector);

        assert.equal(typeof hoc, 'function');
    });
});
