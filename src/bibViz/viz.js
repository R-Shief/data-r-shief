let THREE = require('three');
let vizTools = require('./vizTools.js');

class Viz {

  loadData() {
    return fetch('/data/bookParticles.json')
      .then(response => response.json())
      .then(bpData => {
        ( {years} = bpData );
        this.years = years;
      })
      .then(_ => fetch('/data/booksAndYears.json'))
      .then(response => response.json())
      .then(bAndYData => {
        ( {yearSlices, books} = bAndYData );
        this.books = books;
        this.yearSlices = yearSlices;
      })
      .then(_ => fetch('/data/vizModel.json'))
      .then(response => response.json())
      .then(vizModel => {
        vertices = new Float32Array(vizModel.vertices);
        colors = new Float32Array(vizModel.colors);
        this.vertices = vertices;
        this.colors = colors;

        // create the material
        this.regularMaterial = new THREE.MeshBasicMaterial( { side: THREE.DoubleSide, vertexColors: THREE.VertexColors } );

        // create shit for race condition
        this.getVizGroup();
        this.getSliceGroup();
      });
  }

  getVizBooks() {
    if(typeof this.vizBooks == "undefined") {
      this.vizBooks = new THREE.Group();
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

          this.vizBooks.add( bookMesh );
      }
    }
    return this.vizBooks;
  }

  getVizYears() {
    if(typeof this.vizYears == "undefined"){
      this.vizYears = new THREE.Group();
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

          this.vizYears.add( yearMesh );
      }
    }
    return this.vizYears;
  }

  getVizGroup() {
    if(typeof this.vizGroup == "undefined"){
      this.vizGroup = new THREE.Group();
      this.vizGroup.add( this.getVizBooks(this.books) );
      this.vizGroup.add( this.getVizYears(this.yearSlices) );
    }
    return this.vizGroup;
  }

  getSliceGroup() {
    if (typeof this.sliceGroup == "undefined"){
      // do the sliceShape
      this.sliceGroup = new THREE.Group();
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

          this.sliceGroup.add( sliceShapeMesh );
      }
    }
    return this.sliceGroup;
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

  update(mouse) {
      // console.log(this.years);
      var highlightedYearIdx = Math.ceil(mouse * (this.years.length - 1));
      // console.log(this.years[highlightedYearIdx]);
      var yBPs = this.years[highlightedYearIdx].bookParticles;
      var highlightedBPIdx = Math.ceil(mouse * (yBPs.length - 1));
      var bookIdx = this.yearSlices[highlightedYearIdx].bookParticles[highlightedBPIdx].bookIdx;

      // book update
      for (var i = 0; i < this.books.length; i++){
          var bookMesh = this.getVizBooks().children[i];
          bookMesh.geometry.attributes.color.needsUpdate = true;
      }

      // year update
      for (var i = 0; i < this.years.length; i++){
          // big view
          var yearMesh = this.getVizYears().children[i];
          yearMesh.geometry.attributes.color.needsUpdate = true;
      }

      // small view update
      for (var i = 0; i < this.getSliceGroup().children.length; i++){
          if( i < yBPs.length ){
              var sliceMesh = this.getSliceGroup().children[i];

              sliceMesh.visible = true;
              this.setBookParticleGeoArrays(
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
              this.getSliceGroup().children[i].visible = false;
          }
      }
  }

}

module.exports = Viz;
