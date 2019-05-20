import randomstring from 'randomstring';

export const generateRandomID = () => (
  randomstring.generate({
    length: 6,
    readable: true,
    capitalization: 'lowercase',
  })
);
