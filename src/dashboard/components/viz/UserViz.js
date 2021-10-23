let Viz = require('./Viz.js');

class UserViz extends Viz {
  constructor(props) {
    super(props);

    this.strategyFamilies = {
      parler: {
        uriExtension: 'parlerUsers'
      },
      twitter: {
        uriExtension: 'twitterUsers'
      }
    };

    this.state = {
      strategyFamily: "twitter",
      width: props.bounds.width,
      height: props.bounds.height
    };

    this.fetchExtension = props.fetcher;
    this.margin = {top: 0, right: 20, bottom: 70, left: 20};
    this.uriExtension = () => this.strategyFamilies[this.state.strategyFamily].uriExtension;

    this.props.onLoadChange({id: "userviz", isLoading: false});

    this.graphDivRef = React.createRef();
    this.graphInfoRef = React.createRef();

    this.getGraphDataSets = this.getGraphDataSets.bind(this);
  }

  getGraphDataSets() {

      const loadMiserables = function(Graph) {
          Graph
              //.cooldownTicks(200)
              //.nodeLabel('id')
              .nodeThreeObject(node => {
                  const nsprite = new SpriteText(node.id);
                  nsprite.material.depthWrite = false; // make sprite background transparent
                  //nsprite.color = node.color;
                  return nsprite;
                })
              .linkWidth(2)
              .linkDirectionalArrowLength(3.5)
              .linkDirectionalArrowRelPos(1)
              .linkCurvature(0.25)
              .linkLabel('text')
              //.nodeAutoColorBy('group')
              .forceEngine('ngraph')
              .jsonUrl('../data/tweet_net2.json')
              Graph.enableNodeDrag(false)
              Graph.d3Force('charge').strength(-120)

      };
      loadMiserables.description = "Twitter User Network";

      //

      const loadBlocks = function(Graph) {
          Graph
              //.cooldownTicks(200)
              .nodeThreeObject(node => {
                  const nsprite = new SpriteText(node.id);
                  nsprite.material.depthWrite = false; // make sprite background transparent
                  nsprite.color = node.verified;
                  nsprite.textHeight = 3.5
                  return nsprite;
                })
              //.nodeLabel('id')
              //.nodeAutoColorBy('group')

              .linkLabel('text')
              .linkDirectionalArrowLength(5.5)
              .linkDirectionalArrowRelPos(1)
              .linkDirectionalParticles(10)
              .linkDirectionalParticleSpeed(d => d.likes * 0.0001)
              .linkCurvature(0.25)
              .forceEngine('ngraph')
              .jsonUrl('../data/parler_net2.json')
              Graph.enableNodeDrag(false)
              Graph.d3Force('charge').strength(-450)

      };
      let blue = "Blue";
      blue = blue.fontcolor("blue")

      let red= "Red";
      red = red.fontcolor("red")

      loadBlocks.description = "Parler User Network.<br><u><b>Legend</b></u><br>"+blue+":verified user<br>"+red+":verified users<br><br>";

      //

      return [loadMiserables, loadBlocks];
  }

  componentDidMount() {
    console.log(this.graphDivRef.current);
    const Graph = ForceGraph3D()
      (this.graphDivRef.current);

    let curDataSetIdx;
    const dataSets = this.getGraphDataSets();

    let toggleData;
    (toggleData = function() {
      curDataSetIdx = curDataSetIdx === undefined ? 0 : (curDataSetIdx+1)%dataSets.length;
      const dataSet = dataSets[curDataSetIdx];

      Graph.resetProps(); // Wipe current state
      dataSet(Graph); // Load data set

      console.log(document.getElementById('graph-data-description'));
      document.getElementById('graph-data-description').innerHTML = dataSet.description ? `Viewing ${dataSet.description}` : '';
    })(); // IIFE init
  }


  render() {
    return (
      <React.Fragment>
        <div id="3d-graph" ref={this.graphDivRef} style={{maxHeight: "500px"}}></div>
        <div id="graph-data">
          <span ref={this.graphInfoRef} id="graph-data-description"></span>
          <button class="toggle-data-btn" onClick="toggleData()">Show me something else</button>
        </div>
      </React.Fragment>
    );
  }
}

// viewBox={`0 0 ${this.state.width} ${this.state.height}`}

UserViz.info = {
  id: "userviz",
  name: "Users"
};

module.exports = UserViz;
