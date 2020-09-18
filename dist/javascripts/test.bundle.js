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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/javascripts/test.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/javascripts/dashboard/components/FilterBar.js":
/*!***********************************************************!*\
  !*** ./src/javascripts/dashboard/components/FilterBar.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("function _typeof(obj) { \"@babel/helpers - typeof\"; if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function\"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }\n\nfunction _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }\n\nfunction _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }\n\nfunction _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === \"object\" || typeof call === \"function\")) { return call; } return _assertThisInitialized(self); }\n\nfunction _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return self; }\n\nfunction _isNativeReflectConstruct() { if (typeof Reflect === \"undefined\" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === \"function\") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }\n\nfunction _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }\n\nvar SearchDropdown = __webpack_require__(/*! ./SearchDropdown.js */ \"./src/javascripts/dashboard/components/SearchDropdown.js\");\n\nvar Dropdown = /*#__PURE__*/function (_React$Component) {\n  _inherits(Dropdown, _React$Component);\n\n  var _super = _createSuper(Dropdown);\n\n  function Dropdown(props) {\n    _classCallCheck(this, Dropdown);\n\n    return _super.call(this, props);\n  }\n\n  _createClass(Dropdown, [{\n    key: \"render\",\n    value: function render() {\n      var _this = this;\n\n      return /*#__PURE__*/React.createElement(\"div\", {\n        className: \"input-group input-group-sm\"\n      }, /*#__PURE__*/React.createElement(\"div\", {\n        className: \"input-group-append\"\n      }, /*#__PURE__*/React.createElement(\"button\", {\n        className: \"btn btn-outline-secondary dropdown-toggle\",\n        type: \"button\",\n        id: \"languageMenuDropdownButton\",\n        \"data-toggle\": \"dropdown\",\n        \"aria-haspopup\": \"true\",\n        \"aria-expanded\": \"false\"\n      }, this.props.buttonLabel), /*#__PURE__*/React.createElement(\"div\", {\n        id: this.props.id,\n        className: \"dropdown-menu\",\n        \"aria-labelledby\": \"languageMenuDropdown\",\n        style: {\n          height: \"22rem\",\n          overflowY: \"scroll\"\n        }\n      }, this.props.dropdownData.map(function (_ref) {\n        var val = _ref.val,\n            label = _ref.label;\n\n        var checked = _this.props.defaultChecked.includes(val);\n\n        return /*#__PURE__*/React.createElement(\"div\", {\n          key: val,\n          className: \"form-check d-flex justify-content-start align-items-start pl-3\"\n        }, /*#__PURE__*/React.createElement(\"input\", {\n          className: \"form-check-input\",\n          type: \"checkbox\",\n          id: \"chk-\" + val,\n          value: val,\n          checked: checked\n        }), /*#__PURE__*/React.createElement(\"label\", {\n          className: \"form-check-label\",\n          \"for\": \"chk-\" + val\n        }, label));\n      }))));\n    }\n  }]);\n\n  return Dropdown;\n}(React.Component);\n\nvar DatePicker = /*#__PURE__*/function (_React$Component2) {\n  _inherits(DatePicker, _React$Component2);\n\n  var _super2 = _createSuper(DatePicker);\n\n  function DatePicker(props) {\n    var _this2;\n\n    _classCallCheck(this, DatePicker);\n\n    _this2 = _super2.call(this, props);\n    var months = ['Jan', 'Feb', 'Mar', 'Apr', \"May\", \"Jun\", \"Jul\", \"Aug\", \"Sep\", \"Oct\", \"Nov\", \"Dec\"];\n    _this2.state = {\n      value: \"\".concat(months[props.def.getMonth()], \", \").concat(props.def.getDate(), \" \").concat(props.def.getFullYear())\n    };\n    _this2.handleChange = _this2.handleChange.bind(_assertThisInitialized(_this2));\n    return _this2;\n  }\n\n  _createClass(DatePicker, [{\n    key: \"handleChange\",\n    value: function handleChange(e) {\n      this.setState({\n        value: e.target.value\n      });\n    }\n  }, {\n    key: \"render\",\n    value: function render() {\n      return /*#__PURE__*/React.createElement(\"input\", {\n        key: \"input\",\n        id: this.props.id,\n        className: \"form-control\",\n        type: \"text\",\n        onChange: this.handleChange,\n        value: this.state.value,\n        size: \"20\"\n      });\n    }\n  }]);\n\n  return DatePicker;\n}(React.Component);\n\nvar DateRangePicker = /*#__PURE__*/function (_React$Component3) {\n  _inherits(DateRangePicker, _React$Component3);\n\n  var _super3 = _createSuper(DateRangePicker);\n\n  function DateRangePicker(props) {\n    _classCallCheck(this, DateRangePicker);\n\n    return _super3.call(this, props);\n  }\n\n  _createClass(DateRangePicker, [{\n    key: \"render\",\n    value: function render() {\n      return /*#__PURE__*/React.createElement(\"div\", {\n        className: \"input-group input-group-sm input-daterange\",\n        \"data-date-format\": \"M d, yyyy\"\n      }, /*#__PURE__*/React.createElement(\"div\", {\n        key: \"from\",\n        className: \"input-group-prepend input-group-append\"\n      }, /*#__PURE__*/React.createElement(\"span\", {\n        className: \"input-group-text\"\n      }, \"from\")), /*#__PURE__*/React.createElement(DatePicker, {\n        id: \"from\",\n        def: new Date(this.props.fromDefault)\n      }), /*#__PURE__*/React.createElement(\"div\", {\n        key: \"to\",\n        className: \"input-group-prepend input-group-append\"\n      }, /*#__PURE__*/React.createElement(\"span\", {\n        className: \"input-group-text\"\n      }, \"to\")), /*#__PURE__*/React.createElement(DatePicker, {\n        id: \"to\",\n        def: new Date(this.props.toDefault)\n      }));\n    }\n  }]);\n\n  return DateRangePicker;\n}(React.Component);\n\nvar FilterBar = /*#__PURE__*/function (_React$Component4) {\n  _inherits(FilterBar, _React$Component4);\n\n  var _super4 = _createSuper(FilterBar);\n\n  function FilterBar(props) {\n    _classCallCheck(this, FilterBar);\n\n    return _super4.call(this, props);\n  }\n\n  _createClass(FilterBar, [{\n    key: \"render\",\n    value: function render() {\n      return /*#__PURE__*/React.createElement(\"nav\", {\n        id: \"filterBar\",\n        className: \"navbar pb-1\"\n      }, /*#__PURE__*/React.createElement(\"div\", {\n        className: \"mx-0 px-0 d-flex w-100\"\n      }, /*#__PURE__*/React.createElement(\"form\", {\n        className: \"form-inline w-100\"\n      }, /*#__PURE__*/React.createElement(\"div\", {\n        className: \"input-group input-group-sm w-100\"\n      }, /*#__PURE__*/React.createElement(\"div\", {\n        className: \"input-group-prepend\"\n      }, /*#__PURE__*/React.createElement(\"span\", {\n        className: \"input-group-text\"\n      }, /*#__PURE__*/React.createElement(\"img\", {\n        src: \"/icons/Twitter-Logos/Twitter_Logo_Rshiefcolor.svg\",\n        height: \"20px\"\n      }))), /*#__PURE__*/React.createElement(SearchDropdown, {\n        id: \"hashtags\",\n        placeholder: \"Hashtags\",\n        dropdownData: this.props.hashtagData\n      }), /*#__PURE__*/React.createElement(SearchDropdown, {\n        id: \"usernames\",\n        placeholder: \"Usernames\",\n        dropdownData: this.props.usernameData\n      }), /*#__PURE__*/React.createElement(DateRangePicker, {\n        fromDefault: this.props.fromDefault,\n        toDefault: this.props.toDefault\n      }), /*#__PURE__*/React.createElement(Dropdown, {\n        buttonLabel: \"languages\",\n        dropdownData: this.props.languagesData,\n        defaultChecked: this.props.defaultLanguages\n      }), /*#__PURE__*/React.createElement(\"div\", {\n        className: \"input-group-append\"\n      }, /*#__PURE__*/React.createElement(\"button\", {\n        id: \"filterGoButton\",\n        className: \"btn btn-secondary\",\n        type: \"button\",\n        disabled: true\n      }, /*#__PURE__*/React.createElement(\"img\", {\n        src: \"/icons/bootstrap-icons-1.0.0-alpha5/search.svg\"\n      })))))));\n    }\n  }]);\n\n  return FilterBar;\n}(React.Component);\n\nmodule.exports = FilterBar;\n\n//# sourceURL=webpack:///./src/javascripts/dashboard/components/FilterBar.js?");

