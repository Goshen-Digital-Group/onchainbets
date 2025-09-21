import React from 'react';
import styled from 'styled-components';

const ToastContainer = styled.div`
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  @media (max-width: 768px) {
    top: 0.5rem;
    left: 0.5rem;
  }
`;

const Toast = styled.div<{ $win: boolean }>`
  background-color: ${({ $win }) => ($win ? '#15ff00' : '#ff4d4d')};
  color: #000;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: bold;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  animation: fadeInOut 4s ease-in-out;

  @keyframes fadeInOut {
    0% {
      opacity: 0;
      transform: translateY(-10px);
    }
    10% {
      opacity: 1;
      transform: translateY(0);
    }
    90% {
      opacity: 1;
      transform: translateY(0);
    }
    100% {
      opacity: 0;
      transform: translateY(-10px);
    }
  }
`;

type ToastNotificationProps = {
  notifications: { id: string; message: string; win: boolean }[];
};

export const ToastNotification: React.FC<ToastNotificationProps> = ({ notifications }) => {
  return (
    <ToastContainer>
      {notifications.map((notification) => (
        <Toast key={notification.id} $win={notification.win}>
          {notification.message}
        </Toast>
      ))}
    </ToastContainer>
  );
};