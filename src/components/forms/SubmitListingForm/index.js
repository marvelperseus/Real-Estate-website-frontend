import React, { Component, Fragment } from 'react';
import { observer } from 'mobx-react';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Divider from 'material-ui/Divider';
import Button from 'material-ui/Button';
import { Form, NestedField } from 'react-form';
import moment from 'moment';
import uuid from 'uuid/v4';
import Grid from 'material-ui/Grid';
import TextField from 'material-ui/TextField';
import DeleteIcon from '@material-ui/icons/Delete';
import CircularProgressbar from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { MdFileDownload } from 'react-icons/lib/md';
import Tooltip from 'material-ui/Tooltip';
import { Icon } from 'antd';
import Lightbox from 'react-images';
import classnames from 'classnames';
import EyeIcon from '@material-ui/icons/RemoveRedEye';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/Menu/MenuItem';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';

import MaterialCustomTextFieldWrapper from '../../MaterialCustomTextFieldWrapper';
import MaterialCustomRadioInputWrapper from '../../MaterialCustomRadioInputWrapper';
import MaterialCustomCheckboxInputWrapper from '../../MaterialCustomCheckboxInputWrapper';
import MaterialCustomSelectInputWrapper from '../../MaterialCustomSelectInputWrapper';
import CustomFileUploadInputWrapper from '../../CustomFileUploadInputWrapper';
import { capitalize } from '../../../utils/stringUtils';
import validators from './formValidation';
import {
  agent as agentRole,
  admin,
  superAdmin,
} from '../../../constants/userTypes';
import { padStringToDecimalString } from '../../../utils/Math';

import neighborhoods from '../../../constants/neighborhoods';

const MAPBOX_TOKEN =
  'pk.eyJ1IjoicmV5ZXNlbHNhbWFkIiwiYSI6ImNqcWg3NWs0MDBpaXMzeHFqZGNpd2VnODEifQ.mLXE6QDGRc2bqLb7tx5ogw';
const CustomTextField = MaterialCustomTextFieldWrapper;
const MaterialCustomRadioInput = MaterialCustomRadioInputWrapper;
const MaterialCustomSelectInput = MaterialCustomSelectInputWrapper;
const CustomFileUploadInputBtn = CustomFileUploadInputWrapper;

