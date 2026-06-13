import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [onlineCount, setOnlineCount] = useState(0);

  useEffect(() => {
    const s = io('/', { transports: ['websocket', 'polling'] });
    setSocket(s);

    s.on('connect', () => {
      if (user) s.emit('user:join', { userId: user._id, role: user.role });
    });

    s.on('users:count', count => setOnlineCount(count));

    s.on('incident:new', incident => {
      addNotification({ type: 'incident', severity: incident.severity, message: `New ${incident.type} reported: ${incident.title}`, data: incident });
    });

    s.on('alert:new', alert => {
      addNotification({ type: 'alert', severity: alert.severity, message: alert.title, data: alert });
    });

    s.on('sos:received', data => {
      addNotification({ type: 'sos', severity: 'critical', message: `🆘 SOS from ${data.user?.name || 'Unknown'}`, data });
    });

    return () => s.disconnect();
  }, [user]);

  const addNotification = (notif) => {
    const id = Date.now();
    setNotifications(prev => [{ ...notif, id, timestamp: new Date() }, ...prev.slice(0, 19)]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 8000);
  };

  const dismissNotification = (id) => setNotifications(prev => prev.filter(n => n.id !== id));

  return (
    <SocketContext.Provider value={{ socket, notifications, dismissNotification, onlineCount }}>
      {children}
    </SocketContext.Provider>
  );
};
