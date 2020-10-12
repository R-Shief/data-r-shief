/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/bibViz/bibVizClient.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/three/build/three.module.js":
/*!**************************************************!*\
  !*** ./node_modules/three/build/three.module.js ***!
  \**************************************************/
/*! exports provided: ACESFilmicToneMapping, AddEquation, AddOperation, AdditiveAnimationBlendMode, AdditiveBlending, AlphaFormat, AlwaysDepth, AlwaysStencilFunc, AmbientLight, AmbientLightProbe, AnimationClip, AnimationLoader, AnimationMixer, AnimationObjectGroup, AnimationUtils, ArcCurve, ArrayCamera, ArrowHelper, Audio, AudioAnalyser, AudioContext, AudioListener, AudioLoader, AxesHelper, AxisHelper, BackSide, BasicDepthPacking, BasicShadowMap, BinaryTextureLoader, Bone, BooleanKeyframeTrack, BoundingBoxHelper, Box2, Box3, Box3Helper, BoxBufferGeometry, BoxGeometry, BoxHelper, BufferAttribute, BufferGeometry, BufferGeometryLoader, ByteType, Cache, Camera, CameraHelper, CanvasRenderer, CanvasTexture, CatmullRomCurve3, CineonToneMapping, CircleBufferGeometry, CircleGeometry, ClampToEdgeWrapping, Clock, ClosedSplineCurve3, Color, ColorKeyframeTrack, CompressedTexture, CompressedTextureLoader, ConeBufferGeometry, ConeGeometry, CubeCamera, CubeGeometry, CubeReflectionMapping, CubeRefractionMapping, CubeTexture, CubeTextureLoader, CubeUVReflectionMapping, CubeUVRefractionMapping, CubicBezierCurve, CubicBezierCurve3, CubicInterpolant, CullFaceBack, CullFaceFront, CullFaceFrontBack, CullFaceNone, Curve, CurvePath, CustomBlending, CustomToneMapping, CylinderBufferGeometry, CylinderGeometry, Cylindrical, DataTexture, DataTexture2DArray, DataTexture3D, DataTextureLoader, DecrementStencilOp, DecrementWrapStencilOp, DefaultLoadingManager, DepthFormat, DepthStencilFormat, DepthTexture, DirectionalLight, DirectionalLightHelper, DirectionalLightShadow, DiscreteInterpolant, DodecahedronBufferGeometry, DodecahedronGeometry, DoubleSide, DstAlphaFactor, DstColorFactor, DynamicBufferAttribute, DynamicCopyUsage, DynamicDrawUsage, DynamicReadUsage, EdgesGeometry, EdgesHelper, EllipseCurve, EqualDepth, EqualStencilFunc, EquirectangularReflectionMapping, EquirectangularRefractionMapping, Euler, EventDispatcher, ExtrudeBufferGeometry, ExtrudeGeometry, Face3, Face4, FaceColors, FileLoader, FlatShading, Float32Attribute, Float32BufferAttribute, Float64Attribute, Float64BufferAttribute, FloatType, Fog, FogExp2, Font, FontLoader, FrontFaceDirectionCCW, FrontFaceDirectionCW, FrontSide, Frustum, GammaEncoding, Geometry, GeometryUtils, GreaterDepth, GreaterEqualDepth, GreaterEqualStencilFunc, GreaterStencilFunc, GridHelper, Group, HalfFloatType, HemisphereLight, HemisphereLightHelper, HemisphereLightProbe, IcosahedronBufferGeometry, IcosahedronGeometry, ImageBitmapLoader, ImageLoader, ImageUtils, ImmediateRenderObject, IncrementStencilOp, IncrementWrapStencilOp, InstancedBufferAttribute, InstancedBufferGeometry, InstancedInterleavedBuffer, InstancedMesh, Int16Attribute, Int16BufferAttribute, Int32Attribute, Int32BufferAttribute, Int8Attribute, Int8BufferAttribute, IntType, InterleavedBuffer, InterleavedBufferAttribute, Interpolant, InterpolateDiscrete, InterpolateLinear, InterpolateSmooth, InvertStencilOp, JSONLoader, KeepStencilOp, KeyframeTrack, LOD, LatheBufferGeometry, LatheGeometry, Layers, LensFlare, LessDepth, LessEqualDepth, LessEqualStencilFunc, LessStencilFunc, Light, LightProbe, LightShadow, Line, Line3, LineBasicMaterial, LineCurve, LineCurve3, LineDashedMaterial, LineLoop, LinePieces, LineSegments, LineStrip, LinearEncoding, LinearFilter, LinearInterpolant, LinearMipMapLinearFilter, LinearMipMapNearestFilter, LinearMipmapLinearFilter, LinearMipmapNearestFilter, LinearToneMapping, Loader, LoaderUtils, LoadingManager, LogLuvEncoding, LoopOnce, LoopPingPong, LoopRepeat, LuminanceAlphaFormat, LuminanceFormat, MOUSE, Material, MaterialLoader, Math, MathUtils, Matrix3, Matrix4, MaxEquation, Mesh, MeshBasicMaterial, MeshDepthMaterial, MeshDistanceMaterial, MeshFaceMaterial, MeshLambertMaterial, MeshMatcapMaterial, MeshNormalMaterial, MeshPhongMaterial, MeshPhysicalMaterial, MeshStandardMaterial, MeshToonMaterial, MinEquation, MirroredRepeatWrapping, MixOperation, MultiMaterial, MultiplyBlending, MultiplyOperation, NearestFilter, NearestMipMapLinearFilter, NearestMipMapNearestFilter, NearestMipmapLinearFilter, NearestMipmapNearestFilter, NeverDepth, NeverStencilFunc, NoBlending, NoColors, NoToneMapping, NormalAnimationBlendMode, NormalBlending, NotEqualDepth, NotEqualStencilFunc, NumberKeyframeTrack, Object3D, ObjectLoader, ObjectSpaceNormalMap, OctahedronBufferGeometry, OctahedronGeometry, OneFactor, OneMinusDstAlphaFactor, OneMinusDstColorFactor, OneMinusSrcAlphaFactor, OneMinusSrcColorFactor, OrthographicCamera, PCFShadowMap, PCFSoftShadowMap, PMREMGenerator, ParametricBufferGeometry, ParametricGeometry, Particle, ParticleBasicMaterial, ParticleSystem, ParticleSystemMaterial, Path, PerspectiveCamera, Plane, PlaneBufferGeometry, PlaneGeometry, PlaneHelper, PointCloud, PointCloudMaterial, PointLight, PointLightHelper, Points, PointsMaterial, PolarGridHelper, PolyhedronBufferGeometry, PolyhedronGeometry, PositionalAudio, PropertyBinding, PropertyMixer, QuadraticBezierCurve, QuadraticBezierCurve3, Quaternion, QuaternionKeyframeTrack, QuaternionLinearInterpolant, REVISION, RGBADepthPacking, RGBAFormat, RGBAIntegerFormat, RGBA_ASTC_10x10_Format, RGBA_ASTC_10x5_Format, RGBA_ASTC_10x6_Format, RGBA_ASTC_10x8_Format, RGBA_ASTC_12x10_Format, RGBA_ASTC_12x12_Format, RGBA_ASTC_4x4_Format, RGBA_ASTC_5x4_Format, RGBA_ASTC_5x5_Format, RGBA_ASTC_6x5_Format, RGBA_ASTC_6x6_Format, RGBA_ASTC_8x5_Format, RGBA_ASTC_8x6_Format, RGBA_ASTC_8x8_Format, RGBA_BPTC_Format, RGBA_ETC2_EAC_Format, RGBA_PVRTC_2BPPV1_Format, RGBA_PVRTC_4BPPV1_Format, RGBA_S3TC_DXT1_Format, RGBA_S3TC_DXT3_Format, RGBA_S3TC_DXT5_Format, RGBDEncoding, RGBEEncoding, RGBEFormat, RGBFormat, RGBIntegerFormat, RGBM16Encoding, RGBM7Encoding, RGB_ETC1_Format, RGB_ETC2_Format, RGB_PVRTC_2BPPV1_Format, RGB_PVRTC_4BPPV1_Format, RGB_S3TC_DXT1_Format, RGFormat, RGIntegerFormat, RawShaderMaterial, Ray, Raycaster, RectAreaLight, RedFormat, RedIntegerFormat, ReinhardToneMapping, RepeatWrapping, ReplaceStencilOp, ReverseSubtractEquation, RingBufferGeometry, RingGeometry, SRGB8_ALPHA8_ASTC_10x10_Format, SRGB8_ALPHA8_ASTC_10x5_Format, SRGB8_ALPHA8_ASTC_10x6_Format, SRGB8_ALPHA8_ASTC_10x8_Format, SRGB8_ALPHA8_ASTC_12x10_Format, SRGB8_ALPHA8_ASTC_12x12_Format, SRGB8_ALPHA8_ASTC_4x4_Format, SRGB8_ALPHA8_ASTC_5x4_Format, SRGB8_ALPHA8_ASTC_5x5_Format, SRGB8_ALPHA8_ASTC_6x5_Format, SRGB8_ALPHA8_ASTC_6x6_Format, SRGB8_ALPHA8_ASTC_8x5_Format, SRGB8_ALPHA8_ASTC_8x6_Format, SRGB8_ALPHA8_ASTC_8x8_Format, Scene, SceneUtils, ShaderChunk, ShaderLib, ShaderMaterial, ShadowMaterial, Shape, ShapeBufferGeometry, ShapeGeometry, ShapePath, ShapeUtils, ShortType, Skeleton, SkeletonHelper, SkinnedMesh, SmoothShading, Sphere, SphereBufferGeometry, SphereGeometry, Spherical, SphericalHarmonics3, Spline, SplineCurve, SplineCurve3, SpotLight, SpotLightHelper, SpotLightShadow, Sprite, SpriteMaterial, SrcAlphaFactor, SrcAlphaSaturateFactor, SrcColorFactor, StaticCopyUsage, StaticDrawUsage, StaticReadUsage, StereoCamera, StreamCopyUsage, StreamDrawUsage, StreamReadUsage, StringKeyframeTrack, SubtractEquation, SubtractiveBlending, TOUCH, TangentSpaceNormalMap, TetrahedronBufferGeometry, TetrahedronGeometry, TextBufferGeometry, TextGeometry, Texture, TextureLoader, TorusBufferGeometry, TorusGeometry, TorusKnotBufferGeometry, TorusKnotGeometry, Triangle, TriangleFanDrawMode, TriangleStripDrawMode, TrianglesDrawMode, TubeBufferGeometry, TubeGeometry, UVMapping, Uint16Attribute, Uint16BufferAttribute, Uint32Attribute, Uint32BufferAttribute, Uint8Attribute, Uint8BufferAttribute, Uint8ClampedAttribute, Uint8ClampedBufferAttribute, Uniform, UniformsLib, UniformsUtils, UnsignedByteType, UnsignedInt248Type, UnsignedIntType, UnsignedShort4444Type, UnsignedShort5551Type, UnsignedShort565Type, UnsignedShortType, VSMShadowMap, Vector2, Vector3, Vector4, VectorKeyframeTrack, Vertex, VertexColors, VideoTexture, WebGL1Renderer, WebGLCubeRenderTarget, WebGLMultisampleRenderTarget, WebGLRenderTarget, WebGLRenderTargetCube, WebGLRenderer, WebGLUtils, WireframeGeometry, WireframeHelper, WrapAroundEnding, XHRLoader, ZeroCurvatureEnding, ZeroFactor, ZeroSlopeEnding, ZeroStencilOp, sRGBEncoding */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

