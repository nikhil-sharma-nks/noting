import { Response } from 'miragejs';
import { requiresAuth } from '../utils/authUtils';

/**
 * All the routes related to Archives are present here.
 *  These are Privately accessible routes.
 * */

/**
 * This handler handles gets all archived notes in the db.
 * send GET Request at /api/archives
 * */

export const getAllArchivedNotesHandler = function (schema, request) {
  const user = requiresAuth.call(this, request);
  if (!user) {
    return new Response(
      404,
      {},
      {
        errors: ['The email you entered is not Registered. Not Found error'],
      }
    );
  }
  return new Response(200, {}, { archives: user.archives });
};

/**
 * This handler handles deletes note from archive.
 * send DELETE Request at /api/archives/delete/:noteId
 * */

export const deleteFromArchivesHandler = function (schema, request) {
  const user = requiresAuth.call(this, request);
  if (!user) {
    return new Response(
      404,
      {},
      {
        errors: ['The email you entered is not Registered. Not Found error'],
      }
    );
  }
  const { noteId } = request.params;
  const noteToBeDeleted = user.archives.find((note) => note._id === noteId);
  user.trash.push({ ...noteToBeDeleted });
  user.archives = user.archives.filter((note) => note._id !== noteId);
  this.db.users.update({ _id: user._id }, user);
  return new Response(200, {}, { archives: user.archives, trash: user.trash });
};

/**
 * This handler handles restoring the archived notes to user notes.
 * send POST Request at /api/archives/restore/:noteId
 * */

export const restoreFromArchivesHandler = function (schema, request) {
  const user = requiresAuth.call(this, request);
  if (!user) {
    return new Response(
      404,
      {},
      {
        errors: ['The email you entered is not Registered. Not Found error'],
      }
    );
  }
  const { noteId } = request.params;
  const restoredNote = user.archives.filter((note) => note._id === noteId)[0];
  user.archives = user.archives.filter((note) => note._id !== noteId);
  user.notes.push({ ...restoredNote });
  this.db.users.update({ _id: user._id }, user);
  return new Response(200, {}, { archives: user.archives, notes: user.notes });
};

export const updateArchiveNoteHandler = function (schema, request) {
  const user = requiresAuth.call(this, request);
  try {
    if (!user) {
      return new Response(
        404,
        {},
        {
          errors: ['The email you entered is not Registered. Not Found error'],
        }
      );
    }
    const { noteId } = request.params;
    const { archiveNote } = JSON.parse(request.requestBody);
    const archiveNoteIndex = user.archives.findIndex(
      (archiveNote) => archiveNote._id === noteId
    );
    user.archives[archiveNoteIndex] = {
      ...user.archives[archiveNoteIndex],
      ...archiveNote,
    };
    this.db.users.update({ _id: user._id }, user);
    return new Response(200, {}, { archives: user.archives });
  } catch (error) {
    return new Response(
      500,
      {},
      {
        error,
      }
    );
  }
};
