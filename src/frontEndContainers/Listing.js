import React from 'react';
import { observer } from 'mobx-react';
import Chance from 'chance';
import Listing from '../frontEndComponents/Listing';

const chance = new Chance();

const description = `Lorem ipsum dolor amet beard cray man braid, taxidermy vape retro lumbersexual street art cornhole normcore. Deep v succulents pickled woke. Pinterest iceland typewriter tofu truffaut aesthetic. Listicle 3 wolf moon occupy, snackwave farm-to-table salvia knausgaard health goth wolf thundercats asymmetrical. Artisan scenester echo park mumblecore vape unicorn. Street art drinking vinegar gluten-free hot chicken hell of YOLO, gastropub pinterest lyft green juice.

Blue bottle street art taiyaki selfies listicle yr. Selvage ugh selfies unicorn, leggings snackwave cardigan forage kogi literally mixtape. Ennui meditation yuccie paleo yr occupy beard bitters sriracha before they sold out. Sartorial authentic wayfarers typewriter, chia chartreuse cold-pressed etsy pour-over intelligentsia swag literally pinterest fingerstache. Unicorn jianbing helvetica tattooed umami irony pabst 8-bit etsy deep v trust fund hashtag. IPhone green juice jean shorts neutra four loko meggings tattooed etsy.

Skateboard polaroid humblebrag jianbing cardigan af. Tofu tacos actually, roof party vape semiotics four loko woke kickstarter retro. Echo park venmo skateboard fixie wayfarers, mustache vape bushwick pork belly gentrify keytar lomo hoodie poutine. Plaid church-key ennui VHS, succulents health goth bespoke irony pop-up coloring book craft beer beard. Bitters thundercats ramps master cleanse poutine direct trade pickled af live-edge seitan affogato leggings. Pop-up kickstarter mumblecore vinyl.`;

