import React, { Component } from 'react';
import { observer } from 'mobx-react';
import axios from 'axios';
import CreateAgentForm from '../components/forms/CreateAgentForm';
import { round } from '../utils/Math';
import { capitalize } from '../utils/stringUtils';
import createAgent from '../effects/users/createAgent';
import setAgentProfilePic from '../effects/users/setAgentProfilePic';

@observer
class CreateAgentContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageFile: '',
      imageFileConfirmed: false,
      confirmedImageDataURL: null,
      imageScale: 0,
      adjustedImageScale: 1,
      loadingSetImg: false,
      uplodingImageProgress: 0,
      isUploadingImage: false,
      formSubmitedSuccessfully: false,
      imageBlob: null,
      submittingFormToServer: false,
    };
  }

  setImageFile = file => {
    this.setState({ imageFile: file });
  };

  clearImageFile = () => {
    this.setState({
      imageFile: '',
      imageFileConfirmed: false,
      confirmedImageDataURL: null,
    });

    if (this._fileUploadInput) {
      this._fileUploadInput.value = null;
    }
  };

  getFileUploadInput = input => {
    this._fileUploadInput = input;
  };

  getProfilePicEditor = editor => {
    this._profilePicEditor = editor;
  };

  setImageScale = num => {
    const rawScale = Number(num);
    const adjustedImageScale = round(1 + rawScale / 100, 2);
    this.setState({ imageScale: rawScale, adjustedImageScale });
  };

  confirmImageFile = () => {
    if (this._profilePicEditor) {
      // This returns a HTMLCanvasElement, it can be made into a data URL or a blob,
      // drawn on another canvas, or added to the DOM.
      const canvas = this._profilePicEditor.getImage();

      canvas.toBlob(blob => {
        this.setState({
          imageBlob: blob,
          imageFileConfirmed: true,
          loadingSetImg: true,
          confirmedImageDataURL: URL.createObjectURL(blob),
        });
      });
      // If you want the image resized to the canvas size (also a HTMLCanvasElement)
      // const canvasScaled = this._profilePicEditor.getImageScaledToCanvas();
    }
  };

  setFinishedLoadingImg = () => {
    this.setState({ loadingSetImg: false });
  };

  onSubmit = (values, e, formApi) => {
    const { imageFile, imageFileConfirmed } = this.state;
    const returnValues = {
      ...values,
      firstName: capitalize(values.firstName),
      lastName: capitalize(values.lastName),
      fileName: imageFile && imageFileConfirmed ? imageFile.name : undefined,
      fileType: imageFile && imageFileConfirmed ? imageFile.type : undefined,
    };

    delete returnValues.profilePicture;

    this.setState({
      submittingFormToServer: true,
    });

    this.props.setFormSubmitted();

    createAgent(returnValues).then(result => {
      const { signedURL, error, agent } = result;

      if (error) {
        if (error.field === 'email') {
          const formElement = document.getElementById('formDialog');
          formApi.setError(error.field, error.message);
          formElement.scrollTop = formElement.scrollHeight;
        }
        this.setState({
          submittingFormToServer: false,
        });

        console.log(error);
        this.props.setFormSubmitted(false);

        this.props.openRequestErrorSnackbar(error.message);

        return;
      }

      if (signedURL) {
        axios
          .put(signedURL, this.state.imageBlob, {
            headers: {
              'Content-Type': this.state.imageFile.type,
            },
            onUploadProgress: progressEvent => {
              // Do whatever you want with the native progress event
              const loadedPercent =
                (progressEvent.loaded / progressEvent.total) * 100;
              this.setState({
                submittingFormToServer: Math.floor(loadedPercent)
                  ? false
                  : true,
                formSubmitedSuccessfully: true,
                uplodingImageProgress: Math.floor(loadedPercent),
                isUploadingImage: loadedPercent >= 100 ? false : true,
              });
            },
          })
          .then(res => {
            const status = `${res.status}`;
            const okRegex = /^[2][0-9][0-9]$/;

            if (!okRegex.test(status)) {
              this.setState({
                submittingFormToServer: false,
                isUploadingImage: false,
              });
              this.props.setFormSubmitted(false);
              this.props.openRequestErrorSnackbar(
                'There was an error uploading your file. Please try again shortly.'
              );
              return;
            }

            this.setState({
              submittingFormToServer: true,
            });
            setAgentProfilePic(agent.uuid, this.state.imageFile.name)
              .then(({ url, otherError, userErrors }) => {
                this.setState({
                  submittingFormToServer: false,
                });

                if (otherError) {
                  this.props.openRequestErrorSnackbar(otherError);

                  return;
                }

                if (userErrors && userErrors.length) {
                  this.props.openRequestErrorSnackbar(userErrors[0].message);
                  return;
                }

                if (url) {
                  agent.agent.profilePicURL = this.state.confirmedImageDataURL;
                }
                this.props.confirmAgentCreated(agent);
                this.props.setFormSubmitted(false);
              })
              .catch(error => {
                this.props.openRequestErrorSnackbar(
                  'There was an error uploading your image.'
                );

                console.log(error);
                this.setState({
                  submittingFormToServer: false,
                });
                this.props.setFormSubmitted(false);
              });
          })
          .catch(error => {
            this.props.setFormSubmitted(false);
            this.setState({
              submittingFormToServer: false,
            });

            this.props.openRequestErrorSnackbar(
              'There was an error uploading your image.'
            );

            console.log(error);
          });
      } else {
        this.setState({ formSubmitedSuccessfully: true });
        this.props.setFormSubmitted(false);
        this.props.confirmAgentCreated(agent);
      }
    });
  };

  onSubmitFailure(errs, onSubmitError) {
    console.log(errs);
    console.log(onSubmitError);
  }

  render() {
    const { classes, ...rest } = this.props;
    return (
      <div style={{ width: '100%' }}>
        <CreateAgentForm
          onSubmit={this.onSubmit}
          onSubmitFailure={this.onSubmitFailure}
          setImageFile={this.setImageFile}
          imageFile={this.state.imageFile}
          imageScale={this.state.imageScale}
          setImageScale={this.setImageScale}
          adjustedImageScale={this.state.adjustedImageScale}
          getFileUploadInput={this.getFileUploadInput}
          clearImageFile={this.clearImageFile}
          getProfilePicEditor={this.getProfilePicEditor}
          imageFileConfirmed={this.state.imageFileConfirmed}
          confirmImageFile={this.confirmImageFile}
          confirmedImageDataURL={this.state.confirmedImageDataURL}
          loadingSetImg={this.state.loadingSetImg}
          setFinishedLoadingImg={this.setFinishedLoadingImg}
          uplodingImageProgress={this.state.uplodingImageProgress}
          formSubmitedSuccessfully={this.state.formSubmitedSuccessfully}
          isUploadingImage={this.state.isUploadingImage}
          currentUserRole={this.props.currentUserRole}
          isManagement={this.props.isManagement}
          submittingFormToServer={this.state.submittingFormToServer}
          getFormApi={formApi => {
            this._formApi = formApi;
          }}
          {...rest}
        />
      </div>
    );
  }
}

export default CreateAgentContainer;
