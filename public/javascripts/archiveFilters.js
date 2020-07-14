window.onload = function() {
    //filterHandler.updateView();
    filterHandler.loadHashTags();
}

document.getElementById('keywords-region').onkeypress = function(){
    var pressed = event.key;
    if (pressed == "Enter") {
        filterHandler.addKey();
    }
}

var filterHandler = {
  filters: {
      keywords: new Set([]),
      page: 0,
      langList: new Set(['en']),
      between: {start: "1998-01-01", end: "2015-01-01"}
  },

  ka: document.getElementById('keyAdd'),

  kr: document.getElementById('keywords-region'),

  hashTags: [],

  loadHashTags: function() {
      var url = "/data/hashTags.json";
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
                          a.setAttribute('onclick', 'filterHandler.useSuggestion(this.innerHTML)');
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
        document.getElementById('keyAdd-Text').value = str;
        this.addKey();
        this.kr.removeChild(document.getElementById('suggestions'));
    },

  // handles the keywords box
    nextKeyID: 2,

    addKey: function() {
        var textBarValue = document.getElementById("keyAdd-Text");
        var adds = textBarValue.value.split(",");
        textBarValue.value = "";

        if (adds[0] != "" || adds.length > 1) {
            for (var i = 0; i < adds.length; i++) {
                var l = document.createElement("li");
                l.classList.add("list-group-item");
                l.classList.add("active");
                l.id = this.nextKeyID++;
                l.setAttribute("data-toggle", "button");
                l.setAttribute("onclick", 'filterHandler.toggleKey(this.id)');
                l.innerHTML = adds[i] + " <a href='#' onclick='filterHandler.deleteKey(this.parentNode.id)'><span class='badge badge-danger'><span class='fa fa-times'></span></span></a>";
                this.kr.appendChild(l);
                this.filters.keywords.add(adds[i]);
            }
            filterHandler.updateView();
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
  nResults: 0,

  previousPage: function() {
      if(this.filters.page > 0){
          this.filters.page--;
          this.refreshPaginationInfo();
          this.updateView(false);
      }
  },

  nextPage: function() {
      if(this.nResults == 50){
        this.filters.page++;
        this.refreshPaginationInfo();
        this.updateView(false);
      }
  },

  refreshPaginationInfo: function() {
      //var pStart = this.filters.page*50 + 1;
      //var pEnd = Math.min(pStart+49, this.nResults);
      document.getElementById('pagination').innerHTML = filterHandler.filters.page + 1;
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
          if(date == ''){ filterHandler.filters.between.start = this.defaults[0]; } else {
              filterHandler.filters.between.start = date;
          }
          filterHandler.updateView();
      },
      setEnd: function(date) {
          console.log("fooend", date);
          if(date == ''){ filterHandler.filters.between.end = this.defaults[1]; } else {
              filterHandler.filters.between.end = date;
          }
          filterHandler.updateView();
      }
  },

  // handles updating the database view
  updateView: function(resetPage=true) {
      // var url = "/archive/viewer";
      // console.log("sending", this.filters);
      // // post filters
      // var filterUpdateRequest = new XMLHttpRequest();
      // filterUpdateRequest.onreadystatechange = function() {
      //   // get updated view
      //   var updatedViewRequest = new XMLHttpRequest();
      //   updatedViewRequest.onreadystatechange = function() {
      //       if (this.readyState == 4 && this.status == 200){
      //           //console.log(this.responseText);
      //           var response = JSON.parse(this.responseText);
      //           //console.log(response);
      //           document.getElementById("dbResults").innerHTML = response.dbResults;
      //           filterHandler.nResults = response.nResults;
      //           if(resetPage){
      //             filterHandler.filters.page = 0;
      //             filterHandler.refreshPaginationInfo();
      //           }
      //       }
      //   };
      //   updatedViewRequest.open("GET", url, true);
      //   updatedViewRequest.setRequestHeader("content-type", "application/json;charset=UTF-8");
      //   updatedViewRequest.send();
      // }
      // filterUpdateRequest.open("POST", url, true);
      // filterUpdateRequest.setRequestHeader("content-type", "application/json;charset=UTF-8");
      // var filtersJSON = JSON.stringify(this.filters, (key, value) => value instanceof Set ? [...value] : value);
      // filterUpdateRequest.send(filtersJSON);

      var url = [
        "/archive",
        [...this.filters.langList],
        this.filters.between.start,
        this.filters.between.end,
        this.filters.keywords.length > 0 ? [...this.filters.keywords].join("&") : "NoKeywords",
        this.filters.page].join("/");
      var dbRequest = new XMLHttpRequest();
      dbRequest.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200){
          var response = this.responseText;
          document.getElementById("content").innerHTML = response;
          filterHandler.nResults = 0;
          if(resetPage){
            filterHandler.filters.page = 0;
            filterHandler.refreshPaginationInfo();
          }
        }
      }
      dbRequest.open("GET", url, true);
      dbRequest.setRequestHeader("content-type", "application/json;charset=UTF-8");
      dbRequest.send();
      window.history.pushState({}, "", url);
  },

  addUserFilter: function(user) {
      document.getElementById("keyword-add-text").value += user;
      keywordsBoxHandler.addItem();
  }
}
