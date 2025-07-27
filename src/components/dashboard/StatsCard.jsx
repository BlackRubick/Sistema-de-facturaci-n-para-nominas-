import React from 'react';

const StatsCard = ({ title, value, icon, color, trend }) => {
  const cardClass = `stats-card stats-card-${color}`;
  const trendClass = trend?.startsWith('+') ? 'trend-positive' : 
                    trend?.startsWith('-') ? 'trend-negative' : 'trend-neutral';

  return (
    <div className={cardClass}>
      <div className="stats-card-header">
        <div className="stats-icon">{icon}</div>
        <div className="stats-trend">
          <span className={`trend ${trendClass}`}>{trend}</span>
        </div>
      </div>
      <div className="stats-content">
        <h3 className="stats-value">{value}</h3>
        <p className="stats-title">{title}</p>
      </div>
    </div>
  );
};

export default StatsCard;