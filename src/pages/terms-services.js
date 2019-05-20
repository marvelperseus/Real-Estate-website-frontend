import { Component } from 'react';
import { initStore } from '../models';
import isBrowser from 'is-browser';
import TermsPage from '../components/TermsPage';

export default class TermsServices extends Component {
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
      <TermsPage title="Terms and Policies" UserStore={this.store.UserStore}>
        <h3>TERMS OF SERVICES</h3>
        <p>
          Please read these Terms and Service (Collectively with the Privacy
          Policy and the DMCA Copywrite Policy) carefully before using the
          https://www.reyeselsamad.com website (the "Site") operated by Reyes &
          Elsamad Real Estate Group LTD ("us", "we", or "our") (together with
          the Site, the “Services”). The goal of this Web Site is to provide
          you, the user (“You”) with access to the most comprehensive network of
          residential real estate products/services and related links to meet
          your needs (the “Content”).{' '}
        </p>
        <p>
          Your access to and use of the Service is conditioned upon your
          acceptance of and compliance with these Terms. These Terms apply to
          all visitors, users and others who wish to access or use the Service.
          If you are accepting these terms on behalf of a company, you represent
          you have the authority to do so. By registering for and/or using the
          Services in any manner, you agree to be bound by these Terms. If you
          disagree with any part of the terms, then you do not have permission
          to access the Service.
        </p>
        <h5>Communications & Eligibility</h5>
        <p>
          By creating an account on our Service, you agree to subscribe to
          newsletters, marketing or promotional materials and other information
          we may send. However, you may opt out of receiving any, or all, of
          these communications from us by following the unsubscribe link or
          instructions provided in any email we send. You represent and warrant
          that you are at least eighteen (18) years of age and that you have the
          right, authority, and capacity to enter, perform your obligations
          under, and abide by these Terms of Service. If you are under the age
          of 18, you may not, under any circumstances or for any reason, use the
          Services. We reserve the right to refuse to offer the Services to any
          person or entity and change its eligibility criteria at any time.{' '}
        </p>
        <p>
          To ensure that these Terms of Service follow all rules, laws and
          regulations, you are solely responsible to do so. If the Service
          conflicts with any applicable law, rule or regulation, then the right
          to access the Service is revoked. Keep in mind that our Services are
          offered only for your use and not for the use or benefit of any third
          party. Each other person receiving benefit from the use of the Service
          must agree to and abide by these Terms of Service as a condition to
          our obligations. If you are using the Service outside of the United
          States of America, we make no representations that the Services are
          appropriate or available for use in your location. Those who access or
          use the Services from other jurisdictions do so at their own volition
          and are responsible for compliance with local law. By providing
          information in connection with the Services, you consent to the
          transfer of your information to, and storage of your information in
          the United States, the laws of which may not be as stringent as the
          laws of the country in which you reside.
        </p>
        <h5>Content</h5>
        <p>
          For purposes of these Terms of Service, the term “Content” includes,
          without limitation, data, text, listings, information, inquiries,
          photographs, videos, virtual tours, audio clips, written posts,
          reviews, comments, software, scripts, graphics, and interactive
          features generated, provided, or otherwise made accessible on or
          through the Services. From time to time, you may encounter other users
          utilizing the same Service. Please exercise good judgment and common
          sense; conduct all necessary, appropriate, and prudent inquiries,
          investigations, research, and due diligence; and take all necessary
          precautions when interacting with others or publicly posting Content.
          If you enter into any agreement with any other users, we are not
          liable nor will be held responsible for such agreements.{' '}
        </p>
        <p>
          If available, our Service allows you to post, link, store, share and
          otherwise make available certain information, text, graphics, videos,
          or other material ("Content"). You are responsible for the Content
          that you post on or through the Service, including its legality,
          reliability, and appropriateness. By posting Content on or through the
          Service, You represent and warrant that: (i) the Content is yours (you
          own it) and/or you have the right to use it and the right to grant us
          the rights and license as provided in these Terms, and (ii) that the
          posting of your Content on or through the Service does not violate the
          privacy rights, publicity rights, copyrights, contract rights or any
          other rights of any person or entity. We reserve the right to
          terminate the account of anyone found to be infringing on a copyright.{' '}
        </p>
        <p>
          Some Services may be supported by advertising revenue, and you hereby
          agree that we may display advertising, promotions, sponsored Listings,
          and the like in connection with the Services on, around, and in
          connection with your User Content.
        </p>
        <p>
          You retain any and all your rights to any Content you submit, post or
          display on or through the Service and you are responsible for
          protecting those rights. We take no responsibility and assume no
          liability for Content you or any third-party posts on or through the
          Service. However, by posting Content using the Service you grant us
          the right and license to use, modify, publicly perform, publicly
          display, reproduce, and distribute such Content on and through the
          Service. You agree that this license includes the right for us to make
          your Content available to other users of the Service, who may also use
          your Content subject to these Terms. You acknowledge and agree that we
          are not obligated to monitor, restrict or filter any Content posted
          anywhere on the Site. We do not regularly monitor the accuracy or
          reliability of Content. However, we reserve the right to modify or
          remove any Content at any time.
        </p>
        <p>
          In addition, Content found on or through this Service are the property
          of Reyes & Elsamad Real Estate Group, LTD. You may not distribute,
          modify, transmit, reuse, download, repost, copy, or use said Content,
          whether in whole or in part, for commercial purposes or for personal
          gain, without express advance written permission from us. You shall
          not sell, license, rent, share, publish, or otherwise use or exploit
          any Content outside the Services for commercial use, in connection
          with the provision of services to a third party, or in any way that
          violates any third party right. Without limiting the foregoing, no
          real estate broker, salesperson, agent, or similar state licensed real
          estate professional may market or make commercial use of the Content
          in any way, including, without limitation, advertising our property
          listings, copying our Content for commercial use, or contacting our
          customers or the owners or sellers of any properties listed on the
          Services.
        </p>
        <h5>Availability</h5>
        <p>
          We do not guarantee that any Content will be made available through
          the Services. We are constantly updating product and service offerings
          on the Service. We may experience delays in updating information on
          the Service and in our advertising on other web sites. The information
          found on the Service may contain errors or inaccuracies and may not be
          complete or current. Products or services may be mispriced, described
          inaccurately, or unavailable on the Service and we cannot guarantee
          the accuracy or completeness of any information found on the Service.
          We therefore reserve the right, but not the obligation to change or
          update information and to correct errors, inaccuracies, or omissions
          at any time without prior notice.
        </p>
        <h5>Purchases</h5>
        <p>
          If you wish to purchase any product or service made available through
          the Service ("Purchase"), you may be asked to supply certain
          information relevant to your Purchase including, without limitation,
          your credit card number, the expiration date of your credit card, your
          billing address, and your shipping information.
        </p>
        <h5>You represent and warrant that: </h5>
        <ol>
          <li>
            You have the legal right to use any credit card(s) or other payment
            method(s) in connection with any Purchase; and that
          </li>
          <li>
            the information you supply to us is true, correct and complete.
          </li>
        </ol>
        <p>
          The service may employ the use of third-party services for the purpose
          of facilitating payment and the completion of Purchases. By submitting
          your information, you grant us the right to provide the information to
          these third parties subject to our Privacy Policy.
        </p>
        <p>
          We reserve the right to refuse or cancel your order at any time for
          reasons including but not limited to: product or service availability,
          errors in the description or price of the product or service, error in
          your order or other reasons.
        </p>
        <p>
          We reserve the right to refuse or cancel your order if fraud or an
          unauthorized or illegal transaction is suspected.
        </p>
        <h5>Accounts</h5>
        <p>
          When you create an account with us, you guarantee that you are above
          the age of 18, and that the information you provide us is accurate,
          complete, and current always. Inaccurate, incomplete, or obsolete
          information may result in the immediate termination of your account on
          the Service.
        </p>
        <p>
          You shall not select or use as a username a name (i) of another person
          with the intent to impersonate that person; (ii) subject to any rights
          of a person other than you without appropriate authorization; or (iii)
          that is otherwise offensive, vulgar, or obscene. We reserve the right
          to refuse service, terminate accounts, remove or edit content, or
          cancel orders in our sole discretion. BY REGISTERING FOR AN ACCOUNT,
          YOU CONSENT TO RECEIVE PERSONALIZED EMAILS, TELEPHONE CALLS AND/OR
          FAXES FROM REYES & ELSAMAD REAL ESTATE GROUP LTD. You must always
          provide accurate, current and complete information to Reyes & Elsamad
          Real Estate Group, LTD for the Service. You must update such
          information in a timely manner to maintain its accuracy and
          completeness.
        </p>
        <h5>Intellectual Property</h5>
        <p>
          The Service and its original content (excluding Content provided by
          users), features and functionality are and will remain the exclusive
          property of Reyes & Elsamad Real Estate Group LTD and its licensors.
          The Service is protected by copyright, trademark, and other laws of
          both the United States and foreign countries. Our trademarks and trade
          dress may not be used in connection with any product or service
          without the prior written consent of Reyes & Elsamad Real Estate Group
          LTD.{' '}
        </p>
        <h5>Termination</h5>
        <p>
          We may terminate or suspend your account and bar access to the Service
          immediately, with or without notice or liability, under our sole
          discretion, for any reason whatsoever and without limitation,
          including but not limited to a breach of the Terms.
        </p>
        <p>
          If you wish to terminate your account, you may simply discontinue
          using the Service and or follow the instructions on the Site or
          through the Services. All provisions of the Terms which by their
          nature should survive termination shall survive termination,
          including, without limitation, ownership provisions, warranty
          disclaimers, indemnity and limitations of liability and arbitration.
          Any fees paid hereunder are non-refundable.{' '}
        </p>
        <h5>Indemnification</h5>
        <p>
          You agree to indemnify, defend and hold harmless Reyes & Elsamad Real
          Estate Group, LTD and its licenses and licensors, our affiliates,
          employees, contractors, agents, officers and directors, from any and
          all claims or damages, including attorney’s fees, arising out of or
          related to your use in connection to the Service. To the extent
          permitted by applicable law, Reyes & Elsamad Real Estate Group, LTD
          shall not be liable to you or any other third party for any direct,
          indirect, incidental, special, punitive or consequential damages
          arising out of your access to or use of or connection to the Service.
          Reyes & Elsamad Real Estate Group, LTD shall not be liable to you or
          any other third party for your inability to gain access to or use the
          Service.{' '}
        </p>
        <p>
          Even if Reyes & Elsamad Real Estate Group, LTD has been advised or
          notified of damages or potential damages, Reyes & Elsamad Real Estate
          Group, LTD shall not be liable for any of the foregoing or for any
          breach of any warranty. We do not assume any responsibility or
          liability or make any warranties or guarantees that any Content you
          access on or through the Services is or will continue to be accurate,
          safe, or legal. All Content and information are subject to errors,
          omissions, changes in price, prior sale or rental, or withdrawal
          without notice. No representation, warranty, covenant, or guarantee is
          made as to the accuracy of any description. All measurements and
          square footages are approximate and may not be relied upon by you. All
          information should be confirmed by you. We reserve the right to assume
          the exclusive defense and control of any matter otherwise subject to
          indemnification by you, in which event you will assist and cooperate
          with us in asserting any available defenses.
        </p>
        <h5>Limitation of Liability</h5>
        <h6>
          In no event shall Reyes & Elsamad Real Estate Group LTD nor its
          directors, employees, partners, agents, suppliers, or affiliates, be
          liable for any indirect, incidental, special, consequential or
          punitive damages, including without limitation, loss of profits, data,
          use, goodwill, or other intangible losses, resulting from
        </h6>
        <ol>
          <li>
            your access to or use of or inability to access or use the Service
          </li>
          <li>any conduct or content of any third party on the Service</li>
          <li> any content obtained from the Service; and</li>
          <li>
            unauthorized access, use or alteration of your transmissions or
            content, whether based on warranty, contract, tort (including
            negligence) or any other legal theory, whether or not we have been
            informed of the possibility of such damage, and even if a remedy set
            forth herein is found to have failed of its essential purpose.
          </li>
        </ol>
        <h5>Disclaimer</h5>
        <p>
          The services and content are provided “as is,” “as available,” and
          without warranty of any kind, express or implied, including, but not
          limited to, the implied warranties of title, non-infringement,
          merchantability and fitness for a particular purpose, and any
          warranties implied by any course of performance or usage of trade, all
          of which are expressly disclaimed. Reyes & elsamad real estate group
          ltd, its subsidiaries, affiliates, our directors, employees, agents,
          suppliers, partners, and content providers do not warrant that (I) the
          services will be secure or available at any particular time or
          location; (ii) any defects or errors will be corrected; (iii) any
          content or software available at or through the services is free of
          viruses or other harmful components; or (iv) the results of using the
          services will meet your requirements. Your use of the services is
          solely at your own risk. We do not warrant, endorse, guarantee, or
          assume responsibility for any listing, property, contract, content, or
          service advertised or offered by a third party through the services or
          any hyperlinked site or featured in any banner or other advertising,
          and we will not be a party to or in any way be responsible for
          monitoring any transaction between you and third party providers of
          listing information, properties, content, or services
        </p>
        <p>
          You acknowledge and agree that we (i) do not decide what price is
          appropriate for the Listing; (ii) do not guarantee the condition of
          any properties or the performance, adequacy, or completeness of
          inspections, services, products, or repairs; (iii) do not have any
          obligation to conduct any inspections whatsoever, including, without
          limitation, of common areas, offsite areas, or other aspects of the
          properties; (iv) have no responsibility for identifying defects with
          the property or inspecting public records or permits regarding title
          or use of the properties; (v) are not responsible for verifying square
          footage, representations of others, or information contained in any
          property reports, Listings, or promotional materials; and (vi) are not
          responsible for providing legal or tax advice regarding any
          transactions. Listings and related information provided from third
          parties are provided solely as a convenience, and Reyes & Elsamad Real
          Estate Group LTD has not reviewed or confirmed any information
          originating from sources other than Reyes & Elsamad Real Estate Group
          LTD.
        </p>
        <h5>Exclusions & Jurisdictions </h5>
        <p>
          Some jurisdictions do not allow the exclusion of certain warranties or
          the exclusion or limitation of liability for consequential or
          incidental damages, so the limitations above may not apply to you.
          Those who choose to access the Services from other locations do so on
          their own initiative and are responsible for compliance with local
          laws, if and to the extent local laws are applicable. You may not use
          or export the materials from the Services in violation of U.S. export
          laws and regulations. These Terms shall be governed by, construed and
          enforced in accordance with the laws of the State of New York, as they
          are applied to agreements entered and to be performed entirely within
          such State. Any action You, any third party or Reyes & Elsamad Real
          Estate Group brings to enforce these Terms, or in connection with any
          matters related to the Services, shall be brought only in either the
          state or Federal courts located in New York, NY and You expressly
          consent to the jurisdiction of said courts. YOU AGREE THAT ANY CAUSE
          OF ACTION ARISING OUT OF OR RELATED TO THE SERVICES OR US MUST
          COMMENCE WITHIN ONE (1) YEAR AFTER THE CAUSE OF ACTION ACCRUES.
          OTHERWISE, SUCH CAUSE OF ACTION IS PERMANENTLY BARRED.
        </p>
        <h5>Governing Law</h5>
        <p>
          These Terms shall be governed and construed in accordance with the
          laws of New York of the United States, without regard to its conflict
          of law provisions.
        </p>
        <p>
          Our failure to enforce any right or provision of these Terms will not
          be considered a waiver of those rights. If any provision of these
          Terms is held to be invalid or unenforceable by a court, the remaining
          provisions of these Terms will remain in effect. These Terms
          constitute the entire agreement between us regarding our Service and
          supersede and replace any prior agreements we might have had between
          us regarding the Service.
        </p>
        <h5>Changes</h5>
        <p>
          We reserve the right, at our sole discretion, to modify, suspend,
          limit, discontinue the Services or replace these Terms (including,
          without limitation, Reyes & Elsamad Real Estate Group’s Privacy
          Policy) at any time.By continuing to access or use our Service after
          any revisions become effective, you agree to be bound by the revised
          terms. If you do not agree to the new terms, you are no longer
          authorized to use the Service. It’s your responsibility to review
          these Terms of Service periodically for changes.{' '}
        </p>
        <p>
          <b>Agency</b> No agency, partnership, joint venture, or employment
          relationship is created as a result of these Terms of Service, and
          neither party has any authority of any kind to bind the other in any
          respect.
        </p>
        <p>
          <b>Agreement to Conduct Transactions Electronically.</b> All your
          transactions with or through the Site may, at our option, be conducted
          electronically from start to finish. If the law allows you to withdraw
          this consent or if we are ever required to deal with you
          non-electronically, we reserve the right to charge or increase fees
          and you agree to print or make an electronic copy of the Terms and any
          other contract or disclosure that we are required to provide to you.
        </p>
        <p>
          <b>Entire Agreement</b> These Terms comprise the entire agreement
          between you and Reyes & Elsamad Real Estate Group, LTD with respect to
          the use of the Site and supersede all contemporaneous and prior
          agreements between the parties regarding the subject matter contained
          herein.
        </p>
        <p>
          <b>Severance</b> If any part of the Terms is held by a court of
          competent jurisdiction to be invalid or unenforceable, the invalid or
          unenforceable part will be given effect to the greatest extent
          possible and the remainder will remain in full effect, provided that
          the allocation of risks described in these Terms is given effect to
          the fullest extent possible.
        </p>
        <p>
          <b>Third Party Rights</b> These Terms are for the sole benefit of
          Reyes & Elsamad Real Estate Group, LTD, our officers, directors,
          employees, affiliates and agents. No other person, including any user
          of the Site, shall have the right to assert a claim under these Terms.
        </p>
        <p>
          <b>Your Obligation to Stay Current</b> It is critical that you keep
          your email contact information correct and updated with Reyes &
          Elsamad Real Estate Group, LTD always. In addition, we encourage you
          to check back regularly to review these Terms.
        </p>
        <p>
          <b>Contact</b> If you have any questions, complaints, or claims with
          respect to the Services, you may contact us at Reyes & Elsamad Real
          Estate Group, 307 Knickerbocker Avenue, Brooklyn NY 11237{' '}
          <a href="mailto:admin@reyeselsamad.com">admin@reyeselsamad.com</a>{' '}
        </p>
        <p>
          <b>Broker Restrictions</b> Any real estate broker, salesperson, agent,
          or similar state licensed real estate professional (“Real Estate
          Agent”) who uses any Content for its customer must first enter into a
          co-brokerage agreement with Reyes & Elsamad Real Estate Group, LTD. We
          authorize the Real Estate Board of New York (“REBNY”) and/or REBNY
          Listing Service (“RLS”) brokers (and each of their duly authorized
          representatives) to access the Site for the purposes of verifying
          compliance with the provisions of these Terms, the Co-Brokerage
          Agreement between Reyes & Elsamad and REBNY, or any other applicable
          RLS rules or policies or any other multiple listing system or real
          estate board that Reyes & Elsamad Real Estate Group, LTD subscribes
          to. We reserve the right to deny or terminate access to any Real
          Estate Agent except to the extent such Real Estate Agent is accessing
          the Site for the foregoing purposes. No person, including any Real
          Estate Agent, may market or make commercial use of the Content in any
          way, including without limitation advertising our property listings,
          copying our Content for commercial use, or contacting our customers or
          the owners or sellers of any properties listed on the Site.
        </p>
        <h5>Effective: January 1, 2019</h5>
        <h2>NEW YORK CUSTOMERS:</h2>
        <h2>NEW YORK STATE DISCLOSURE FORM FOR BUYERS AND SELLERS</h2>
        <h6>THIS IS NOT A CONTRACT</h6>
        <p>
          New York State law requires real estate licensees who are acting as
          agents of buyers or sellers of property to advise the potential buyers
          or sellers with whom they work of the nature of their agency
          relationship and the rights and obligations it creates. This
          disclosure will help you to make informed choices about your
          relationship with the real estate broker and its sales agents.
        </p>
        <p>
          Throughout the transaction you may receive more than one disclosure
          form. The law may require each agent assisting in the transaction to
          present you with this disclosure form. A real estate agent is a person
          qualified to advise about real estate.
        </p>
        <p>
          If you need legal, tax or other advice, consult with a professional in
          that field.
        </p>
        <h5>DISCLOSURE REGARDING REAL ESTATE AGENCY RELATIONSHIPS</h5>
        <h6>SELLER'S AGENT</h6>
        <p>
          A seller’s agent is an agent who is engaged by a seller to represent
          the seller’s interests. The seller’s agent does this by securing a
          buyer for the seller’s home at a price and on terms acceptable to the
          seller. A seller’s agent has, without limitation, the following
          fiduciary duties to the seller: reasonable care, undivided loyalty,
          confidentiality, full disclosure, obedience and duty to account. A
          seller’s agent does not represent the interests of the buyer. The
          obligations of a seller’s agent are also subject to any specific
          provisions set forth in an agreement between the agent and the seller.
          In dealings with the buyer, a seller’s agent should (a) exercise
          reasonable skill and care in performance of the agent’s duties; (b)
          deal honestly, fairly and in good faith; and (c) disclose all facts
          known to the agent materially affecting the value or desirability of
          property, except as otherwise provided by law.
        </p>
        <h6>BUYER'S AGENT</h6>
        <p>
          A buyer’s agent is an agent who is engaged by a buyer to represent the
          buyer’s interests. The buyer’s agent does this by negotiating the
          purchase of a home at a price and on terms acceptable to the buyer. A
          buyer’s agent has, without limitation, the following fiduciary duties
          to the buyer: reasonable care, undivided loyalty, confidentiality,
          full disclosure, obedience and duty to account. A buyer’s agent does
          not represent the interest of the seller. The obligations of a buyer’s
          agent are also subject to any specific provisions set forth in an
          agreement between the agent and the buyer. In dealings with the
          seller, a buyer’s agent should (a) exercise reasonable skill and care
          in performance of the agent’s duties; (b) deal honestly, fairly and in
          good faith; and (c) disclose all facts known to the agent materially
          affecting the buyer’s ability and/or willingness to perform a contract
          to acquire seller’s property that are not inconsistent with the
          agent’s fiduciary duties to the buyer.
        </p>
        <h6>BROKER'S AGENT</h6>
        <p>
          A broker’s agent is an agent that cooperates or is engaged by a
          listing agent or a buyer’s agent (but does not work for the same firm
          as the listing agent or buyer’s agent) to assist the listing agent or
          buyer’s agent in locating a property to sell or buy, respectively, for
          the listing agent’s seller or the buyer agent’s buyer. The broker’s
          agent does not have a direct relationship with the buyer or seller and
          the buyer or seller cannot provide instructions or direction directly
          to the broker’s agent. The buyer and the seller therefore do not have
          vicarious liability for the acts of the broker’s agent. The listing
          agent or buyer’s agent do provide direction and instruction to the
          broker’s agent and therefore the listing agent or buyer’s agent will
          have liability for the acts of the broker’s agent.
        </p>
        <h6>DUAL AGENT</h6>
        <p>
          A real estate broker may represent both the buyer and seller if both
          the buyer and seller give their informed consent in writing. In such a
          dual agency situation, the agent will not be able to provide the full
          range of fiduciary duties to the buyer and seller. The obligations of
          an agent are also subject to any specific provisions set forth in an
          agreement between the agent, and the buyer and seller. An agent acting
          as a dual agent must explain carefully to both the buyer and seller
          that the agent is acting for the other party as well. The agent should
          also explain the possible effects of dual representation, including
          that by consenting to the dual agency relationship the buyer and
          seller are giving up their right to undivided loyalty. A buyer or
          seller should carefully consider the possible consequences of a dual
          agency relationship before agreeing to such representation. A seller
          or buyer may provide advance informed consent to dual agency by
          indicating the same on this form.
        </p>
        <h6>DUAL AGENT WITH DESIGNATED SALES AGENTS</h6>
        <p>
          If the buyer and seller provide their informed consent in writing, the
          principals and the real estate broker who represents both parties as a
          dual agent may designate a sales agent to represent the buyer and
          another sales agent to represent the seller to negotiate the purchase
          and sale of real estate. A sales agent works under the supervision of
          the real estate broker. With the informed consent of the buyer and the
          seller in writing, the designated sales agent for the buyer will
          function as the buyer’s agent representing the interests of and
          advocating on behalf of the buyer and the designated sales agent for
          the seller will function as the seller’s agent representing the
          interests of and advocating on behalf of the seller in the
          negotiations between the buyer and seller. A designated sales agent
          cannot provide the full range of fiduciary duties to the buyer or
          seller. The designated sales agent must explain that like the dual
          agent under whose supervision they function, they cannot provide
          undivided loyalty. A buyer or seller should carefully consider the
          possible consequences of a dual agency relationship with designated
          sales agents before agreeing to such representation. A seller or buyer
          may provide advance informed consent to dual agency with designated
          sales agents by indicating the same on this form.
        </p>
        <h6>
          This form was provided to me by Reyes & Elsamad Real Estate Group LTD,
          a licensed real estate broker acting in the interest of the:
        </h6>
        <ol>
          <li>Seller as a (check relationship below)</li>
          <li>Buyer as a (check relationship below)</li>
          <li>Seller's agent </li>
          <li>Buyer's agent</li>
          <li>Broker's agent</li>
          <li>Broker's agent</li>
          <li>Dual agent</li>
          <li>Dual agent with designated sales agent</li>
        </ol>
        <br />
        <p>
          If dual agent with designated sales agents is indicated above:
          ___________ is appointed to represent the buyer; and ______ is
          appointed to represent the seller in this transaction.{' '}
        </p>
        <p>Electronic signature of ( ) Buyer(s) and/or ( ) Seller(s)</p>
        <p>Electronic signature of ( ) Buyer(s) and/or ( ) Seller(s)</p>
        <a href="https://www.dos.ny.gov/forms/licensing/1736-a.pdf">
          <svg
            version="1.1"
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            viewBox="0 0 309.529 309.529"
            style={{ enableBackground: 'new 0 0 309.529 309.529' }}
          >
            <g>
              <path
                style={{ fill: '#E2574C' }}
                d="M179.728,251.279c0-39.586,32.096-71.682,71.682-71.682c6.698,0,13.173,0.995,19.329,2.716V86.711
                  L183.69,0H19.46C8.79,0,0.13,8.65,0.13,19.329v270.609c0,10.679,8.659,19.329,19.329,19.329h189.929
                  C191.441,296.239,179.728,275.161,179.728,251.279z"
              />
              <path
                style={{ fill: '#B53629' }}
                d="M270.46,86.981h-67.372c-10.67,0-19.329-8.659-19.329-19.329V0.193L270.46,86.981z"
              />
              <path
                style={{ fill: '#3DB39E' }}
                d="M251.41,193.553c32.028,0,57.988,25.969,57.988,57.988c0,32.009-25.959,57.988-57.988,57.988
                          c-32.009,0-57.988-25.978-57.988-57.988C193.422,219.522,219.401,193.553,251.41,193.553z"
              />
              <path
                style={{ fill: '#FFFFFF' }}
                d="M270.74,241.876h-9.665v-9.665c0-5.345-4.32-9.665-9.665-9.665c-5.345,0-9.665,4.32-9.665,9.665
                              v9.665h-9.665c-5.345,0-9.665,4.32-9.665,9.665c0,5.354,4.32,9.665,9.665,9.665h9.665v9.665c0,5.354,4.32,9.665,9.665,9.665
                              c5.344,0,9.665-4.31,9.665-9.665v-9.665h9.665c5.345,0,9.665-4.31,9.665-9.665C280.404,246.206,276.085,241.876,270.74,241.876z"
              />
              <path
                style={{ fill: '#FFFFFF' }}
                d="M198.235,146.544c3.238,0,4.823-2.822,4.823-5.557c0-2.832-1.653-5.567-4.823-5.567h-18.44
                                  c-3.605,0-5.615,2.986-5.615,6.282v45.317c0,4.04,2.3,6.282,5.412,6.282c3.093,0,5.403-2.242,5.403-6.282v-12.438h11.153
                                  c3.46,0,5.19-2.832,5.19-5.644c0-2.754-1.73-5.49-5.19-5.49h-11.153v-16.903C184.995,146.544,198.235,146.544,198.235,146.544z
                                  M135.908,135.42h-13.492c-3.663,0-6.263,2.513-6.263,6.243v45.395c0,4.629,3.74,6.079,6.417,6.079h14.159
                                  c16.758,0,27.824-11.027,27.824-28.047C164.545,147.095,154.126,135.42,135.908,135.42z M136.556,181.946h-8.225v-35.334h7.413
                                  c11.221,0,16.101,7.529,16.101,17.918C151.845,174.253,147.052,181.946,136.556,181.946z M87.131,135.42H73.765
                                  c-3.779,0-5.886,2.493-5.886,6.282v45.317c0,4.04,2.416,6.282,5.663,6.282s5.663-2.242,5.663-6.282v-13.231h8.379
                                  c10.341,0,18.875-7.326,18.875-19.107C106.46,143.152,98.226,135.42,87.131,135.42z M86.909,163.158h-7.703v-17.097h7.703
                                  c4.755,0,7.78,3.711,7.78,8.553C94.679,159.447,91.664,163.158,86.909,163.158z"
              />
            </g>
          </svg>
        </a>
        <h6>NEW YORK CUSTOMERS:</h6>
        <h5>NEW YORK STATE DISCLOSURE FORM FOR LANDLORD AND TENANT</h5>
        <h6>THIS IS NOT A CONTRACT</h6>
        <p>
          New York State law requires real estate licensees who are acting as
          agents of landlords and tenants of real property to advise the
          potential landlords and tenants with whom they work of the nature of
          their agency relationship and the rights and obligations it creates.
          This disclosure will help you to make informed choices about your
          relationship with the real estate broker and its sales agents.
        </p>
        <p>
          Throughout the transaction you may receive more than one disclosure
          form. The law may require each agent assisting in the transaction to
          present you with this disclosure form. A real estate agent is a person
          qualified to advise about real estate.
        </p>
        <p>
          If you need legal, tax or other advice, consult with a professional in
          that field.
        </p>
        <h6>DISCLOSURE REGARDING REAL ESTATE AGENCY RELATIONSHIPS</h6>
        <h6>LANDLORD'S AGENT</h6>
        <p>
          A landlord’s agent is an agent who is engaged by a landlord to
          represent the landlord’s interest. The landlord’s agent does this by
          securing a tenant for the landlord’s apartment or house at a rent and
          on terms acceptable to the landlord. A landlord’s agent has, without
          limitation, the following fiduciary duties to the landlord: reasonable
          care, undivided loyalty, confidentiality, full disclosure, obedience
          and duty to account. A landlord’s agent does not represent the
          interests of the tenant. The obligations of a landlord’s agent are
          also subject to any specific provisions set forth in an agreement
          between the agent and the landlord. In dealings with the tenant, a
          landlord’s agent should (a) exercise reasonable skill and care in
          performance of the agent’s duties; (b) deal honestly, fairly and in
          good faith; and (c) disclose all facts known to the agent materially
          affecting the value or desirability of property, except as otherwise
          provided by law.
        </p>
        <h6>TENANT'S AGENT</h6>
        <p>
          A tenant’s agent is an agent who is engaged by a tenant to represent
          the tenant’s interest. The tenant’s agent does this by negotiating the
          rental or lease of an apartment or house at a rent and on terms
          acceptable to the tenant. A tenant’s agent has, without limitation,
          the following fiduciary duties to the tenant: reasonable care,
          undivided loyalty, confidentiality, full disclosure, obedience and
          duty to account. A tenant’s agent does not represent the interest of
          the landlord. The obligations of a tenant’s agent are also subject to
          any specific provisions set forth in an agreement between the agent
          and the tenant. In dealings with the landlord, a tenant’s agent should
          (a) exercise reasonable skill and care in performance of the agent’s
          duties; (b) deal honestly, fairly and in good faith; and (c) disclose
          all facts known to the tenant’s ability and/or willingness to perform
          a contract to rent or lease landlord’s property that are not
          consistent with the agent’s fiduciary duties to the buyer.
        </p>
        <h6>BROKER'S AGENT</h6>
        <p>
          A broker’s agent is an agent that cooperates or is engaged by a
          listing agent or a tenant’s agent (but does not work for the same firm
          as the listing agent or tenant’s agent) to assist the listing agent or
          tenant’s agent in locating a property to rent or lease for the listing
          agent’s landlord or the tenant agent’s tenant. The broker’s agent does
          not have a direct relationship with the tenant or landlord and the
          tenant or landlord cannot provide instructions or direction directly
          to the broker’s agent. The tenant and the landlord therefore do not
          have vicarious liability for the acts of the broker’s agent. The
          listing agent or tenant’s agent do provide direction and instruction
          to the broker’s agent and therefore the listing agent or tenant’s
          agent will have liability for the acts of the broker’s agent.
        </p>
        <h6>DUAL AGENT</h6>
        <p>
          A real estate broker may represent both the tenant and the landlord if
          both the tenant and landlord give their informed consent in writing.
          In such a dual agency situation, the agent will not be able to provide
          the full range of fiduciary duties to the landlord and the tenant. The
          obligations of an agent are also subject to any specific provisions
          set forth in an agreement between the agent, and the tenant and
          landlord. An agent acting as a dual agent must explain carefully to
          both the landlord and tenant that the agent is acting for the other
          party as well. The agent should also explain the possible effects of
          dual representation, including that by consenting to the dual agency
          relationship the landlord and tenant are giving up their right to
          undivided loyalty. A landlord and tenant should carefully consider the
          possible consequences of a dual agency relationship before agreeing to
          such representation. A landlord or tenant may provide advance informed
          consent to dual agency by indicating the same on this form.
        </p>
        <h6>DUAL AGENT WITH DESIGNATED SALES AGENTS</h6>
        <p>
          If the tenant and the landlord provide their informed consent in
          writing, the principals and the real estate broker who represents both
          parties as a dual agent may designate a sales agent to represent the
          tenant and another sales agent to represent the landlord. A sales
          agent works under the supervision of the real estate broker. With the
          informed consent in writing of the tenant and the landlord, the
          designated sales agent for the tenant will function as the tenant’s
          agent representing the interests of and advocating on behalf of the
          tenant and the designated sales agent for the landlord will function
          as the landlord’s agent representing the interests of and advocating
          on behalf of the landlord in the negotiations between the tenant and
          the landlord. A designated sales agent cannot provide the full range
          of fiduciary duties to the landlord or tenant. The designated sales
          agent must explain that like the dual agent under whose supervision
          they function, they cannot provide undivided loyalty. A landlord or
          tenant should carefully consider the possible consequences of a dual
          agency relationship with designated sales agents before agreeing to
          such representation. A landlord or tenant may provide advance informed
          consent to dual agency with designated sales agents by indicating the
          same on this form.
        </p>
        <p>
          This form was provided to me by Reyes & Elsamad Real Estate Group LTD,
          a licensed real estate broker acting in the interest of the:
        </p>
        <ol>
          <li>Landlord as a (check relationship below)</li>
          <li>Tenant as a (check relationship below)</li>
          <li>Landlord’s agent </li>
          <li>Tenant’s agent</li>
          <li>Broker’s agent </li>
          <li>Broker's agent</li>
          <li>Dual agent</li>
          <li>Dual agent with designated sales agent</li>
        </ol>
        <p>
          If dual agent with designated sales agents is indicated above: _______
          is appointed to represent the tenant; and ______ is appointed to
          represent the seller in this transaction.
        </p>
        <p>I/We acknowledge receipt of a copy of this disclosure form:</p>
        <p>Electronic signature of ( ) Landlord(s) and/or ( ) Tenant(s)</p>
        <p>
          <a href="https://www.dos.ny.gov/forms/licensing/1735-f.pdf">
            <svg
              version="1.1"
              id="Layer_1"
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              viewBox="0 0 309.529 309.529"
              style={{ enableBackground: 'new 0 0 309.529 309.529' }}
            >
              <g>
                <path
                  style={{ fill: '#E2574C' }}
                  d="M179.728,251.279c0-39.586,32.096-71.682,71.682-71.682c6.698,0,13.173,0.995,19.329,2.716V86.711
                                          L183.69,0H19.46C8.79,0,0.13,8.65,0.13,19.329v270.609c0,10.679,8.659,19.329,19.329,19.329h189.929
                                          C191.441,296.239,179.728,275.161,179.728,251.279z"
                />
                <path
                  style={{ fill: '#B53629' }}
                  d="M270.46,86.981h-67.372c-10.67,0-19.329-8.659-19.329-19.329V0.193L270.46,86.981z"
                />
                <path
                  style={{ fill: '#3DB39E' }}
                  d="M251.41,193.553c32.028,0,57.988,25.969,57.988,57.988c0,32.009-25.959,57.988-57.988,57.988
                                                  c-32.009,0-57.988-25.978-57.988-57.988C193.422,219.522,219.401,193.553,251.41,193.553z"
                />
                <path
                  style={{ fill: '#FFFFFF' }}
                  d="M270.74,241.876h-9.665v-9.665c0-5.345-4.32-9.665-9.665-9.665c-5.345,0-9.665,4.32-9.665,9.665
                                                      v9.665h-9.665c-5.345,0-9.665,4.32-9.665,9.665c0,5.354,4.32,9.665,9.665,9.665h9.665v9.665c0,5.354,4.32,9.665,9.665,9.665
                                                      c5.344,0,9.665-4.31,9.665-9.665v-9.665h9.665c5.345,0,9.665-4.31,9.665-9.665C280.404,246.206,276.085,241.876,270.74,241.876z"
                />
                <path
                  style={{ fill: '#FFFFFF' }}
                  d="M198.235,146.544c3.238,0,4.823-2.822,4.823-5.557c0-2.832-1.653-5.567-4.823-5.567h-18.44
                                                          c-3.605,0-5.615,2.986-5.615,6.282v45.317c0,4.04,2.3,6.282,5.412,6.282c3.093,0,5.403-2.242,5.403-6.282v-12.438h11.153
                                                          c3.46,0,5.19-2.832,5.19-5.644c0-2.754-1.73-5.49-5.19-5.49h-11.153v-16.903C184.995,146.544,198.235,146.544,198.235,146.544z
                                                          M135.908,135.42h-13.492c-3.663,0-6.263,2.513-6.263,6.243v45.395c0,4.629,3.74,6.079,6.417,6.079h14.159
                                                          c16.758,0,27.824-11.027,27.824-28.047C164.545,147.095,154.126,135.42,135.908,135.42z M136.556,181.946h-8.225v-35.334h7.413
                                                          c11.221,0,16.101,7.529,16.101,17.918C151.845,174.253,147.052,181.946,136.556,181.946z M87.131,135.42H73.765
                                                          c-3.779,0-5.886,2.493-5.886,6.282v45.317c0,4.04,2.416,6.282,5.663,6.282s5.663-2.242,5.663-6.282v-13.231h8.379
                                                          c10.341,0,18.875-7.326,18.875-19.107C106.46,143.152,98.226,135.42,87.131,135.42z M86.909,163.158h-7.703v-17.097h7.703
                                                          c4.755,0,7.78,3.711,7.78,8.553C94.679,159.447,91.664,163.158,86.909,163.158z"
                />
              </g>
            </svg>
          </a>
        </p>
      </TermsPage>
    );
  }
}
