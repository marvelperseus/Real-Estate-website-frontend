import React from 'react';
import { observer } from 'mobx-react';
import { withStyles } from 'material-ui/styles';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { BounceLoader } from 'react-spinners';
import moment from 'moment';
import CompanyNewsAlerts from '../components/CompanyNewsAlerts';
import CreateCompanyAlertsNewsDialogBox from '../components/CreateCompanyAlertsNewsDialogBox';
import CompanyAlertsNewsDialogBox from '../components/CompanyAlertsNewsDialogBox';
import { admin as adminRole, superAdmin } from '../constants/userTypes';
import submitNewsAlertItem from '../effects/general/submitNewsAlertItem';
import deleteNewsAlertItem from '../effects/general/deleteNewsAlertItem';

const Loader = BounceLoader;

const newsAlertItemsQuery = gql`
  query newsAlertItems {
    newsAlertItems {
      uuid
      html
      string
      type
      createdAt
    }
  }
`;

const styles = theme => ({
  root: {
    maxWidth: '100%',
    width: '100%',
    marginBottom: 10,
  },
  snackBar: {
    marginTop: 30,
  },
});

@observer
@withStyles(styles)
class CompanyNewsAlertsContainer extends React.Component {
  state = {
    dialogBoxOpen: false,
    viewDialogBoxOpen: false,
    dialogBoxType: '',
    textEditorValue: {
      html: '',
      string: '',
    },
    addedNewsItems: [],
    addedAlertItems: [],
    deletedNewsItems: [],
    deletedAlertItems: [],
    viewingNewsAlertItemID: null,
    viewingNewsAlertItemHTML: '',
  };

  openDialogBox = type => {
    this.setState({
      dialogBoxOpen: true,
      dialogBoxType: type,
    });
  };

  closeDialogBox = () => {
    this.setState({
      dialogBoxOpen: false,
    });
  };

  onTextEditorChange = (content, delta, source, editor) => {
    this.setState({
      textEditorValue: {
        html: content,
        string: editor.getText(),
      },
    });
  };

  deleteNewsAlertItem = async (uuid, type) => {
    const { deletedAlertItems, deletedNewsItems } = this.state;
    let res;
    try {
      res = deleteNewsAlertItem(uuid);
    } catch (err) {
      console.log(err);
      return;
    }

    if (res.error) {
      console.log(error);
    } else {
      if (type === 'news') {
        this.setState({
          deletedNewsItems: [uuid, ...deletedNewsItems],
        });
      } else {
        this.setState({
          deletedAlertItems: [uuid, ...deletedAlertItems],
        });
      }

      if (this.props.deletedNewsAlertSuccessfully) {
        this.props.deletedNewsAlertSuccessfully();
      }
    }
  };

  onSubmit = async () => {
    const {
      textEditorValue,
      dialogBoxType,
      addedNewsItems,
      addedAlertItems,
    } = this.state;

    if (
      !textEditorValue ||
      !textEditorValue.string ||
      textEditorValue.html === '<p><br></p>'
    ) {
      return;
    }

    let res;
    let hasErrors = false;

    try {
      res = await submitNewsAlertItem({
        html: textEditorValue.html,
        string: textEditorValue.string,
        type: dialogBoxType,
      });
    } catch (err) {
      console.log('sdgns');
      console.log(err);
    }

    if (res.error) {
      console.log(res.error);
      hasErrors = true;
    }

    if (hasErrors) return;

    if (dialogBoxType === 'news') {
      this.setState({
        addedNewsItems: [res.item, ...addedNewsItems],
      });
    } else {
      this.setState({
        addedAlertItems: [res.item, ...addedAlertItems],
      });
    }

    this.closeDialogBox();
    if (this.props.submittedNewsAlertSuccessfully) {
      this.props.submittedNewsAlertSuccessfully();
    }
  };

  openVeiwNewsAlertItemDialogBox = (uuid, viewingNewsAlertItemHTML, type) => {
    this.setState({
      viewingNewsAlertItemID: uuid,
      viewDialogBoxOpen: true,
      viewingNewsAlertItemHTML,
      dialogBoxType: type,
    });
  };

  closeVeiwNewsAlertItemDialogBox = () => {
    this.setState({
      viewDialogBoxOpen: false,
    });
  };

  render() {
    const { classes, userRole } = this.props;
    const {
      dialogBoxType,
      dialogBoxOpen,
      addedAlertItems,
      addedNewsItems,
      deletedAlertItems,
      deletedNewsItems,
      viewingNewsAlertItemID,
      viewDialogBoxOpen,
      viewingNewsAlertItemHTML,
    } = this.state;
    const isAdmin = userRole === adminRole || userRole === superAdmin;
    return (
      <Query query={newsAlertItemsQuery} ssr={false}>
        {({ loading, error, data }) => {
          if (loading)
            return (
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '64px',
                  margin: '8px',
                  marginTop: '0',
                  boxShadow:
                    '0px 1px 3px 0px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.12)',
                }}
              >
                <Loader color="#f44336" size={35} loading />
              </div>
            );

          if (error) {
            console.log(error);
            return (
              <div style={{ textAlign: 'center' }}>
                We're sorry. There was an error processing your request.
              </div>
            );
          }

          const newsAlertItems = data.newsAlertItems;

          const newsItems = [...addedNewsItems];
          const alertItems = [...addedAlertItems];

          newsAlertItems.forEach(item => {
            if (item.type === 'news') {
              newsItems.push(item);
            } else if (item.type === 'alert') {
              alertItems.push(item);
            }
          });

          console.log(newsItems);

          return (
            <div className={classes.root}>
              <CompanyNewsAlerts
                userRole={userRole}
                openDialogBox={this.openDialogBox}
                deleteNewsAlertItem={this.deleteNewsAlertItem}
                openVeiwNewsAlertItemDialogBox={
                  this.openVeiwNewsAlertItemDialogBox
                }
                newsItems={newsItems
                  .sort((a, b) =>
                    moment(b.createdAt).isAfter(moment(a.createdAt))
                  )
                  .filter(item => !deletedNewsItems.includes(item.uuid))}
                alertItems={alertItems
                  .sort((a, b) =>
                    moment(b.createdAt).isAfter(moment(a.createdAt))
                  )
                  .filter(item => !deletedAlertItems.includes(item.uuid))}
                isAdmin={isAdmin}
              />
              {isAdmin && (
                <CreateCompanyAlertsNewsDialogBox
                  open={dialogBoxOpen}
                  dialogBoxType={dialogBoxType}
                  closeDialogBox={this.closeDialogBox}
                  onTextEditorChange={this.onTextEditorChange}
                  onSubmit={this.onSubmit}
                />
              )}
              <CompanyAlertsNewsDialogBox
                open={viewDialogBoxOpen}
                dialogBoxType={dialogBoxType}
                closeDialogBox={this.closeVeiwNewsAlertItemDialogBox}
                viewingNewsAlertItemID={viewingNewsAlertItemID}
                newsAlertHTML={viewingNewsAlertItemHTML}
              />
            </div>
          );
        }}
      </Query>
    );
  }
}

export default CompanyNewsAlertsContainer;
