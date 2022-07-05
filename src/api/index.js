export { loginUser, signupUser } from './authService';
export { getNotes, postNote, editNote, deleteNote } from './NoteService/note';
export {
  getArchives,
  addToArchive,
  restoreArchiveNote,
  deleteArchive,
  updateArchiveNote,
} from './NoteService/archive';
export {
  getAllTrash,
  addToTrash,
  restoreFromTrash,
  deleteFromTrash,
} from './NoteService/trash';
