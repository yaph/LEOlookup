import { cache_id, lang_pairs } from './settings.js';

// Initialize context menu
chrome.runtime.onInstalled.addListener(() => {
    // Load saved language pair preferences
    chrome.storage.sync.get([cache_id], data => {
        if (data[cache_id]) {
            updateContextMenus(data[cache_id]);
        } else {
            // By default show "English - Deutsch" menu item
            const pair = lang_pairs.get('ende');
            chrome.contextMenus.create({
                id: pair.path,
                title: pair.name,
                contexts: ['selection']
            });
        }
    });
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
    if (!active_lang_pairs.length) {
        return;
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
            const item = {id: pair, title: lang_pairs.get(pair).name, contexts: ['selection']}
            if (active_lang_pairs.length > 1) {
                item.parentId = 'leo-parent';
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
