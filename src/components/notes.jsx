import React, { useState, useEffect } from 'react';
import styles from '../styles/notes.module.css';
import AddNotes from './addnotes';

const getInitials = (name) => {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

export default function Notes({ group, onUpdateGroup, existingGroups }) {
  const [noteText, setNoteText] = useState('');
  const [notes, setNotes] = useState(group.notes || []);
  const [isMenuActive, setIsMenuActive] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setNotes(group.notes || []);
  }, [group]);

  const toggleMenu = () => {
    const offscreen = document.querySelector('.offscreen');
    if (offscreen) {
      offscreen.classList.toggle('active');
      setIsMenuActive(!isMenuActive);
    }
  };

  const handleAddNote = () => {
    const trimmedText = noteText.trim();
    if (!trimmedText) return;

    const time = new Date().toLocaleTimeString('en-us', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });

    const date = new Date().toLocaleDateString([], {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const newNote = {
      note: trimmedText,
      time,
      date
    };

    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);

    const updatedGroup = {
      ...group,
      notes: updatedNotes
    };
    
    onUpdateGroup(updatedGroup);
    setNoteText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddNote();
    }
  };

  const handleCreateGroup = (newGroup) => {
    console.log('New group created:', newGroup);
    setIsModalOpen(false);
  };

  return (
    <>
      <div className={`${styles.notesWrapper} ${isMenuActive ? styles['move-right'] : ''}`}>
        <div
          className={styles.notesHeader}
          style={{ backgroundColor: group.color }}
        >
          <div className={styles.headerContent}>
            <div className={`${styles.hamburger} ${isMenuActive ? styles.active : ''}`} onClick={toggleMenu}>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div className={styles.headerRight}>
              <div className={styles.initialsCircle}>{getInitials(group.groupName)}</div>
              <div className={styles.groupTitle}>{group.groupName}</div>
            </div>
          </div>
        </div>

        <div className={styles.notesArea}>
          {notes.map((note, index) => (
            <div key={index} className={styles.noteItem}>
              <div className={styles.noteText}>{note.note}</div>
              <div className={styles.noteDate}>
                {note.time} | {note.date}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.notesInputContainer}>
          <div
            className={styles.inputContainer}
            style={{ backgroundColor: group.color }}
          >
            <div className={styles.inputInner}>
              <textarea
                className={styles.inputField}
                placeholder="Enter your text here..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                className={`${styles.enterButton} ${!noteText.trim() ? styles.disabledButton : ''}`}
                onClick={handleAddNote}
                disabled={!noteText.trim()}
              >
                &#10148;
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className="add-button"
        style={{ display: isMenuActive ? 'flex' : 'none' }}
        onClick={() => setIsModalOpen(true)}
      >
        <div className="plus-icon">
          <span></span>
          <span></span>
        </div>
      </div>

      {isModalOpen && (
        <AddNotes
          onCreate={handleCreateGroup}
          existingGroups={existingGroups}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
