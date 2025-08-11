import React, { useState, useEffect } from 'react';
import SubTitleLabel from '../atoms/SubTitleLabel';

function ProgressLabel({ status }) {
  const [statusClass] = useState({
    1: 'progress-1',
    2: 'progress-2',
  });

  const [messageLabel] = useState({
    1: 'In progress',
    2: 'Completed',
  });

  const message = messageLabel[status];

  return (
    <div className={statusClass[status]}>
      <SubTitleLabel label={message}/>
    </div>
  );
}

export default ProgressLabel;
