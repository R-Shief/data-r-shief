let THREE = require('three');
let vizTools = require('./vizTools.js');
let Viz = require('./viz.js');

let vizGroup, vizBooks, vizYears, sliceGroup;
let scene, camera, renderer;
let mouse = new THREE.Vector2();
let years, yearSlices, books;
let viz;

fetch('/data/bookParticles.json')
  .then(response => response.json())
  .then(bpData => {
    fetch('/data/booksAndYears.json')
      .then(response => response.json())
      .then(bAndYData => {
        fetch('/data/vizModel.json')
          .then(response => response.json())
          .then(vizModel => {

            ( {years} = bpData );
            ( {yearSlices, books} = bAndYData );
            vertices = new Float32Array(vizModel.vertices);
            colors = new Float32Array(vizModel.colors);
            viz = new Viz(years, books, yearSlices, vertices, colors);

            init();
            animate();

          })
      });
  });

function init() {

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  camera.position.z = 5;

  renderer = new THREE.WebGLRenderer( {antiaias: true} );
  renderer.setSize( window.innerWidth, window.innerHeight );

  document.body.appendChild( renderer.domElement );

  vizGroup = new THREE.Group();

  vizBooks = viz.getVizBooks(books);
  vizGroup.add(vizBooks);

  vizYears = viz.getVizYears(yearSlices);
  vizGroup.add(vizYears);

  sliceGroup = viz.getSliceGroup(years);
  scene.add(sliceGroup);

  // position the structure
  vizGroup.position.z -= 800;
  vizGroup.rotation.x -= 90 * (Math.PI/180);
  vizGroup.position.y += 250;
  scene.add(vizGroup);

  // Add event listeners
  document.addEventListener( 'mousemove', onMouseMove, false );
}

function update(mouseX, mouseY) {
    var highlightedYearIdx = Math.ceil(mouseY * (years.length - 1));
    var yBPs = years[highlightedYearIdx].bookParticles;
    var highlightedBPIdx = Math.ceil(mouseX * (yBPs.length - 1));
    var bookIdx = yearSlices[highlightedYearIdx].bookParticles[highlightedBPIdx].bookIdx;

    // book update
    for (var i = 0; i < books.length; i++){
        var bookMesh = vizBooks.children[i];
        bookMesh.geometry.attributes.color.needsUpdate = true;
    }

    // year update
    for (var i = 0; i < years.length; i++){
        // big view
        var yearMesh = vizYears.children[i];
        yearMesh.geometry.attributes.color.needsUpdate = true;
    }

    // small view update
    for (var i = 0; i < sliceGroup.children.length; i++){
        if( i < yBPs.length ){
            var sliceMesh = sliceGroup.children[i];

            sliceMesh.visible = true;
            viz.setBookParticleGeoArrays(
                sliceMesh.geometry.attributes.position.array,
                sliceMesh.geometry.attributes.color.array,
                highlightedYearIdx,
                i
            );
            sliceMesh.geometry.setDrawRange( 0, yBPs.length );
            sliceMesh.geometry.attributes.position.needsUpdate = true;
            sliceMesh.geometry.attributes.color.needsUpdate = true;
            sliceMesh.geometry.computeBoundingSphere();
        } else {
            sliceGroup.children[i].visible = false;
        }
    }
}

// event listeners
function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

function onMouseMove( event ) {

    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

// utilities
function map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

function render() {
    update(
        Math.max(Math.min(map_range(mouse.x, -1, 1, 0, 1), 1), 0),
        Math.max(Math.min(map_range(mouse.y, -1, 1, 0.5, 1.12), 1), 0)
    );

    vizGroup.rotation.z = Math.max(Math.min(map_range(mouse.x, -1, 1, Math.PI*2, 0), Math.PI*2), 0);

    renderer.render( scene, camera );
}

// animation loop
var animate = function() {
    requestAnimationFrame( animate );
    render();
}