const acceptedFileExtensions = ['jpg', 'jpeg', 'pdf'];

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    padding: theme.spacing.unit * 3,
    backgroundColor: '#fff',
    borderRadius: '5px',
    boxShadow: theme.shadows[3],
  },
  map: {
    height: '300px',
  },
  subContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    padding: '0 10px',
    width: '100%',
  },
  formControlWrapper: {
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
  },
  formControl: {
    marginLeft: 0,
    marginRight: 0,
  },
  alignCenter: {
    textAlign: 'center',
  },
  formHeader: {
    marginBottom: theme.spacing.unit * 3,
  },
  formWrapper: {
    paddingLeft: theme.spacing.unit * 4,
    paddingRight: theme.spacing.unit * 4,
    textAlign: 'center',
  },
  formRoot: {
    paddingBottom: 10,
    flexGrow: 1,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  radioInputWrapper: {
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  formSubheading: {
    width: '100%',
    textAlign: 'center',
    paddingTop: '82px',
  },
  h3: {
    fontWeight: theme.typography.fontWeightMedium,
  },
  addPaymentBtn: {
    marginTop: '10px',
  },
  removePaymentBtn: {
    marginTop: '5px',
    marginLeft: '28px',
  },
  paymentItemsWrapper: {
    display: 'flex',
    width: '100%',
    padding: '5px 0 12px 0',
    flexWrap: 'wrap',
    boxSizing: 'border-box',
    '& > div': {
      paddingLeft: '12px',
      paddingRight: '12px',
    },
  },
  formMiniHeading: {
    width: '100%',
    textAlign: 'left',
    paddingLeft: '28px',
  },
  formMiniHeading2: {
    width: '100%',
    textAlign: 'left',
    paddingLeft: '28px',
    marginTop: '60px',
  },
  topPaymentMethodWrapper: {
    paddingTop: '0',
  },
  paddingBottom10: {
    paddingBottom: '15px',
  },
  greenText: {
    color: '#448A19',
  },
  redText: {
    color: '#ED462F',
  },
  blueText: {
    color: '#3878D8',
  },
  financialsTotal: {
    backgroundColor: 'rgba(0,0,0,.12)',
  },
  uploadBtnClassName: {
    color: '#fff',
    backgroundColor: '#272A2E',
    boxShadow:
      '0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)',
    padding: '8px 16px',
    minWidth: '88px',
    fontSize: '0.875rem',
    boxSizing: 'border-box',
    minHeight: '36px',
    transition:
      'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    lineHeight: '1.4em',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontWeight: '500',
    borderRadius: '2px',
    textTransform: 'uppercase',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#000',
    },
    addUploadBtnClassName: {},
  },
  fileUploadBtnWrapper2: {
    position: 'relative',
    display: 'inline-block',
  },
  fileUploadBtnWrapper: {
    position: 'relative',
    display: 'inline-block',
  },
  mapContainer: {
    position: 'relative',
  },
  smallFileAddBtn: {
    width: '40px',
    height: '40px',
    minWidth: '40px',
    minHeight: '40px',
    backgroundColor: '#2995F3',
    transition:
      'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    '&:hover': {
      backgroundColor: '#2483D6',
    },
  },
  smallFileRemoveBtn: {
    width: '40px',
    height: '40px',
    minWidth: '40px',
    minHeight: '40px',
    position: 'absolute',
    top: '5px',
    marginLeft: '6px',
  },
  smallFileViewBtn: {
    width: '35px',
    height: '35px',
    minWidth: '35px',
    minHeight: '35px',
    position: 'absolute',
    backgroundColor: '#008000',
    top: '8px',
    marginLeft: '6px',
    color: '#fff',
    transition:
      'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    '&:hover': {
      backgroundColor: '#067706',
    },
    [theme.breakpoints.down('xs')]: {
      position: 'relative',
      marginTop: '-18px',
    },
    '@media only screen and (max-width: 400px)': {
      position: 'relative',
      marginTop: '0 !important',
    },
  },
  uploadContractDivWrapper: {
    position: 'relative',
  },
  blueBackgroundColor: {
    backgroundColor: '#2995F3',
  },
  finalTotalLabelClass: {
    paddingLeft: '10px',
  },
  finalTotalInputClass: {
    backgroundColor: 'rgba(0,0,0,.12)',
    borderRadius: '5px 5px 0 0',
    paddingLeft: '10px',
  },
  ManagementOrCobrokeCompanyTextField: {
    width: '100%',
    margin: 8,
    marginLeft: 0,
  },
  progressBarWrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  formSubmittingWrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  progressBar: {
    width: '25%',
  },
  progressBarExplanation: {
    marginTop: '20px',
    fontSize: '1.1rem',
  },
  gridContainer: {
    marginBottom: 0,
  },
  viewIcon: {
    fontSize: '1.2rem',
  },
  disabled: {
    cursor: 'not-allowed',
  },
  fullwidthInput: {
    width: '100%',
  },
  downloadFileBtn: {
    display: 'flex',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    height: '26px',
    width: '26px',
    border: 'none',
    borderRadius: '50%',
    fontSize: '1rem',
    color: '#fff !important',
    backgroundColor: '#646d64',
    boxShadow: theme.shadows[2],
    zIndex: '2',
    cursor: 'pointer',
    outline: 'none',
    transition: 'transform .2s ease-in-out',
    '&:hover': {
      transform: 'scale(1.1,1.1)',
    },
  },
  popupMenuTitle: {
    display: 'flex',
    justifyContent: 'center',
    outline: 'none',
    padding: '12px 16px',
    width: 'auto',
    color: 'rgba(0, 0, 0, 0.87)',
    height: '24px',
    overflow: 'hidden',
    fontSize: '1rem',
    boxSizing: 'content-box',
    fontWeight: '400',
    lineHeight: '1.5em',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    whiteSpace: 'nowrap',
    paddingLeft: '16px',
    textOverflow: 'ellipsis',
    paddingRight: '16px',
    borderBottom: '1px solid rgba(0,0,0,.1)',
    pointerEvents: 'none',
  },
  menuItem: {
    display: 'flex !important',
    justifyContent: 'center !important',
  },
  listingDescription: {
    backgroundColor: 'rgba(0,0,0,.07)',
    borderRadius: '5px 5px 0 0',
  },
  datePicker: {
    width: '100%',
  },
});

const radioInputAgentItems = [
  { label: '60%', value: '60' },
  { label: '70%', value: '70' },
  { label: '80%', value: '80' },
];

const radioInputManagementItems = [
  { label: '60%', value: '60' },
  { label: '70%', value: '70' },
  { label: '80%', value: '80' },
  { label: '85%', value: '85' },
  { label: '100%', value: '100' },
];
const radioInputAgentPaymentItems = [
  { label: "I'll pick up the check" },
  { label: 'Please ACH me' },
];

const radioInputYesNoItems = [{ label: 'Yes' }, { label: 'No' }];

const listingCategorySelectItems = [
  { label: 'Residential' },
  { label: 'Commercial' },
];

const ResidentialSelectItems = [
  { label: 'Multi Family' },
  { label: 'Mixed Use' },
  { label: 'Condo' },
  { label: 'Cooperative' },
  { label: 'Town House' },
  { label: 'Apartment' },
  { label: 'Condo-op' },
  { label: 'Retail Condo' },
  { label: 'Room' },
  { label: 'Loft Apartments' },
];

