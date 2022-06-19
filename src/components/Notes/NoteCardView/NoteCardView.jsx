import React, { useState } from 'react';
import './noteCardView.scss';
import parse from 'html-react-parser';
import { Spinner, makeToast } from '../../';
import {
  editNote,
  deleteNote,
  addToArchive,
  restoreArchiveNote,
  updateArchiveNote,
  deleteArchive,
} from '../../../api';
import { useNote } from '../../../context';

const NoteCardView = ({ note, fromArchive }) => {
  const { noteDispatch } = useNote();
  const { title, content, priority, createdAt, color, _id } = note;
  const [showColoPalette, setShowColorPalette] = useState(false);
  const toggleColorPalette = () => setShowColorPalette((s) => !s);
  const [loading, setLoading] = useState(false);

  const colorCode = [
    '#C2DED1',
    '#6D8B74',
    '#9A86A4',
    '#97C4B8',
    '#D18CE0',
    '#CDB699',
  ];

  const handleCardClick = () => {
    noteDispatch({
      type: 'SET_EDIT_NOTE',
      payload: { isModalOpen: true, editNote: note },
    });
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      if (fromArchive) {
        const archives = await deleteArchive(_id);
        if (archives) {
          makeToast(`Archive Note Deleted Successfully`, 'success');
          noteDispatch({ type: 'LOAD_ARCHIVE', payload: archives });
        } else {
          makeToast('Failed To Delete Archive Note', 'error');
        }
        return;
      }
      const notes = await deleteNote(_id);
      if (notes) {
        makeToast(`Note Deleted Successfully`, 'success');
        noteDispatch({ type: 'LOAD_NOTES', payload: notes });
      } else {
        makeToast('Failed To Delete Note', 'error');
      }
      return;
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (type, payload) => {
    setLoading(true);
    var current = new Date();
    let updatedNote = {
      ...note,
      updatedAt: current.toLocaleString(),
    };
    if (type === 'COLOR') {
      updatedNote.color = payload;
      toggleColorPalette();
    } else if (type === 'PRIORITY') {
      updatedNote.priority = payload;
    }
    try {
      if (fromArchive) {
        const data = await updateArchiveNote(_id, updatedNote);
        const { archives } = data;
        if (archives) {
          makeToast(`Note Updated Successfully`, 'success');
          noteDispatch({ type: 'LOAD_ARCHIVE', payload: archives });
        } else {
          makeToast('Failed To Add To Archive Note', 'error');
        }
        return;
      }
      const notes = await editNote(_id, updatedNote);
      if (notes) {
        makeToast(`Note ${type.toLowerCase()} Updated`, 'success');
        noteDispatch({ type: 'LOAD_NOTES', payload: notes });
      } else {
        makeToast('Failed To Update Note', 'error');
      }
      return;
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleArchive = async () => {
    setLoading(true);
    try {
      const data = await addToArchive(_id, note);
      const { notes, archives } = data;
      if (notes) {
        noteDispatch({ type: 'LOAD_NOTES', payload: notes });
      } else {
        makeToast('Failed To Delete Note', 'error');
      }
      if (archives) {
        makeToast(`Note Archived Successfully`, 'success');
        noteDispatch({ type: 'LOAD_ARCHIVE', payload: archives });
      } else {
        makeToast('Failed To Add To Archive Note', 'error');
      }
      return;
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    setLoading(true);
    try {
      const data = await restoreArchiveNote(_id, note);
      const { notes, archives } = data;
      if (notes) {
        noteDispatch({ type: 'LOAD_NOTES', payload: notes });
      } else {
        makeToast('Failed To Restore Note', 'error');
      }
      if (archives) {
        makeToast(`Note Unarchived Successfully`, 'success');
        noteDispatch({ type: 'LOAD_ARCHIVE', payload: archives });
      } else {
        makeToast('Failed To Move From Archive Note', 'error');
      }
      return;
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className='note-card-view mt-2' style={{ backgroundColor: color }}>
        {loading ? (
          <Spinner />
        ) : (
          <>
            {title && <div className='note-title pb-2'>{title}</div>}
            <div className='note-body mt-2 pb-2'>{parse(`${content}`)}</div>
            <div className='note-labels'>
              <div className={`label-chip priority-${priority}`}>
                {priority === ''
                  ? 'P-None'
                  : `P-${
                      priority?.charAt(0).toUpperCase() + priority?.slice(1)
                    }`}
              </div>
            </div>
            <div className='note-footer mt-2'>
              <div className='note-created-at'>Created At: {createdAt}</div>
              <div className='options'>
                <i
                  className='fa-solid fa-pen icon-button mr-3'
                  onClick={handleCardClick}
                ></i>
                <i
                  className='fa-solid fa-palette mr-3 icon-button'
                  onClick={toggleColorPalette}
                ></i>
                <i className='fa-solid fa-tag mr-3 icon-button'></i>
                {!fromArchive ? (
                  <i
                    className='fa-solid fa-box-archive mr-3 icon-button'
                    onClick={handleArchive}
                  ></i>
                ) : (
                  <i
                    class='fa-solid fa-arrow-right-to-bracket mr-3 icon-button'
                    onClick={handleRestore}
                  ></i>
                )}
                <div className='dropdown'>
                  <i className='fa-solid fa-bolt icon-button mr-3'></i>
                  <div className='dropdown-content'>
                    <div
                      className={priority === 'low' ? 'selected-priority' : ''}
                      onClick={() => handleUpdate('PRIORITY', 'low')}
                    >
                      Low Priority
                    </div>
                    <div
                      className={
                        priority === 'medium' ? 'selected-priority' : ''
                      }
                      onClick={() => handleUpdate('PRIORITY', 'medium')}
                    >
                      Medium Priority
                    </div>
                    <div
                      className={priority === 'high' ? 'selected-priority' : ''}
                      onClick={() => handleUpdate('PRIORITY', 'high')}
                    >
                      High Priority
                    </div>
                    <div
                      className={priority === '' ? 'selected-priority' : ''}
                      onClick={() => handleUpdate('PRIORITY', '')}
                    >
                      None
                    </div>
                  </div>
                </div>
                <i
                  className='fa-solid fa-trash mr-3 icon-button delete-icon'
                  onClick={handleDelete}
                ></i>
              </div>
            </div>
          </>
        )}
      </div>
      {showColoPalette && (
        <div className='color-pallete'>
          {colorCode.map((color) => (
            <div
              className='color-element'
              style={{ backgroundColor: color }}
              onClick={() => handleUpdate('COLOR', color)}
              key={color}
            ></div>
          ))}
          <div
            className='color-element'
            onClick={() => handleUpdate('COLOR', '')}
          >
            <i className='fa-solid fa-ban fa-2x'></i>
          </div>
        </div>
      )}
    </>
  );
};

export { NoteCardView };
