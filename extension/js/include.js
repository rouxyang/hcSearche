
// 这些检查代码貌似用不着了

// 只支持在 http:// https:// file:// 页面弹窗
// if (! tab.url || tab.url.match(/^(?:http|https|file)\:\/\/.*/) === null)
    // return false;

// Chrome Web Store 不允许 executeScript 因此无法使用小窗搜索
// if (tab.url.indexOf('https://chrome.google.com/webstore/') === 0)
    // return false;

let options = [];

let popupEngines = [];

chrome.storage.sync.get(defaultConfig, function(items) {

    options = items;
    
    if (options.show_float_icon !== true && options.show_contextmenu_icon !== true)
        return false;

    if (options.searchEngines) {
        
        options.searchEngines = options.searchEngines.slice().sort(function(a, b) {
            return a['position'] - b['position'];
        });
        
        for (var i = 0; i<options.searchEngines.length; i++) {
            let se = options.searchEngines[i];
            if (se.show_icon === true) {
                se.index = i;
                popupEngines.push(se);
            }
        }
    }

    // 没有悬浮图标的搜索引擎当然就不添加事件了
    if (popupEngines.length <= 0)
        return false;

    // 告诉后台插入代码
    chrome.runtime.sendMessage(
        {
            ForrestRun: true
        },
        function(response) {
            // 回调，暂时用不着
            // console.log(response);
        }
    );
});
