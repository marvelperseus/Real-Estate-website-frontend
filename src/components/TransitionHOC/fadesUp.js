import React from 'react';
import { TweenMax, Elastic } from 'gsap';

// HOC that adds a fade up animation to it's component argument
// and takes an 'options' configuration object
/*

const config = {
  enterDuration: Int (seconds),
  enterDelay: Int (seconds),
  exitDuration: Int (seconds),
}

*/
function fadesUp(Component, options = {}) {
  return class FadesUp extends React.Component {
    componentWillAppear(callback) {
      const el = this._child;
      TweenMax.fromTo(
        el,
        options.enterDuration || 0.8,
        { y: -100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          onComplete: callback,
          delay: options.enterDelay || 0.3,
          ease: Elastic.easeOut.config(1.5, 0.6),
        }
      );
    }

    componentWillLeave(callback) {
      const el = this._child;
      TweenMax.fromTo(el, options.exitDuration || 0.5, { opacity: 1 }, { opacity: 0, onComplete: callback });
    }

    render() {
      return (
        <div ref={c => this._child = c}>
          <Component {...this.props} />
        </div>
      );
    }
  }
}

export default fadesUp;
