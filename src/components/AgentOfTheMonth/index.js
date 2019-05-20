import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Tooltip from 'material-ui/Tooltip';
import { darken } from 'polished';
import classNames from 'classnames';
import { Link } from '../../routes';

const styles = theme => ({
  root: {},
  anchor: {
    textDecoration: 'none',
    color: 'rgba(0,0,0,.7)',
    '&:hover': {
      color: 'rgba(0,0,0,.9)',
    },
  },
  agentBoxWrapper: {
    position: 'relative',
    display: 'flex',
    padding: '5px 25px',
    alignItems: 'center',
    height: '120px',
    boxShadow: theme.shadows[1],
    backgroundColor: '#fff',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  /*
  sales: {
    background: 'linear-gradient(45deg, #9e1f1f 0%,#c11f1f 14%,#ffffff 14%,#ffffff 100%)',
    [theme.breakpoints.only('sm')]: {
      background: 'linear-gradient(45deg, #9e1f1f 0%,#c11f1f 13%,#ffffff 13%,#ffffff 100%)',
    },
  },
  other: {
    background: `linear-gradient(45deg, ${darken(0.1, '#9e1f1f')} 0%, ${darken(0.1, '#c11f1f')} 14%,#ffffff 14%,#ffffff 100%)`,
    [theme.breakpoints.only('sm')]: {
      background: `linear-gradient(45deg, ${darken(0.1, '#9e1f1f')} 0%, ${darken(0.1, '#c11f1f')} 13%,#ffffff 13%,#ffffff 100%)`,
    },
  },
  */
  profilePhotoWrapper: {
    position: 'absolute',
    height: '60%',
  },
  image: {
    height: '100%',
    display: 'block',
    objectFit: 'cover',
    cursor: 'pointer',
    borderRadius: '50%',
    background: 'linear-gradient(45deg, #45484d 0%,#000000 100%)',
  },
  imageNo: {
    width: '72px',
    color: '#fff',
    height: '100%',
    cursor: 'pointer',
    display: 'flex',
    background: 'linear-gradient(45deg, #45484d 0%,#000000 100%)',
    alignItems: 'center',
    borderRadius: '50%',
    justifyContent: 'center'
  },
  infoWrapper: {
    marginLeft: '70px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '0 10px',
    width: '100%',
    height: '80%',
  },
  AgentOfTheMonthType: {
    fontSize: '.85rem',
    fontWeight: 500,
    color: 'rgba(0,0,0,.7)',
  },
  agentName: {
    fontSize: '20px',
    fontWeight: 300,
  },
  agentAwardTitle: {
    marginBottom: '10px',
    fontSize: '14px',
    fontWeight: 300,
    // fontStyle: 'italic',
    color: theme.palette.secondary.dark,
  },
  stat: {
    fontSize: '14px',
    fontWeight: 300,
    color: 'rgba(0,0,0,.7)',
  },
  label: {
    position: 'absolute',
    top: '-5px',
    right: '5px',
    padding: '5px 8px',
    backgroundColor: 'rgba(0,0,0,.8)',
    fontSize: '10px',
    borderRadius: '10px',
    color: '#fff',
    zIndex: 10,
  },
  contentWrapper: {
    height: '100%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    overflow: 'auto',
  },
  placeholder: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    //backgroundColor: 'rgba(0,0,0,.8)',
    background: 'linear-gradient(45deg, #45484d 0%,#1c1c1c 100%)',
    color: '#fff',
    fontWeight: 500,
    borderRadius: '5px',
  },
  placeholderWrapper: {
    cursor: 'default',
  },
});

@observer
class AgentOfTheMonth extends Component {
  renderPlaceholder = (message) => {
    const { classes } = this.props;
    return (
      <div
        className={classNames(
          classes.agentBoxWrapper,
          classes.placeholderWrapper
        )}
      >
        <span className={classes.label}>Agent of the Quarter</span>
        <div className={classes.placeholder}>{message}</div>
      </div>
    );
  };

