import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import { observer } from 'mobx-react';
import Grid from 'material-ui/Grid';
import AddPersonIcon from '@material-ui/icons/PersonAdd';
import PersonPinIcon from '@material-ui/icons/PersonPin';
import LargeIconTextBtn from '../components/LargeIconTextBtn';

const styles = theme => ({
  wrapper: {
    position: 'relative',
  },
});

@observer
class Deals extends Component {
  constructor(props) {
    super(props);

    this.state = {
      addAgentDialogOpen: false,
    };
  }

  toggleAddAgentDialogBox = () => {
    this.setState({ addAgentDialogOpen: !this.state.addAgentDialogOpen });
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.wrapper}>
      {/*
        <Grid container>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <LargeIconTextBtn onClick={this.toggleAddAgentDialogBox} icon={AddPersonIcon} title="New Agent" description="Create a new agent and agent profile." />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <LargeIconTextBtn onClick={this.toggleManageProfileDialogBox} icon={PersonPinIcon} title="Manage Profile" description="Select and manage an agent's profile" />
          </Grid>
        </Grid>
      */}
      </div>
    );
  }
}

export default withStyles(styles)(Deals);
