import React, { useEffect, useState } from 'react';
import AddNotes from './addnotes';
import Notes from './notes';
import homeImage from '/src/assets/home.png';

export default function HomePage() {
  const [modal, setModal] = useState(false);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);

  useEffect(() => {
    const fetchGroups = async () => {
      const storedGroups = localStorage.getItem('groups');
      if (storedGroups) {
        const groups = JSON.parse(storedGroups);
        setGroups(groups);
      }
    };
    fetchGroups();
  }, []);

  const toggleModal = () => setModal(!modal);

  const closeModal = () => setModal(false);

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handleCreateGroup = (group) => {
    const updatedGroups = [...groups, group];
    setGroups(updatedGroups);
    localStorage.setItem('groups', JSON.stringify(updatedGroups));
    setSelectedGroup(group);
    closeModal();
  };

  const handleUpdateGroup = (updatedGroup) => {
    const updatedGroups = groups.map((g) =>
      g.id === updatedGroup.id ? updatedGroup : g
    );
    setGroups(updatedGroups);
    localStorage.setItem('groups', JSON.stringify(updatedGroups));
  };

  const handleSelectGroup = (group) => {
    setSelectedGroup(group);
  };

  useEffect(() => {
    const hamburger = document.querySelector('.hamburger');
    const offscreen = document.querySelector('.offscreen');
    const container = document.querySelector('.container');

    const handleClick = () => {
      offscreen.classList.toggle('active');
      hamburger.classList.toggle('active');
      container.classList.toggle('move-right');
    };

    if (hamburger) {
      hamburger.addEventListener('click', handleClick);
      return () => hamburger.removeEventListener('click', handleClick);
    }
  }, []);

  return (
    <>
      <div className="offscreen">
        <div className="sidebar-header">
          <h2>Pocket Notes</h2>
        </div>

        <div className="grouplist">
          {groups.map((group) => (
            <div
              key={group.id}
              className={`groupitem ${selectedGroup?.id === group.id ? 'selected' : ''}`}
              onClick={() => handleSelectGroup(group)}
            >
              <div
                className="initials-circle"
                style={{ backgroundColor: group.color }}
              >
                {getInitials(group.groupName)}
              </div>
              <span className="group-name">{group.groupName}</span>
            </div>
          ))}
        </div>

        <div className="add-button" onClick={toggleModal}>
          <div className="plus-icon">
            <span></span>
            <span></span>
          </div>
        </div>
      </div>

      <nav>
        <div className="hamburger">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </nav>

      {selectedGroup ? (
        <div className="container">
          <Notes
            group={selectedGroup}
            onUpdateGroup={handleUpdateGroup}
          />
          
        </div>
      ) : (
        <div className="container">
          <img src={homeImage} alt="home" />
          <h1>Pocket Notes</h1>
          <p>Send and receive messages without keeping your phone online.</p>
          <p>Use Pocket Notes on up to 4 linked devices and 1 mobile phone</p>
          <p className="endtoend">&#128274;
        end-to-end encrypted
      </p>
        </div>
       
      )}

      {modal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={toggleModal}>
              &times;
            </span>
            <AddNotes
              onCreate={handleCreateGroup}
              existingGroups={groups}
              onClose={closeModal}
            />
          </div>
        </div>
      )}
      
    </>
  );
}