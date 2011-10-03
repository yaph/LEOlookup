var Sitesearch = {
    cache_id: '',
    urls: [],
    menu_item_count: 0,
    menu_items_created_count: 0,
    selected: [],
    selected_urls: [],
    init: function(cache_id) {
        Sitesearch.cache_id = cache_id;
        Sitesearch.resetVars();
        Sitesearch.loadSelected();
    },
    resetVars: function() {
        Sitesearch.menu_item_count = 0;
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
    search: function(info) {
        // TODO try parent item and IDs instead of keeping track of created count
        // Chrome increments menuItemId values with every created menu item within a browser session
        var lid = Sitesearch.menu_item_count - Sitesearch.menu_items_created_count + info.menuItemId - 1;
        var site = null;
        if (Sitesearch.selected_urls) {
            site = Sitesearch.selected_urls[lid];
        }
        else {
            site = Sitesearch.urls[lid];
        }

        if (site) {
            chrome.tabs.create({'url': site.url.replace('#SEARCH#', info.selectionText)});
        }
        else {
            alert("menuItemId: " + info.menuItemId + "\nList ID: " + lid + "\nItem count: " + Sitesearch.menu_item_count + "\nCreated count: " + Sitesearch.menu_items_created_count + "\nSelected URLs" + Sitesearch.selected_urls);
        }
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
        var item_count = 0;
        var selected = [];
        Sitesearch.cycle(function(url) {
            if (!Sitesearch.selected.length || -1 != Sitesearch.selected.indexOf(url.id)) {
                chrome.contextMenus.create({'title': url.name, 'contexts':['selection'], 'onclick': Sitesearch.search});
                selected.push(url);
                item_count++;
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
            item_count += 2;
        }
        Sitesearch.menu_item_count = item_count;
        Sitesearch.menu_items_created_count += item_count;
    },
    reloadContextMenu: function() {
        var bg = chrome.extension.getBackgroundPage();
        chrome.contextMenus.removeAll(function(){bg.createContextMenu();});
    }
};
