import React from 'react';
import { withStyles } from 'material-ui/styles';
import Input, { InputLabel } from 'material-ui/Input';
import Chip from 'material-ui/Chip';
import { FormControl } from 'material-ui/Form';
import Divider from 'material-ui/Divider';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import MenuItem from 'material-ui/Menu/MenuItem';
import Select from 'material-ui/Select';
import Grid from 'material-ui/Grid';
import TextField from 'material-ui/TextField';

import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import CircularProgressbar from 'react-circular-progressbar';
import neighborhoods from '../constants/neighborhoods';
import submitDevelopment from '../effects/developments/submitDevelopment';
import deleteDevelopment from '../effects/developments/deleteDevelopment';
import getDevelopmentUploadsSignedURLS from '../effects/developments/getDevelopmentUploadsSignedURLS';
import uploadFile from '../effects/uploadFile';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const MAPBOX_TOKEN =
  'pk.eyJ1IjoicmV5ZXNlbHNhbWFkIiwiYSI6ImNqcWg3NWs0MDBpaXMzeHFqZGNpd2VnODEifQ.mLXE6QDGRc2bqLb7tx5ogw';
const petPolicySelectItems = [
  { label: 'Cats Allowed' },
  { label: 'Dogs Allowed' },
  { label: 'Cats and Dogs Allowed' },
  { label: 'Case by Case' },
  { label: 'No Pets Allowed' },
];

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