/***/ }),

/***/ "./src/bibViz/bibVizClient.js":
/*!************************************!*\
  !*** ./src/bibViz/bibVizClient.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var THREE = __webpack_require__(/*! three */ \"./node_modules/three/build/three.module.js\");\n\nvar Viz = __webpack_require__(/*! ./viz.js */ \"./src/bibViz/viz.js\");\n\nvar Control = __webpack_require__(/*! ./control.js */ \"./src/bibViz/control.js\");\n\nvar scene, camera, renderer;\nvar control = new Control();\nvar viz = new Viz();\nviz.loadData().then(function (result) {\n  init();\n  animate();\n});\n\nfunction init() {\n  scene = new THREE.Scene();\n  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);\n  camera.position.z = 5;\n  renderer = new THREE.WebGLRenderer({\n    antiaias: true,\n    alpha: true\n  });\n  renderer.setSize(window.innerWidth, window.innerHeight);\n  document.body.appendChild(renderer.domElement); // sliceGroup = viz.getSliceGroup();\n  // sliceGroup.position.x += 0.8;\n  // sliceGroup.position.y -= 0.8;\n  // scene.add(sliceGroup);\n  // position the structure\n\n  vizGroup = viz.getVizGroup();\n  vizGroup.position.z -= 500;\n  vizGroup.rotation.x -= 90 * (Math.PI / 180);\n  vizGroup.rotation.y -= 90 * (Math.PI / 180);\n  vizGroup.position.x -= 500;\n  vizGroup.position.y += 0;\n  scene.add(vizGroup);\n  control.bind({\n    ref: vizGroup.rotation,\n    key: 'z',\n    axis: 'y',\n    range_low: Math.PI * 2,\n    range_high: 0,\n    min: 0,\n    max: Math.PI * 2\n  });\n  control.bind({\n    ref: vizGroup.position,\n    key: 'x',\n    axis: 'x',\n    range_low: -300,\n    range_high: 300,\n    min: -300,\n    max: 300\n  });\n  control.bind({\n    axis: 'x',\n    range_low: 0,\n    range_high: 1,\n    overider: viz\n  });\n  window.addEventListener('resize', onWindowResize);\n} // event listeners\n\n\nfunction onWindowResize() {\n  camera.aspect = window.innerWidth / window.innerHeight;\n  camera.updateProjectionMatrix();\n  renderer.setSize(window.innerWidth, window.innerHeight);\n}\n\nfunction render() {\n  control.update();\n  renderer.render(scene, camera);\n} // animation loop\n\n\nvar animate = function animate() {\n  requestAnimationFrame(animate);\n  render();\n};\n\n//# sourceURL=webpack:///./src/bibViz/bibVizClient.js?");

