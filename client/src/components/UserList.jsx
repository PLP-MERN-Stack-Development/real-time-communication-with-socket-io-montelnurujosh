import React from 'react';
import './UserList.css';

const UserList = ({ users, currentUser, onUserSelect, selectedUser }) => {
  const onlineUsers = users.filter((user) => user.username !== currentUser);

  return (
    <div className="user-list">
      <div className="user-list-header">
        <h3>Online Users ({onlineUsers.length})</h3>
      </div>
      <div className="users">
        {onlineUsers.length === 0 ? (
          <div className="no-users">No other users online</div>
        ) : (
          onlineUsers.map((user) => (
            <div
              key={user.id}
              className={`user-item ${
                selectedUser?.id === user.id ? 'selected' : ''
              }`}
              onClick={() => onUserSelect(user)}
            >
              <div className="user-avatar">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div className="user-info">
                <span className="username">{user.username}</span>
                <span className="status">Online</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserList;
