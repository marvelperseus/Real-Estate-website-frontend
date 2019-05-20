function debounce(func, wait, immediate) {
  let timeout;
  return function() {
    const args = arguments;
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(null, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(null, args);
  };
}

export default debounce;
