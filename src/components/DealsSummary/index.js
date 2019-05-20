import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsiveLine } from '@nivo/line';
import withSizes from 'react-sizes';
import Chance from 'chance';
import ToggleButton from 'react-toggle-button';
import moment from 'moment';
import DollarIcon from '@material-ui/icons/AttachMoney';
import PendingIcon from '@material-ui/icons/Help';
import { round } from '../../utils/Math';
import StatNumberBox from '../StatNumberBox';

const chance = new Chance();

const styles = theme => ({
  root: {
    maxWidth: '100%',
    fontFamily: theme.typography.fontFamily,
  },
  graphWrapper: {
    position: 'relative',
    padding: '10px',
    height: '500px',
    maxHeight: '100%',
    maxWidth: '100%',
    backgroundColor: '#fff',
    fontSize: '12px',
    boxShadow: theme.shadows[1],
    borderRadius: '5px',
    display: 'flex',
    justifyContent: 'center',
  },
  graphWrapper2: {
    position: 'relative',
    padding: '10px',
    height: '500px',
    [theme.breakpoints.down('sm')]: {
      height: '670px',
    },
    maxHeight: '100%',
    maxWidth: '100%',
    backgroundColor: '#fff',
    fontSize: '12px',
    boxShadow: theme.shadows[1],
    borderRadius: '5px',
    display: 'flex',
    justifyContent: 'center',
  },
  graphControlsWrapper: {
    position: 'absolute',
    padding: '6px 80px',
    bottom: '0',
    alignText: 'center',
    zIndex: 1,
    display: 'flex',
    justifyContent: 'center',
  },
  toggleWrapper: {
    marginRight: '20px',
  },
  graphControlsLabel: {
    display: 'flex',
    alignItems: 'center',
    marginRight: '10px',
    color: 'rgba(0,0,0,.8)',
  },
  graphTitle: {
    position: 'absolute',
    top: 0,
    padding: '15px 10px',
    fontSize: '16px',
    fontWeight: 500,
    alignText: 'center',
    color: 'rgba(0,0,0,.7)',
    textDecoration: 'underline',
    transition: 'all .3s ease-in-out',
  },
  statNumberBoxWrapper: {
    width: '50%',
  },
  statBoxQuestionIcon: {
    fontSize: '40px',
    color: '#F57C00',
  },
  statBoxMoneyIcon: {
    fontSize: '40px',
    color: '#388E3C',
  },
});

const generateMonthlyNumberDealsData = () => {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const data = {};

  months.forEach(month => {
    data[month] = {
      'Com Sales': chance.integer({ min: 0, max: 3 }) || 0.05,
      'Com Rentals': chance.integer({ min: 0, max: 15 }) || 0.05,
      'Res Sales': chance.integer({ min: 0, max: 3 }) || 0.05,
      'Res Rentals': chance.integer({ min: 0, max: 30 }) || 0.05,
    };
  });

  return data;
};

const generateYearlyNumberDealsData = () => {
  const currentYear = moment().year();
  const years = [
    currentYear,
    currentYear - 1,
    currentYear - 2,
    currentYear - 3,
    currentYear - 4,
  ];

  const data = {};

  years.forEach(year => {
    data[year] = {
      'Com Sales': chance.integer({ min: 0, max: 36 }) || 0.05,
      'Com Rentals': chance.integer({ min: 0, max: 180 }) || 0.05,
      'Res Sales': chance.integer({ min: 0, max: 36 }) || 0.05,
      'Res Rentals': chance.integer({ min: 0, max: 360 }) || 0.05,
    };
  });

  return data;
};

const generateYearlyDollarDealsData = () => {
  const currentYear = moment().year();
  const years = [
    currentYear,
    currentYear - 1,
    currentYear - 2,
    currentYear - 3,
    currentYear - 4,
  ];

  const data = {};

  years.forEach(year => {
    data[year] = {
      'Com Sales':
        round(chance.integer({ min: 0, max: 35000000 }) / 1000000, 2) || 0.001,
      'Com Rentals':
        round(chance.integer({ min: 0, max: 35000000 }) / 1000000, 2) || 0.001,
      'Res Sales':
        round(chance.integer({ min: 0, max: 35000000 }) / 1000000, 2) || 0.001,
      'Res Rentals':
        round(chance.integer({ min: 0, max: 3500000 }) / 1000000, 2) || 0.001,
    };
  });

  return data;
};

