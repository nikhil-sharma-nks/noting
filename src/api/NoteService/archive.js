import axios from 'axios';

const getArchives = async () => {
  const token = localStorage.getItem('token');
  const getArchivesBaseUrl = '/api/archives';

  try {
    const {
      data: { archives },
      status,
    } = await axios.get(getArchivesBaseUrl, {
      headers: {
        authorization: token,
      },
    });
    if (status >= 200 && status <= 300) return archives;
    else {
      throw new Error('Could not get archives');
    }
  } catch (err) {
    console.log(err.message);
  }
};

const addToArchive = async (noteId, note) => {
  const token = localStorage.getItem('token');
  const addToArchiveBaseUrl = `/api/notes/archives/${noteId}`;
  try {
    const { data, status } = await axios.post(
      addToArchiveBaseUrl,
      { note },
      {
        headers: {
          authorization: token,
        },
      }
    );
    if (status >= 200 && status <= 300) return data;
    else {
      throw new Error('Could not add to archives');
    }
  } catch (err) {
    console.log(err.message);
  }
};

const restoreArchiveNote = async (noteId, note) => {
  const token = localStorage.getItem('token');
  const restoreArchiveBaseUrl = `/api/archives/restore/${noteId}`;
  try {
    const { data, status } = await axios.post(
      restoreArchiveBaseUrl,
      { note },
      {
        headers: {
          authorization: token,
        },
      }
    );
    if (status >= 200 && status <= 300) return data;
    else {
      throw new Error('Could not restore archives');
    }
  } catch (err) {
    console.log(err.message);
  }
};

const deleteArchive = async (noteId) => {
  const token = localStorage.getItem('token');
  const deleteArchiveBaseUrl = `/api/archives/delete/${noteId}`;
  try {
    const { data, status } = await axios.delete(deleteArchiveBaseUrl, {
      headers: {
        authorization: token,
      },
    });
    if (status >= 200 && status <= 300) return data;
    else {
      throw new Error('Could not delete archives');
    }
  } catch (err) {
    console.log(err.message);
  }
};

const updateArchiveNote = async (noteId, archiveNote) => {
  const token = localStorage.getItem('token');
  const updateArchiveNoteBaseUrl = `/api/archives/${noteId}`;
  try {
    const { data, status } = await axios.post(
      updateArchiveNoteBaseUrl,
      { archiveNote },
      {
        headers: {
          authorization: token,
        },
      }
    );
    if (status >= 200 && status <= 300) return data;
    else {
      throw new Error('Could not update archives');
    }
  } catch (err) {
    console.log(err.message);
  }
};

export {
  getArchives,
  addToArchive,
  restoreArchiveNote,
  deleteArchive,
  updateArchiveNote,
};
