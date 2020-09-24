class OverviewModal extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    $("#overviewModal").modal({});
  }

  render() {
    return (
      <div className={"modal fade"} id="overviewModal" tabIndex="-1" role="dialog" aria-labelledby="shareModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-body">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">×</span>
              </button>
              <h4>The R-Shief Dashboard</h4>
              <p>Welcome to the <strong>R-Shief Dashboard</strong>, a collection of interactive data visualization tools.</p>
              <hr />
              <h4>How do I get started?</h4>
              <p>The R-Shief Dashboard is fully interactive. If you don't already know what you're looking for, click around or browse the hashtag or username dropdowns. The data is rich, good hunting!</p>
              <h4>How do I use these tools?</h4>
              <p>First use the <strong>filter bar</strong> to narrow your selection. You can find a complete list of avaiable hashtags or usernames under their respective dropdowns.</p>
              <p>Then select your <strong>view</strong>. If you're unsure which view to use, here is a table with descriptions and strengths.</p>
              <p>Finally, tweak your view's <strong>options</strong>. Some options are purely visual, while others will change which aspects of the data are scrutinized.</p>
              <hr />
              <h4>The Data</h4>
              <p>The data consists of <strong>87,707,630</strong> tweets in <strong>58</strong> languages recorded between <strong>March 2011</strong> and <strong>June 2013</strong> from hashtags relating to the <strong>Occupy Movements</strong> and the <strong>Arab Spring Uprisings</strong>. Samples of <strong>1,239</strong> hashtags were collected in total.</p>
              <p>This dashboard takes a <strong>random sample</strong> of the archive, which ensures that sample sizes N &gt; 1000 will be representative of the whole with high confidence</p>
              <p>And the random sample is taken <strong>deterministically</strong> (psuedorandomly), which ensures that the same filters will always sample the same tweets.</p>
              <hr />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

module.exports = OverviewModal;
