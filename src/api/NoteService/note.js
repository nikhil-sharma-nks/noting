import axios from 'axios';

const getNotes = async () => {
  const token = localStorage.getItem('token');
  const getNotesBaseUrl = '/api/notes';
  try {
    axios
      .get(getNotesBaseUrl, {
        headers: {
          authorization: token,
        },
      })
      .then((response) => {
        const { data } = response;
        return data;
      });
  } catch (err) {
    console.log(err.message);
  }
};

const postNote = async (note) => {
  const token = localStorage.getItem('token');
  const postNoteBaseUrl = '/api/notes';
  try {
    const {
      data: { notes },
      status,
    } = await axios.post(
      postNoteBaseUrl,
      { note },
      {
        headers: {
          authorization: token,
        },
      }
    );
    if (status >= 200 && status <= 300) return notes;
    else {
      throw new Error("Couldn't add to notes");
    }
  } catch (err) {
    console.log(err.message);
  }
};

const editNote = async (noteId, note) => {
  const token = localStorage.getItem('token');
  const editNoteBaseUrl = `/api/notes/${noteId}`;
  try {
    const {
      data: { notes },
      status,
    } = await axios.post(
      editNoteBaseUrl,
      { note },
      {
        headers: {
          authorization: token,
        },
      }
    );
    if (status >= 200 && status <= 300) return notes;
    else {
      throw new Error("Couldn't edit note");
    }
  } catch (err) {
    console.log(err.message);
  }
};

const deleteNote = async (noteId) => {
  const token = localStorage.getItem('token');
  const deleteNoteBaseUrl = `/api/notes/${noteId}`;
  try {
    const { data, status } = await axios.delete(deleteNoteBaseUrl, {
      headers: {
        authorization: token,
      },
    });
    if (status >= 200 && status <= 300) return data;
    else {
      throw new Error("Couldn't delete note");
    }
  } catch (err) {
    console.log(err.message);
  }
};

export { getNotes, postNote, editNote, deleteNote };
