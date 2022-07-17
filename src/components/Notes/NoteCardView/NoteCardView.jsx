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
  deleteFromTrash,
  restoreFromTrash,
} from '../../../api';
import { useNote } from '../../../context';

const NoteCardView = ({ note, fromArchive, fromTrash }) => {
  const { noteState, noteDispatch } = useNote();
  const { title, content, priority, createdAt, color, _id, tags } = note;
  const [showColoPalette, setShowColorPalette] = useState(false);
  const toggleColorPalette = () => setShowColorPalette((s) => !s);
  const [loading, setLoading] = useState(false);
  const [isLabelOpen, setIsLabelOpen] = useState(false);
  const [labelInput, setLabelInput] = useState('');
  const [updatedNoteTags, setUpdatedNoteTags] = useState(tags || []);
  const colorCode = [
    '#F29191',
    '#3AB0FF',
    '#14C38E',
    '#E2C275',
    '#FF7F3F',
    '#A2416B',
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
        const data = await deleteArchive(_id);
        const { trash, archives } = data;
        if (archives) {
          makeToast(`Archive Note Moved To Trash`, 'success');
          noteDispatch({ type: 'LOAD_ARCHIVE', payload: archives });
          noteDispatch({ type: 'LOAD_TRASH', payload: trash });
        } else {
          makeToast('Failed To Delete Archive Note', 'error');
        }
        return;
      }
      if (fromTrash) {
        const trash = await deleteFromTrash(_id);
        if (trash) {
          makeToast(`Note Permanently deleted`, 'success');
          noteDispatch({ type: 'LOAD_TRASH', payload: trash });
        } else {
          makeToast('Failed To Delete Note Permanently', 'error');
        }
        return;
      }
      const data = await deleteNote(_id);
      const { trash, notes } = data;
      if (notes) {
        makeToast(`Note Moved To Trash`, 'success');
        noteDispatch({ type: 'LOAD_TRASH', payload: trash });
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

  const checkIfChecked = (label) => {
    return tags.includes(label);
  };
  const handleLabelClick = (label, isChecked) => {
    if (isChecked) {
      setUpdatedNoteTags((s) => {
        handleUpdate('TAG', [...s, label]);
        return [...s, label];
      });
    } else {
      const newSet = new Set(updatedNoteTags);
      newSet.delete(label);
      setUpdatedNoteTags([...newSet]);
      handleUpdate('TAG', [...newSet]);
    }
  };

  const handleNewLabel = () => {
    if (labelInput === '') {
      makeToast("Label Name Can't Be Empty", 'info');
      return;
    }
    if (noteState.labels.includes(labelInput)) {
      makeToast(`${labelInput} Already Exisits`, 'error');
      return;
    }
    noteDispatch({ type: 'ADD_NEW_LABEL', payload: labelInput });
    setLabelInput('');
    makeToast('New Label Added', 'success');
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
    } else if (type === 'TAG') {
      updatedNote.tags = payload;
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
      setIsLabelOpen(false);
    }
  };
  const toggleLabel = () => setIsLabelOpen((prev) => !prev);

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
      if (fromArchive) {
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
      }
      if (fromTrash) {
        const data = await restoreFromTrash(_id);
        const { trash, notes } = data;
        makeToast(`Note Restored`, 'success');
        noteDispatch({ type: 'LOAD_TRASH', payload: trash });
        noteDispatch({ type: 'LOAD_NOTES', payload: notes });
        return;
      }
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
              {tags.map((tag) => (
                <div className={`label-chip ml-1`} key={tag}>
                  {tag}
                </div>
              ))}
            </div>
            <div className='note-footer mt-2'>
              <div className='note-created-at'>Created At: {createdAt}</div>
              <div className='options'>
                {!fromTrash && (
                  <>
                    <i
                      className='fa-solid fa-pen icon-button mr-3'
                      onClick={handleCardClick}
                    ></i>
                    <i
                      className='fa-solid fa-palette mr-3 icon-button'
                      onClick={toggleColorPalette}
                    ></i>
                    <i
                      className='fa-solid fa-tag mr-3 icon-button'
                      onClick={toggleLabel}
                    ></i>
                  </>
                )}
                {!fromArchive && !fromTrash ? (
                  <i
                    className='fa-solid fa-box-archive mr-3 icon-button'
                    onClick={handleArchive}
                  ></i>
                ) : (
                  <i
                    className='fa-solid fa-arrow-right-to-bracket mr-3 icon-button'
                    onClick={handleRestore}
                  ></i>
                )}
                {!fromTrash && (
                  <div className='dropdown'>
                    <i className='fa-solid fa-bolt icon-button mr-3'></i>
                    <div className='dropdown-content'>
                      <div
                        className={
                          priority === 'low' ? 'selected-priority' : ''
                        }
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
                        className={
                          priority === 'high' ? 'selected-priority' : ''
                        }
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
                )}
                <i
                  className='fa-solid fa-trash mr-3 icon-button delete-icon'
                  onClick={handleDelete}
                ></i>
              </div>
            </div>
          </>
        )}
      </div>
      {isLabelOpen && (
        <div className='label'>
          <div className='new-label'>
            <label className='ml-1 mr-2' htmlFor='create-new-label'>
              Create New Label
            </label>
            <input
              type='text'
              className='add-to-playlist-input'
              placeholder='New Label'
              id='create-new-label'
              value={labelInput}
              onChange={(e) => setLabelInput(e.target.value)}
            />
            <button
              className='btn btn-primary-outlined btn-floating ml-2'
              onClick={handleNewLabel}
            >
              <i className='fa-solid fa-plus'></i>
            </button>
          </div>
          <div className='label-container'>
            {noteState.labels?.map((label) => (
              <div className='input-container' key={label}>
                <input
                  type='checkbox'
                  name={label}
                  checked={checkIfChecked(label)}
                  onChange={(e) => handleLabelClick(label, e.target.checked)}
                />
                <label className='ml-1'>{label}</label>
              </div>
            ))}
          </div>
        </div>
      )}
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
