import React from 'react';
import PropTypes from 'prop-types';

export default (state, actions) => {
    if (typeof state === 'function' ||
        (state && typeof state === 'object' && Object.keys(state).length)) {
            return target => connect(state, actions, target);
    }

    // Lowercase JSX identifiers are treated as DOM elements, so render
    // through createElement to forward to the actual component.
    return Target => props => (
        React.createElement(Target, Object.assign({}, props, actions))
    );
}

function connect(state = () => ({}), actions = {}, target) {
    class Connect extends React.Component {
        componentDidMount() {
            const {flux} = this.context;

            flux.FinalStore.listen(this.handleChange);
        }
        componentWillUnmount() {
            const {flux} = this.context;

            flux.FinalStore.unlisten(this.handleChange);
        }
        render() {
            const {flux} = this.context;
            const composedStores = composeStores(flux.stores);
            const derived = state(composedStores) || {};

            this._lastDerived = derived;

            return React.createElement(target,
                Object.assign({}, this.props, derived, actions)
            );
        }
        handleChange = () => {
            const {flux} = this.context;
            const next = state(composeStores(flux.stores)) || {};

            // Avoid re-rendering when the slice of state we care about has
            // not actually changed. FinalStore fires on every store update.
            if (!shallowEqual(this._lastDerived, next)) {
                this.forceUpdate();
            }
        }
    }
    Connect.contextTypes = {
        flux: PropTypes.object.isRequired
    };
    return Connect;
}

function composeStores(stores) {
    let ret = {};

    Object
        .keys(stores)
        .forEach(k => {
            const store = stores[k];

            ret = Object.assign({}, ret, store.getState());
        });

    return ret;
}

export function shallowEqual(a, b) {
    if (a === b) return true;
    if (!a || !b) return false;

    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    if (keysA.length !== keysB.length) return false;

    for (let i = 0; i < keysA.length; i++) {
        const key = keysA[i];
        if (!Object.prototype.hasOwnProperty.call(b, key) || a[key] !== b[key]) {
            return false;
        }
    }

    return true;
}