/***/ }),

/***/ "./src/javascripts/dashboard/components/SearchDropdown.js":
/*!****************************************************************!*\
  !*** ./src/javascripts/dashboard/components/SearchDropdown.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("function _typeof(obj) { \"@babel/helpers - typeof\"; if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function\"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }\n\nfunction _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }\n\nfunction _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }\n\nfunction _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === \"object\" || typeof call === \"function\")) { return call; } return _assertThisInitialized(self); }\n\nfunction _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return self; }\n\nfunction _isNativeReflectConstruct() { if (typeof Reflect === \"undefined\" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === \"function\") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }\n\nfunction _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }\n\nvar SearchDropdown = /*#__PURE__*/function (_React$Component) {\n  _inherits(SearchDropdown, _React$Component);\n\n  var _super = _createSuper(SearchDropdown);\n\n  function SearchDropdown(props) {\n    var _this;\n\n    _classCallCheck(this, SearchDropdown);\n\n    _this = _super.call(this, props);\n    _this.state = {\n      value: ''\n    };\n    _this.dropdownId = props.id + \"Dropdown\";\n    _this.inputId = props.id + \"Text\";\n    _this.handleClickItem = _this.handleClickItem.bind(_assertThisInitialized(_this));\n    _this.handleValueChange = _this.handleValueChange.bind(_assertThisInitialized(_this));\n    _this.handleInputFocus = _this.handleInputFocus.bind(_assertThisInitialized(_this));\n    _this.handleInputBlur = _this.handleInputBlur.bind(_assertThisInitialized(_this));\n    return _this;\n  }\n\n  _createClass(SearchDropdown, [{\n    key: \"handleValueChange\",\n    value: function handleValueChange(e) {\n      this.setState({\n        value: e.target.value\n      });\n    }\n  }, {\n    key: \"handleClickItem\",\n    value: function handleClickItem(e) {\n      console.log(e.target.id);\n      this.setState({\n        value: e.target.id\n      });\n    }\n  }, {\n    key: \"handleInputFocus\",\n    value: function handleInputFocus(e) {\n      if (!$(this.dropdownId).hasClass(\"show\")) $(this.dropdownId).dropdown('toggle');\n    }\n  }, {\n    key: \"handleInputBlur\",\n    value: function handleInputBlur(e) {\n      if ($(this.dropdownId).hasClass(\"show\")) $(this.dropdownId).dropdown('toggle');\n    }\n  }, {\n    key: \"render\",\n    value: function render() {\n      var _this2 = this;\n\n      return [/*#__PURE__*/React.createElement(\"input\", {\n        key: \"input\",\n        className: \"form-control\",\n        id: this.inputId,\n        type: \"search\",\n        placeholder: this.props.placeholder,\n        size: \"20\",\n        onChange: this.handleValueChange,\n        onFocus: this.handleInputFocus,\n        onBlur: this.handleInputBlur,\n        value: this.state.value\n      }), /*#__PURE__*/React.createElement(\"div\", {\n        key: \"dropdown\",\n        className: \"input-group-prepend input-group-append\"\n      }, /*#__PURE__*/React.createElement(\"button\", {\n        className: \"btn btn-outline-secondary dropdown-toggle dropdown-toggle-split rounded-0\",\n        type: \"button\",\n        \"data-toggle\": \"dropdown\",\n        \"aria-haspopup\": \"true\",\n        \"aria-expanded\": \"false\"\n      }, /*#__PURE__*/React.createElement(\"span\", {\n        className: \"sr-only\"\n      }, \"Toggle Dropdown\")), /*#__PURE__*/React.createElement(\"div\", {\n        className: \"dropdown-menu\",\n        id: this.dropdownId,\n        style: {\n          minHeight: \"3rem\",\n          maxHeight: \"22rem\",\n          overflowY: \"scroll\"\n        }\n      }, this.props.dropdownData.filter(function (item) {\n        return item.includes(_this2.state.value);\n      }).map(function (item) {\n        var startIdx = item.indexOf(_this2.state.value, 1);\n        var endIdx = startIdx + _this2.state.value.length;\n        return /*#__PURE__*/React.createElement(\"a\", {\n          className: \"dropdown-item\",\n          key: item.substring(1),\n          id: item.substring(1),\n          onClick: _this2.handleClickItem\n        }, item.substring(1, startIdx), /*#__PURE__*/React.createElement(\"strong\", null, _this2.state.value), item.substring(endIdx));\n      })))];\n    }\n  }]);\n\n  return SearchDropdown;\n}(React.Component);\n\nmodule.exports = SearchDropdown;\n\n//# sourceURL=webpack:///./src/javascripts/dashboard/components/SearchDropdown.js?");

/***/ }),

