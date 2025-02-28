import React, { useState, useRef, useEffect } from 'react';
import styles from '../styles/addnotes.module.css';

function AddNotes({ onCreate, existingGroups, onClose }) {
  const [groupName, setGroupName] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const modalRef = useRef(null);

  const colors = ['#B38BFA', '#FF79F2', '#43E6FC', '#F19576', '#0047FF', '#6691FF'];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleCreate = () => {
    if (!groupName.trim()) {
      alert('Group name cannot be empty.');
      return;
    }
    if (!selectedColor) {
      alert('Please select a color.');
      return;
    }
    const isDuplicate = existingGroups.some(
      (group) => group.groupName?.toLowerCase() === groupName.trim().toLowerCase()
    );
    if (isDuplicate) {
      alert('Group with this name already exists!');
      return;
    }

    const newGroup = {
      groupName: groupName.trim(),
      color: selectedColor,
      notes: [],
      id: existingGroups.length
    };
    onCreate(newGroup);
  };

  return (
    <div className={styles.container1}>
      <div className={styles.box} ref={modalRef}>
        <h2>Create New Group</h2>

        <label htmlFor="groupname">Group Name</label>
        <input
          type="text"
          id="groupname"
          placeholder="Enter group name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />

        <label>Choose Colour</label>
        <div className={styles.colorOptions}>
          {colors.map((color, index) => (
            <span
              key={index}
              className={styles.colorCircle}
              style={{
                backgroundColor: color,
                border: selectedColor === color ? '2px solid black' : 'none',
              }}
              onClick={() => setSelectedColor(color)}
            />
          ))}
        </div>

        <button className={styles.createbtn} onClick={handleCreate}>
          Create
        </button>
      </div>
    </div>
  );
}

export default AddNotes;