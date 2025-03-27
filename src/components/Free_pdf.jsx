import React from 'react';

const Free_pdf = () => {
  return (
    <div className='text-center p-5'>
    <div className="fire-text">
      Coming Soon
    </div></div>
  );
};

const styles = `
  /* Fire Animation Styles */
  .fire-text {
    font-size: 50px;
    font-weight: bold;
    color: #f39c12; /* Set initial color to fire-like yellow */
    position: relative;
    text-transform: uppercase;
    animation: fire-animation 1.5s infinite alternate;
    display: inline-block;
  }

  .fire-text::before,
  .fire-text::after {
    content: '';
    position: absolute;
    width: 10px;
    height: 10px;
    background-color: red;
    border-radius: 50%;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    animation: fire-particle 1s infinite alternate;
  }

  .fire-text::before {
    top: 8px;
    animation-delay: 0.1s;
  }

  .fire-text::after {
    top: 12px;
    animation-delay: 0.3s;
  }

  /* Keyframes for flame effect */
  @keyframes fire-animation {
    0% {
      color: #f39c12; /* yellow */
      text-shadow: 0 0 5px #f39c12, 0 0 10px #f39c12, 0 0 15px #e74c3c, 0 0 20px #e74c3c;
    }
    100% {
      color: #e74c3c; /* red */
      text-shadow: 0 0 5px #e74c3c, 0 0 10px #e74c3c, 0 0 15px #f39c12, 0 0 20px #f39c12;
    }
  }

  /* Keyframes for small flame particles */
  @keyframes fire-particle {
    0% {
      transform: translateX(-50%) translateY(0) scale(1);
      opacity: 1;
    }
    100% {
      transform: translateX(-50%) translateY(-30px) scale(0.5);
      opacity: 0;
    }
  }
`;

const injectStyles = () => {
  const styleTag = document.createElement('style');
  styleTag.innerHTML = styles;
  document.head.appendChild(styleTag);
};

injectStyles();

export default Free_pdf;