const generateMonthlyDollarDealsData = () => {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const data = {};

  months.forEach(month => {
    data[month] = {
      'Com Sales':
        round(chance.integer({ min: 0, max: 3000000 }) / 1000000, 2) || 0.001,
      'Com Rentals':
        round(chance.integer({ min: 0, max: 3000000 }) / 1000000, 2) || 0.001,
      'Res Sales':
        round(chance.integer({ min: 0, max: 3000000 }) / 1000000, 2) || 0.001,
      'Res Rentals':
        round(chance.integer({ min: 0, max: 300000 }) / 1000000, 2) || 0.001,
    };
  });

  return data;
};

const generateMonthlyDealsBarData = data => Object.keys(data).map(month => ({
  month,
  'Com Sales': data[month]['Com Sales'],
  'Com Rentals': data[month]['Com Rentals'],
  'Res Sales': data[month]['Res Sales'],
  'Res Rentals': data[month]['Res Rentals'],
}));

const generateMonthlyDealsLineData = data => {
  const types = ['Com Sales', 'Com Rentals', 'Res Sales', 'Res Rentals'];

  return types.map(id => ({
    id,
    data: Object.keys(data).map(month => ({
      x: month,
      y: data[month][id],
    })),
  }));
};

const mapSizesToProps = ({ width }) => ({
  xsViewport: width < 412,
  smViewport: width < 600,
  mdViewport: width < 960,
  lgViewport: width < 1280,
});

@observer
@withSizes(mapSizesToProps)
class AgentDashboard extends Component {
  constructor(props) {
    super(props);
    this._monthlyDealsNumberData = generateMonthlyNumberDealsData();
    this._monthlyDealsDollarData = generateMonthlyDollarDealsData();

    this._yearlyDealsNumberData = generateYearlyNumberDealsData();
    this._yearlyDealsDollarData = generateYearlyDollarDealsData();

    this._monthlyDealsDollarBarData = generateMonthlyDealsBarData(
      this._monthlyDealsDollarData
    );
    this._monthlyDealsNumberBarData = generateMonthlyDealsBarData(
      this._monthlyDealsNumberData
    );

    this._monthlyDealsDollarLineData = generateMonthlyDealsLineData(
      this._monthlyDealsDollarData
    );
    this._monthlyDealsNumberLineData = generateMonthlyDealsLineData(
      this._monthlyDealsNumberData
    );

    this._yearlyDealsDollarBarData = generateMonthlyDealsBarData(
      this._yearlyDealsDollarData
    );
    this._yearlyDealsNumberBarData = generateMonthlyDealsBarData(
      this._yearlyDealsNumberData
    );

    this._yearlyDealsDollarLineData = generateMonthlyDealsLineData(
      this._yearlyDealsDollarData
    );
    this._yearlyDealsNumberLineData = generateMonthlyDealsLineData(
      this._yearlyDealsNumberData
    );

    this.state = {
      monthlyDealsNumberLineGraphOn: true,
      monthlyDealsDollarLineGraphOn: true,

      yearlyDealsNumberGraphOn: false,
      yearlyDealsDollarGraphOn: false,

      monthlyDealsDollarOrNum: 'number',
      totalDealsPieDollarOrNum: 'number',
    };
  }

  toggleMonthlyDealsNumberLineGraph = () => {
    this.setState({
      monthlyDealsNumberLineGraphOn: !this.state.monthlyDealsNumberLineGraphOn,
    });
  };

  toggleMonthlyDealsDollarLineGraph = () => {
    this.setState({
      monthlyDealsDollarLineGraphOn: !this.state.monthlyDealsDollarLineGraphOn,
    });
  };

  toggleMonthlyDealsDollarOrNum = () => {
    this.setState({
      monthlyDealsDollarOrNum:
        this.state.monthlyDealsDollarOrNum === 'dollar' ? 'number' : 'dollar',
    });
  };

  toggleTotalDealsPieDollarOrNum = () => {
    this.setState({
      totalDealsPieDollarOrNum:
        this.state.totalDealsPieDollarOrNum === 'dollar' ? 'number' : 'dollar',
    });
  };

  toggleYearlyDealsNumberGraph = () => {
    this.setState({
      yearlyDealsNumberGraphOn: !this.state.yearlyDealsNumberGraphOn,
    });
  };

  toggleYearlyDealsDollarGraph = () => {
    this.setState({
      yearlyDealsDollarGraphOn: !this.state.yearlyDealsDollarGraphOn,
    });
  };

