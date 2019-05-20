import moment from 'moment';

export const returnMonthlyDollarDataContainer = () => ({
  Jan: {
    'Com Sales': 0,
    'Com Rentals': 0,
    'Res Sales': 0,
    'Res Rentals': 0,
  },
  Feb: {
    'Com Sales': 0,
    'Com Rentals': 0,
    'Res Sales': 0,
    'Res Rentals': 0,
  },
  Mar: {
    'Com Sales': 0,
    'Com Rentals': 0,
    'Res Sales': 0,
    'Res Rentals': 0,
  },
  Apr: {
    'Com Sales': 0,
    'Com Rentals': 0,
    'Res Sales': 0,
    'Res Rentals': 0,
  },
  May: {
    'Com Sales': 0,
    'Com Rentals': 0,
    'Res Sales': 0,
    'Res Rentals': 0,
  },
  June: {
    'Com Sales': 0,
    'Com Rentals': 0,
    'Res Sales': 0,
    'Res Rentals': 0,
  },
  Jul: {
    'Com Sales': 0,
    'Com Rentals': 0,
    'Res Sales': 0,
    'Res Rentals': 0,
  },
  Aug: {
    'Com Sales': 0,
    'Com Rentals': 0,
    'Res Sales': 0,
    'Res Rentals': 0,
  },
  Sep: {
    'Com Sales': 0,
    'Com Rentals': 0,
    'Res Sales': 0,
    'Res Rentals': 0,
  },
  Oct: {
    'Com Sales': 0,
    'Com Rentals': 0,
    'Res Sales': 0,
    'Res Rentals': 0,
  },
  Nov: {
    'Com Sales': 0,
    'Com Rentals': 0,
    'Res Sales': 0,
    'Res Rentals': 0,
  },
  Dec: {
    'Com Sales': 0,
    'Com Rentals': 0,
    'Res Sales': 0,
    'Res Rentals': 0,
  },
});

export const returnMonthlyDealNumberDataContainer = () => ({
  Jan: {
    'Com Sales': 0,
    'Com Rentals': 0,
    'Res Sales': 0,
    'Res Rentals': 0,
  },
  Feb: {
    'Com Sales': 0,
    'Com Rentals': 0,
    'Res Sales': 0,
    'Res Rentals': 0,
  },
  Mar: {
    'Com Sales': 0,
    'Com Rentals': 0,
    'Res Sales': 0,
    'Res Rentals': 0,
  },
  Apr: {
    'Com Sales': 0,
    'Com Rentals': 0,
    'Res Sales': 0,
    'Res Rentals': 0,
  },
  May: {
    'Com Sales': 0,
    'Com Rentals': 0,
    'Res Sales': 0,
    'Res Rentals': 0,
  },
  June: {
    'Com Sales': 0,
    'Com Rentals': 0,
    'Res Sales': 0,
    'Res Rentals': 0,
  },
  Jul: {
    'Com Sales': 0,
    'Com Rentals': 0,
    'Res Sales': 0,
    'Res Rentals': 0,
  },
  Aug: {
    'Com Sales': 0,
    'Com Rentals': 0,
    'Res Sales': 0,
    'Res Rentals': 0,
  },
  Sep: {
    'Com Sales': 0,
    'Com Rentals': 0,
    'Res Sales': 0,
    'Res Rentals': 0,
  },
  Oct: {
    'Com Sales': 0,
    'Com Rentals': 0,
    'Res Sales': 0,
    'Res Rentals': 0,
  },
  Nov: {
    'Com Sales': 0,
    'Com Rentals': 0,
    'Res Sales': 0,
    'Res Rentals': 0,
  },
  Dec: {
    'Com Sales': 0,
    'Com Rentals': 0,
    'Res Sales': 0,
    'Res Rentals': 0,
  },
});

export const returnNumberDealsDataContainer = () => {
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
      'Com Sales': 0,
      'Com Rentals': 0,
      'Res Sales': 0,
      'Res Rentals': 0,
    };
  });

  return data;
};

export const returnYearlyDollarDealsDataContainer = () => {
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
      'Com Sales': 0,
      'Com Rentals': 0,
      'Res Sales': 0,
      'Res Rentals': 0,
    };
  });

  return data;
};
