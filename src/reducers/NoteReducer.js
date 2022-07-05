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
    case 'LOAD_LABELS': {
      return {
        ...state,
        labels: [...new Set(payload)],
      };
    }
    case 'ADD_NEW_LABEL': {
      return {
        ...state,
        labels: [...new Set([...state.labels, payload])],
      };
    }
    case 'SEARCH_QUERY': {
      return {
        ...state,
        searchQuery: payload,
      };
    }
    case 'FILTER_DATE': {
      return {
        ...state,
        filter: {
          ...state.filter,
          sortBy: payload,
        },
      };
    }
    case 'FILTER_PRIORITY': {
      return {
        ...state,
        filter: {
          ...state.filter,
          filterPriority: payload,
        },
      };
    }
    case 'FILTER_TAGS': {
      return {
        ...state,
        filter: {
          ...state.filter,
          filterTags: payload,
        },
      };
    }
    case 'CLEAR_FILTER': {
      return {
        ...state,
        filter: {
          sortBy: '',
          filterTags: [],
          filterPriority: '',
        },
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
        labels: [],
        filter: {
          sortBy: '',
          filterTags: [],
          filterPriority: '',
        },
      };
    }
    default:
      return state;
  }
};

export { NoteReducer };
