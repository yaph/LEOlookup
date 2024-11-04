import { cache_id, lang_pairs } from './settings.js';

// Initialize context menu
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get([cache_id], data => updateContextMenus(data[cache_id]));
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId !== 'leo-parent') {
        const selectedText = encodeURIComponent(info.selectionText.trim());
        const url = `https://dict.leo.org/${lang_pairs.get(info.menuItemId).path}/${selectedText}`;
        chrome.tabs.create({ url: url });
    }
});

// Update context menus based on active language pairs
function updateContextMenus(active_lang_pairs) {
    // Show all pairs if none is selected
    if (!active_lang_pairs || !active_lang_pairs.length) {
        active_lang_pairs = Array.from(lang_pairs.keys());
    }

    // Remove all existing items
    chrome.contextMenus.removeAll(() => {
        if (active_lang_pairs.length > 1) {
            chrome.contextMenus.create({
                id: 'leo-parent',
                title: 'LEO Wörterbuchsuche',
                contexts: ['selection']
            });
        }
        // Create menu items for active language pairs
        for (const pair of active_lang_pairs) {
            const item = {id: pair, contexts: ['selection'], title: stripFlags(lang_pairs.get(pair).name)};
            if (active_lang_pairs.length > 1) {
                item.parentId = 'leo-parent';
            } else {
                item.title = `LEO: ${item.title}`;
            }
            chrome.contextMenus.create(item);
        }
    });
}

// Listen for changes from options page
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'updateSettings') {
        updateContextMenus(request.lang_pairs);
    }
});


function stripFlags(s) {
  // This pattern matches regional indicator symbol letters (used for flags)
  // Each flag emoji is made up of two regional indicator symbols
  // Range U+1F1E6 to U+1F1FF covers all regional indicator symbols
  return s.replace(/\uD83C[\uDDE6-\uDDFF]\uD83C[\uDDE6-\uDDFF]/g, '');
}