import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import withSizes from 'react-sizes';
import DollarIcon from '@material-ui/icons/AttachMoney';
import PendingIcon from '@material-ui/icons/Help';
import StarIcon from '@material-ui/icons/Star';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import moment from 'moment';
import Divider from 'material-ui/Divider';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from 'material-ui/Typography';
import ExpansionPanel, {
	ExpansionPanelSummary,
	ExpansionPanelDetails,
} from 'material-ui/ExpansionPanel';
import StatNumberBox from '../StatNumberBox';
import CompanyNewsAlerts from '../../containers/CompanyNewsAlerts';

const months = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
];

const styles = theme => ({
	root: {
		maxWidth: '100%',
	},
	heading: {
		fontSize: '.94rem',
		fontWeight: 500,
		color: 'rgba(0,0,0,.7)',
	},
	lightHeading: {
		color: '#fff',
	},
	statNumberBoxWrapper: {
		backgroundColor: '#fff',
		height: '175px',
	},
	statBoxQuestionIcon: {
		fontSize: '40px',
		color: '#F57C00',
	},
	statBoxMoneyIcon: {
		fontSize: '40px',
		color: '#388E3C',
	},
	statBoxStarIcon: {
		fontSize: '40px',
		color: '#1976D2',
	},
	agentOfTheMonthWrapper: {
		paddingTop: '20px',
		height: '320px',
		backgroundColor: '#fff',
		borderRadius: '5px',
		boxShadow: theme.shadows[1],
		overflow: 'auto',
	},
	companyNewsWrapper: {
		display: 'flex',
		flexDirection: 'column',
		// paddingTop: '20px',
		maxHeight: '256px',
		// backgroundColor: '#fff',
		borderRadius: '5px',
		boxShadow: theme.shadows[1],
	},
	companyAlertsWrapper: {
		display: 'flex',
		flexDirection: 'column',
		// paddingTop: '20px',
		maxHeight: '256px',
		// backgroundColor: '#fff',
		borderRadius: '5px',
		boxShadow: theme.shadows[1],
	},
	boxTitleWrapper: {
		width: '100%',
		paddingLeft: '24px',
		paddingRight: '24px',
		display: 'flex',
		alignItems: 'center',
		height: '35px',
		fontSize: '.94rem',
		fontWeight: 500,
		color: 'rgba(0,0,0,.7)',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
	},
	agentOfTheMonthContent: {
		// padding: '24px',
	},
	companyNewsPlaceHolder: {
		display: 'flex',
		marginTop: '15px',
		alignItems: 'center',
		justifyContent: 'center',
		height: '100%',
		width: '100%',
		// backgroundColor: 'rgba(0,0,0,.8)',
		color: 'rgba(0,0,0,.7)',
		borderRadius: '0 0 5px 5px',
	},
	companyAlertsExpansionWrapper: {
		backgroundColor: 'inherit',
		color: 'inherit',
	},
	normalExpansionSummary: {
		minHeight: '48px',
		maxHeight: '48px',
	},
	darkExpansionSummary: {
		minHeight: '48px',
		maxHeight: '48px',
		backgroundColor: theme.palette.secondary.dark,
		color: '#fff',
	},
	expansionSummaryExpanded: {
		minHeight: '48px',
		maxHeight: '48px',
	},
});

const mapSizesToProps = ({ width }) => ({
	xsViewport: width < 412,
	smViewport: width < 600,
	mdViewport: width < 960,
	lgViewport: width < 1280,
});

@observer
@withSizes(mapSizesToProps)
class AdminDashboard extends Component {
	render() {
		const currentDate = moment();
		const {
			classes,
			submittedNewsAlertSuccessfully,
			deletedNewsAlertSuccessfully,
			years,
			currentYear,
			changeYear,
			userUUID,
			userRole,
			grossCommissions,
			netCommissions,
			currentMonthNetCommissions,
			currentMonthNumOfDeals,
			numOfPendingDeals
		} = this.props

		return (
			<div className={classes.root}>
				<CompanyNewsAlerts
					userRole={this.props.userRole}
					submittedNewsAlertSuccessfully={submittedNewsAlertSuccessfully}
					deletedNewsAlertSuccessfully={deletedNewsAlertSuccessfully}
				/>

				<Grid container spacing={16}>
					<Grid item xs={12}>
						<Divider />
					</Grid>

					<Grid item xs={12}>
						<div className={classes.expansionPanelWrapper}>
							<Grid item xs={12} justify="flex-start" alignItems="flex-end" container direction="row-reverse">
								<FormControl variant="filled" className={classes.formControl}>
									<InputLabel htmlFor="filled-age-simple">Year</InputLabel>
									<Select
										value={currentYear}
										onChange={e => changeYear(e.target.value)}
									>
										{years.map(year => <MenuItem value={year} key={year}>{year}</MenuItem>)}
									</Select>
								</FormControl>
							</Grid>
							<ExpansionPanel defaultExpanded>
								<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
									<Typography className={classes.heading}>
										Company Stats
									</Typography>
								</ExpansionPanelSummary>
								<ExpansionPanelDetails>
									<Grid container spacing={16}>
										<Grid item xs={12} sm={6} lg={4}>
											<StatNumberBox
												rootClassName={classes.statNumberBoxWrapper}
												icon={DollarIcon}
												iconClass={classes.statBoxMoneyIcon}
												stat={grossCommissions}
												statTitle="Gross Commissions to Date"
											/>
										</Grid>
										<Grid item xs={12} sm={6} lg={4}>
											<StatNumberBox
												rootClassName={classes.statNumberBoxWrapper}
												icon={DollarIcon}
												iconClass={classes.statBoxMoneyIcon}
												stat={netCommissions}
												statTitle="Total Net Commissions to Date"
											/>
										</Grid>
										<Grid item xs={12} lg={4}>
											<StatNumberBox
												rootClassName={classes.statNumberBoxWrapper}
												icon={DollarIcon}
												iconClass={classes.statBoxMoneyIcon}
												stat={currentMonthNetCommissions}
												statTitle={`Current month (${months[currentDate.month()]}) Net Commissions`}
											/>
										</Grid>
										<Grid item xs={12} sm={6}>
											<StatNumberBox
												rootClassName={classes.statNumberBoxWrapper}
												icon={StarIcon}
												iconClass={classes.statBoxStarIcon}
												stat={currentMonthNumOfDeals}
												statTitle={`Current month (${months[currentDate.month()]}) Number of Deals`}
											/>
										</Grid>
										<Grid item xs={12} sm={6}>
											<StatNumberBox
												rootClassName={classes.statNumberBoxWrapper}
												icon={PendingIcon}
												iconClass={classes.statBoxQuestionIcon}
												stat={numOfPendingDeals}
												statTitle="Number of Pending Deals"
											/>
										</Grid>
									</Grid>
								</ExpansionPanelDetails>
							</ExpansionPanel>
						</div>
					</Grid>
				</Grid>
			</div>
		);
	}
}

export default withStyles(styles)(AdminDashboard);