  barGraphLayout = () => {
    const { lgViewport, mdViewport, smViewport } = this.props;
    if (smViewport) {
      return 'horizontal';
    } if (mdViewport) {
      return 'vertical';
    }
    if (lgViewport) {
      return 'vertical';
    }
    return 'horizontal';
  };

  dollarBarGraphAxis = (axis, isYear) => {
    const { lgViewport, mdViewport, smViewport } = this.props;
    if (axis === 'left') {
      if (smViewport) {
        return isYear ? 'Year' : 'Month';
      } if (mdViewport) {
        return 'Gross Dollar Amount ($ Thousands)';
      }
      if (lgViewport) {
        return 'Gross Dollar Amount ($ Thousands)';
      }
      return isYear ? 'Year' : 'Month';
    }

    if (smViewport) {
      return 'Gross Dollar Amount ($ Thousands)';
    } if (mdViewport) {
      return isYear ? 'Year' : 'Month';
    }
    if (lgViewport) {
      return isYear ? 'Year' : 'Month';
    }
    return 'Gross Dollar Amount ($ Thousands)';
  };

  numberBarGraphAxis = (axis, isYear) => {
    const { lgViewport, mdViewport, smViewport } = this.props;
    if (axis === 'left') {
      if (smViewport) {
        return isYear ? 'Year' : 'Month';
      } if (mdViewport) {
        return 'Number of Deals';
      }
      if (lgViewport) {
        return 'Number of Deals';
      }
      return isYear ? 'Year' : 'Month';
    }

    if (smViewport) {
      return 'Number of Deals';
    } if (mdViewport) {
      return isYear ? 'Year' : 'Month';
    }
    if (lgViewport) {
      return isYear ? 'Year' : 'Month';
    }
    return 'Number of Deals';
  };

