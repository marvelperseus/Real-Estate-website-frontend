import React, { Component } from 'react';
import { observer } from 'mobx-react';
import moment from 'moment';
import setValue from 'set-value';
import DealsSummary from '../components/DealsSummary';
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
      graphDealType = 'Res Sales';
      break;
    case residentialSale:
      graphDealType = 'Res Rentals';
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
class DealsSummaryContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  returnNumberOfTotalDealsData = (deals = []) => {
    if (!deals.length) return false;

    if (!deals.some(deal => deal.status !== 'pending')) return false;

    const dealDataCounts = {
      'Res. Sales': 0,
      'Res. Rentals': 0,
      'Com. Sales': 0,
      'Com. Rentals': 0,
    };

    if (deals && Array.isArray(deals)) {
      deals.forEach(deal => {
        if (deal.status === 'pending') return;

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

  returnGrossDollarAmtOfTotalDealsData = (deals = []) => {
    if (!deals.length) return false;

    if (!deals.some(deal => deal.status !== 'pending')) return false;

    const dealDataCounts = {
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
            dealDataCounts['Com. Rentals'] += deal.total;
            break;
          case commercialSale:
            dealDataCounts['Com. Sales'] += deal.total;
            break;
          case residentialRental:
            dealDataCounts['Res. Rentals'] += deal.total;
            break;
          case residentialSale:
            dealDataCounts['Res. Sales'] += deal.total;
            break;
          default:
        }
      });
    }

    const dealsGrossDollarData = [
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

    return dealsGrossDollarData;
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

  returnNetCurrentYearDealCommissions = (deals = []) => toLocaleCurrency(deals.reduce((grossAmount, deal) => {
    if (deal.status === 'pending') return grossAmount;
    if (moment(deal.date).year() !== moment().year()) return grossAmount;

    return grossAmount += deal.netAgentCommission;
  }, 0));

  returnMonthlyAndYearlyDealsData = (deals = []) => {
    const monthlyDollarData = returnMonthlyDollarDataContainer();
    const monthlyDealNumberData = returnMonthlyDealNumberDataContainer();
    const yearlyDollarData = returnNumberDealsDataContainer();
    const yearlyDealNumberData = returnYearlyDollarDealsDataContainer();

    deals.forEach(deal => {
      if (deal.status === 'pending') return;

      const month = moment(deal.date).month();
      const year = moment(deal.date).year();
      const currentYear = moment().year();
      const yearLimit = currentYear - 4;

      // monthlyDollarData
      if (
        get(
          [returnGraphMonth(month), returnGraphDealType(deal)],
          monthlyDollarData
        )
      ) {
        monthlyDollarData[returnGraphMonth(month)][
          returnGraphDealType(deal)
        ] += round(deal.netAgentCommission / 1000);
      } else {
        setValue(
          monthlyDollarData,
          `${returnGraphMonth(month)}.${returnGraphDealType(deal)}`,
          round(deal.netAgentCommission / 1000)
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
        // yearlyDollarData
        if (get([year, returnGraphDealType(deal)], yearlyDollarData)) {
          yearlyDollarData[year][returnGraphDealType(deal)] += round(
            deal.netAgentCommission / 1000
          );
        } else {
          setValue(
            yearlyDollarData,
            `${year}.${returnGraphDealType(deal)}`,
            round(deal.netAgentCommission / 1000)
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
      monthlyDealNumberData,
      yearlyDollarData,
      yearlyDealNumberData,
    };
  };

  generateDealsBarData = data => Object.keys(data).map(month => ({
    month,
    'Com Sales': data[month]['Com Sales'],
    'Com Rentals': data[month]['Com Rentals'],
    'Res Sales': data[month]['Res Sales'],
    'Res Rentals': data[month]['Res Rentals'],
  }));

  generateDealsLineData = data => {
    const types = ['Com Sales', 'Com Rentals', 'Res Sales', 'Res Rentals'];

    return types.map(id => ({
      id,
      data: Object.keys(data).map(month => ({
        x: month,
        y: data[month][id],
      })),
    }));
  };

  returnAllGraphData = deals => {
    const {
      monthlyDollarData,
      monthlyDealNumberData,
      yearlyDollarData,
      yearlyDealNumberData,
    } = this.returnMonthlyAndYearlyDealsData(deals);

    return {
      monthlyDealsDollarBarData: this.generateDealsBarData(monthlyDollarData),
      monthlyDealsNumberBarData: this.generateDealsBarData(
        monthlyDealNumberData
      ),
      monthlyDealsDollarLineData: this.generateDealsLineData(monthlyDollarData),
      monthlyDealsNumberLineData: this.generateDealsLineData(
        monthlyDealNumberData
      ),
      yearlyDealsDollarBarData: this.generateDealsBarData(yearlyDollarData),
      yearlyDealsNumberBarData: this.generateDealsBarData(yearlyDealNumberData),
      yearlyDealsDollarLineData: this.generateDealsLineData(yearlyDollarData),
      yearlyDealsNumberLineData: this.generateDealsLineData(
        yearlyDealNumberData
      ),
    };
  };

  render() {
    const { deals } = this.props;

    const {
      monthlyDealsDollarBarData,
      monthlyDealsNumberBarData,
      monthlyDealsDollarLineData,
      monthlyDealsNumberLineData,
      yearlyDealsDollarBarData,
      yearlyDealsNumberBarData,
      yearlyDealsDollarLineData,
      yearlyDealsNumberLineData,
    } = this.returnAllGraphData(deals);

    return (
      <div>
        <DealsSummary
          userUUID={this.props.userUUID}
          numberOfTotalDealsData={this.returnNumberOfTotalDealsData(deals)}
          grossDollarAmtOfTotalDealsData={this.returnGrossDollarAmtOfTotalDealsData(
            deals
          )}
          numberOfPendingDeals={this.returnNumberOfPendingDeals(deals)}
          grossDealCommissions={this.returnGrossDealCommissions(deals)}
          netCurrentYearDealCommissions={this.returnNetCurrentYearDealCommissions(
            deals
          )}
          monthlyDealsDollarBarData={monthlyDealsDollarBarData}
          monthlyDealsNumberBarData={monthlyDealsNumberBarData}
          monthlyDealsDollarLineData={monthlyDealsDollarLineData}
          monthlyDealsNumberLineData={monthlyDealsNumberLineData}
          yearlyDealsDollarBarData={yearlyDealsDollarBarData}
          yearlyDealsNumberBarData={yearlyDealsNumberBarData}
          yearlyDealsDollarLineData={yearlyDealsDollarLineData}
          yearlyDealsNumberLineData={yearlyDealsNumberLineData}
        />
      </div>
    );
  }
}

export default DealsSummaryContainer;
