import React, { useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import './noteCard.scss';
import { Spinner, makeToast } from '../../';
import {
  postNote,
  editNote,
  deleteNote,
  addToArchive,
  restoreArchiveNote,
  updateArchiveNote,
  deleteArchive,
} from '../../../api';
import { useNote } from '../../../context';
import { useLocation } from 'react-router-dom';

const NoteCard = ({ fromEdit }) => {
  const location = useLocation();
  const { noteState, noteDispatch } = useNote();
  const { editorNote } = noteState;
  const [content, setContent] = useState(editorNote.content || '');
  const [textContent, setTextContent] = useState(editorNote.textContent || '');
  const [title, setTitle] = useState(editorNote.title || '');

  const [showColoPalette, setShowColorPalette] = useState(false);
  const [selectedColor, setSelectedColor] = useState(editorNote.color || '');
  const [priority, setPriority] = useState(editorNote.priority || '');

  const [loading, setLoading] = useState(false);
  const [fromArchive, setFromArchive] = useState(false);
  const [isLabelOpen, setIsLabelOpen] = useState(false);
  const [labelInput, setLabelInput] = useState('');
  const [updatedNoteTags, setUpdatedNoteTags] = useState(editorNote.tags || []);
  useEffect(() => {
    setFromArchive(location.pathname.includes('archive'));
  }, [location]);

  const colorCode = [
    '#FF5959',
    '#3AB0FF',
    '#14C38E',
    '#D4D925',
    '#EA5C2B',
    '#A2416B',
  ];

  const resetEditor = () => {
    setContent('');
    setTextContent('');
    setTitle('');
    setSelectedColor('');
    setPriority('');
    setShowColorPalette(false);
    setUpdatedNoteTags([]);
    toggleLabel();
    setIsLabelOpen(false);
  };

  const handleChange = (content, editor) => {
    setContent(content);
    setTextContent(editor.getContent({ format: 'text' }));
  };
  const toggleColorPalette = () => setShowColorPalette((s) => !s);

  const toggleLabel = () => setIsLabelOpen((prev) => !prev);

  const handleColorClick = (color) => setSelectedColor(color);

  const handleTitle = (e) => setTitle(e.target.value);

  const handleSubmit = async (event, editor) => {
    if (content === '') {
      makeToast('Please Add Something In The Note', 'error');
      return;
    }
    setLoading(true);
    event.preventDefault();
    var current = new Date();
    const note = {
      title: title,
      content: content,
      textContent: textContent,
      color: selectedColor,
      priority: priority,
      createdAt: current.toLocaleString(),
      tags: updatedNoteTags,
    };
    try {
      if (fromEdit && !fromArchive) {
        const notes = await editNote(editorNote._id, note);
        if (notes) {
          makeToast('Note Editied', 'success');
          noteDispatch({ type: 'LOAD_NOTES', payload: notes });
          handleCancel();
        } else {
          makeToast('Failed To Edit Note', 'error');
        }
        return;
      }
      if (fromArchive) {
        const data = await updateArchiveNote(editorNote._id, note);
        const { archives } = data;
        if (archives) {
          makeToast(`Archive Note Updated Successfully`, 'success');
          noteDispatch({ type: 'LOAD_ARCHIVE', payload: archives });
          resetEditor();
          handleCancel();
        } else {
          makeToast('Failed To Add To Archive Note', 'error');
        }
        return;
      }
      const notes = await postNote(note);
      if (notes) {
        makeToast('Note Added', 'success');
        noteDispatch({ type: 'LOAD_NOTES', payload: notes });
        resetEditor();
      } else {
        makeToast('Failed To Add To Note', 'error');
      }
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (fromEdit || fromArchive) {
      noteDispatch({
        type: 'SET_EDIT_NOTE',
        payload: { isModalOpen: false, editNote: {} },
      });
    }
    noteDispatch({
      type: 'CLOSE_NEW_NOTE',
    });
    resetEditor();
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      if (fromArchive) {
        const archives = await deleteArchive(editorNote._id);
        if (archives) {
          makeToast(`Archive Note Deleted Successfully`, 'success');
          noteDispatch({ type: 'LOAD_ARCHIVE', payload: archives });
          handleCancel();
        } else {
          makeToast('Failed To Delete Archive Note', 'error');
        }
        return;
      }
      const notes = await deleteNote(editorNote._id);
      if (notes) {
        makeToast(`Note Deleted Successfully`, 'success');
        noteDispatch({ type: 'LOAD_NOTES', payload: notes });
        handleCancel();
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

  const handleArchive = async () => {
    setLoading(true);
    try {
      const data = await addToArchive(editorNote._id, editorNote);
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
      handleCancel();
    }
  };

  const handleRestore = async () => {
    setLoading(true);
    try {
      const data = await restoreArchiveNote(editorNote._id, editorNote);
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
      handleCancel();
      setLoading(false);
    }
  };
  const checkIfChecked = (label) => {
    return updatedNoteTags.includes(label);
  };
  const handleLabelClick = (label, isChecked) => {
    if (isChecked) {
      setUpdatedNoteTags((s) => [...s, label]);
    } else {
      const newSet = new Set(updatedNoteTags);
      newSet.delete(label);
      setUpdatedNoteTags([...newSet]);
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

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <div className='note-card' style={{ backgroundColor: selectedColor }}>
            <div className='title-container'>
              <input
                type='text'
                className='title-input'
                placeholder='Enter Title Here'
                style={{ backgroundColor: selectedColor }}
                value={title}
                onChange={handleTitle}
              />
            </div>
            <div className='text-body-container p-3'>
              <Editor
                apiKey='ycwkesug7hp0pxny33cc65ytjz7wq7veeqeltjx2yzf8ucw3'
                // apiKey={process.env.TINY_MCE_KEY}
                value={content}
                init={{
                  height: 200,
                  menubar: false,

                  skin: 'oxide-dark',
                  content_css: 'dark',

                  plugins:
                    'lists  code emoticons advlist image styleselect advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table help wordcount',
                  toolbar:
                    'undo redo | blocks | bold italic underline| forecolor backcolor | ' +
                    'alignleft aligncenter alignright alignjustify | ' +
                    ' numlist bullist lists | emoticons image' +
                    '| outdent indent | help',
                  content_style:
                    'body { font-family:Helvetica,Arial,sans-serif; font-size:14px; line-height:normal }',
                }}
                onEditorChange={handleChange}
              />
            </div>
            <div className='note-controls-options'>
              <div className='controls'>
                <button className='btn btn-primary' onClick={handleSubmit}>
                  {fromEdit ? 'Edit' : 'Add'}
                </button>
                <button
                  className='btn btn-error-outlined '
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
              <div className='options'>
                <i
                  className='fa-solid fa-palette mr-3 icon-button'
                  onClick={toggleColorPalette}
                ></i>
                <i
                  className='fa-solid fa-tag mr-3 icon-button'
                  onClick={toggleLabel}
                ></i>
                {fromEdit && !fromArchive && (
                  <i
                    className='fa-solid fa-box-archive mr-3 icon-button'
                    onClick={handleArchive}
                  ></i>
                )}
                {fromArchive && (
                  <i
                    className='fa-solid fa-arrow-right-to-bracket mr-3 icon-button'
                    onClick={handleRestore}
                  ></i>
                )}
                <div className='dropdown'>
                  <i className='fa-solid fa-bolt icon-button mr-3'></i>
                  <div className='dropdown-content'>
                    <div
                      className={priority === 'low' ? 'selected-priority' : ''}
                      onClick={() => setPriority('low')}
                    >
                      Low Priority
                    </div>
                    <div
                      className={
                        priority === 'medium' ? 'selected-priority' : ''
                      }
                      onClick={() => setPriority('medium')}
                    >
                      Medium Priority
                    </div>
                    <div
                      className={priority === 'high' ? 'selected-priority' : ''}
                      onClick={() => setPriority('high')}
                    >
                      High Priority
                    </div>
                    <div
                      className={priority === '' ? 'selected-priority' : ''}
                      onClick={() => setPriority('')}
                    >
                      None
                    </div>
                  </div>
                </div>
                {fromEdit && (
                  <i
                    className='fa-solid fa-trash mr-3  delete-icon'
                    onClick={handleDelete}
                  ></i>
                )}
              </div>
            </div>
            {showColoPalette && (
              <div className='color-pallete-editor'>
                {colorCode.map((color) => (
                  <div
                    className='color-element'
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorClick(color)}
                    key={color}
                  ></div>
                ))}
                <div
                  className='color-element'
                  onClick={() => handleColorClick('')}
                >
                  <i className='fa-solid fa-ban fa-2x'></i>
                </div>
              </div>
            )}
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
                    class='btn btn-primary-outlined btn-floating ml-2'
                    onClick={handleNewLabel}
                  >
                    <i class='fa-solid fa-plus'></i>
                  </button>
                </div>
                <div className='label-container'>
                  {noteState.labels?.map((label) => (
                    <div className='input-container'>
                      <input
                        type='checkbox'
                        name={label}
                        checked={checkIfChecked(label)}
                        onChange={(e) =>
                          handleLabelClick(label, e.target.checked)
                        }
                      />
                      <label className='ml-1'>{label}</label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};
export { NoteCard };
