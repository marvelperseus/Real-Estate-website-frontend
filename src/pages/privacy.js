import {Component} from 'react';
import { initStore } from '../models';
import isBrowser from 'is-browser';
import TermsPage from '../components/TermsPage';

export default class Privacy extends Component {
  static getInitialProps({ req }) {
    const isServer = !!req;
    return {
      cookieJWTData: req && req.cookies ? req.cookies.jwtData : null,
      isServer,
    };
  }

  constructor(props) {
    super(props);
    this.store = initStore(props.isServer, props.cookieJWTData);

    // for debugging only!!!
    if (isBrowser && !window._appStore) window._appStore = this.store;
  }


  render() {
    return (
      <TermsPage title="Privacy Policy" UserStore={this.store.UserStore}>
        <h3>Privacy Policy</h3>
        <p>
          This Privacy Policy describes the policies and procedures of Reyes &
          Elsamad Real Estate Group, LTD and its affiliates ("us", "we", or
          "our") on the use, collection and disclosure of your information on
          www.reyeselsamad.com (the “Site”). This Site referred also as the
          "Service", collectively with the company’s phone App’s and content,
          you are consenting to the collection, manipulation, storage, transfer
          and disclosure of your information as described in the Privacy Policy.
        </p>

        <h5>Information Collection and Use</h5>
        <p>
          While using our Service, you may choose to provide us without
          limitation, certain personal identifiable information that can be used
          to contact or identify you. Personal identifiable information may
          include, but is not limited to, your email address, name, phone
          number, rental listing information, geolocation data, social security
          number, background check history, reference letters, bank statements,
          income tax returns, credit card or other payment information and
          postal address ("Personal Information"). We collect this information
          for providing the Service, identifying and communicating with you,
          responding to your requests/inquiries, servicing your purchase orders,
          and improving our services.
        </p>

        <h5>Log Data</h5>
        <p>
          We may also collect information that your browser sends whenever you
          visit our Service ("Log Data"). This Log Data may include information
          such as your computer's Internet Protocol ("IP") address, browser
          type, browser version, the pages of our Service that you visit, the
          time and date of your visit, the time spent on those pages and other
          statistics. In addition, we may use Third Party Services such as
          Google Analytics that collect, monitor and analyze this type of
          information to increase our Service's functionality. This Privacy
          Policy does not apply to the practices of those third parties that we
          do not own or control, including but not limited to any landlords,
          renters, owners, buyers and third-party websites, services and
          applications (“Third Party Services”) that you elect to access through
          the Services or individuals that we do not manage or employ. We do not
          take responsibility for the content or privacy policies of those
          Third-Party Services and furthermore recommend you review their own
          privacy policies.{' '}
        </p>
        <p>
          <b>Other Statistics:</b> We collect statistical information about how
          both users, collectively, use the Services. This statistical
          information is not Personal Information and cannot be tied back to
          you. This type of data enables us to figure out how often users use
          parts of the Services so that we can make the Services appealing to as
          many users as possible and improve the Services. As part of this use
          of information, we may provide this data to our partners about how our
          users, collectively, use our site. Why is this done? Our partners want
          to also provide excellent online services; thus, we give our partners
          such information.{' '}
        </p>

        <h5>Cookies</h5>
        <p>
          Cookies are files with a small amount of data, which may include an
          anonymous unique identifier. Cookies are sent to your browser from a
          website and transferred to your device. We use cookies to collect
          information to improve our Services for you. We use cookies to enable
          our servers to recognize your web browser and tell us how and when you
          visit the Site and otherwise use the Services through the Internet.
          Our cookies do not, by themselves, contain Personal Information. We do
          use cookies to identify that your web browser has accessed aspects of
          the Services. You can instruct your browser to refuse all cookies or
          to indicate when a cookie is being sent. The Help feature on most
          browsers provide information on how to accept cookies, disable cookies
          or to notify you when receiving a new cookie. If you do not accept
          cookies, you may not be able to use some features of our Service and
          we recommend that you leave them turned on. This Privacy Policy covers
          the use of cookies by Reyes & Elsamad and does not cover the use of
          cookies by any third parties, including advertisers or partners. We do
          not control when or how third parties place cookies on your computer.
        </p>
        <h5>Communications</h5>
        <p>
          We may use your Personal Information to contact you with newsletters,
          marketing or promotional materials and other information that may be
          of interest to you. You may opt out of receiving any, or all, of these
          communications from us by following the unsubscribe link or
          instructions provided in any email we send or by contacting us. If you
          do decide to opt out, you may not have access to certain features of
          the Service. By opting out, you only opt out from messages by Reyes &
          Elsamad and not third parties.{' '}
        </p>
        <h5>Communications with Independent contractors</h5>

        <p>
          We contract with people and other entities which include our
          independent contractor licensed real estate salespersons and brokers
          (“Agents”). Our business practice of real estate transactions such as
          to the sale, purchase, leasing or financing of properties will require
          for us to share personal information with our Agents and you hereby
          consent to share your Personal Information with our Agents.{' '}
        </p>

        <h5>Communications during Business Transfers</h5>
        <p>
          Our business from time to time may target to acquire or sell assets.
          User information is typically one of the transferred business assets.
          You acknowledge that such transfers may occur if for example we sell
          all our assets, were acquired by another entity or we go out of
          business or enter bankruptcy, and that any acquirer of us or our
          assets may continue to use your Personal Information as set forth in
          this Policy.{' '}
        </p>
        <h5>Compliance with Laws for your protection and ours.</h5>
        <p>
          We will disclose your Personal Information where required to do so by
          any applicable law, regulation, legal process, governmental request or
          subpoena or if we believe that such action is necessary to comply with
          the law and the reasonable requests of law enforcement or to protect
          the security or integrity of our Service. We reserve the right to
          enforce this Privacy Policy to detect, prevent or otherwise address
          fraud, security or technical issues. This includes exchanging
          information with other companies and organizations for spam/malware
          prevention and fraud protection.
        </p>
        <h5>Information We Share with Your Consent</h5>
        <p>
          Except as set forth above, you will be notified when your Personal
          Information may be shared with third parties and will be able to
          prevent the sharing of this information.
        </p>

        <h5>Do Not Track Disclosures</h5>
        <p>
          We do not support (DNT) or Do Not Track technology. Do Not Track is a
          preference you can set in your web browser to inform websites that you
          do not want to be tracked. We may use tracking technologies to collect
          information about your online activities over time and across
          third-party websites or other online services (behavioral tracking).
          If you do not want to be tracked, we will comply with the web browsers
          do not track signals. If there are third party content or
          applications, which may include advertisements on the Service, then
          you should be aware that we do not control their tracking technologies
          or how they may be used.{' '}
        </p>

        <h5>Is Personal Information About Me Secure</h5>
        <h6>
          We attempt to protect your account information and to ensure that it
          is kept private; however, we cannot guarantee the security of any
          account information. To ensure that you’re doing your part to prevent
          unauthorized access to your account and personal information, we
          suggest you sign off out of our Service each time you utilize it and
          to protect your password.{' '}
        </h6>

        <h5>Security</h5>
        <p>
          The security of your Personal Information is important to us, and we
          strive to implement and maintain reasonable, commercially acceptable
          security procedures and practices appropriate to the nature of the
          information we store, to protect it from unauthorized access,
          destruction, use, modification, or disclosure. However, please be
          aware that no method of transmission over the internet, or method of
          electronic storage is 100% secure and we are unable to guarantee the
          absolute security of the Personal Information we have collected from
          you.
        </p>

        <h5>International Transfer </h5>
        <p>
          Your information, including Personal Information, may be transferred
          to — and maintained on — computers located outside of your state,
          province, country or other governmental jurisdiction where the data
          protection laws may differ than those from your jurisdiction. If you
          are located outside United States and choose to provide information to
          us, please note that we transfer the information, including Personal
          Information, to United States and process it there. Your use of the
          Services and your submission of such information each represents your
          consent to that transfer.{' '}
        </p>
        <h5>Children’s Policy </h5>
        <p>
          Only persons age 18 or older have permission to access our Service.
          Our Service does not address anyone under the age of 13 ("Children").
          We do not knowingly collect personally identifiable information from
          children under 13. If you are a parent or guardian and you learn that
          your Children have provided us with Personal Information, please
          contact us. If we become aware that we have collected Personal
          Information from a child under age 13 without verification of parental
          consent, we take steps to remove that information from our servers.
        </p>
        <h5>Changes to this Policy</h5>
        <p>
          This Privacy Policy is effective as of October 30, 2018 and will
          remain in effect except with respect to any changes in its provisions
          in the future, which will be in effect immediately after being posted
          on this page. We reserve the right to update or change our Privacy
          Policy at any time and you should check this Privacy Policy
          periodically. Your continued use of the Service after we post any
          modifications to the Privacy Policy on this page will constitute your
          acknowledgment of the modifications and your consent to abide and be
          bound by the modified Privacy Policy. If we make any material changes
          to this Privacy Policy, we will notify you either through the email
          address you have provided us, or by placing a prominent notice on our
          website.
        </p>
        <h5>What If I Have Questions Or Concerns?</h5>
        <p>
          If you have any questions or concerns regarding privacy using the
          Services, please send us a detailed message to <a href="mailto:admin@reyeselsamad.com">
            admin@reyeselsamad.com
          </a>
        </p>
      </TermsPage>
    );
  }
}
