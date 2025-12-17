import React from 'react';

const BalanceCard = ({ title, value, icon, color }) => {
  const colorClasses = {
    yellow: 'border-l-4 border-primary-yellow',
    green: 'border-l-4 border-primary-green',
    red: 'border-l-4 border-primary-red',
    gray: 'border-l-4 border-gray-500'
  };

  return (
    <div className={`bg-card rounded-xl p-6 ${colorClasses[color]}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-text-muted text-sm mb-2">{title}</p>
          <p className="text-2xl font-bold text-text-primary">{value}</p>
        </div>
        <div className="p-3 rounded-lg bg-gray-800">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;
