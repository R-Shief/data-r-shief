let THREE = require('three');
let Viz = require('./viz.js');
let Control = require('./control.js');

let scene, camera, renderer;
let control = new Control();
let viz = new Viz();

viz.loadData().then(result => {
  init();
  animate();
});

function init() {

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  camera.position.z = 5;

  renderer = new THREE.WebGLRenderer( {antiaias: true, alpha: true} );
  renderer.setSize( window.innerWidth, window.innerHeight );

  document.body.appendChild( renderer.domElement );

  // sliceGroup = viz.getSliceGroup();
  // sliceGroup.position.x += 0.8;
  // sliceGroup.position.y -= 0.8;
  // scene.add(sliceGroup);

  // position the structure
  vizGroup = viz.getVizGroup();
  vizGroup.position.z -= 500;
  vizGroup.rotation.x -= 90 * (Math.PI/180);
  vizGroup.rotation.y -= 90 * (Math.PI/180);
  vizGroup.position.x -= 500;
  vizGroup.position.y += 0;
  scene.add(vizGroup);

  control.bind({ref: vizGroup.rotation, key: 'z', axis: 'y', range_low: Math.PI*2, range_high: 0, min: 0, max: Math.PI*2});
  control.bind({ref: vizGroup.position, key: 'x', axis: 'x', range_low: -300, range_high: 300, min: -300, max: 300});
  control.bind({axis: 'x', range_low: 0, range_high: 1, overider: viz});

  window.addEventListener('resize', onWindowResize);
}

// event listeners
function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );

}

function render() {

    control.update();
    renderer.render( scene, camera );

}

// animation loop
var animate = function() {

    requestAnimationFrame( animate );
    render();

}
