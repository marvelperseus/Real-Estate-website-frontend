export default () => (
  <footer>
    <div class="cust-container">
      <div class="col-xs-12 col-sm-3 col-md-3">
        <h3 style={{ marginTop: '20px' }}>COMPANY</h3>
        <ul>
          <li>
            <a href="/about">About us</a>
          </li>
          <li>
            <a href="/our-team">Team</a>
          </li>
          <li>
            <a href="/agents">Our agents </a>
          </li>
          {/* <li>
            <a href="#">Services </a>
          </li> */}
        </ul>
      </div>
      <div class="col-xs-12 col-sm-3 col-md-3">
        <h3 style={{ marginTop: '20px' }}>EXTRAS</h3>
        <ul>
          {/* <li>
            <a href="#">Apply </a>
          </li> */}
          <li>
            <a href="/region">Listings</a>
          </li>
          <li>
            <a href="/careers">Careers </a>
          </li>
          {/* <li>
            <a href="#">Neighborhood Guides </a>
          </li> */}
        </ul>
      </div>
      <div class="col-xs-12 col-sm-3 col-md-3">
        <h3 style={{ marginTop: '20px' }}>SUPPORT</h3>
        <ul>
          <li>
            <a href="/contact">Contact Us </a>
          </li>
        </ul>
      </div>
      <div class="col-xs-12 col-sm-3 col-md-3">
        <h3 style={{ marginTop: '20px' }}>Follow Us On</h3>
        <ul class="social-icon">
          <li>
            <a href="https://www.instagram.com/reyeselsamad/">
              <i class="fa fa-instagram" aria-hidden="true" />
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div class="copy-right">
      <p>
        Copyright © 2019 Reyes & Elsamad. All Rights Reserved.{' '}
        <span>
          <a href="/terms-services">Terms & Conditions</a>
          <a href="/privacy">Privacy Policy</a>
        </span>{' '}
      </p>
    </div>
  </footer>
);