/***/ "./src/javascripts/test.js":
/*!*********************************!*\
  !*** ./src/javascripts/test.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var FilterBar = __webpack_require__(/*! ./dashboard/components/FilterBar.js */ \"./src/javascripts/dashboard/components/FilterBar.js\");\n\nPromise.all([fetch('/data/hashTags.json').then(function (response) {\n  return response.json();\n}).then(function (data) {\n  return data.map(function (hashtag) {\n    return hashtag;\n  });\n}), fetch('/data/usernames.json').then(function (response) {\n  return response.json();\n}).then(function (data) {\n  return data.map(function (username) {\n    return \"@\" + username;\n  });\n}), fetch('/data/languages.json').then(function (response) {\n  return response.json();\n}).then(function (data) {\n  return data.map(function (language) {\n    return {\n      val: language[\"639-1\"],\n      label: language[\"ISO language name\"]\n    };\n  });\n})]).then(function (datum) {\n  return ReactDOM.render( /*#__PURE__*/React.createElement(FilterBar, {\n    hashtagData: datum[0],\n    usernameData: datum[1],\n    languagesData: datum[2],\n    fromDefault: \"2009-04-12\",\n    toDefault: \"2014-12-12\",\n    defaultLanguages: [\"en\", \"ar\"]\n  }), document.getElementById(\"root\"));\n}).then(function () {\n  return $('.input-daterange').datepicker();\n});\n\n//# sourceURL=webpack:///./src/javascripts/test.js?");

/***/ })

/******/ });