window.onload = function() {
    filterHandler.updateView();
    filterHandler.loadHashTags();
}

document.getElementById('keywords-region').onkeypress = function(){
    var pressed = event.key;
    if (pressed == "Enter") {
        filtersHandler.addKey();
    }
}

var filterHandler = {
  filters: {
      keywords: new Set([]),
      limitOffset: 0,
      langList: new Set(['en']),
      between: {start: "1998-01-01", end: "2015-01-01"}
  },

  ka: document.getElementById('keyAdd'),

  kr: document.getElementById('keywords-region'),

  hashTags: [],

  loadHashTags: function() {
      var url = "data/hashTags.json";
      var xhttp = new XMLHttpRequest();
      var scope = this;
      xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200){
              //console.log(this.responseText);
              scope.hashTags = JSON.parse(this.responseText).ht;
          }
      };
      // shoot off the xhttp get request.
      xhttp.open("GET", url, true);
      xhttp.send();
  },

  showPossibleTags: function(str) {
      if (str.length > 0) { //&& str.substring(0,1)=='#') {
          var u = document.getElementById('suggestions');
          if (u == null){
              u = document.createElement('ul');
              u.classList.add('list-group');
              u.id = 'suggestions';
              u.style.height = '6em';
              u.style.overflowY = 'scroll';
              u.style.overflowX = 'hidden';
          }
          u.textContent = '';
          for (var i = 0; i < this.hashTags.length; i++) {
              if (this.hashTags[i].includes(str)) {
                  var l = document.createElement('li');
                      l.classList.add('list-group-item');
                      var a = document.createElement('a');
                          a.setAttribute('href', '#');
                          a.setAttribute('onclick', 'filtersHandler.useSuggestion(this.innerHTML)');
                          a.innerHTML = this.hashTags[i];
                      l.appendChild(a);
                  u.appendChild(l);
              }
          }
          this.kr.insertBefore(u, this.kr.childNodes[2]);
      } else {
          if(document.getElementById('suggestions') != null){
              this.kr.removeChild(document.getElementById('suggestions'));
          }
      }
  },

    useSuggestion: function(str) {
        document.getElementById('keyword-add-text').value = str;
        this.addKey();
        this.kr.removeChild(document.getElementById('suggestions'));
    },

  // handles the keywords box
    nextKeyID: 2,

    addKey: function() {
        var textBarValue = document.getElementById("keyword-add-text");
        var adds = textBarValue.value.split(",");
        textBarValue.value = "";

        if (adds[0] != "" || adds.length > 1) {
            for (var i = 0; i < adds.length; i++) {
                var l = document.createElement("li");
                l.classList.add("list-group-item");
                l.classList.add("active");
                l.id = this.nextKeyID++;
                l.setAttribute("data-toggle", "button");
                l.setAttribute("onclick", 'filtersHandler.toggleKey(this.id)');
                l.innerHTML = adds[i] + " <a href='#' onclick='filtersHandler.deleteKey(this.parentNode.id)'><span class='badge badge-danger'><span class='fa fa-times'></span></span></a>";
                this.kr.appendChild(l);
                this.filters.keywords.add(adds[i]);
            }
        }
    },

    toggleKey: function(toggleID) {
        var toBeToggled = document.getElementById(toggleID);
        if(toBeToggled) {
            toBeToggled.classList.toggle("active");
            var key = toBeToggled.innerHTML;
            if(this.filters.keywords.includes(key)) {
              this.filters.keywords.delete(key);
            } else {
              this.filters.keywords.add(key);
            }
        }
    },

    deleteKey: function(deleteID) {
        var keyElem = document.getElementById(deleteID);
        this.filters.keywords.delete(keyElem.innerHTML);
        keyElem.remove();
    },

  // handles pagination
  page: 0,
  nResults: "2000",

  previousPage: function() {
      if(this.page > 0){
          this.page--;
          this.refreshPaginationInfo();
      }
      dbHandler.submitFilters();
  },

  nextPage: function() {
      if(this.page*50+50 <= this.nResults){
          this.page++;
          this.refreshPaginationInfo();
      }
      dbHandler.submitFilters();
  },

  refreshPaginationInfo: function() {
      var pStart = this.page*50 + 1;
      var pEnd = Math.min(pStart+49, this.nResults);
      document.getElementById('pi').innerHTML = pStart + "-" + pEnd + " of " + this.nResults;
  },

  // handles language filter
  possibleLangs: ['fr', 'en', 'es', 'it', 'el', 'de', 'sv', 'no', 'nl', 'pt', 'in', 'pl', 'ru', 'tr', 'ko', 'hu', 'vi', 'da', 'ar', 'lt', 'iw', 'id', 'tl'],

  setLang: function(lang) {
      if(document.getElementById(lang).checked){
          this.filters.langList.add(lang);
      } else {
          this.filters.langList.delete(lang);
      }
  },

  // handles dates filter
  dateHandler: {
      defaults: ["1998-01-01", "2015-01-01"],
      setStart: function(date) {
          console.log("foostart", date);
          if(date == ''){ dbHandler.filters.between[0] = this.defaults[0]; } else {
              dbHandler.filters.between[0] = date;
          }
          dbHandler.submitFilters(true);
      },
      setEnd: function(date) {
          console.log("fooend", date);
          if(date == ''){ dbHandler.filters.between[1] = this.defaults[1]; } else {
              dbHandler.filters.between[1] = date;
          }
          dbHandler.submitFilters(true);
      }
  },

  // handles sending php queries
  submitFilters: function(resetPage=false) {
      if(resetPage) {paginator.page = 0;}
      this.filters.keywords = [];
      var children = document.getElementById("keywords-region").children;
      for (var i = 0; i < children.length; i++){
          if(children[i].tagName == "LI" && children[i].classList.contains('active')) {
              this.filters.keywords.push(encodeURIComponent(children[i].textContent));
          }
      }
      this.filters.limitOffset = paginator.page*50;
      this.updateViewer(this.filters);
  },

  updateView: function(filters) {
      this.page = 0;
      // add filters to the url as a string
      var updateURL = "/archive/updateViewer";
      console.log("sending", this.filters);
      // post filters
      var filterUpdateRequest = new XMLHttpRequest();
      filterUpdateRequest.onreadystatechange = function() {
        // get updated view
        var getURL = "/archive/getUpdatedViewer"
        var updatedViewRequest = new XMLHttpRequest();
        updatedViewRequest.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200){
                console.log(this.responseText);
                var response = JSON.parse(this.responseText);
                //console.log(response);
                document.getElementById("dbResults").innerHTML = response.dbResults;
                paginator.nResults = response.nResults;
                paginator.refreshPaginationInfo();
            }
        };
        // shoot off the xhttp get request.
        updatedViewRequest.open("GET", getURL, true);
        updatedViewRequest.setRequestHeader("content-type", "application/json;charset=UTF-8");
        updatedViewRequest.send();
      }
      filterUpdateRequest.open("POST", updateURL, true);
      filterUpdateRequest.setRequestHeader("content-type", "application/json;charset=UTF-8");
      var filtersJSON = JSON.stringify(this.filters, (key, value) => value instanceof Set ? [...value] : value);
      filterUpdateRequest.send(filtersJSON);

  },

  buildListItem: function(row) {
      var l = document.createElement('hgroup');
          l.classList.add('list-group-item');
          var u = document.createElement('h6');
              u.classList.add('list-group-item-heading');
              var a = document.createElement('a');
                  a.setAttribute('href', '#');
                  a.setAttribute('onclick', 'filterHandler.addUserFilter(this.innerHTML)');
                  a.innerHTML = '@' + row.from_user;
              u.appendChild(a);
          l.appendChild(u);
          var t = document.createElement('h6');
              t.classList.add('list-group-item-heading');
              t.innerHTML = row.text;
          l.appendChild(t);
      return l;
  },

  addUserFilter: function(user) {
      document.getElementById("keyword-add-text").value += user;
      keywordsBoxHandler.addItem();
  }
}
