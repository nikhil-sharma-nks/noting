import { useContext, createContext, useReducer } from 'react';
import { NoteReducer } from '../reducers';

const NoteContext = createContext();

const useNote = () => useContext(NoteContext);

const NoteProvider = ({ children }) => {
  const [noteState, noteDispatch] = useReducer(NoteReducer, {
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
  });
  return (
    <NoteContext.Provider value={{ noteState, noteDispatch }}>
      {children}
    </NoteContext.Provider>
  );
};

export { NoteProvider, useNote };
