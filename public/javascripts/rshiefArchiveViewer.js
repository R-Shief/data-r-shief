window.onload = function() {
    dbHandler.loadViewer(["#classwar"]);
    keySearch.loadHashTags();
}

var keySearch = {
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

    showPossible: function(str) {
        if (str.length > 0 && str.substring(0,1)=='#') {
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
                            a.setAttribute('onclick', 'keySearch.useSuggestion(this.innerHTML)');
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
        keywordsBoxHandler.addItem();
        this.kr.removeChild(document.getElementById('suggestions'));
    }

}

document.getElementById('keywords-region').onkeypress = function(){
    var pressed = event.key;
    if (pressed == "Enter") {
        keywordsBoxHandler.addItem();
    }
}

// handles the keywords box
var keywordsBoxHandler = {
    nextID: 2,

    addItem: function() {
        var textBarValue = document.getElementById("keyword-add-text");
        var adds = textBarValue.value.split(",");
        textBarValue.value = "";

        if (adds[0] != "" || adds.length > 1) {
            for (var i = 0; i < adds.length; i++) {
                var l = document.createElement("li");
                l.classList.add("list-group-item");
                l.classList.add("active");
                l.id = this.nextID++;
                l.setAttribute("data-toggle", "button");
                l.setAttribute("onclick", 'keywordsBoxHandler.toggleItem(this.id)');
                l.innerHTML = adds[i] + " <a href='#' onclick='keywordsBoxHandler.deleteItem(this.parentNode.id)'><span class='badge badge-danger'><span class='fa fa-times'></span></span></a>";
                document.getElementById("keywords-region").appendChild(l);
            }
        }
        paginator.page = 0;
        dbHandler.submitFilters();
    },

    toggleItem: function(toggleID) {
        var toBeToggled = document.getElementById(toggleID);
        if(toBeToggled) {
            toBeToggled.classList.toggle("active");
        }
        paginator.page = 0;
        dbHandler.submitFilters();
    },

    deleteItem: function(deleteID) {
        document.getElementById(deleteID).remove();
        paginator.page = 0;
        dbHandler.submitFilters();
    }
}

// handles pagination
var paginator = {
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
    }
}

// handles language filter
var languageHandler = {
    possibleLangs: ['fr', 'en', 'es', 'it', 'el', 'de', 'sv', 'no', 'nl', 'pt', 'in', 'pl', 'ru', 'tr', 'ko', 'hu', 'vi', 'da', 'ar', 'lt', 'iw', 'id', 'tl'],
    langList: new Set(['en']),

    setLang: function(lang) {
        if(document.getElementById(lang).checked){
            this.langList.add(lang);
        } else {
            this.langList.delete(lang);
        }
        //console.log(this.langList);
        dbHandler.filters.langList = Array.from(this.langList);
        dbHandler.submitFilters(true);
    }
}

// handles dates filter
var dateHandler = {
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
}

// handles sending php queries
var dbHandler = {
    filters: {
        keywords: [],
        limitOffset: 0,
        langList: ['en'],
        between: ["1998-01-01", "2015-01-01"]
    },

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
        this.loadViewer(this.filters);
    },

    loadViewer: function(filters) {
        // add filters to the url as a string
        var url = "getResults";
        var data = JSON.stringify(this.filters);
        //console.log("sending", this.filters, url);
        // decide what to do once the xhttp request returns
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
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
        xhttp.open("GET", url, true);
        xhttp.send(data);
    },

    buildListItem: function(row) {
        var l = document.createElement('hgroup');
            l.classList.add('list-group-item');
            var u = document.createElement('h6');
                u.classList.add('list-group-item-heading');
                var a = document.createElement('a');
                    a.setAttribute('href', '#');
                    a.setAttribute('onclick', 'dbHandler.addUserFilter(this.innerHTML)');
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
