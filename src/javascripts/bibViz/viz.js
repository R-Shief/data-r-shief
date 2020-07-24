let THREE = require('three');
let vizTools = require('./vizTools.js');

class Viz {

  constructor(yrs, bks, yrSlcs, verts, cols) {
    // create the material
    this.regularMaterial = new THREE.MeshBasicMaterial( { side: THREE.DoubleSide, vertexColors: THREE.VertexColors } );
    this.years = yrs;
    this.books = bks;
    this.yearSlices = yrSlcs;
    this.vertices = verts;
    this.colors = cols;
  }

  getVizBooks() {
    vizBooks = new THREE.Group();
    for (var i = 0; i < this.books.length; i++) {
        // create an array of slices from the vertices typedArray
        var bookVerts = new Float32Array();
        var bookColors = new Float32Array();
        for (var j = 0; j < this.books[i].bookParticleIdxs.length; j++){
            var start = this.books[i].bookParticleIdxs[j].bookParticleArrayBufferIdx
            bookVerts = vizTools.concatenate( Float32Array, bookVerts, this.vertices.slice(start, start+18) );
            bookColors = vizTools.concatenate( Float32Array, bookColors, this.colors.slice(start, start+18) );
        }

        // create the geometry
        var bookGeometry = new THREE.BufferGeometry();

        // attach the book TypedArray's to the geometry
        bookGeometry.setAttribute( 'position', new THREE.BufferAttribute( bookVerts, 3) );
        bookGeometry.setAttribute( 'color', new THREE.BufferAttribute( bookColors, 3 ) );

        // create the mesh itself
        var bookMesh = new THREE.Mesh( bookGeometry, this.regularMaterial );

        vizBooks.add( bookMesh );
    }
    return vizBooks;
  }

  getVizYears() {
    vizYears = new THREE.Group();
    for (var i = 0; i < this.yearSlices.length; i++){
        var yearVerts = new Float32Array();
        var yearColors = new Float32Array();
        for (var j = 0; j < this.yearSlices[i].bookParticles.length; j++){
            var start = this.yearSlices[i].bookParticles[j].arrayBuffIdx;
            yearVerts = vizTools.concatenate( Float32Array, yearVerts, this.vertices.slice(start, start+18) );
            yearColors = vizTools.concatenate( Float32Array, yearColors, this.colors.slice(start, start+18) );
        }

        var yearGeometries = new THREE.BufferGeometry();

        yearGeometries.setAttribute( 'position', new THREE.BufferAttribute(yearVerts, 3) );
        yearGeometries.setAttribute( 'color', new THREE.BufferAttribute(yearColors, 3) );

        var yearMesh = new THREE.Mesh( yearGeometries, this.regularMaterial );

        vizYears.add( yearMesh );
    }
    return vizYears;
  }

  getSliceGroup() {
    // do the sliceShape
    sliceGroup = new THREE.Group();
    var yearIdx = this.years.length-1; // get the latest year - this has the added benefit that we will always have enough groups to draw everything.
    var yBPs = this.years[yearIdx].bookParticles;
    var booksThisYear = yBPs.length;
    for(var bpIdx = 0; bpIdx < booksThisYear; bpIdx++){

        var sliceVertices = new Float32Array(3 * 3);
        var sliceColors = new Float32Array(3 * 3);

        this.setBookParticleGeoArrays(sliceVertices, sliceColors, yearIdx, bpIdx);

        var sliceGeometry = new THREE.BufferGeometry();
        sliceGeometry.setAttribute( 'position', new THREE.BufferAttribute( sliceVertices, 3 ) );
        sliceGeometry.setAttribute( 'color', new THREE.BufferAttribute( sliceColors, 3 ) );

        var sliceShapeMesh = new THREE.Mesh( sliceGeometry, this.regularMaterial );
        sliceShapeMesh.position.x -= 1;
        sliceShapeMesh.position.y -= 1;

        sliceGroup.add( sliceShapeMesh );
    }
    return sliceGroup;
  }

  setBookParticleGeoArrays(sliceVertices, sliceColors, yearIdx, i) {
      var yBPs = this.years[yearIdx].bookParticles;
      // first point
      sliceVertices[0] = yBPs[i].x / 242.70702 * 1;
      sliceVertices[1] = yBPs[i].y / 242.70702 * 1;
      sliceVertices[2] = 1;
      // second point
      if (i+1 >= yBPs.length) {
          sliceVertices[3] = 0;
          sliceVertices[4] = 0;
          sliceVertices[5] = 1;
      } else {
          sliceVertices[3] = yBPs[i+1].x / 242.70702 * 1;
          sliceVertices[4] = yBPs[i+1].y / 242.70702 * 1;
          sliceVertices[5] = 1;
      }
      // third point
      sliceVertices[6] = 0;
      sliceVertices[7] = 0;
      sliceVertices[8] = 1;

      // now the colors
      var r = ((yBPs[i].colorInt >> 16) & 0xFF) / 255;
      var g = ((yBPs[i].colorInt >> 8) & 0xFF) / 255;
      var b = (yBPs[i].colorInt & 0xFF) / 255;
      sliceColors[0] = r;
      sliceColors[1] = g;
      sliceColors[2] = b;

      sliceColors[3] = r;
      sliceColors[4] = g;
      sliceColors[5] = b;

      sliceColors[6] = r;
      sliceColors[7] = g;
      sliceColors[8] = b;
  }

}

module.exports = Viz;
