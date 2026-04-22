import React from 'react';
import classnames from 'classnames';

export default ({editing, value, onEdit, className, ...props}) => {
    if (editing) {
        return <Edit className={className} value={value} onEdit={onEdit} {...props} />;
    }

    return <span className={classnames('value', className)} {...props}>{value}</span>;
};

export class Edit extends React.Component {
    constructor(props) {
        super(props);

        this.state = {value: props.value == null ? '' : props.value};
        this.finished = false;
    }

    componentWillReceiveProps(nextProps) {
        // Keep the local draft in sync if the parent swaps the note's value
        // while editing (e.g. optimistic update from another source).
        if (nextProps.value !== this.props.value) {
            this.setState({value: nextProps.value == null ? '' : nextProps.value});
        }
    }

    handleChange = (e) => {
        this.setState({value: e.target.value});
    }

    checkEnter = (e) => {
        if (e.key === 'Enter') {
            this.finishEdit();
        }
    }

    finishEdit = () => {
        if (this.finished) return;
        this.finished = true;

        const trimmed = this.state.value.trim();
        // Empty input: cancel the edit by echoing the previous value so the
        // parent clears its editing flag without clobbering the task text.
        const next = trimmed === '' ? this.props.value : trimmed;

        if (this.props.onEdit) {
            this.props.onEdit(next);
        }
    }

    render() {
        const {className, value, onEdit, ...rest} = this.props;

        return (
            <input
                type="text"
                className={classnames('edit', className)}
                autoFocus={true}
                value={this.state.value}
                onChange={this.handleChange}
                onBlur={this.finishEdit}
                onKeyPress={this.checkEnter}
                {...rest}
            />
        );
    }
}
