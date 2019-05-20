import React from 'react';
import { observer } from 'mobx-react';

const AppContext = React.createContext();

@observer
class AppProvider extends React.Component {
  render() {
    const { UserStore, UIStore } = this.props;
    return (
      <AppContext.Provider value={{ UserStore, UIStore }}>
        {this.props.children}
      </AppContext.Provider>
    );
  }
}

export { AppProvider, AppContext };
