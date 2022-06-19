const NoteReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'LOAD_NOTES': {
      return {
        ...state,
        notes: payload,
      };
    }
    case 'LOAD_ARCHIVE': {
      return {
        ...state,
        archives: payload,
      };
    }
    case 'LOAD_TRASH': {
      return {
        ...state,
        trash: payload,
      };
    }
    case 'SET_EDIT_NOTE': {
      const { isModalOpen, editNote } = payload;
      return {
        ...state,
        isEditorModalOpen: isModalOpen,
        editorNote: editNote,
      };
    }
    case 'CLOSE_NEW_NOTE': {
      return {
        ...state,
        isNewNoteOpen: false,
        editorNote: {},
      };
    }
    case 'OPEN_NEW_NOTE': {
      return {
        ...state,
        isNewNoteOpen: true,
        editorNote: {},
      };
    }
    case 'LOGOUT': {
      return {
        notes: [],
        archives: [],
        trash: [],
        searchQuery: '',
        isEditorModalOpen: false,
        isNewNoteOpen: true,
        editorNote: {},
      };
    }
    default:
      return state;
  }
};

export { NoteReducer };
