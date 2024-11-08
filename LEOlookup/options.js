import { cache_id, lang_pairs } from './settings.js';

document.addEventListener('DOMContentLoaded', () => {
    // Create options
    const container = document.getElementById('language-pairs');
    lang_pairs.forEach((value, id) => {
        const div = document.createElement('div');
        div.setAttribute('class', 'language-pair');

        const input = document.createElement('input');
        Object.assign(input, {type: 'checkbox', id: id, value: id});

        const label = document.createElement('label');
        label.setAttribute('for', id);
        label.textContent = value.name;

        div.append(input);
        div.append(label);
        container.append(div);
    });

    // Load saved settings
    chrome.storage.sync.get([cache_id], (data) => {
        if (!data[cache_id]) return;
        data[cache_id].forEach(pair => {
            let checkbox;
            if (checkbox = document.getElementById(pair)) {
                checkbox.checked = true;
            }
        });
    });

    // Check / Uncheck all
    clickHandler('check-all', setCheckboxes.bind(null, true));
    clickHandler('uncheck-all', setCheckboxes.bind(null, false));

    // Save settings
    clickHandler('save', () => {
        const active_lang_pairs = [];
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');

        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                active_lang_pairs.push(checkbox.value);
            }
        });

        const storage_data = {};
        storage_data[cache_id] = active_lang_pairs;

        // Save to storage
        chrome.storage.sync.set(storage_data, () => {
            // Notify background script
            chrome.runtime.sendMessage({action: 'updateSettings', lang_pairs: active_lang_pairs});

            // Show save confirmation
            const msg = document.getElementById('message');
            msg.textContent = 'Einstellungen gespeichert.'
            setTimeout(() => {msg.textContent = ''}, 2000);
        });
    });
});


function clickHandler(element_id, callback) {
    document.getElementById(element_id).addEventListener('click', callback);
}


function setCheckboxes(val) {
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = val;
    });
}