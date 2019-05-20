import React, { Component } from 'react';
import { observer } from 'mobx-react';
import moment from 'moment';
import setValue from 'set-value';
import AdminDealsSummary from '../components/AdminDealsSummary';
import {
  residentialRental,
  residentialSale,
  commercialRental,
  commercialSale,
} from '../constants/dealTypes';
import { round } from '../utils/Math';
import {
  returnMonthlyDollarDataContainer,
  returnMonthlyDealNumberDataContainer,
  returnNumberDealsDataContainer,
  returnYearlyDollarDealsDataContainer,
} from '../constants/graphDataModels';
import { toLocaleCurrency } from '../utils/currency';

const get = (p, o) => p.reduce((xs, x) => (xs && xs[x] ? xs[x] : null), o);

const returnGraphDealType = deal => {
  let graphDealType;

  switch (deal.dealType) {
    case commercialRental:
      graphDealType = 'Com Rentals';
      break;
    case commercialSale:
      graphDealType = 'Com Sales';
      break;
    case residentialRental:
      graphDealType = 'Res Rentals';
      break;
    case residentialSale:
      graphDealType = 'Res Sales';
      break;
    default:
      return null;
  }
  return graphDealType;
};

const returnGraphMonth = month => {
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

  return months[month];
};

@observer
class AdminDealsSummaryContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  returnNumberOfTotalDealsData = (deals = []) => {
    if (!deals.length) return false;

    const dealDataCounts = {
      'Res. Sales': 0,
      'Res. Rentals': 0,
      'Com. Sales': 0,
      'Com. Rentals': 0,
    };

    if (deals && Array.isArray(deals)) {
      deals.forEach(deal => {
        switch (deal.dealType) {
          case commercialRental:
            dealDataCounts['Com. Rentals'] += 1;
            break;
          case commercialSale:
            dealDataCounts['Com. Sales'] += 1;
            break;
          case residentialRental:
            dealDataCounts['Res. Rentals'] += 1;
            break;
          case residentialSale:
            dealDataCounts['Res. Sales'] += 1;
            break;
          default:
        }
      });
    }

    const dealData = [
      {
        id: 'Res. Sales',
        label: 'Res. Sales',
        value: dealDataCounts['Res. Sales'] || 0,
      },
      {
        id: 'Res. Rentals',
        label: 'Res. Rentals',
        value: dealDataCounts['Res. Rentals'] || 0,
      },
      {
        id: 'Com. Sales',
        label: 'Com. Sales',
        value: dealDataCounts['Com. Sales'] || 0,
      },
      {
        id: 'Com. Rentals',
        label: 'Com. Rentals',
        value: dealDataCounts['Com. Rentals'] || 0,
      },
    ];

