var LEO = {
    langs: [
        {"pair":"ende", "title":"Englisch"},
        {"pair":"frde", "title":unescape("Franz%F6sisch")},
        {"pair":"esde", "title":"Spanisch"},
        {"pair":"itde", "title":"Italienisch"},
        {"pair":"chde", "title":"Chinesisch"},
        {"pair":"rude", "title":"Russisch"}
    ],
    lookup: function(info) {
        // menuItemId count starts with parent item
        var mid = info.menuItemId - info.parentMenuItemId;
        // decrement ID if parent ID is not 0 to match correct lang pair
        (0 != info.parentMenuItemId) && --mid;
        var pair = LEO.langs[mid].pair;
        chrome.tabs.create({url: "http://dict.leo.org/"+pair+"?lp="+pair+"&search=" + info.selectionText})
    }
};
var lang = chrome.contextMenus.create({"title": unescape("LEO W%F6rterbuchsuche"), "contexts":["selection"]});
for (i in LEO.langs) {
    if ("undefined" != typeof LEO.langs[i].title)
        chrome.contextMenus.create({"title": LEO.langs[i].title, "parentId": lang, "contexts":["selection"],"onclick": LEO.lookup});
}
