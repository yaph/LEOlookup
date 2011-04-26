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
        // menuItemId start at 1 which is the id of the parent, so 2 must be subtracted to get the correct langs index
        var pair = LEO.langs[info.menuItemId-2].pair;
        chrome.tabs.create({url: "http://dict.leo.org/"+pair+"?lp="+pair+"&search=" + info.selectionText})
    }
};
var lang = chrome.contextMenus.create({"title": unescape("LEO W%F6rterbuchsuche"), "contexts":["selection"]});
for (i in LEO.langs) {
    if ("undefined" != typeof LEO.langs[i].title)
        chrome.contextMenus.create({"title": LEO.langs[i].title, "parentId": lang, "contexts":["selection"],"onclick": LEO.lookup});
}