  render() {
    const { classes, smViewport, xsViewport } = this.props;
    const {
      totalDealsPieDollarOrNum,
      yearlyDealsDollarGraphOn,
      yearlyDealsNumberGraphOn,
    } = this.state;
    const borderRadiusStyle = { borderRadius: 2 };

    const isDollar = totalDealsPieDollarOrNum === 'dollar';
    const sliceLabel = v => `${isDollar ? '$' : ''}${v.value}`;

    return (
      <div className={classes.root}>
        <Grid container spacing={16}>
          <Grid item xs={12} md={6}>
            <StatNumberBox
              icon={DollarIcon}
              iconClass={classes.statBoxMoneyIcon}
              stat={this.props.grossDealCommissions}
              statTitle="Gross Commissions to Date"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <StatNumberBox
              icon={DollarIcon}
              iconClass={classes.statBoxMoneyIcon}
              stat={this.props.netCurrentYearDealCommissions}
              statTitle={`${moment().year()} Net Commissions to Date`}
            />
          </Grid>
          <Grid item xs={12}>
            <StatNumberBox
              icon={PendingIcon}
              iconClass={classes.statBoxQuestionIcon}
              stat={this.props.numberOfPendingDeals}
              statTitle="Number of Pending Deals"
            />
          </Grid>

          {this.props.numberOfTotalDealsData ? (
            <Grid item xs={12}>
              <div
                className={classes.graphWrapper}
                style={{ fontSize: xsViewport ? '11px' : '12px' }}
              >
                <div className={classes.graphTitle}>Total Deals</div>
                <ResponsivePie
                  data={
                    totalDealsPieDollarOrNum === 'number'
                      ? this.props.numberOfTotalDealsData
                      : this.props.grossDollarAmtOfTotalDealsData
                  }
                  margin={{
                    top: 70,
                    right: 80,
                    bottom: 120,
                    left: 80,
                  }}
                  sliceLabel={sliceLabel}
                  innerRadius={0.7}
                  padAngle={0.7}
                  cornerRadius={0}
                  colors="dark2"
                  colorBy="id"
                  borderColor="inherit:darker(0.6)"
                  radialLabelsSkipAngle={10}
                  radialLabelsTextXOffset={6}
                  radialLabelsTextColor="#333333"
                  radialLabelsLinkOffset={0}
                  radialLabelsLinkDiagonalLength={smViewport ? 4 : 16}
                  radialLabelsLinkHorizontalLength={smViewport ? 10 : 24}
                  radialLabelsLinkStrokeWidth={1}
                  radialLabelsLinkColor="inherit"
                  slicesLabelsSkipAngle={10}
                  slicesLabelsTextColor="#333333"
                  animate
                  motionStiffness={90}
                  motionDamping={15}
                  legends={[
                    {
                      anchor: 'bottom',
                      direction: 'row',
                      translateY: 56,
                      itemWidth: smViewport ? 85 : 100,
                      itemHeight: 14,
                      symbolSize: 14,
                      symbolShape: 'circle',
                      itemDirection: 'top-to-bottom',
                    },
                  ]}
                />
                <div className={classes.graphControlsWrapper}>
                  <span className={classes.graphControlsLabel}>Controls:</span>
                  <ToggleButton
                    value={this.state.totalDealsPieDollarOrNum !== 'number'}
                    thumbStyle={borderRadiusStyle}
                    trackStyle={borderRadiusStyle}
                    colors={{
                      active: {
                        base: 'rgb(65,66,68)',
                        hover: 'rgb(95,96,98)',
                      },
                      inactive: {
                        base: 'rgb(65,66,68)',
                        hover: 'rgb(95,96,98)',
                      },
                    }}
                    inactiveLabel="Num"
                    activeLabel="$"
                    onToggle={this.toggleTotalDealsPieDollarOrNum}
                  />
                </div>
              </div>
            </Grid>
          ) : null}

          <Grid item xs={12} lg={6}>
            <div
              className={classes.graphWrapper2}
              style={{ fontSize: xsViewport ? '11px' : '12px' }}
            >
              <div className={classes.graphTitle}>Net Commissions ($)</div>
              <div className={classes.graphControlsWrapper}>
                <span className={classes.graphControlsLabel}>Controls:</span>
                <span className={classes.toggleWrapper}>
                  <ToggleButton
                    value={!this.state.monthlyDealsDollarLineGraphOn}
                    thumbStyle={borderRadiusStyle}
                    trackStyle={borderRadiusStyle}
                    colors={{
                      active: {
                        base: 'rgb(65,66,68)',
                        hover: 'rgb(95,96,98)',
                      },
                      inactive: {
                        base: 'rgb(65,66,68)',
                        hover: 'rgb(95,96,98)',
                      },
                    }}
                    inactiveLabel="Line"
                    activeLabel="Bar"
                    onToggle={this.toggleMonthlyDealsDollarLineGraph}
                  />
                </span>
                <ToggleButton
                  value={this.state.yearlyDealsDollarGraphOn}
                  thumbStyle={borderRadiusStyle}
                  trackStyle={borderRadiusStyle}
                  colors={{
                    active: {
                      base: 'rgb(65,66,68)',
                      hover: 'rgb(95,96,98)',
                    },
                    inactive: {
                      base: 'rgb(65,66,68)',
                      hover: 'rgb(95,96,98)',
                    },
                  }}
                  inactiveLabel="Month"
                  activeLabel="Year"
                  onToggle={this.toggleYearlyDealsDollarGraph}
                />
              </div>
              {this.state.monthlyDealsDollarLineGraphOn ? (
                <ResponsiveLine
                  data={
                    !yearlyDealsDollarGraphOn
                      ? this.props.monthlyDealsDollarLineData
                      : this.props.yearlyDealsDollarLineData
                  }
                  colors="dark2"
                  curve="catmullRom"
                  enableArea
                  margin={{
                    top: 60,
                    right: smViewport ? 40 : 110,
                    bottom: smViewport ? 130 : 80,
                    left: 60,
                  }}
                  minY="auto"
                  axisBottom={{
                    orient: 'bottom',
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: !yearlyDealsDollarGraphOn ? 'Month' : 'Year',
                    legendOffset: 36,
                    legendPosition: 'center',
                  }}
                  axisLeft={{
                    orient: 'left',
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Net Dollar Amount ($ Thousands)',
                    legendOffset: -40,
                    legendPosition: 'center',
                  }}
                  dotSize={10}
                  dotColor="inherit:darker(0.3)"
                  dotBorderWidth={2}
                  dotBorderColor="#ffffff"
                  dotLabel="y"
                  dotLabelYOffset={-12}
                  animate
                  motionStiffness={90}
                  motionDamping={15}
                  legends={[
                    {
                      anchor: smViewport ? 'bottom' : 'bottom-right',
                      direction: smViewport ? 'row' : 'column',
                      translateX: smViewport ? undefined : 118,
                      translateY: smViewport ? 76 : -40,
                      itemWidth: smViewport ? 80 : 100,
                      itemHeight: 20,
                      itemsSpacing: smViewport ? 2 : 10,
                      symbolSize: 12,
                      itemDirection: smViewport ? 'top-to-bottom' : undefined,
                    },
                  ]}
                />
              ) : (
                <ResponsiveBar
                  data={
                    yearlyDealsDollarGraphOn
                      ? this.props.yearlyDealsDollarBarData
                      : this.props.monthlyDealsDollarBarData
                  }
                  colors="dark2"
                  groupMode="grouped"
                  maxValue="auto"
                  layout={this.barGraphLayout()}
                  keys={[
                    'Com Sales',
                    'Com Rentals',
                    'Res Sales',
                    'Res Rentals',
                  ]}
                  indexBy="month"
                  margin={{
                    top: 50,
                    right: smViewport ? 40 : 130,
                    bottom: smViewport ? 130 : 80,
                    left: 60,
                  }}
                  padding={0.3}
                  colorBy="id"
                  defs={[
                    {
                      id: 'dots',
                      type: 'patternDots',
                      background: 'inherit',
                      color: '#38bcb2',
                      size: 4,
                      padding: 1,
                      stagger: true,
                    },
                    {
                      id: 'lines',
                      type: 'patternLines',
                      background: 'inherit',
                      color: '#eed312',
                      rotation: -45,
                      lineWidth: 6,
                      spacing: 10,
                    },
                  ]}
                  fill={[
                    {
                      match: {
                        id: 'fries',
                      },
                      id: 'dots',
                    },
                    {
                      match: {
                        id: 'sandwich',
                      },
                      id: 'lines',
                    },
                  ]}
                  borderColor="inherit:darker(1.6)"
                  axisBottom={{
                    orient: 'bottom',
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: yearlyDealsDollarGraphOn
                      ? this.dollarBarGraphAxis('bottom', true)
                      : this.dollarBarGraphAxis('bottom'),
                    legendPosition: 'center',
                    legendOffset: 36,
                  }}
                  axisLeft={{
                    orient: 'left',
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: yearlyDealsDollarGraphOn
                      ? this.dollarBarGraphAxis('left', true)
                      : this.dollarBarGraphAxis('left'),
                    legendPosition: 'center',
                    legendOffset: -40,
                  }}
                  labelSkipWidth={12}
                  labelSkipHeight={12}
                  labelTextColor="inherit:darker(1.6)"
                  animate
                  motionStiffness={90}
                  motionDamping={15}
                  innerPadding={2}
                  legends={[
                    {
                      dataFrom: 'keys',
                      anchor: smViewport ? 'bottom' : 'bottom-right',
                      direction: smViewport ? 'row' : 'column',
                      translateX: smViewport ? undefined : 120,
                      translateY: smViewport ? 76 : -40,
                      itemWidth: smViewport ? 80 : 100,
                      itemHeight: 20,
                      itemsSpacing: smViewport ? 2 : 10,
                      symbolSize: 12,
                      itemDirection: smViewport ? 'top-to-bottom' : undefined,
                    },
                  ]}
                />
              )}
            </div>
          </Grid>

          <Grid item xs={12} lg={6}>
            <div
              className={classes.graphWrapper2}
              style={{ fontSize: xsViewport ? '11px' : '12px' }}
            >
              <div className={classes.graphTitle}>Number of Deals (#)</div>
              <div className={classes.graphControlsWrapper}>
                <span className={classes.graphControlsLabel}>Controls:</span>
                <span className={classes.toggleWrapper}>
                  <ToggleButton
                    value={!this.state.monthlyDealsNumberLineGraphOn}
                    thumbStyle={borderRadiusStyle}
                    trackStyle={borderRadiusStyle}
                    colors={{
                      active: {
                        base: 'rgb(65,66,68)',
                        hover: 'rgb(95,96,98)',
                      },
                      inactive: {
                        base: 'rgb(65,66,68)',
                        hover: 'rgb(95,96,98)',
                      },
                    }}
                    inactiveLabel="Line"
                    activeLabel="Bar"
                    onToggle={this.toggleMonthlyDealsNumberLineGraph}
                  />
                </span>
                <ToggleButton
                  value={this.state.yearlyDealsNumberGraphOn}
                  thumbStyle={borderRadiusStyle}
                  trackStyle={borderRadiusStyle}
                  colors={{
                    active: {
                      base: 'rgb(65,66,68)',
                      hover: 'rgb(95,96,98)',
                    },
                    inactive: {
                      base: 'rgb(65,66,68)',
                      hover: 'rgb(95,96,98)',
                    },
                  }}
                  inactiveLabel="Month"
                  activeLabel="Year"
                  onToggle={this.toggleYearlyDealsNumberGraph}
                />
              </div>
              {this.state.monthlyDealsNumberLineGraphOn ? (
                <ResponsiveLine
                  data={
                    !yearlyDealsNumberGraphOn
                      ? this.props.monthlyDealsNumberLineData
                      : this.props.yearlyDealsNumberLineData
                  }
                  colors="dark2"
                  curve="catmullRom"
                  enableArea
                  margin={{
                    top: 60,
                    right: smViewport ? 40 : 110,
                    bottom: smViewport ? 130 : 80,
                    left: 60,
                  }}
                  minY="auto"
                  axisBottom={{
                    orient: 'bottom',
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: !yearlyDealsNumberGraphOn ? 'Month' : 'Year',
                    legendOffset: 36,
                    legendPosition: 'center',
                  }}
                  axisLeft={{
                    orient: 'left',
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Number of Deals',
                    legendOffset: -40,
                    legendPosition: 'center',
                  }}
                  dotSize={10}
                  dotColor="inherit:darker(0.3)"
                  dotBorderWidth={2}
                  dotBorderColor="#ffffff"
                  dotLabel="y"
                  dotLabelYOffset={-12}
                  animate
                  motionStiffness={90}
                  motionDamping={15}
                  legends={[
                    {
                      anchor: smViewport ? 'bottom' : 'bottom-right',
                      direction: smViewport ? 'row' : 'column',
                      translateX: smViewport ? undefined : 118,
                      translateY: smViewport ? 76 : -40,
                      itemWidth: smViewport ? 80 : 100,
                      itemHeight: 20,
                      itemsSpacing: smViewport ? 2 : 10,
                      symbolSize: 12,
                      itemDirection: smViewport ? 'top-to-bottom' : undefined,
                    },
                  ]}
                />
              ) : (
                <ResponsiveBar
                  data={
                    yearlyDealsNumberGraphOn
                      ? this.props.yearlyDealsNumberBarData
                      : this.props.monthlyDealsNumberBarData
                  }
                  colors="dark2"
                  groupMode="grouped"
                  maxValue="auto"
                  layout={this.barGraphLayout()}
                  keys={[
                    'Com Sales',
                    'Com Rentals',
                    'Res Sales',
                    'Res Rentals',
                  ]}
                  indexBy="month"
                  margin={{
                    top: 50,
                    right: smViewport ? 40 : 130,
                    bottom: smViewport ? 130 : 80,
                    left: 60,
                  }}
                  padding={0.3}
                  colorBy="id"
                  defs={[
                    {
                      id: 'dots',
                      type: 'patternDots',
                      background: 'inherit',
                      color: '#38bcb2',
                      size: 4,
                      padding: 1,
                      stagger: true,
                    },
                    {
                      id: 'lines',
                      type: 'patternLines',
                      background: 'inherit',
                      color: '#eed312',
                      rotation: -45,
                      lineWidth: 6,
                      spacing: 10,
                    },
                  ]}
                  fill={[
                    {
                      match: {
                        id: 'fries',
                      },
                      id: 'dots',
                    },
                    {
                      match: {
                        id: 'sandwich',
                      },
                      id: 'lines',
                    },
                  ]}
                  borderColor="inherit:darker(1.6)"
                  axisBottom={{
                    orient: 'bottom',
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: yearlyDealsNumberGraphOn
                      ? this.numberBarGraphAxis('bottom', true)
                      : this.numberBarGraphAxis('bottom'),
                    legendPosition: 'center',
                    legendOffset: 36,
                  }}
                  axisLeft={{
                    orient: 'left',
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: yearlyDealsNumberGraphOn
                      ? this.numberBarGraphAxis('left', true)
                      : this.numberBarGraphAxis('left'),
                    legendPosition: 'center',
                    legendOffset: -40,
                  }}
                  labelSkipWidth={12}
                  labelSkipHeight={12}
                  labelTextColor="inherit:darker(1.6)"
                  animate
                  motionStiffness={90}
                  motionDamping={15}
                  innerPadding={2}
                  legends={[
                    {
                      dataFrom: 'keys',
                      anchor: smViewport ? 'bottom' : 'bottom-right',
                      direction: smViewport ? 'row' : 'column',
                      translateX: smViewport ? undefined : 120,
                      translateY: smViewport ? 76 : -40,
                      itemWidth: smViewport ? 80 : 100,
                      itemHeight: 20,
                      itemsSpacing: smViewport ? 2 : 10,
                      symbolSize: 12,
                      itemDirection: smViewport ? 'top-to-bottom' : undefined,
                    },
                  ]}
                />
              )}
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(AgentDashboard);
