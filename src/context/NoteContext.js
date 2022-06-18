import { useContext, createContext, useEffect, useReducer } from 'react';
import { NoteReducer } from '../reducers';

const NoteContext = createContext();

const useNote = () => useContext(NoteContext);

const NoteProvider = ({ children }) => {
  const [noteState, noteDispatch] = useReducer(NoteReducer, {
    notes: [],
    archive: [],
    trash: [],
    searchQuery: '',
    isEditorModalOpen: false,
    isNewNoteOpen: true,
    editorNote: {},
  });
  return (
    <NoteContext.Provider value={{ noteState, noteDispatch }}>
      {children}
    </NoteContext.Provider>
  );
};

export { NoteProvider, useNote };
