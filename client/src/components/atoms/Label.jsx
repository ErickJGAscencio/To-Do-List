import React from 'react'
import PropTypes from 'prop-types';

const Label = ({ text, type }) => {
  const getClass = () => {
    switch (type) {
      case 'title':
        return 'label-title';
      case 'subtitle':
        return 'label-subtitle';
      case 'paragraph':
        return 'label-paragraph';
      default:
        return 'label-default';
    }
  };

  return <div className={getClass()}>{text}</div>;
};

Label.propTypes = {
  text: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['title', 'subtitle', 'paragraph', 'default']).isRequired,
};

export default Label;