@observer
class ListingContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      listing: this.createListing(),
      listingAgent: this.createListingAgent(),
      relatedListings: this.createRelatedListings(),
      contactAgentModalOpen: false,
    };
  }
  createRelatedListings = () => [
    {
      featuredPhotoURL: `http://picsum.photos/314/234/?random?${chance.integer({
        min: 1,
        max: 1000,
      })}`,
      otherPhotoURLs: [
        `http://picsum.photos/314/234/?random?${chance.integer({
          min: 1,
          max: 1000,
        })}`,
        `http://picsum.photos/314/234/?random?${chance.integer({
          min: 1,
          max: 1000,
        })}`,
        `http://picsum.photos/314/234/?random?${chance.integer({
          min: 1,
          max: 1000,
        })}`,
      ],
      address: '225 West 60th Street, Manhattan NY, 10023',
      neighborhood: 'Jackson Heights',
      price: 2000,
      beds: 3,
      baths: 2,
      isLiked: false,
      isNoFee: false,
      monthsOfFreeRent: 0,
      sqFootage: 6339,
      type: 'Residential Rental',
      id: 'jxj595h9f5i5fj',
    },
    {
      featuredPhotoURL: `http://picsum.photos/314/234/?random?${chance.integer({
        min: 1,
        max: 1000,
      })}`,
      otherPhotoURLs: [
        `http://picsum.photos/314/234/?random?${chance.integer({
          min: 1,
          max: 1000,
        })}`,
        `http://picsum.photos/314/234/?random?${chance.integer({
          min: 1,
          max: 1000,
        })}`,
        `http://picsum.photos/314/234/?random?${chance.integer({
          min: 1,
          max: 1000,
        })}`,
      ],
      address: '452 West 60th Street, Manhattan NY, 10023',
      neighborhood: 'Jackson Heights',
      price: 1400,
      beds: 2,
      baths: 2,
      isLiked: true,
      isNoFee: true,
      monthsOfFreeRent: 1,
      sqFootage: 5225,
      type: 'Residential Rental',
      id: 'o3j9dn9un3nj3',
    },
    {
      featuredPhotoURL: `http://picsum.photos/314/234/?random?${chance.integer({
        min: 1,
        max: 1000,
      })}`,
      otherPhotoURLs: [
        `http://picsum.photos/314/234/?random?${chance.integer({
          min: 1,
          max: 1000,
        })}`,
        `http://picsum.photos/314/234/?random?${chance.integer({
          min: 1,
          max: 1000,
        })}`,
        `http://picsum.photos/314/234/?random?${chance.integer({
          min: 1,
          max: 1000,
        })}`,
      ],
      address: '893 West 60th Street, Manhattan NY, 10023',
      neighborhood: 'SoHo',
      price: 3700,
      beds: 3,
      baths: 3,
      isLiked: false,
      isNoFee: false,
      monthsOfFreeRent: 2,
      sqFootage: 5225,
      type: 'Residential Rental',
      id: 'cinoervtoi4in',
    },
  ];

  createListing = () => {
    return {
      description,
      address: '225 West 60th Street, Manhattan NY, 10023',
      neighborhood: 'Jackson Heights',
      price: 2000,
      beds: 3,
      baths: 2,
      isLiked:
        chance.integer({
          min: 1,
          max: 2,
        }) === 2
          ? false
          : true,
      isNoFee: false,
      monthsOfFreeRent: 0,
      sqFootage: 6339,
      type: 'Residential Rental',
      id: 'jxj595h9f5i5fj',
      commercialOrResidential: 'residential',
      rentalOrSale: 'rental',
      cantApplyOnline: false,
      listingID: chance.integer({ min: 100000, max: 999999 }),
      images: [
        {
          URL: `http://picsum.photos/400/500/?random?${chance.integer({
            min: 1,
            max: 1000,
          })}`,
          title: 'Image',
          author: 'author',
        },
        {
          URL: `http://picsum.photos/400/500/?random?${chance.integer({
            min: 1,
            max: 1000,
          })}`,
          title: 'Image',
          author: 'author',
        },
        {
          URL: `http://picsum.photos/325/600/?random?${chance.integer({
            min: 1,
            max: 1000,
          })}`,
          title: 'Image',
          author: 'author',
        },
        {
          URL: `http://picsum.photos/400/500/?random?${chance.integer({
            min: 1,
            max: 1000,
          })}`,
          title: 'Image',
          author: 'author',
        },
        {
          URL: `http://picsum.photos/400/500/?random?${chance.integer({
            min: 1,
            max: 1000,
          })}`,
          title: 'Image',
          author: 'author',
        },
        {
          URL: `http://picsum.photos/400/500/?random?${chance.integer({
            min: 1,
            max: 1000,
          })}`,
          title: 'Image',
          author: 'author',
        },
        {
          URL: `http://picsum.photos/400/500/?random?${chance.integer({
            min: 1,
            max: 1000,
          })}`,
          title: 'Image',
          author: 'author',
        },
        {
          URL: `http://picsum.photos/400/500/?random?${chance.integer({
            min: 1,
            max: 1000,
          })}`,
          title: 'Image',
          author: 'author',
        },
      ],
    };
  };

  createListingAgent = () => ({
    profilePhotoURL: `http://picsum.photos/325/400/?random?${chance.integer({
      min: 1,
      max: 1000,
    })}`,
    name: chance.name(),
    email: chance.email(),
    title: 'Licensed Real Estate Salesperson',
    officeNumber: `${chance.phone()} x${chance.integer({ min: 1, max: 999 })}`,
    areaOfFocus: 'none',
    mobileNumber: chance.phone(),
    region:
      chance.integer({ min: 0, max: 100 }) > 70
        ? chance.state({ full: true })
        : 'New York',
    agentID: chance.integer({ min: 100000, max: 999999 }),
  });

  toggleContactAgentModalOpen = () => {
    this.setState({
      contactAgentModalOpen: true,
    });
  };

  toggleContactAgentModalClosed = () => {
    this.setState({
      contactAgentModalOpen: false,
    });
  };

  onSubmitContactAgentForm = values => {
    console.log('Contact agent form submitted');
    console.log(values);
  };

  render() {
    const { listingID } = this.props;
    return (
      <Listing
        listing={this.state.listing}
        listingAgent={this.state.listingAgent}
        listingID={this.state.listing.id}
        relatedListings={this.state.relatedListings}
        contactAgentModalOpen={this.state.contactAgentModalOpen}
        toggleContactAgentModalOpen={this.toggleContactAgentModalOpen}
        toggleContactAgentModalClosed={this.toggleContactAgentModalClosed}
        onSubmitContactAgentForm={this.onSubmitContactAgentForm}
      />
    );
  }
}

export default ListingContainer;