const CommercialSelectItems = [
  { label: 'Mixed Use' },
  { label: 'Multi Family' },
  { label: 'Warehouse' },
  { label: 'Land/Development Site' },
];

const listingTypeSelectItems = [
  { label: 'Elevator' },
  { label: 'Walk Up' },
  { label: 'Mid Rise' },
  { label: 'Low Rise' },
  { label: 'High Rise' },
  { label: '1 Family' },
  { label: '2 Family' },
  { label: '3 Family' },
  { label: 'Garden Style' },
];

const petPolicySelectItems = [
  { label: 'Cats Allowed' },
  { label: 'Dogs Allowed' },
  { label: 'Cats and Dogs Allowed' },
  { label: 'Case by Case' },
  { label: 'No Pets Allowed' },
];

const amenitiesCheckboxItems = [
  { label: 'Garbage disposal' },
  { label: 'Gated Entry' },
  { label: 'Microwave' },
  { label: 'Secured Entry' },
  { label: 'Package room' },
  { label: 'New Building' },
  { label: 'Parking Available' },
  { label: 'Refrigerator' },
  { label: 'Dishwasher' },
  { label: 'Terrace' },
  { label: 'Breakfast Nook' },
  { label: 'Open Kitchen' },
  { label: 'Controlled Access' },
  { label: 'High ceilings' },
  { label: 'Laundry in the unit' },
  { label: 'Vaulted Ceiling' },
  { label: 'Private Deck' },
  { label: 'Intercom' },
  { label: 'Live in Super' },
  { label: 'Freezer' },
  { label: 'Stall Shower' },
  { label: 'Sprinkler system' },
  { label: 'Verizon Fios' },
  { label: 'Patio' },
  { label: 'Garage Parking' },
  { label: 'Elevator' },
  { label: 'Exposed Brick' },
  { label: 'Hardwood floors' },
  { label: 'Bike room' },
  { label: 'Loft' },
  { label: 'Central air' },
  { label: 'Renovated' },
  { label: 'Living room' },
  { label: 'Railroad apartment' },
  { label: 'Stainless Steel Appliances' },
  { label: 'Private Outdoor Space' },
];

const imagePreloader = images => {
  images.forEach(imageItem => {
    if (imageItem && imageItem.src) {
      const fileType = imageItem.src.split('.').pop();

      if (fileType.toLowerCase === 'pdf') return;

      const newImage = new Image();

      newImage.src = imageItem.src;
    }
  });
};

