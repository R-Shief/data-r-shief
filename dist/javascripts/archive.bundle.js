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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/javascripts/archiveClient.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/javascripts/archiveClient.js":
/*!******************************************!*\
  !*** ./src/javascripts/archiveClient.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }\n\nfunction _nonIterableSpread() { throw new TypeError(\"Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.\"); }\n\nfunction _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === \"string\") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === \"Object\" && o.constructor) n = o.constructor.name; if (n === \"Map\" || n === \"Set\") return Array.from(o); if (n === \"Arguments\" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }\n\nfunction _iterableToArray(iter) { if (typeof Symbol !== \"undefined\" && Symbol.iterator in Object(iter)) return Array.from(iter); }\n\nfunction _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }\n\nfunction _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }\n\nwindow.onload = function () {\n  //filterHandler.updateView();\n  filterHandler.loadHashTags();\n};\n\ndocument.getElementById('keywords-region').onkeypress = function () {\n  var pressed = event.key;\n\n  if (pressed == \"Enter\") {\n    filterHandler.addKey();\n  }\n};\n\nvar filterHandler = {\n  filters: {\n    keywords: new Set([]),\n    page: 0,\n    langList: new Set(['en']),\n    between: {\n      start: \"1998-01-01\",\n      end: \"2015-01-01\"\n    }\n  },\n  ka: document.getElementById('keyAdd'),\n  kr: document.getElementById('keywords-region'),\n  hashTags: [],\n  loadHashTags: function loadHashTags() {\n    var url = \"/data/hashTags.json\";\n    var xhttp = new XMLHttpRequest();\n    var scope = this;\n\n    xhttp.onreadystatechange = function () {\n      if (this.readyState == 4 && this.status == 200) {\n        //console.log(this.responseText);\n        scope.hashTags = JSON.parse(this.responseText).ht;\n      }\n    }; // shoot off the xhttp get request.\n\n\n    xhttp.open(\"GET\", url, true);\n    xhttp.send();\n  },\n  showPossibleTags: function showPossibleTags(str) {\n    if (str.length > 0) {\n      //&& str.substring(0,1)=='#') {\n      var u = document.getElementById('suggestions');\n\n      if (u == null) {\n        u = document.createElement('ul');\n        u.classList.add('list-group');\n        u.id = 'suggestions';\n        u.style.height = '6em';\n        u.style.overflowY = 'scroll';\n        u.style.overflowX = 'hidden';\n      }\n\n      u.textContent = '';\n\n      for (var i = 0; i < this.hashTags.length; i++) {\n        if (this.hashTags[i].includes(str)) {\n          var l = document.createElement('li');\n          l.classList.add('list-group-item');\n          var a = document.createElement('a');\n          a.setAttribute('href', '#');\n          a.setAttribute('onclick', 'filterHandler.useSuggestion(this.innerHTML)');\n          a.innerHTML = this.hashTags[i];\n          l.appendChild(a);\n          u.appendChild(l);\n        }\n      }\n\n      this.kr.insertBefore(u, this.kr.childNodes[2]);\n    } else {\n      if (document.getElementById('suggestions') != null) {\n        this.kr.removeChild(document.getElementById('suggestions'));\n      }\n    }\n  },\n  useSuggestion: function useSuggestion(str) {\n    document.getElementById('keyAdd-Text').value = str;\n    this.addKey();\n    this.kr.removeChild(document.getElementById('suggestions'));\n  },\n  // handles the keywords box\n  nextKeyID: 2,\n  addKey: function addKey() {\n    var textBarValue = document.getElementById(\"keyAdd-Text\");\n    var adds = textBarValue.value.split(\",\");\n    textBarValue.value = \"\";\n\n    if (adds[0] != \"\" || adds.length > 1) {\n      for (var i = 0; i < adds.length; i++) {\n        var l = document.createElement(\"li\");\n        l.classList.add(\"list-group-item\");\n        l.classList.add(\"active\");\n        l.id = this.nextKeyID++;\n        l.setAttribute(\"data-toggle\", \"button\");\n        l.setAttribute(\"onclick\", 'filterHandler.toggleKey(this.id)');\n        l.innerHTML = adds[i] + \" <a href='#' onclick='filterHandler.deleteKey(this.parentNode.id)'><span class='badge badge-danger'><span class='fa fa-times'></span></span></a>\";\n        this.kr.appendChild(l);\n        this.filters.keywords.add(adds[i]);\n      }\n\n      filterHandler.updateView();\n    }\n  },\n  toggleKey: function toggleKey(toggleID) {\n    var toBeToggled = document.getElementById(toggleID);\n\n    if (toBeToggled) {\n      toBeToggled.classList.toggle(\"active\");\n      var key = toBeToggled.innerHTML;\n\n      if (this.filters.keywords.includes(key)) {\n        this.filters.keywords[\"delete\"](key);\n      } else {\n        this.filters.keywords.add(key);\n      }\n    }\n  },\n  deleteKey: function deleteKey(deleteID) {\n    var keyElem = document.getElementById(deleteID);\n    this.filters.keywords[\"delete\"](keyElem.innerHTML);\n    keyElem.remove();\n  },\n  // handles pagination\n  nResults: 0,\n  previousPage: function previousPage() {\n    if (this.filters.page > 0) {\n      this.filters.page--;\n      this.refreshPaginationInfo();\n      this.updateView(false);\n    }\n  },\n  nextPage: function nextPage() {\n    if (this.nResults == 50) {\n      this.filters.page++;\n      this.refreshPaginationInfo();\n      this.updateView(false);\n    }\n  },\n  refreshPaginationInfo: function refreshPaginationInfo() {\n    //var pStart = this.filters.page*50 + 1;\n    //var pEnd = Math.min(pStart+49, this.nResults);\n    document.getElementById('pagination').innerHTML = filterHandler.filters.page + 1;\n  },\n  // handles language filter\n  possibleLangs: ['fr', 'en', 'es', 'it', 'el', 'de', 'sv', 'no', 'nl', 'pt', 'in', 'pl', 'ru', 'tr', 'ko', 'hu', 'vi', 'da', 'ar', 'lt', 'iw', 'id', 'tl'],\n  setLang: function setLang(lang) {\n    if (document.getElementById(lang).checked) {\n      this.filters.langList.add(lang);\n    } else {\n      this.filters.langList[\"delete\"](lang);\n    }\n  },\n  // handles dates filter\n  dateHandler: {\n    defaults: [\"1998-01-01\", \"2015-01-01\"],\n    setStart: function setStart(date) {\n      console.log(\"foostart\", date);\n\n      if (date == '') {\n        filterHandler.filters.between.start = this.defaults[0];\n      } else {\n        filterHandler.filters.between.start = date;\n      }\n\n      filterHandler.updateView();\n    },\n    setEnd: function setEnd(date) {\n      console.log(\"fooend\", date);\n\n      if (date == '') {\n        filterHandler.filters.between.end = this.defaults[1];\n      } else {\n        filterHandler.filters.between.end = date;\n      }\n\n      filterHandler.updateView();\n    }\n  },\n  // handles updating the database view\n  updateView: function updateView() {\n    var resetPage = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;\n    var url = [\"/archive\", _toConsumableArray(this.filters.langList), this.filters.between.start, this.filters.between.end, this.filters.keywords.length > 0 ? _toConsumableArray(this.filters.keywords).join(\"&\") : \"NoKeywords\", this.filters.page].join(\"/\");\n    var dbRequest = new XMLHttpRequest();\n\n    dbRequest.onreadystatechange = function () {\n      if (this.readyState == 4 && this.status == 200) {\n        var response = this.responseText;\n        document.getElementById(\"content\").innerHTML = response;\n        filterHandler.nResults = 0;\n\n        if (resetPage) {\n          filterHandler.filters.page = 0;\n          filterHandler.refreshPaginationInfo();\n        }\n      }\n    };\n\n    dbRequest.open(\"GET\", url, true);\n    dbRequest.setRequestHeader(\"content-type\", \"application/json;charset=UTF-8\");\n    dbRequest.send();\n    window.history.pushState({}, \"\", url);\n  },\n  addUserFilter: function addUserFilter(user) {\n    document.getElementById(\"keyword-add-text\").value += user;\n    keywordsBoxHandler.addItem();\n  }\n};\n\n//# sourceURL=webpack:///./src/javascripts/archiveClient.js?");

/***/ })

/******/ });