const styles = {
  map: {
    height: '300px',
  },
  dialog: {
    width: '800px',
    maxWidth: '800px',
  },
  progressBarWrapper: {
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
};

@withStyles(styles)
class SubmitDevelopmentDialogBox extends React.Component {
  constructor() {
    super();
    this.state = {
      name: '',
      headline: '',
      subheadline: '',
      description: '',
      website: '',
      category: '',
      ownership: '',
      type: '',
      petPolicy: '',
      floors: '',
      unitCount: '',
      image: null,
      builderimage: null,
      address: '',
      builderlogos: [],
      coordinates: [],
      neighborhood: '',
      borough: '',
      region: '',
      agents: [],
      isUploadingFile: false,
      uploadingFileData: null,
      submittingFormToServer: false,
    };
  }

  componentDidMount() {
    if (this.props.isView) {
      const {
        image,
        builderimage,
        builderlogos,
        ...data
      } = this.props.newdevelopment;
      this.setState(data);
    }
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleOnResult = event => {
    this.setState({
      coordinates: event.result.geometry.coordinates,
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    const { image, builderimage, builderlogos } = this.state;
    const uploads = [];
    const files = [];

    if (image) {
      const uploadImage = {
        itemName: `image`,
        fileName: image.name,
        fileType: image.type,
      };

      uploads.push(uploadImage);
      files.push(image);
    }

    if (builderimage) {
      uploads.push({
        itemName: `builder image`,
        fileName: builderimage.name,
        fileType: builderimage.type,
      });
      files.push(builderimage);
    }

    if (builderlogos.length) {
      Object.keys(builderlogos).forEach(key => {
        uploads.push({
          itemName: `builder logo ${key}`,
          fileName: builderlogos[key].name,
          fileType: builderlogos[key].type,
        });
        files.push(builderlogos[key]);
      });
    }

    let newdevelopmentID;
    if (this.props.isView)
      newdevelopmentID = this.props.newdevelopment.newdevelopmentID;

    getDevelopmentUploadsSignedURLS(uploads, newdevelopmentID).then(
      async response => {
        this.setState({ submittingFormToServer: true });
        const { items, listingID } = response;
        let counter = 0;
        for (let item of items) {
          this.setState({
            isUploadingFile: true,
            uploadingFileData: item,
            loadedPercent: 0,
          });
          await uploadFile({
            file: files[counter],
            url: item.signedURL,
            onUploadProgress: progressEvent => {
              // Do whatever you want with the native progress event
              const loadedPercent =
                progressEvent.loaded / progressEvent.total * 100;
              this.setState({ loadedPercent: Math.round(loadedPercent) });
            },
          });
          this.setState({ isUploadingFile: false });
          counter++;
        }
        submitDevelopment(this.state, listingID).then(responseObject => {
          this.setState({ submittingFormToServer: false });
          this.props.onClose();
        });
      }
    );
  };

  setBuilderImage = fileObject => {
    this.setState({ builderimage: fileObject });
  };

  setImage = fileObject => {
    this.setState({ image: fileObject });
  };

  setBuilderLogos = filesObject => {
    this.setState({ builderlogos: filesObject });
  };
  render() {
    const {
      submittingFormToServer,
      isUploadingFile,
      uploadingFileData,
      loadedPercent,
    } = this.state;
    const { open, onClickOpen, onClose } = this.props;
    const { classes } = this.props;

    if (isUploadingFile) {
      console.log(isUploadingFile, uploadingFileData, loadedPercent);
    }

    return (
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="form-dialog-title"
        classes={{ paper: classes.dialog }}
      >
        <DialogTitle id="form-dialog-title">Submit New Development</DialogTitle>
        <DialogContent>
          <SubmitDevelopmentForm
            {...this.state}
            onCoordinatesChange={this.handleOnResult}
            onChange={this.handleChange}
            setImage={this.setImage}
            setBuilderLogos={this.setBuilderLogos}
            setBuilderImage={this.setBuilderImage}
          />

          {isUploadingFile ? (
            <div className={classes.progressBarWrapper}>
              <CircularProgressbar
                className={classes.progressBar}
                percentage={loadedPercent}
                styles={{
                  path: {
                    stroke: `rgba(62, 152, 199, ${loadedPercent / 100})`,
                  },
                }}
              />
              <div className={classes.progressBarExplanation}>
                {'Uploading ' + uploadingFileData.itemName + ' ...'}
              </div>
            </div>
          ) : (
            <span />
          )}
        </DialogContent>
        {submittingFormToServer || (
          <DialogActions>
            <Button onClick={onClose} color="primary">
              Cancel
            </Button>
            {this.props.isView && (
              <Button
                color="secondary"
                onClick={() => {
                  deleteDevelopment(this.props.newdevelopment.newdevelopmentID);
                  onClose();
                }}
              >
                Delete
              </Button>
            )}
            <Button onClick={this.handleSubmit} color="primary">
              Submit
            </Button>
          </DialogActions>
        )}
      </Dialog>
    );
  }
}

const formStyles = theme => ({
  fileInput: {
    display: 'none',
  },
  formControl: {
    margin: theme.spacing.unit,
    width: '100%',
    minWidth: 120,
    maxWidth: 300,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: theme.spacing.unit / 4,
  },
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder',
];

function getStyles(name, that) {
  return {
    fontWeight:
      that.props.agents.indexOf(name) === -1
        ? that.props.theme.typography.fontWeightRegular
        : that.props.theme.typography.fontWeightMedium,
  };
}

const agentsQuery = gql`
  query agents {
    agents {
      uuid
      lastName
    }
  }
`;

@withStyles(formStyles, { withTheme: true })
class SubmitDevelopmentForm extends React.Component {
  constructor() {
    super();
    this.map = React.createRef();
  }

  componentDidMount() {
    const handleOnResult = this.props.onCoordinatesChange;
    const mapboxgl = require('mapbox-gl');
    const MapboxGeocoder = require('mapbox-gl-geocoder');

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const coordinates = [-73.96169, 40.69758];

    var map = new mapboxgl.Map({
      container: this.map, // Container ID
      style: 'mapbox://styles/mapbox/streets-v11', // Map style to use
      center: coordinates,
      zoom: 10, // Starting zoom level
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

      // Listen for the `result` event from the Geocoder
      // `result` event is triggered when a user makes a selection
      // Add a marker at the result's coordinates
      geocoder.on('result', function(ev) {
        map.getSource('single-point').setData(ev.result.geometry);
        handleOnResult(ev);
      });
    });
  }

  prepareSelectItems = () => {
    const { category, neighborhood, borough } = this.props;
    const ownerships =
      category === 'Residential'
        ? ResidentialSelectItems
        : category === 'Commercial' ? CommercialSelectItems : [];
    const coordinates = this.props.coordinates.join(',');

    const selectedNeighborhood = neighborhoods.find(
      n => n.title === neighborhood
    );
    const boroughs = neighborhood === '' ? [] : selectedNeighborhood.value;
    return { ownerships, boroughs };
  };

  render() {
    const {
      name,
      headline,
      subheadline,
      description,
      website,
      category,
      ownership,
      type,
      petPolicy,
      floors,
      unitCount,
      address,
      region,
      borough,
      neighborhood,
      image,
      coordinates,
      agents,
      classes,
      onChange,
      setImage,
      setBuilderLogos,
      setBuilderImage,
      submittingFormToServer,
    } = this.props;

    const { ownerships, boroughs } = this.prepareSelectItems();

    return (
      <form
        style={{
          display: submittingFormToServer ? 'none' : undefined,
        }}
      >
        <Grid container spacing={24}>
          <Grid item sm={12} xs={12}>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              value={name}
              onChange={onChange('name')}
              label="Name"
              type="text"
              fullWidth
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextField
              margin="dense"
              id="headline"
              value={headline}
              onChange={onChange('headline')}
              label="Headline"
              type="text"
              fullWidth
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextField
              margin="dense"
              id="subheadline"
              value={subheadline}
              onChange={onChange('subheadline')}
              label="Sub Headline"
              type="text"
              fullWidth
            />
          </Grid>
          <Grid item sm={12}>
            <TextField
              label="Description"
              value={description}
              onChange={onChange('description')}
              multiline
              rowsMax="4"
              margin="normal"
              fullWidth
            />
          </Grid>
          <Grid item sm={6}>
            <TextField
              margin="dense"
              label="Website"
              value={website}
              onChange={onChange('website')}
              type="text"
              fullWidth
            />
          </Grid>

          <Grid item sm={6} xs={12}>
            <Query
              query={agentsQuery}
              ssr={false}
              fetchPolicy="cache-and-network"
            >
              {({ loading, error, data }) => {
                if (loading) return <p>Loading</p>;
                if (error) return <p>error</p>;
                if (data) {
                  const fetchedAgents = data.agents;
                  return (
                    <FormControl className={classes.formControl}>
                      <InputLabel htmlFor="select-multiple-agent">
                        Agents
                      </InputLabel>
                      <Select
                        multiple
                        value={agents}
                        onChange={onChange('agents')}
                        input={<Input id="select-multiple-agent" />}
                        renderValue={selected => (
                          <div className={classes.chips}>
                            {selected.map(value => (
                              <Chip
                                key={value}
                                label={
                                  fetchedAgents.find(a => a.uuid === value)
                                    .lastName
                                }
                                className={classes.chip}
                              />
                            ))}
                          </div>
                        )}
                        MenuProps={MenuProps}
                      >
                        {fetchedAgents.map(agent => (
                          <MenuItem
                            key={agent.uuid}
                            value={agent.uuid}
                            style={getStyles(agent.uuid, this)}
                          >
                            {agent.lastName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  );
                }
              }}
            </Query>
          </Grid>
          <Grid item xs={12}>
            <input
              type="file"
              className={classes.fileInput}
              id="image-input"
              onChange={e => setImage(e.target.files[0])}
            />

            <label htmlFor="image-input">
              <Button
                variant="raised"
                color="secondary"
                aria-label="add"
                component="span"
              >
                Upload Image
              </Button>
            </label>
            <Divider />
          </Grid>

          <Grid item xs={12}>
            <input
              type="file"
              className={classes.fileInput}
              id="builder-image-input"
              onChange={e => setBuilderImage(e.target.files[0])}
            />

            <label htmlFor="builder-image-input">
              <Button
                variant="raised"
                color="secondary"
                aria-label="add"
                component="span"
              >
                Upload Builder Image
              </Button>
            </label>
            <Divider />
          </Grid>

          <Grid item xs={12}>
            <input
              type="file"
              className={classes.fileInput}
              id="builder-logos-input"
              onChange={e => setBuilderLogos(e.target.files)}
              multiple
            />

            <label htmlFor="builder-logos-input">
              <Button
                variant="raised"
                color="secondary"
                aria-label="add"
                component="span"
              >
                Upload Builder Logos
              </Button>
            </label>
            <Divider />
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextField
              select
              label="Category"
              value={category}
              onChange={onChange('category')}
              margin="normal"
              fullWidth
            >
              {listingCategorySelectItems.map(option => (
                <option key={option.label} value={option.label}>
                  {option.label}
                </option>
              ))}
            </TextField>
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextField
              select
              value={ownership}
              onChange={onChange('ownership')}
              label="Ownership"
              margin="normal"
              fullWidth
            >
              {ownerships.map(option => (
                <option key={option.label} value={option.label}>
                  {option.label}
                </option>
              ))}
            </TextField>
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextField
              select
              label="Type"
              value={type}
              onChange={onChange('type')}
              margin="normal"
              fullWidth
            >
              {listingTypeSelectItems.map(option => (
                <option key={option.label} value={option.label}>
                  {option.label}
                </option>
              ))}
            </TextField>
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextField
              select
              label="Pet Policy"
              margin="normal"
              value={petPolicy}
              onChange={onChange('petPolicy')}
              fullWidth
            >
              {petPolicySelectItems.map(option => (
                <option key={option.label} value={option.label}>
                  {option.label}
                </option>
              ))}
            </TextField>
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextField
              margin="dense"
              id="floors"
              value={floors}
              onChange={onChange('floors')}
              label="Floors"
              type="text"
              fullWidth
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextField
              margin="dense"
              id="unitCount"
              value={unitCount}
              onChange={onChange('unitCount')}
              label="Unit Count"
              type="text"
              fullWidth
            />
          </Grid>
          <Grid item sm={12}>
            <TextField
              margin="dense"
              id="address"
              value={address}
              onChange={onChange('address')}
              label="Address"
              type="text"
              fullWidth
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextField
              select
              label="Region"
              margin="normal"
              value={region}
              onChange={onChange('region')}
              fullWidth
            >
              <option key={'NYC'} value={'NYC'}>
                NYC
              </option>
            </TextField>
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextField
              select
              label="Neighborhood"
              margin="normal"
              value={neighborhood}
              onChange={onChange('neighborhood')}
              fullWidth
            >
              {region === 'NYC' &&
                neighborhoods.map(n => (
                  <option key={n.title} value={n.title}>
                    {n.title}
                  </option>
                ))}
            </TextField>
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextField
              select
              label="Boroughs"
              margin="normal"
              value={borough}
              onChange={onChange('borough')}
              fullWidth
            >
              {boroughs.map(n => (
                <option key={n.value} value={n.value}>
                  {n.value}
                </option>
              ))}
            </TextField>
          </Grid>

          <Grid item sm={6} xs={12} />
          <Grid item xs={12}>
            <div style={{ height: '300px' }}>
              <div
                ref={el => (this.map = el)}
                style={{ display: 'flex', height: '100%' }}
              />
            </div>
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextField
              margin="dense"
              id="coordinates"
              label="Coordinates"
              value={coordinates}
              type="text"
              disabled
              fullWidth
            />
          </Grid>
        </Grid>
      </form>
    );
  }
}

export default SubmitDevelopmentDialogBox;
