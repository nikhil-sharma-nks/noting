import React, { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import './noteCard.scss';
import { Spinner, makeToast } from '../../';
import { postNote, editNote, deleteNote } from '../../../api';
import { useNote } from '../../../context';

const NoteCard = ({ fromEdit }) => {
  const { noteState, noteDispatch } = useNote();
  const { editorNote, isNewNoteOpen } = noteState;
  const [content, setContent] = useState(editorNote.content || '');
  const [textContent, setTextContent] = useState(editorNote.textContent || '');
  const [title, setTitle] = useState(editorNote.title || '');

  const [showColoPalette, setShowColorPalette] = useState(false);
  const [selectedColor, setSelectedColor] = useState(editorNote.color || '');
  const [priority, setPriority] = useState(editorNote.priority || '');

  const [loading, setLoading] = useState(false);

  const colorCode = [
    '#C2DED1',
    '#6D8B74',
    '#9A86A4',
    '#97C4B8',
    '#D18CE0',
    '#CDB699',
  ];

  const resetEditor = () => {
    setContent('');
    setTextContent('');
    setTitle('');
    setSelectedColor('');
    setPriority('');
    setShowColorPalette(false);
  };

  const handleChange = (content, editor) => {
    setContent(content);
    setTextContent(editor.getContent({ format: 'text' }));
  };
  const toggleColorPalette = () => setShowColorPalette((s) => !s);

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
    };
    try {
      if (fromEdit) {
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
    if (fromEdit) {
      noteDispatch({
        type: 'SET_EDIT_NOTE',
        payload: { isModalOpen: false, editNote: {} },
      });
    } else {
      noteDispatch({
        type: 'CLOSE_NEW_NOTE',
      });
      resetEditor();
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
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

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          {isNewNoteOpen && (
            <div
              className='note-card'
              style={{ backgroundColor: selectedColor }}
            >
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
                  <i className='fa-solid fa-tag mr-3 icon-button'></i>
                  <i className='fa-solid fa-box-archive mr-3 icon-button'></i>
                  <div className='dropdown'>
                    <i className='fa-solid fa-bolt icon-button mr-3'></i>
                    <div className='dropdown-content'>
                      <div
                        className={
                          priority === 'low' ? 'selected-priority' : ''
                        }
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
                        className={
                          priority === 'high' ? 'selected-priority' : ''
                        }
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
            </div>
          )}
        </>
      )}
    </>
  );
};
export { NoteCard };