    return dealData;
  };

  returnDollarAmtOfTotalDealsData = (deals = []) => {
    if (!deals.length) return false;

    const grossDealDataCounts = {
      'Res. Sales': 0,
      'Res. Rentals': 0,
      'Com. Sales': 0,
      'Com. Rentals': 0,
    };

    const netDealDataCounts = {
      'Res. Sales': 0,
      'Res. Rentals': 0,
      'Com. Sales': 0,
      'Com. Rentals': 0,
    };

    if (deals) {
      deals.forEach(deal => {
        if (deal.status === 'pending') return;

        switch (deal.dealType) {
          case commercialRental:
            grossDealDataCounts['Com. Rentals'] += deal.total;
            netDealDataCounts['Com. Rentals'] += deal.netCompanyCommission;
            break;
          case commercialSale:
            grossDealDataCounts['Com. Sales'] += deal.total;
            netDealDataCounts['Com. Sales'] += deal.netCompanyCommission;
            break;
          case residentialRental:
            grossDealDataCounts['Res. Rentals'] += deal.total;
            netDealDataCounts['Res. Rentals'] += deal.netCompanyCommission;
            break;
          case residentialSale:
            grossDealDataCounts['Res. Sales'] += deal.total;
            netDealDataCounts['Res. Sales'] += deal.netCompanyCommission;
            break;
          default:
        }
      });
    }

    const grossDealsDollarData = [
      {
        id: 'Res. Sales',
        label: 'Res. Sales',
        value: grossDealDataCounts['Res. Sales'] || 0,
      },
      {
        id: 'Res. Rentals',
        label: 'Res. Rentals',
        value: grossDealDataCounts['Res. Rentals'] || 0,
      },
      {
        id: 'Com. Sales',
        label: 'Com. Sales',
        value: grossDealDataCounts['Com. Sales'] || 0,
      },
      {
        id: 'Com. Rentals',
        label: 'Com. Rentals',
        value: grossDealDataCounts['Com. Rentals'] || 0,
      },
    ];

    const netDealsDollarData = [
      {
        id: 'Res. Sales',
        label: 'Res. Sales',
        value: netDealDataCounts['Res. Sales'] || 0,
      },
      {
        id: 'Res. Rentals',
        label: 'Res. Rentals',
        value: netDealDataCounts['Res. Rentals'] || 0,
      },
      {
        id: 'Com. Sales',
        label: 'Com. Sales',
        value: netDealDataCounts['Com. Sales'] || 0,
      },
      {
        id: 'Com. Rentals',
        label: 'Com. Rentals',
        value: netDealDataCounts['Com. Rentals'] || 0,
      },
    ];

    return { grossDealsDollarData, netDealsDollarData };
  };

  returnNumberOfPendingDeals = (deals = []) => {
    const numOfPendingDeals = deals.reduce((pendingDeals, deal) => {
      if (deal.status === 'pending') {
        return (pendingDeals += 1);
      }

      return pendingDeals;
    }, 0);

    return numOfPendingDeals || 0;
  };

  returnGrossDealCommissions = (deals = []) => toLocaleCurrency(deals.reduce((grossAmount, deal) => {
    if (deal.status === 'pending') return grossAmount;

    return grossAmount += deal.total;
  }, 0));

  returnNetDealCommissions = (deals = []) => toLocaleCurrency(deals.reduce((grossAmount, deal) => {
    if (deal.status === 'pending') return grossAmount;

    return grossAmount += deal.netCompanyCommission;
  }, 0));

  returnNetCurrentYearDealCommissions = (deals = []) => toLocaleCurrency(deals.reduce((grossAmount, deal) => {
    if (deal.status === 'pending') return grossAmount;
    if (moment(deal.date).year() !== moment().year()) return grossAmount;

    return grossAmount += deal.netCompanyCommission;
  }, 0));

  returnMonthlyAndYearlyDealsData = (deals = []) => {
    const monthlyDollarData = returnMonthlyDollarDataContainer();
    const grossMonthlyDollarData = returnMonthlyDollarDataContainer();
    const monthlyDealNumberData = returnMonthlyDealNumberDataContainer();
    const yearlyDollarData = returnNumberDealsDataContainer();
    const grossYearlyDollarData = returnNumberDealsDataContainer();
    const yearlyDealNumberData = returnYearlyDollarDealsDataContainer();

    deals.forEach(deal => {
      if (deal.status === 'pending') return;

      const month = moment(deal.date).month();
      const year = moment(deal.date).year();
      const currentYear = moment().year();
      const yearLimit = currentYear - 4;

      // gross monthlyDollarData
      if (
        get(
          [returnGraphMonth(month), returnGraphDealType(deal)],
          grossMonthlyDollarData
        )
      ) {
        grossMonthlyDollarData[returnGraphMonth(month)][
          returnGraphDealType(deal)
        ] += round(deal.total / 1000);
      } else {
        setValue(
          grossMonthlyDollarData,
          `${returnGraphMonth(month)}.${returnGraphDealType(deal)}`,
          round(deal.total / 1000)
        );
      }

      // net monthlyDollarData
      if (
        get(
          [returnGraphMonth(month), returnGraphDealType(deal)],
          monthlyDollarData
        )
      ) {
        monthlyDollarData[returnGraphMonth(month)][
          returnGraphDealType(deal)
        ] += round(deal.netCompanyCommission / 1000);
      } else {
        setValue(
          monthlyDollarData,
          `${returnGraphMonth(month)}.${returnGraphDealType(deal)}`,
          round(deal.netCompanyCommission / 1000)
        );
      }

      // monthlyDealNumberData
      if (
        get(
          [returnGraphMonth(month), returnGraphDealType(deal)],
          monthlyDealNumberData
        )
      ) {
        monthlyDealNumberData[returnGraphMonth(month)][
          returnGraphDealType(deal)
        ] += 1;
      } else {
        setValue(
          monthlyDealNumberData,
          `${returnGraphMonth(month)}.${returnGraphDealType(deal)}`,
          1
        );
      }

      if (year >= yearLimit) {
        // gross yearlyDollarData
        if (get([year, returnGraphDealType(deal)], yearlyDollarData)) {
          grossYearlyDollarData[year][returnGraphDealType(deal)] += round(
            deal.total / 1000
          );
        } else {
          setValue(
            grossYearlyDollarData,
            `${year}.${returnGraphDealType(deal)}`,
            round(deal.total / 1000)
          );
        }

        // yearlyDollarData
        if (get([year, returnGraphDealType(deal)], yearlyDollarData)) {
          yearlyDollarData[year][returnGraphDealType(deal)] += round(
            deal.netCompanyCommission / 1000
          );
        } else {
          setValue(
            yearlyDollarData,
            `${year}.${returnGraphDealType(deal)}`,
            round(deal.netCompanyCommission / 1000)
          );
        }

        // yearlyDealNumberData
        if (get([year, returnGraphDealType(deal)], yearlyDealNumberData)) {
          yearlyDealNumberData[year][returnGraphDealType(deal)] += 1;
        } else {
          setValue(
            yearlyDealNumberData,
            `${year}.${returnGraphDealType(deal)}`,
            1
          );
        }
      }
    });

    return {
      monthlyDollarData,
      grossMonthlyDollarData,
      monthlyDealNumberData,
      yearlyDollarData,
      grossYearlyDollarData,
      yearlyDealNumberData,
    };
  };

  generateDealsBarData = data => Object.keys(data).map(month => ({
    month,
    'Com Sales': round(data[month]['Com Sales']),
    'Com Rentals': round(data[month]['Com Rentals']),
    'Res Sales': round(data[month]['Res Sales']),
    'Res Rentals': round(data[month]['Res Rentals']),
  }));

  generateDealsLineData = data => {
    const types = ['Com Sales', 'Com Rentals', 'Res Sales', 'Res Rentals'];

    return types.map(id => ({
      id,
      data: Object.keys(data).map(month => ({
        x: month,
        y: round(data[month][id]),
      })),
    }));
  };

  returnAllGraphData = deals => {
    const {
      monthlyDollarData,
      grossMonthlyDollarData,
      monthlyDealNumberData,
      yearlyDollarData,
      grossYearlyDollarData,
      yearlyDealNumberData,
    } = this.returnMonthlyAndYearlyDealsData(deals);

    return {
      monthlyDealsDollarBarData: this.generateDealsBarData(monthlyDollarData),
      grossMonthlyDealsDollarBarData: this.generateDealsBarData(
        grossMonthlyDollarData
      ),
      monthlyDealsNumberBarData: this.generateDealsBarData(
        monthlyDealNumberData
      ),
      monthlyDealsDollarLineData: this.generateDealsLineData(monthlyDollarData),
      grossMonthlyDealsDollarLineData: this.generateDealsLineData(
        grossMonthlyDollarData
      ),
      monthlyDealsNumberLineData: this.generateDealsLineData(
        monthlyDealNumberData
      ),
      yearlyDealsDollarBarData: this.generateDealsBarData(yearlyDollarData),
      grossYearlyDealsDollarBarData: this.generateDealsBarData(
        grossYearlyDollarData
      ),
      yearlyDealsNumberBarData: this.generateDealsBarData(yearlyDealNumberData),
      yearlyDealsDollarLineData: this.generateDealsLineData(yearlyDollarData),
      grossYearlyDealsDollarLineData: this.generateDealsLineData(
        grossYearlyDollarData
      ),
      yearlyDealsNumberLineData: this.generateDealsLineData(
        yearlyDealNumberData
      ),
    };
  };

  render() {
    const { deals, userUUID } = this.props;

    const {
      monthlyDealsDollarBarData,
      grossMonthlyDealsDollarBarData,
      monthlyDealsNumberBarData,
      monthlyDealsDollarLineData,
      grossMonthlyDealsDollarLineData,
      monthlyDealsNumberLineData,
      yearlyDealsDollarBarData,
      grossYearlyDealsDollarBarData,
      yearlyDealsNumberBarData,
      yearlyDealsDollarLineData,
      grossYearlyDealsDollarLineData,
      yearlyDealsNumberLineData,
    } = this.returnAllGraphData(deals);

    const {
      grossDealsDollarData,
      netDealsDollarData,
    } = this.returnDollarAmtOfTotalDealsData(deals);

    return (
      <div>
        <AdminDealsSummary
          userUUID={userUUID}
          numberOfTotalDealsData={this.returnNumberOfTotalDealsData(deals)}
          grossDollarAmtOfTotalDealsData={grossDealsDollarData}
          netDollarAmtOfTotalDealsData={netDealsDollarData}
          numberOfPendingDeals={this.returnNumberOfPendingDeals(deals)}
          grossDealCommissions={this.returnGrossDealCommissions(deals)}
          netDealCommissions={this.returnNetDealCommissions(deals)}
          netCurrentYearDealCommissions={this.returnNetCurrentYearDealCommissions(
            deals
          )}
          monthlyDealsDollarBarData={monthlyDealsDollarBarData}
          grossMonthlyDealsDollarBarData={grossMonthlyDealsDollarBarData}
          monthlyDealsNumberBarData={monthlyDealsNumberBarData}
          monthlyDealsDollarLineData={monthlyDealsDollarLineData}
          grossMonthlyDealsDollarLineData={grossMonthlyDealsDollarLineData}
          monthlyDealsNumberLineData={monthlyDealsNumberLineData}
          yearlyDealsDollarBarData={yearlyDealsDollarBarData}
          grossYearlyDealsDollarBarData={grossYearlyDealsDollarBarData}
          yearlyDealsNumberBarData={yearlyDealsNumberBarData}
          yearlyDealsDollarLineData={yearlyDealsDollarLineData}
          grossYearlyDealsDollarLineData={grossYearlyDealsDollarLineData}
          yearlyDealsNumberLineData={yearlyDealsNumberLineData}
        />
      </div>
    );
  }
}

export default AdminDealsSummaryContainer;
