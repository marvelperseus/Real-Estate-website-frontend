import { types } from 'mobx-state-tree';

const defaultState = {
  fullScreenLoaderOn: false,
  fullScreenLoaderText: '',
};

const Store = types
  .model('UI', {
    fullScreenLoaderOn: types.boolean,
    fullScreenLoaderText: types.string,
  })
  .actions(self => ({
    toggleFullScreenLoader: (state, text) => {
      if (typeof text === 'string') self.fullScreenLoaderText = text;
      self.fullScreenLoaderOn =
        typeof state === 'boolean' ? state : !self.fullScreenLoaderOn;
    },
    setfullScreenLoaderText: text => {
      if (typeof text !== 'string' && !text) return;
      self.fullScreenLoaderText = text;
    },
  }));

export default Store.create(defaultState);
