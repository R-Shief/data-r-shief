let ClipboardJS = require('clipboard');
let OverviewModal = require('./OverviewModal.js');

class ShareModal extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let clipboard = new ClipboardJS('.clippable');
  }

  render() {
    const ShareEmbed = (props) => (
      <div className="input-group input-group-sm mb-2">
        <div className="input-group-prepend">
          <span className="input-group-text">
            <img src="icons/bootstrap-icons-1.0.0-alpha5/code.svg" />
          </span>
        </div>
        <textarea id="shareembed" className="form-control" rows="3" readOnly size="30" defaultValue={`<iframe frameborder="0" src="${props.url}"></iframe>`} />
        <div className="input-group-append">
          <button className="btn clippable btn-outline-secondary" data-clipboard-target="#shareembed">
            Copy
          </button>
        </div>
      </div>
    )

    const ShareLink = (props) => (
      <div className="input-group input-group-sm">
        <div className="input-group-prepend">
          <span className="input-group-text">
            <img src="icons/bootstrap-icons-1.0.0-alpha5/link-45deg.svg" />
          </span>
        </div>
        <input id="sharelink" className="form-control" type="text" readOnly value={props.url} size="30" />
        <div className="input-group-append">
          <button className="btn clippable btn-outline-secondary" data-clipboard-target="#sharelink">
            Copy
          </button>
        </div>
      </div>
    )

    return (
      <div className="modal fade" id="shareModal" tabIndex="-1" role="dialog" aria-labelledby="shareModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header py-2">
              <h5 className="modal-title" id="shareModalLabel">Share</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <ShareEmbed url={this.props.url} />
              <ShareLink url={this.props.url} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class InfoBar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return [
      <div key="infobar" className="card">
        <div className="card-body d-flex align-items-center px-0 pl-3 py-0">
          <p className="my-0">
            Using <strong>{this.props.sampleCount.toLocaleString()}</strong> filtered samples taken <strong>{this.props.sampleMethod}</strong> (<strong>{(this.props.sampleCount / this.props.totalCount).toLocaleString('en-US', {style: "percent", minimumFractionDigits: 4})}</strong>)
          </p>
          <div className="btn-group ml-auto" role="group" aria-label="Info Buttons">
            <button type="button" className="btn btn-sm btn-outline-secondary" data-toggle="modal" data-target="#shareModal">
              <img src="icons/bootstrap-icons-1.0.0-alpha5/share-fill.svg" />
            </button>
            <button type="button" className="btn btn-sm btn-outline-secondary" data-toggle="modal" data-target="#overviewModal">
              <img src="icons/bootstrap-icons-1.0.0-alpha5/info.svg" />
            </button>
          </div>
        </div>
      </div>,
      <ShareModal key="shareModal" url={this.props.getUrl()} />,
      <OverviewModal key="overviewModal" />
    ];
  }
}

// Using <strong>{this.props.sampleCount.toLocaleString()}</strong> samples taken <strong>{this.props.sampleMethod}</strong> from <strong>{this.props.totalCount.toLocaleString()}</strong> tweets

module.exports = InfoBar;
