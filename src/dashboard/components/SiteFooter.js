class SiteFooter extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return [
      <div key="contactAndSocials" className="d-flex justify-content-center" style={{backgroundColor: "#414141"}}>
        <div className="container-fluid d-flex py-3 align-items-center" style={{width: "980px", color: "white", fontSize: "14px"}}>
          <div><strong>
            <p className="mb-0">Laila Shereen Sakr</p>
            <p className="mb-0">Assistant Professor</p>
            <p className="mb-0">Department of Film and Media</p>
            <p className="mb-0">UC Santa Barbara</p>
            <p className="mb-0">Santa Barbara, CA 93106</p>
          </strong></div>
          <div className="ml-auto">
            <strong><p className="mb-1">laila at r-shief dot org</p></strong>
            <div className="d-flex justify-content-center">
              <a href="https://twitter.com/rshief" target="_blank"><img className="pl-1" src="icons/social/twitter_icon_wix.png" height="30px" /></a>
              <a href="https://facebook.com/RShief" target="_blank"><img className="pl-1" src="icons/social/facebookIcon.png" height="30px" /></a>
              <a href="https://github.com/R-Shief" target="_blank"><img className="pl-1" src="icons/social/github_mark_white.png" height="30px" /></a>
            </div>
          </div>
        </div>
      </div>,
      <div key="copyright" style={{backgroundColor: "white"}}>
        <div className="container-fluid" style={{width: "980px", fontSize: "13px", color: "#a0a09f"}}>
          <p className="my-3">© 2020 created by <u><a href="https://vjumamel.com" target="_blank" style={{color: "#a0a09f"}}>VJ Um Amel.</a></u> Developer - <u><a href="https://joshable.com" target="_blank" style={{color: "#a0a09f"}}>Josh Bevan</a></u></p>
        </div>
      </div>
    ];
  }
}

module.exports = SiteFooter;
