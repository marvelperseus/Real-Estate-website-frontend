import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withStyles } from 'material-ui/styles';
import { DotLoader } from 'react-spinners';
import { Typography } from 'material-ui';
import InvoicesTable from '../components/InvoicesTable';

const Loader = DotLoader;

const styles = theme => ({
  progress: {
    margin: theme.spacing.unit * 2,
    marginRight: 'auto',
    marginLeft: 'auto',
    display: 'block',
  },
  progressWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    height: '500px',
    [theme.breakpoints.down('sm')]: {
      height: '300px',
    },
    padding: '60px 20px',
    boxShadow: theme.shadows[1],
    borderRadius: '3px',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: '20px',
    fontSize: '1rem',
    fontFamily: theme.typography.fontFamily,
  },
});

@observer
class InvoicesTableContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableIsLoading: true,
    };
  }

  render() {
    const { tableIsLoading } = this.state;
    const { classes, ...rest } = this.props;
    return (
      <div>
        {
          tableIsLoading ? (
            <div className={classes.progressWrapper}>
              <Loader
                color="#f44336"
                loading
              />
              {/* <div className={classes.loadingText} variant="subheading">Loading ...</div> */}
            </div>
          ) : null
        }
        <InvoicesTable {...rest} onMount={() => this.setState({ tableIsLoading: false })} />
      </div>
    );
  }
}

export default withStyles(styles)(InvoicesTableContainer);
