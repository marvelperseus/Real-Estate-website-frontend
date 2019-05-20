import React from 'react';
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
  toolbar: {
    display: 'table',
    width: '100%',
  },
  tableTitle: {
    display: 'table-cell',
    verticalAlign: 'middle',
    fontWeight: 500,
  },
});

class Toolbar extends React.Component {
  static defaultProps = {
    enableAddRow: true,
    addRowButtonText: 'Add Row',
    filterRowsButtonText: 'Filter Rows',
  };

  onAddRow = () => {
    if (this.props.onAddRow !== null && this.props.onAddRow instanceof Function) {
      this.props.onAddRow({ newRowIndex: this.props.numberOfRows });
    }
  };

  renderAddRowButton = () => {
    if (this.props.onAddRow) {
      return (<button type="button" className="btn" onClick={this.onAddRow}>
        {this.props.addRowButtonText}
      </button>);
    }
  };

  renderToggleFilterButton = () => {
    if (this.props.enableFilter) {
      return (<button type="button" className="btn" onClick={this.props.onToggleFilter}>
        {this.props.filterRowsButtonText}
      </button>);
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={`react-grid-Toolbar ${classes.toolbar}`}>
        <span className={classes.tableTitle}>{this.props.tableTitle}</span>
        <div className="tools">
          {this.renderAddRowButton()}
          {this.renderToggleFilterButton()}
          {this.props.children}
        </div>
      </div>);
  }
}
export default withStyles(styles)(Toolbar);