/***/ }),

/***/ "./src/bibViz/control.js":
/*!*******************************!*\
  !*** ./src/bibViz/control.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nvar _require = __webpack_require__(/*! ./vizTools.js */ \"./src/bibViz/vizTools.js\"),\n    map_range = _require.map_range;\n\nvar Control = /*#__PURE__*/function () {\n  function Control() {\n    var _this = this;\n\n    _classCallCheck(this, Control);\n\n    this.binds = new Set();\n    this.mouse = {\n      x: undefined,\n      y: undefined\n    };\n    document.addEventListener('mousemove', function (event) {\n      _this.mouse.x = event.clientX / window.innerWidth * 2 - 1;\n      _this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;\n    }, false);\n  }\n\n  _createClass(Control, [{\n    key: \"bind\",\n    value: function bind(options) {\n      this.binds.add(Object.assign({\n        ref: null,\n        key: null,\n        axis: null,\n        range_low: 0,\n        range_high: 1,\n        min: 0,\n        max: 1,\n        overider: null\n      }, options));\n    }\n  }, {\n    key: \"update\",\n    value: function update() {\n      var _this2 = this;\n\n      this.binds.forEach(function (bind) {\n        re_ranged = Math.max(Math.min(map_range(_this2.mouse[bind.axis], -1, 1, bind.range_low, bind.range_high), bind.max), bind.min);\n\n        if (!bind.overider) {\n          bind.ref[bind.key] = re_ranged;\n        } else {\n          bind.overider.update(re_ranged);\n        }\n      });\n    }\n  }]);\n\n  return Control;\n}();\n\nmodule.exports = Control;\n\n//# sourceURL=webpack:///./src/bibViz/control.js?");