  render() {
    const {
      classes,
      residentialDollarsAgent,
      commercialDollarsAgent,
      rentalsDollarsAgent,
      numbersAgent,
    } = this.props;
    return (
      <div className={classes.root}>
        <Grid container spacing={16}>
          <Grid item xs={12} md={6}>
            {residentialDollarsAgent ? (
              <Link route={residentialDollarsAgent.profileURL || '#'}>
                <a className={classes.anchor}>
                  <div
                    className={classNames(
                      classes.agentBoxWrapper,
                      classes.sales
                    )}
                  >
                    <span className={classes.label}>Agent of the Quarter</span>

                    <div className={classes.contentWrapper}>
                      <div className={classes.profilePhotoWrapper}>
                        {
                          residentialDollarsAgent.photoURL ? (<img
                            className={classes.image}
                            src={residentialDollarsAgent.photoURL}
                            alt={residentialDollarsAgent.name}
                          />) : (
                              <div className={classes.imageNo}>?</div>
                            )
                        }

                      </div>

                      <div className={classes.infoWrapper}>
                        <div className={classes.agentName}>
                          {residentialDollarsAgent.name}
                        </div>
                        <div className={classes.agentAwardTitle}>
                          - Gross Residential Sales
                        </div>
                        {/* <div className={classes.stat}>
                          Seles: ${residentialDollarsAgent.statItem.toLocaleString()}
                        </div> */}
                      </div>
                    </div>
                  </div>
                </a>
              </Link>
            ) : (
                this.renderPlaceholder("No deals for Residential Sales")
              )}
          </Grid>

          <Grid item xs={12} md={6}>
            {commercialDollarsAgent ? (
              <Link route={commercialDollarsAgent.profileURL || '#'}>
                <a className={classes.anchor}>
                  <div
                    className={classNames(
                      classes.agentBoxWrapper,
                      classes.sales
                    )}
                  >
                    <span className={classes.label}>Agent of the Quarter</span>

                    <div className={classes.contentWrapper}>
                      <div className={classes.profilePhotoWrapper}>
                        {
                          commercialDollarsAgent.photoURL ? (<img
                            className={classes.image}
                            src={commercialDollarsAgent.photoURL}
                            alt={commercialDollarsAgent.name}
                          />) : (
                              <div className={classes.imageNo}>?</div>
                            )
                        }

                      </div>

                      <div className={classes.infoWrapper}>
                        <div className={classes.agentName}>
                          {commercialDollarsAgent.name}
                        </div>
                        <div className={classes.agentAwardTitle}>
                          - Gross Commercial Sales
                        </div>
                        {/* <div className={classes.stat}>
                          Sales: ${commercialDollarsAgent.statItem.toLocaleString()}
                        </div> */}
                      </div>
                    </div>
                  </div>
                </a>
              </Link>
            ) : (
                this.renderPlaceholder("No deals for Commercial Sales")
              )}
          </Grid>

          <Grid item xs={12} md={6}>
            {rentalsDollarsAgent ? (
              <Link route={rentalsDollarsAgent.profileURL || '#'}>
                <a className={classes.anchor}>
                  <div
                    className={classNames(
                      classes.agentBoxWrapper,
                      classes.other
                    )}
                  >
                    <span className={classes.label}>Agent of the Quarter</span>

                    <div className={classes.contentWrapper}>
                      <div className={classes.profilePhotoWrapper}>
                        {
                          rentalsDollarsAgent.photoURL ? (<img
                            className={classes.image}
                            src={rentalsDollarsAgent.photoURL}
                            alt={rentalsDollarsAgent.name}
                          />) :
                            (
                              <div className={classes.imageNo}>?</div>
                            )

                        }

                      </div>

                      <div className={classes.infoWrapper}>
                        <div className={classes.agentName}>
                          {rentalsDollarsAgent.name}
                        </div>
                        <div className={classes.agentAwardTitle}>
                          - Top Residential Commissions Earned
                        </div>
                        {/* <div className={classes.stat}>
                          Amount: ${rentalsDollarsAgent.statItem.toLocaleString()}
                        </div> */}
                      </div>
                    </div>
                  </div>
                </a>
              </Link>
            ) : (
                this.renderPlaceholder("No deals for Rental Sales")
              )}
          </Grid>

          <Grid item xs={12} md={6}>
            {numbersAgent ? (
              <Link route={numbersAgent.profileURL || '#'}>
                <a className={classes.anchor}>
                  <div
                    className={classNames(
                      classes.agentBoxWrapper,
                      classes.other
                    )}
                  >
                    <span className={classes.label}>Agent of the Quarter</span>

                    <div className={classes.contentWrapper}>
                      <div className={classes.profilePhotoWrapper}>
                        {
                          numbersAgent.photoURL ? (
                            <img
                              className={classes.image}
                              src={numbersAgent.photoURL}
                              alt={numbersAgent.name}
                            />
                          ) : (
                              <div className={classes.imageNo}>?</div>
                            )
                        }

                      </div>

                      <div className={classes.infoWrapper}>
                        <div className={classes.agentName}>
                          {numbersAgent.name}
                        </div>
                        <div className={classes.agentAwardTitle}>
                          - Total Deals
                        </div>
                        <div className={classes.stat}>
                          Deals: {numbersAgent.statItem.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              </Link>
            ) : (
                this.renderPlaceholder("No deals for Agent Sales")
              )}
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(AgentOfTheMonth);
