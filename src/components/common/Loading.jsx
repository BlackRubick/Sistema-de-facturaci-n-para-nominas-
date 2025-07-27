import React from 'react';

const Loading = ({ 
  size = 'medium', 
  text = 'Cargando...', 
  fullScreen = false,
  className = '' 
}) => {
  const sizeClass = `loading-${size}`;
  const fullScreenClass = fullScreen ? 'loading-fullscreen' : '';
  
  const classes = [
    'loading',
    sizeClass,
    fullScreenClass,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
      {text && <div className="loading-text">{text}</div>}
    </div>
  );
};

export default Loading;