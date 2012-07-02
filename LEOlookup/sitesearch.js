var Sitesearch = {
    cache_id: '',
    urls: [],
    urlMap: {},
    selected: [],
    selected_urls: [],
    init: function(cache_id) {
        Sitesearch.cache_id = cache_id;
        Sitesearch.resetVars();
        Sitesearch.loadSelected();
    },
    resetVars: function() {
        Sitesearch.selected = Sitesearch.selected_urls = [];
    },
    loadSelected: function() {
        if (selected = localStorage[Sitesearch.cache_id]) {
            Sitesearch.selected = selected.split(',');
            Sitesearch.cycle(function(url){
                if (-1 != selected.indexOf(url.id))
                    Sitesearch.selected_urls.push(url)
            });
        }
    },
    search: function(info, tab) {
        chrome.tabs.create({'url': Sitesearch.urlMap[info.menuItemId].replace('#SEARCH#', info.selectionText)});
    },
    cycle: function(callback) {
        var len = Sitesearch.urls.length;
        var ret = [];
        for (var i = 0; i < len; i++) {
            if ('undefined' != typeof Sitesearch.urls[i])
                ret.push(callback(Sitesearch.urls[i]));
        }
        return ret;
    },
    createContextMenu: function() {
        var selected = [];
        Sitesearch.cycle(function(url) {
            if (!Sitesearch.selected.length || -1 != Sitesearch.selected.indexOf(url.id)) {
                var mid = chrome.contextMenus.create({'title': url.name, 'contexts':['selection'], 'onclick': Sitesearch.search});
                Sitesearch.urlMap[mid] = url.url;
                selected.push(url);
            }
        });
        // when no URL is selected show all
        if (!Sitesearch.selected.length) {
            Sitesearch.selected_urls = selected;
        }
        if (Sitesearch.selected.length > 1) {
            // create separated options page link and update counts
            chrome.contextMenus.create({'type': 'separator', 'contexts':['selection']});
            chrome.contextMenus.create({'title': 'Options', 'contexts':['selection'], 'onclick': function(info, tab){
                chrome.tabs.create({'url': 'options.html'});
            }});
        }
    },
    reloadContextMenu: function() {
        var bg = chrome.extension.getBackgroundPage();
        chrome.contextMenus.removeAll(function(){bg.createContextMenu();});
    }
};
