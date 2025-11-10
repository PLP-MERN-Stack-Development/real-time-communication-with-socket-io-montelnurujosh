import React, { useState, useEffect } from 'react';
import './RoomList.css';

const RoomList = ({ currentRoom, onRoomSelect }) => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    // Fetch available rooms
    fetch('http://localhost:5000/api/rooms')
      .then(res => res.json())
      .then(data => setRooms(data))
      .catch(err => console.error('Error fetching rooms:', err));
  }, []);

  return (
    <div className="room-list">
      <div className="room-list-header">
        <h3>Chat Rooms</h3>
      </div>
      <div className="rooms">
        {rooms.map((room) => (
          <div
            key={room}
            className={`room-item ${currentRoom === room ? 'active' : ''}`}
            onClick={() => onRoomSelect(room)}
          >
            <span className="room-name">#{room}</span>
            {currentRoom === room && <span className="active-indicator">●</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomList;