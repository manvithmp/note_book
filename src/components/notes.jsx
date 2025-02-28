import React, { useState, useEffect } from 'react';
import styles from '../styles/notes.module.css';

const getInitials = (name) => {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

export default function Notes({ group, onUpdateGroup }) {
  const [noteText, setNoteText] = useState('');
  const [notes, setNotes] = useState(group.notes || []);
  const [isMenuActive, setIsMenuActive] = useState(false);

  useEffect(() => {
    setNotes(group.notes || []);
  }, [group]);

  useEffect(() => {
    const container = document.querySelector('.container');
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'classList') {
          setIsMenuActive(container.classList.contains('move-right'));
        }
      });
    });

    observer.observe(container, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

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

  return (
    <div className={`${styles.notesWrapper} ${isMenuActive ? styles['move-right'] : ''}`}>
      <div
        className={styles.notesHeader}
        style={{ backgroundColor: group.color }}
      >
        <div className={styles.headerContent}>
          <div className={styles.initialsCircle}>{getInitials(group.groupName)}</div>
          <div className={styles.groupTitle}>{group.groupName}</div>
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
  );
}