@observer
class SubmitListingForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shouldRenderInitialDeductionItem: true,
      lightboxIsOpen: false,
      currentLightBoxIndex: 0,
      lightboxType: 'agencyDisclosure',
      contractLeaseAnchorEl: null,
      agencyDisclosureAnchorEl: null,
      currentLightboxItem: [{ src: '' }],
      viewport: {
        width: '100%',
        height: 200,
        latitude: 37.7577,
        longitude: -122.4376,
        zoom: 8,
      },
      searchResultLayer: null,
    };
    this.mapRef = React.createRef();
    this.map = React.createRef();
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleViewportChange = viewport => {
    this.setState({
      viewport: { ...this.state.viewport, ...viewport },
    });
  };

  handleGeocoderViewportChange = viewport => {
    const geocoderDefaultOverrides = { transitionDuration: 1000 };

    return this.handleViewportChange({
      ...viewport,
      ...geocoderDefaultOverrides,
    });
  };

  handleOnResult = event => {
    this.setState({
      coordinates: event.result.geometry.coordinates.toString(),
    });
  };

  componentDidMount() {
    const handleOnResult = this.handleOnResult;

    imagePreloader([...this.returnContractLeaseURLS()]);
    const { submittedListing } = this.props;
    if (submittedListing) {
      this.setState({ coordinates: submittedListing.coordinates.join(',') });
    }

    const mapboxgl = require('mapbox-gl');
    const MapboxGeocoder = require('mapbox-gl-geocoder');

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const coordinates = submittedListing
      ? submittedListing.coordinates
      : [-73.96169, 40.69758];

    var map = new mapboxgl.Map({
      container: this.map, // Container ID
      style: 'mapbox://styles/mapbox/streets-v11', // Map style to use
      center: coordinates,
      zoom: submittedListing ? 14 : 10, // Starting zoom level
    });

    var marker = new mapboxgl.Marker() // Initialize a new marker
      .setLngLat(coordinates) // Marker [lng, lat] coordinates
      .addTo(map); // Add the marker to the map

    var geocoder = new MapboxGeocoder({
      // Initialize the geocoder
      accessToken: mapboxgl.accessToken, // Set the access token
      placeholder: 'Select location in New York', // Placeholder text for the search bar
      proximity: {
        longitude: coordinates[0],
        latitude: coordinates[1],
      }, // Coordinates of New York
    });

    // Add the geocoder to the map
    map.addControl(geocoder);

    // After the map style has loaded on the page,
    // add a source layer and default styling for a single point
    map.on('load', function() {
      map.addSource('single-point', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      });

      map.addLayer({
        id: 'point',
        source: 'single-point',
        type: 'circle',
        paint: {
          'circle-radius': 10,
          'circle-color': '#448ee4',
        },
      });

      if (submittedListing) {
        console.log('If Submitted Listing', {
          type: 'Point',
          coordinates: submittedListing.coordinates,
        });
        map.getSource('single-point').setData({
          type: 'Point',
          coordinates: submittedListing.coordinates,
        });
      }

      // Listen for the `result` event from the Geocoder
      // `result` event is triggered when a user makes a selection
      // Add a marker at the result's coordinates
      geocoder.on('result', function(ev) {
        map.getSource('single-point').setData(ev.result.geometry);
        console.log(ev.result.geometry);
        handleOnResult(ev);
      });
    });
  }

  returnContractLeaseURLS = () => {
    const { submittedListing } = this.props;
    if (!submittedListing) return [];

    if (submittedListing.images) {
      return submittedListing.images.map(url => {
        const fileName = url.split('/').pop();
        const urlArray = url.split('/');

        const encodedFileName = encodeURIComponent(fileName);
        const encodedUrl = `${urlArray
          .slice(0, urlArray.length - 1)
          .join('/')}/${encodedFileName}`;
        return {
          src: encodedUrl,
        };
      });
    }
  };

  openFileLightBox = item => {
    this.setState({
      lightboxIsOpen: true,
      currentLightBoxIndex: 0,
      lightboxType: 'contractLease',
      currentLightboxItem: [item],
    });
  };

  openFileViewer = (src, fileName, fileType) => {
    if (fileType === 'pdf' && fileType === 'PDF') {
      return;
    }

    this.openFileLightBox({
      src,
    });
  };

  closeLightbox = () => {
    this.setState({ lightboxIsOpen: false });
  };

  onClickPrev = () => {
    const { currentLightBoxIndex } = this.state;

    this.setState({
      currentLightBoxIndex: currentLightBoxIndex - 1,
    });
  };

  onClickNext = () => {
    const { currentLightBoxIndex } = this.state;

    this.setState({
      currentLightBoxIndex: currentLightBoxIndex + 1,
    });
  };

  onClickThumbnail = index => {
    this.setState({
      currentLightBoxIndex: index,
    });
  };

  downloadFile = async () => {
    const urls =
      this.state.lightboxType === 'agencyDisclosure'
        ? this.returnAgencyDisclosureURL()
        : this.returnContractLeaseURLS();

    const fileType = urls[this.state.currentLightBoxIndex].src.split('.').pop();

    let objectURL;

    try {
      const res = await fetch(
        `${urls[this.state.currentLightBoxIndex].src}?v=10`
      );
      console.log(res);
      objectURL = URL.createObjectURL(await res.blob());
    } catch (err) {
      console.log(err);
      return;
    }

    if (this._fileLink) {
      this._fileLink.setAttribute('href', objectURL);
      this._fileLink.setAttribute(
        'download',
        `${this.state.lightboxType}${this.state.currentLightBoxIndex + 1}`
      );
      this._fileLink.click();
    }
  };

  returnDownloadFileBtn = () => {
    const { classes } = this.props;

    return (
      <Tooltip
        title="Download current file."
        enterDelay={300}
        leaveDelay={100}
        PopperProps={{ style: { zIndex: 2100 } }}
      >
        <button className={classes.downloadFileBtn} onClick={this.downloadFile}>
          <MdFileDownload />
        </button>
      </Tooltip>
    );
  };

  handleContractLeaseMenuClick = event => {
    this.setState({ contractLeaseAnchorEl: event.currentTarget });
  };

  handleContractLeaseMenuClose = () => {
    this.setState({ contractLeaseAnchorEl: null });
  };

  handleAgencyDisclosureMenuClick = event => {
    this.setState({ agencyDisclosureAnchorEl: event.currentTarget });
  };

  handleAgencyDisclosureMenuClose = () => {
    this.setState({ agencyDisclosureAnchorEl: null });
  };

  render() {
    const {
      classes,
      setImagesForms,
      imagesForms,
      uplodingFileProgress,
      isUploadingFile,
      uplodingFileText,
      formSubmissionBegun,
      submittingFormToServer,
      submittedListing,
      isEditingListing,
      isViewType,
      agentUUID,
      managementCobrokeCompanyItems,
      agentPaymentTypeIsACH,
      onSubmit,
      userRole,
      isCoAgent,
      isCoAgentEditDeal,
    } = this.props;

    const { contractLeaseAnchorEl, agencyDisclosureAnchorEl } = this.state;
    const { viewport, searchResultLayer } = this.state;

    const managementCobrokeCompanies = [];

    let finalDefaultValues;
    const isCoBrokeringAgentPaymentType =
      (submittedListing &&
        submittedListing.coBrokeringAgentPaymentTypes &&
        submittedListing.coBrokeringAgentPaymentTypes[0]) ||
      {};
    const isACHAccountNumberCoBroke =
      isCoBrokeringAgentPaymentType.ACHAccountNumber;
    const isACHAccountBankRoutingNumber =
      isCoBrokeringAgentPaymentType.ACHAccountBankRoutingNumber;

    if (submittedListing) {
      const {
        agentNotes,
        agentType,
        agentName,
        alreadyTurnedFundsIn,
        city,
        clientEmail,
        clientName,
        date,
        dealType,
        leadSource,
        managementOrCobrokeCompany,
        propertyAddress,
        shouldSendApprovalTextMessageNotification,
        state,
        fundsPaidBy,
        agentPaymentType,
        price,
        apartmentNumber,
        address,
        region,
        offer,
        neighborhood,
        borough,
        description,
        category,
        ownership,
        type,
        amenities,
        cooperativeOwn,
        condoOwn,
        approx,
        builtIn,
        unitCount,
        floors,
        petPolicy,
        coordinates,
        sqFootage,
        moveInDate,
        beds,
        baths,
      } = submittedListing;
      finalDefaultValues = {
        agent: agentName,
        agentNotes,
        agentType,
        alreadyTurnedFundsIn,
        city,
        apartmentNumber,
        clientEmail,
        clientName,
        date: moment(date).format('MMMM Do YYYY'),
        dealType,
        leadSource,
        agentPaymentType,
        managementOrCobrokeCompany,
        propertyAddress,
        shouldSendApprovalTextMessageNotification,
        state,
        fundsPaidBy,
        price,
        address,
        region,
        offer,
        neighborhood,
        borough,
        description,
        category,
        ownership,
        type,
        amenities,
        cooperativeOwn,
        condoOwn,
        approx,
        builtIn,
        unitCount,
        floors,
        petPolicy,
        coordinates: coordinates.join(','),
        sqFootage,
        moveInDate: moment(moveInDate).format('YYYY-MM-DD'),
        beds,
        baths,
      };
    }

    const renderContractLeaseMenuItems = () =>
      this.returnContractLeaseURLS().map(({ src }) => {
        const fileName = decodeURIComponent(src.split('/').pop());
        const fileType = src.split('.').pop();

        if (fileType.toLowerCase() === 'pdf') {
          return (
            <a href={src} target="_blank" key={src}>
              <MenuItem
                classes={{ root: classes.menuItem }}
                onClick={() => {
                  this.handleContractLeaseMenuClose();
                }}
              >
                {fileName}
              </MenuItem>
            </a>
          );
        }

        return (
          <MenuItem
            classes={{ root: classes.menuItem }}
            onClick={() => {
              this.handleContractLeaseMenuClose();
              this.openFileViewer(src, fileName, fileType);
            }}
          >
            {fileName}
          </MenuItem>
        );
      });

    // return(<div>asd</div>)
    return (
      <div className={classes.formWrapper}>
        <a
          href="#"
          id="fileLink"
          ref={ref => (this._fileLink = ref)}
          style={{
            visibility: 'hidden',
            position: 'absolute',
            poniterEvents: 'none',
          }}
        />
        <Menu
          id="simple-menu"
          anchorEl={contractLeaseAnchorEl}
          open={Boolean(contractLeaseAnchorEl)}
          onClose={this.handleContractLeaseMenuClose}
        >
          <div className={classes.popupMenuTitle}>Image Items</div>
          {renderContractLeaseMenuItems()}
        </Menu>
        <Form
          defaultValues={
            !finalDefaultValues && this.props.agent
              ? {
                  date: `${moment().format('MMMM Do YYYY')}`,
                  agentType: `${this.props.agent.agent.agentType}`,
                  state: this.props.agent.agent.state,
                  agent: `${capitalize(
                    this.props.agent.firstName
                  )} ${capitalize(this.props.agent.lastName)}`,
                }
              : finalDefaultValues
          }
          preValidate={this.preValidate}
          validateOnMount
          onSubmit={values => {
            if (onSubmit) {
              let formItems = values;
              formItems['coordinates'] = this.state.coordinates.split(',');
              formItems['moveInDate'] = new Date(formItems['moveInDate']);
              onSubmit(formItems);
            }
          }}
          onSubmitFailure={this.props.onSubmitFailure}
          validate={validators}
          getApi={formApi => {
            this.props.getFormApi(formApi);
          }}
        >
          {formApi => {
            const category = formApi.values.category;
            const selectedNeighborhood = neighborhoods.find(
              n => n.title === formApi.values.neighborhood
            );
            const boroughs = !formApi.values.neighborhood
              ? []
              : selectedNeighborhood.value;

            return (
              <form
                onSubmit={formApi.submitForm}
                id="form1"
                className={classes.formRoot}
                style={{
                  display:
                    formSubmissionBegun || submittingFormToServer
                      ? 'none'
                      : undefined,
                }}
              >
                <Grid container spacing={24}>
                  <Grid item sm={6} xs={12}>
                    <div className={classes.formControlWrapper}>
                      <CustomTextField
                        field="date"
                        id={uuid()}
                        label="Date"
                        disabled
                        fullWidth
                        required
                      />
                    </div>
                  </Grid>
                  <Grid item sm={6} xs={12}>
                    <div className={classes.formControlWrapper}>
                      <CustomTextField
                        field="agent"
                        id={uuid()}
                        label="Agent"
                        disabled
                        fullWidth
                        required
                      />
                    </div>
                  </Grid>

                  {/* <div
                    className={`${classes.formControlWrapper} ${
                      classes.radioInputWrapper
                    }`}
                  >
                    <MaterialCustomRadioInput
                      field="agentType"
                      id={uuid()}
                      required
                      label="Agent Type"
                      radioInputItems={
                        (this.props.agent &&
                          this.props.agent.agent.agentType > 80) ||
                        (this.props.submittedListing &&
                          this.props.submittedListing.agentType > 80)
                          ? radioInputManagementItems
                          : radioInputAgentItems
                      }
                      disabled
                      horizontal
                    />
                  </div> */}

                  <div className={classes.formSubheading}>
                    <Typography
                      variant="subheading"
                      classes={{ subheading: classes.h3 }}
                    >
                      Property Offer
                    </Typography>
                  </div>
                  <Grid item sm={6} xs={12}>
                    <div className={classes.formControlWrapper}>
                      <MaterialCustomSelectInput
                        field="offer"
                        id={uuid()}
                        required
                        fullWidth
                        label="Offer"
                        name="offer"
                        selectInputItems={[
                          { value: 'SELL', label: 'SELL' },
                          { value: 'RENT', label: 'RENT' },
                        ]}
                        disabled={submittedListing && !isEditingListing}
                      />
                    </div>
                  </Grid>
                  <div className={classes.formSubheading}>
                    <Typography
                      variant="subheading"
                      classes={{ subheading: classes.h3 }}
                    >
                      Property Information
                    </Typography>
                  </div>
                  <Grid item sm={6} xs={12}>
                    <div className={classes.formControlWrapper}>
                      <MaterialCustomSelectInput
                        field="category"
                        id={uuid()}
                        required
                        fullWidth
                        label="Listing Category"
                        name="category"
                        selectInputItems={listingCategorySelectItems}
                        disabled={submittedListing && !isEditingListing}
                      />
                    </div>
                  </Grid>
                  <Grid item sm={6} xs={12} style={{ height: '50px' }}>
                    <div className={classes.formControlWrapper}>
                      <MaterialCustomSelectInput
                        field="ownership"
                        id={uuid()}
                        required
                        fullWidth
                        label="Ownership "
                        name="ownership"
                        selectInputItems={
                          category === 'Residential'
                            ? ResidentialSelectItems
                            : category === 'Commercial'
                              ? CommercialSelectItems
                              : []
                        }
                        disabled={submittedListing && !isEditingListing}
                      />
                    </div>
                  </Grid>
                  <Grid item sm={6} xs={12}>
                    <div className={classes.formControlWrapper}>
                      <MaterialCustomSelectInput
                        field="type"
                        id={uuid()}
                        required
                        fullWidth
                        label="Listing Type"
                        name="type"
                        selectInputItems={listingTypeSelectItems}
                        disabled={submittedListing && !isEditingListing}
                      />
                    </div>
                  </Grid>
                  <Grid item sm={6} xs={12}>
                    <div className={classes.formControlWrapper}>
                      <MaterialCustomSelectInput
                        field="petPolicy"
                        id={uuid()}
                        required
                        fullWidth
                        label="Pet Policy"
                        name="petPolicy"
                        selectInputItems={petPolicySelectItems}
                        disabled={submittedListing && !isEditingListing}
                      />
                    </div>
                  </Grid>
                  <Grid item sm={6} xs={12}>
                    <div className={classes.formControlWrapper}>
                      <CustomTextField
                        field="floors"
                        id={uuid()}
                        label="Floors"
                        fullWidth
                        noLetters
                        disabled={submittedListing && !isEditingListing}
                      />
                    </div>
                  </Grid>
                  <Grid item sm={6} xs={12}>
                    <div className={classes.formControlWrapper}>
                      <CustomTextField
                        field="unitCount"
                        id={uuid()}
                        label="Residence Count"
                        fullWidth
                        noLetters
                        disabled={submittedListing && !isEditingListing}
                      />
                    </div>
                  </Grid>
                  <Grid item sm={6} xs={12}>
                    <div className={classes.formControlWrapper}>
                      <CustomTextField
                        field="builtIn"
                        id={uuid()}
                        label="Built In"
                        disabled={submittedListing && !isEditingListing}
                        fullWidth
                      />
                    </div>
                  </Grid>
                  <Grid item sm={6} xs={12}>
                    <div className={classes.formControlWrapper}>
                      <CustomTextField
                        field="approx"
                        id={uuid()}
                        label="Approx Sq. Feet "
                        disabled={submittedListing && !isEditingListing}
                        fullWidth
                      />
                    </div>
                  </Grid>
                  {formApi.values.ownership === 'Condo' ? (
                    <Grid className={classes.subContainer}>
                      <NestedField field={'condoOwn'}>
                        <Grid item sm={4} xs={12}>
                          <div className={classes.formControlWrapper}>
                            <CustomTextField
                              field="minimumDownPayment"
                              id={uuid()}
                              label="Minimum Down payment"
                              disabled={submittedListing && !isEditingListing}
                              fullWidth
                            />
                          </div>
                        </Grid>
                        <Grid item sm={4} xs={12}>
                          <div className={classes.formControlWrapper}>
                            <CustomTextField
                              field="tax"
                              id={uuid()}
                              label="Tax"
                              disabled={submittedListing && !isEditingListing}
                              fullWidth
                            />
                          </div>
                        </Grid>
                        <Grid item sm={4} xs={12}>
                          <div className={classes.formControlWrapper}>
                            <CustomTextField
                              field="maintenanceFee"
                              id={uuid()}
                              label="Maintenance Fee"
                              disabled={submittedListing && !isEditingListing}
                              fullWidth
                            />
                          </div>
                        </Grid>
                      </NestedField>
                    </Grid>
                  ) : null}
                  {formApi.values.ownership === 'Cooperative' ? (
                    <NestedField field={'cooperativeOwn'}>
                      <Grid item xs={12}>
                        <div className={classes.formControlWrapper}>
                          <CustomTextField
                            field="maintenanceFee"
                            id={uuid()}
                            label="Maintenance Fee"
                            disabled={submittedListing && !isEditingListing}
                            fullWidth
                          />
                        </div>
                      </Grid>
                    </NestedField>
                  ) : null}
                  <Grid item xs={12}>
                    <div className={classes.formControlWrapper}>
                      <CustomTextField
                        field="price"
                        id={uuid()}
                        label="Price"
                        fullWidth
                        noLetters
                        required
                        noNegativeSign
                        isDollarAmount
                        disabled={submittedListing && !isEditingListing}
                      />
                    </div>
                  </Grid>
                  <Grid item xs={12}>
                    <div className={classes.formControlWrapper}>
                      <CustomTextField
                        field="address"
                        id={uuid()}
                        label="Address"
                        disabled={submittedListing && !isEditingListing}
                        fullWidth
                      />
                    </div>
                  </Grid>
                  <Grid item sm={6} xs={12}>
                    <div className={classes.formControlWrapper}>
                      <MaterialCustomSelectInput
                        field="region"
                        id={uuid()}
                        required
                        fullWidth
                        label="Region"
                        name="region"
                        selectInputItems={[{ label: 'NYC' }]}
                        disabled={submittedListing && !isEditingListing}
                      />
                    </div>
                  </Grid>

                  <Grid item sm={6} xs={12}>
                    <div className={classes.formControlWrapper}>
                      <MaterialCustomSelectInput
                        field="neighborhood"
                        id={uuid()}
                        required
                        fullWidth
                        label="Neighborhood"
                        name="neighborhood"
                        selectInputItems={neighborhoods.map(option => ({
                          label: option.title,
                        }))}
                        disabled={submittedListing && !isEditingListing}
                      />
                    </div>
                  </Grid>

                  <Grid item sm={6} xs={12}>
                    <div className={classes.formControlWrapper}>
                      <MaterialCustomSelectInput
                        field="borough"
                        id={uuid()}
                        required
                        fullWidth
                        label="Borough"
                        name="borough"
                        selectInputItems={boroughs.map(option => ({
                          label: option.value,
                        }))}
                        disabled={submittedListing && !isEditingListing}
                      />
                    </div>
                  </Grid>
                  <Grid item sm={6} />

                  <Grid item xs={6}>
                    <div className={classes.formControlWrapper}>
                      <CustomTextField
                        field="beds"
                        id={uuid()}
                        label="Beds"
                        noLetters
                        disabled={submittedListing && !isEditingListing}
                        fullWidth
                      />
                    </div>
                  </Grid>
                  <Grid item xs={6}>
                    <div className={classes.formControlWrapper}>
                      <CustomTextField
                        field="baths"
                        id={uuid()}
                        label="Baths"
                        noLetters
                        disabled={submittedListing && !isEditingListing}
                        fullWidth
                      />
                    </div>
                  </Grid>
                  <Grid item xs={6}>
                    <div className={classes.formControlWrapper}>
                      <CustomTextField
                        field="moveInDate"
                        id={uuid()}
                        label="Move In Date"
                        type="date"
                        defaultValue={moment().format('YYYY-MM-DD')}
                        disabled={submittedListing && !isEditingListing}
                        fullWidth
                      />
                    </div>
                  </Grid>

                  <Grid item xs={12} />

                  <Grid item xs={12}>
                    <div className={classes.map}>
                      <div
                        ref={el => (this.map = el)}
                        style={{ display: 'flex', height: '100%' }}
                      />
                    </div>
                  </Grid>

                  <Grid item xs={6}>
                    <div className={classes.formControlWrapper}>
                      <CustomTextField
                        label=""
                        field="coordinates"
                        id={uuid()}
                        value={this.state.coordinates}
                        disabled={submittedListing && !isEditingListing}
                        fullWidth
                      />
                    </div>
                  </Grid>

                  <Grid item xs={12}>
                    <div className={classes.formControlWrapper}>
                      <CustomTextField
                        inputRootClassName={classes.listingDescription}
                        field="description"
                        id={uuid()}
                        label="Description"
                        fullWidth
                        multiline
                        rows={4}
                        rowsMax={12}
                        shrink
                        disabled={submittedListing && !isEditingListing}
                      />
                    </div>
                  </Grid>

                  <div
                    className={`${classes.formControlWrapper} ${
                      classes.radioInputWrapper
                    }`}
                  >
                    <MaterialCustomCheckboxInputWrapper
                      field="amenities"
                      id={uuid()}
                      required
                      label="Amenities"
                      radioInputItems={amenitiesCheckboxItems}
                      disabled={submittedListing && !isEditingListing}
                      horizontal
                    />
                  </div>
                  <div className={classes.formMiniHeading2}>
                    <Typography
                      variant="subheading"
                      classes={{ subheading: classes.h4 }}
                    >
                      File Uploads:
                    </Typography>
                  </div>

                  <Grid item xs={12}>
                    <Divider />
                  </Grid>

                  <Grid item xs={12}>
                    <div className={classes.fileUploadBtnWrapper}>
                      <CustomFileUploadInputBtn
                        field="images"
                        id="contractOrLeaseItemsUploadForm"
                        label="Upload Pictures"
                        btnClassName={classes.uploadBtnClassName}
                        multiple
                        customOnChange={setImagesForms}
                        customState={imagesForms}
                        helperInfo="Pictures (JPEG/JPG files)"
                        acceptedFileExtensions={acceptedFileExtensions}
                        accept=".jpeg, .jpg"
                        disabled={submittedListing && !isEditingListing}
                      />
                      {submittedListing &&
                      submittedListing.images &&
                      submittedListing.images.length &&
                      !(imagesForms && imagesForms.length) ? (
                        <Button
                          variant="fab"
                          color="primary"
                          aria-label="add"
                          size="small"
                          classes={{ root: classes.smallFileViewBtn }}
                          onClick={this.handleContractLeaseMenuClick}
                        >
                          <EyeIcon className={classes.viewIcon} />
                        </Button>
                      ) : null}
                      {imagesForms.length ? (
                        <Button
                          variant="fab"
                          color="secondary"
                          aria-label="add"
                          size="small"
                          classes={{ root: classes.smallFileRemoveBtn }}
                          onClick={() => {
                            setImagesForms([]);
                          }}
                        >
                          <DeleteIcon />
                        </Button>
                      ) : null}
                    </div>
                  </Grid>
                </Grid>
              </form>
            );
          }}
        </Form>

        {submittingFormToServer ? (
          <div className={classes.formSubmittingWrapper}>
            <Icon type="loading" style={{ color: '#000', fontSize: '4rem' }} />
            <div className={classes.progressBarExplanation}>
              Finishing submission...
            </div>
          </div>
        ) : null}

        {isUploadingFile ? (
          <div className={classes.progressBarWrapper}>
            <CircularProgressbar
              className={classes.progressBar}
              percentage={uplodingFileProgress}
              styles={{
                path: {
                  stroke: `rgba(62, 152, 199, ${uplodingFileProgress / 100})`,
                },
              }}
            />
            <div className={classes.progressBarExplanation}>
              {uplodingFileText || 'Uploading file picture...'}
            </div>
          </div>
        ) : null}

        <Lightbox
          images={this.state.currentLightboxItem}
          isOpen={this.state.lightboxIsOpen}
          onClose={this.closeLightbox}
          onClickPrev={this.onClickPrev}
          onClickNext={this.onClickNext}
          currentImage={this.state.currentLightBoxIndex}
          backdropClosesModal
          customControls={[this.returnDownloadFileBtn()]}
        />
      </div>
    );
  }
}

export default withStyles(styles)(SubmitListingForm);
