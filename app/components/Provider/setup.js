import NoteStore from '../../stores/NoteStore';

export default () => {
    // Importing the store is enough to register it with Alt, but keep a
    // reference here so the module isn't tree-shaken in future bundlers.
    return NoteStore;
};
