import axios from 'axios';

const getAllTrash = async () => {
  const token = localStorage.getItem('token');
  const getAllTrashBaseUrl = '/api/trash';
  try {
    const {
      data: { trash },
      status,
    } = await axios.get(getAllTrashBaseUrl, {
      headers: {
        authorization: token,
      },
    });
    if (status >= 200 && status <= 300) return trash;
    else throw new Error('Error In Getting Notes In Trash');
  } catch (err) {
    console.log(err.message);
  }
};

const addToTrash = async (noteId) => {
  const token = localStorage.getItem('token');
  const addToTrashBaseUrl = `/api/trash/${noteId}`;
  try {
    const { data, status } = await axios.post(
      addToTrashBaseUrl,
      {},
      {
        headers: {
          authorization: token,
        },
      }
    );
    if (status >= 200 && status <= 300) return data;
    else throw new Error('Error In Adding To Trash');
  } catch (err) {
    console.log(err.message);
  }
};

const restoreFromTrash = async (noteId) => {
  const token = JSON.parse(localStorage.getItem('token'));
  const restoreFromTrashBaseUrl = `/api/trash/restore/${noteId}`;
  try {
    const { data, status } = await axios.post(
      restoreFromTrashBaseUrl,
      {},
      {
        headers: {
          authorization: token,
        },
      }
    );
    if (status >= 200 && status <= 300) return data;
    else throw new Error('Error In Restoring From Trash');
  } catch (err) {
    console.log(err.message);
  }
};

const deleteFromTrash = async (noteId) => {
  const token = JSON.parse(localStorage.getItem('token'));
  const deleteFromTrashBaseUrl = `/api/trash/delete/${noteId}`;
  try {
    const {
      data: { trash },
      status,
    } = await axios.delete(deleteFromTrashBaseUrl, {
      headers: {
        authorization: token,
      },
    });
    if (status >= 200 && status <= 300) return trash;
    else throw new Error('Error In Deleting From Trash');
  } catch (err) {
    console.log(err.message);
  }
};

export { getAllTrash, addToTrash, restoreFromTrash, deleteFromTrash };