/***/ }),

/***/ "./src/bibViz/viz.js":
/*!***************************!*\
  !*** ./src/bibViz/viz.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nvar THREE = __webpack_require__(/*! three */ \"./node_modules/three/build/three.module.js\");\n\nvar vizTools = __webpack_require__(/*! ./vizTools.js */ \"./src/bibViz/vizTools.js\");\n\nvar Viz = /*#__PURE__*/function () {\n  function Viz() {\n    _classCallCheck(this, Viz);\n  }\n\n  _createClass(Viz, [{\n    key: \"loadData\",\n    value: function loadData() {\n      var _this = this;\n\n      return fetch('/data/bookParticles.json').then(function (response) {\n        return response.json();\n      }).then(function (bpData) {\n        years = bpData.years;\n        _this.years = years;\n      }).then(function (_) {\n        return fetch('/data/booksAndYears.json');\n      }).then(function (response) {\n        return response.json();\n      }).then(function (bAndYData) {\n        yearSlices = bAndYData.yearSlices;\n        books = bAndYData.books;\n        _this.books = books;\n        _this.yearSlices = yearSlices;\n      }).then(function (_) {\n        return fetch('/data/vizModel.json');\n      }).then(function (response) {\n        return response.json();\n      }).then(function (vizModel) {\n        vertices = new Float32Array(vizModel.vertices);\n        colors = new Float32Array(vizModel.colors);\n        _this.vertices = vertices;\n        _this.colors = colors; // create the material\n\n        _this.regularMaterial = new THREE.MeshBasicMaterial({\n          side: THREE.DoubleSide,\n          vertexColors: THREE.VertexColors\n        }); // create shit for race condition\n\n        _this.getVizGroup();\n\n        _this.getSliceGroup();\n      });\n    }\n  }, {\n    key: \"getVizBooks\",\n    value: function getVizBooks() {\n      if (typeof this.vizBooks == \"undefined\") {\n        this.vizBooks = new THREE.Group();\n\n        for (var i = 0; i < this.books.length; i++) {\n          // create an array of slices from the vertices typedArray\n          var bookVerts = new Float32Array();\n          var bookColors = new Float32Array();\n\n          for (var j = 0; j < this.books[i].bookParticleIdxs.length; j++) {\n            var start = this.books[i].bookParticleIdxs[j].bookParticleArrayBufferIdx;\n            bookVerts = vizTools.concatenate(Float32Array, bookVerts, this.vertices.slice(start, start + 18));\n            bookColors = vizTools.concatenate(Float32Array, bookColors, this.colors.slice(start, start + 18));\n          } // create the geometry\n\n\n          var bookGeometry = new THREE.BufferGeometry(); // attach the book TypedArray's to the geometry\n\n          bookGeometry.setAttribute('position', new THREE.BufferAttribute(bookVerts, 3));\n          bookGeometry.setAttribute('color', new THREE.BufferAttribute(bookColors, 3)); // create the mesh itself\n\n          var bookMesh = new THREE.Mesh(bookGeometry, this.regularMaterial);\n          this.vizBooks.add(bookMesh);\n        }\n      }\n\n      return this.vizBooks;\n    }\n  }, {\n    key: \"getVizYears\",\n    value: function getVizYears() {\n      if (typeof this.vizYears == \"undefined\") {\n        this.vizYears = new THREE.Group();\n\n        for (var i = 0; i < this.yearSlices.length; i++) {\n          var yearVerts = new Float32Array();\n          var yearColors = new Float32Array();\n\n          for (var j = 0; j < this.yearSlices[i].bookParticles.length; j++) {\n            var start = this.yearSlices[i].bookParticles[j].arrayBuffIdx;\n            yearVerts = vizTools.concatenate(Float32Array, yearVerts, this.vertices.slice(start, start + 18));\n            yearColors = vizTools.concatenate(Float32Array, yearColors, this.colors.slice(start, start + 18));\n          }\n\n          var yearGeometries = new THREE.BufferGeometry();\n          yearGeometries.setAttribute('position', new THREE.BufferAttribute(yearVerts, 3));\n          yearGeometries.setAttribute('color', new THREE.BufferAttribute(yearColors, 3));\n          var yearMesh = new THREE.Mesh(yearGeometries, this.regularMaterial);\n          this.vizYears.add(yearMesh);\n        }\n      }\n\n      return this.vizYears;\n    }\n  }, {\n    key: \"getVizGroup\",\n    value: function getVizGroup() {\n      if (typeof this.vizGroup == \"undefined\") {\n        this.vizGroup = new THREE.Group();\n        this.vizGroup.add(this.getVizBooks(this.books));\n        this.vizGroup.add(this.getVizYears(this.yearSlices));\n      }\n\n      return this.vizGroup;\n    }\n  }, {\n    key: \"getSliceGroup\",\n    value: function getSliceGroup() {\n      if (typeof this.sliceGroup == \"undefined\") {\n        // do the sliceShape\n        this.sliceGroup = new THREE.Group();\n        var yearIdx = this.years.length - 1; // get the latest year - this has the added benefit that we will always have enough groups to draw everything.\n\n        var yBPs = this.years[yearIdx].bookParticles;\n        var booksThisYear = yBPs.length;\n\n        for (var bpIdx = 0; bpIdx < booksThisYear; bpIdx++) {\n          var sliceVertices = new Float32Array(3 * 3);\n          var sliceColors = new Float32Array(3 * 3);\n          this.setBookParticleGeoArrays(sliceVertices, sliceColors, yearIdx, bpIdx);\n          var sliceGeometry = new THREE.BufferGeometry();\n          sliceGeometry.setAttribute('position', new THREE.BufferAttribute(sliceVertices, 3));\n          sliceGeometry.setAttribute('color', new THREE.BufferAttribute(sliceColors, 3));\n          var sliceShapeMesh = new THREE.Mesh(sliceGeometry, this.regularMaterial);\n          sliceShapeMesh.position.x -= 1;\n          sliceShapeMesh.position.y -= 1;\n          this.sliceGroup.add(sliceShapeMesh);\n        }\n      }\n\n      return this.sliceGroup;\n    }\n  }, {\n    key: \"setBookParticleGeoArrays\",\n    value: function setBookParticleGeoArrays(sliceVertices, sliceColors, yearIdx, i) {\n      var yBPs = this.years[yearIdx].bookParticles; // first point\n\n      sliceVertices[0] = yBPs[i].x / 242.70702 * 1;\n      sliceVertices[1] = yBPs[i].y / 242.70702 * 1;\n      sliceVertices[2] = 1; // second point\n\n      if (i + 1 >= yBPs.length) {\n        sliceVertices[3] = 0;\n        sliceVertices[4] = 0;\n        sliceVertices[5] = 1;\n      } else {\n        sliceVertices[3] = yBPs[i + 1].x / 242.70702 * 1;\n        sliceVertices[4] = yBPs[i + 1].y / 242.70702 * 1;\n        sliceVertices[5] = 1;\n      } // third point\n\n\n      sliceVertices[6] = 0;\n      sliceVertices[7] = 0;\n      sliceVertices[8] = 1; // now the colors\n\n      var r = (yBPs[i].colorInt >> 16 & 0xFF) / 255;\n      var g = (yBPs[i].colorInt >> 8 & 0xFF) / 255;\n      var b = (yBPs[i].colorInt & 0xFF) / 255;\n      sliceColors[0] = r;\n      sliceColors[1] = g;\n      sliceColors[2] = b;\n      sliceColors[3] = r;\n      sliceColors[4] = g;\n      sliceColors[5] = b;\n      sliceColors[6] = r;\n      sliceColors[7] = g;\n      sliceColors[8] = b;\n    }\n  }, {\n    key: \"update\",\n    value: function update(mouse) {\n      // console.log(this.years);\n      var highlightedYearIdx = Math.ceil(mouse * (this.years.length - 1)); // console.log(this.years[highlightedYearIdx]);\n\n      var yBPs = this.years[highlightedYearIdx].bookParticles;\n      var highlightedBPIdx = Math.ceil(mouse * (yBPs.length - 1));\n      var bookIdx = this.yearSlices[highlightedYearIdx].bookParticles[highlightedBPIdx].bookIdx; // book update\n\n      for (var i = 0; i < this.books.length; i++) {\n        var bookMesh = this.getVizBooks().children[i];\n        bookMesh.geometry.attributes.color.needsUpdate = true;\n      } // year update\n\n\n      for (var i = 0; i < this.years.length; i++) {\n        // big view\n        var yearMesh = this.getVizYears().children[i];\n        yearMesh.geometry.attributes.color.needsUpdate = true;\n      } // small view update\n\n\n      for (var i = 0; i < this.getSliceGroup().children.length; i++) {\n        if (i < yBPs.length) {\n          var sliceMesh = this.getSliceGroup().children[i];\n          sliceMesh.visible = true;\n          this.setBookParticleGeoArrays(sliceMesh.geometry.attributes.position.array, sliceMesh.geometry.attributes.color.array, highlightedYearIdx, i);\n          sliceMesh.geometry.setDrawRange(0, yBPs.length);\n          sliceMesh.geometry.attributes.position.needsUpdate = true;\n          sliceMesh.geometry.attributes.color.needsUpdate = true;\n          sliceMesh.geometry.computeBoundingSphere();\n        } else {\n          this.getSliceGroup().children[i].visible = false;\n        }\n      }\n    }\n  }]);\n\n  return Viz;\n}();\n\nmodule.exports = Viz;\n\n//# sourceURL=webpack:///./src/bibViz/viz.js?");

/***/ }),

/***/ "./src/bibViz/vizTools.js":
/*!********************************!*\
  !*** ./src/bibViz/vizTools.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = {\n  concatenate: function concatenate(resultConstructor) {\n    var totalLength = 0;\n\n    for (var _len = arguments.length, arrays = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {\n      arrays[_key - 1] = arguments[_key];\n    }\n\n    for (var _i = 0, _arrays = arrays; _i < _arrays.length; _i++) {\n      var arr = _arrays[_i];\n      totalLength += arr.length;\n    }\n\n    var result = new resultConstructor(totalLength);\n    var offset = 0;\n\n    for (var _i2 = 0, _arrays2 = arrays; _i2 < _arrays2.length; _i2++) {\n      var _arr = _arrays2[_i2];\n      result.set(_arr, offset);\n      offset += _arr.length;\n    }\n\n    return result;\n  },\n  map_range: function map_range(value, low1, high1, low2, high2) {\n    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);\n  }\n};\n\n//# sourceURL=webpack:///./src/bibViz/vizTools.js?");

/***/ })

/******/ });