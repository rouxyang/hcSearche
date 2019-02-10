
/**
 * Qikipedia_v0.1.1 里有删除内容安全策略 Content Security Policies 的代码
 * 先记下，如果有需要用再拿来用，就不用自己研究了，毕竟不了解
 */

let menusCallbackFunc = [];

function createMenus() {
    chrome.storage.sync.get(defaultConfig, function(items) {

        if (items.in_the_menu === false)
            return false;
        
        menusCallbackFunc = [];
        
        for (let i=0; i<items.searchEngines.length; i++) {

            let se = items.searchEngines[i];
            
            if (se.type === 'newtab') {
                
                let menuItemId = 'hcsearche_' + i;
                
                chrome.contextMenus.create({
                    'title' : '使用 ' + se.name + ' 搜索',
                    'id' : menuItemId,
                    'contexts' : [ 'selection' ]
                });
                
                let queryUrl = se.url.replace(new RegExp('%p', 'g'), 1);

                menusCallbackFunc[menuItemId] = function(selectionText) {
                    
                    queryUrl = queryUrl.replace(new RegExp('%s', 'g'), encodeURIComponent(selectionText));
        
                    window.open( queryUrl );
                }
            }
        }
        
        // console.log(menusCallbackFunc)
        
        if (menusCallbackFunc.length > 0)
            chrome.contextMenus.onClicked.addListener(menusCallback);
    });
}

function menusCallback(info, tab) {
    if (menusCallbackFunc[info.menuItemId]) {
        menusCallbackFunc[info.menuItemId](info.selectionText);
    }
}

chrome.storage.onChanged.addListener(function(changes, areaName) {
    if (areaName === 'sync') {
        if (
            (changes.in_the_menu !== undefined
            && changes.in_the_menu.newValue !== changes.in_the_menu.oldValue)
            || changes.searchEngines !== undefined
        ) {

            // 无论开关都清除右键菜单，如果开了再创建就是
            chrome.contextMenus.removeAll(function(){
                
                // 先清除事件
                chrome.contextMenus.onClicked.removeListener(menusCallback);
                
                createMenus();
            });
        }

    }
});


/**
 * 原本是内容脚本实现，到了发布到应用店的时候才发现使用内容脚本要深入审核
 * 要几个工作日审核，那就太坑了，实在不方便这个新插件的快速迭代
 * 改回 executeScript 方法实现，看看能不能快点
 */
 
// 很遗憾，用了 content_scripts 或者 http://*/* https://*/* <all_urls> 就不可避免深入审核

/**
 * 只有右键菜单才能在不申请宽泛的主机权限的情况下 executeScript 任意窗口
 * 要划词出现搜索图标就必须申请宽泛的主机权限，不可避免深入审核
 * 不过因为这次尝试，我倒发现用 executeScript 比 content_scripts 更好
 * 使用 content_scripts 插入脚本是每个页面都会插入，不管设置有没有开启
 * 而是用 executeScript 插入则可以在插入之前判断，设置关掉了就不插入了
 */
 
/**
 * 又发现通过 chrome.tabs.onUpdated 使用 executeScript 有个问题
 * 会出现网页打不开但回调参数 changeInfo.status 依然是 complete 
 * 导致无法判断是否正常网页，于是正常不正常都插入了
 * 但 executeScript 在无法访问的网页是不能执行的，于是报错
 * 没有解决方法。但 content_scripts 就没有这个问题
 * 于是我决定结合 content_scripts 来修复这个问题
 * 在 content_scripts 设置一个脚本发送消息来这里说可以加载
 * 然后再进行判断和 executeScript 
 */

// 这应该是最后一次调整了，使用了目前已知的最优方法
// by 2019年2月7日 13:04:35
 
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.ForrestRun === true) {
        
        runForrestRun(sender.tab.id);
        
        // Forrest Gump Suite
        // https://music.163.com/#/song?id=5057917
        // 很好听
        
    } else if (request.getPage === true && !! request.ajaxurl) {

        fetch(request.ajaxurl).then(function(response) {

            const contentType = response.headers.get('content-type');
            if (contentType && contentType.indexOf('application/json') !== -1) {
                
                return response.json();

            } else {
                
                return {
                    error: 'content-type-error'
                };
                
            }

        }).then(function(json) {
            
            if (json && json.action && json.action === 'hcsearche' && json.body) {
                
                sendResponse(json);
                
            } else {
                
                sendResponse(json && json.error ? json : {
                    error: 'json-error'
                });
            }
        });
        
        // 注意，这里必须返回 true 否则无法异步调用 sendResponse
        return true;
    }

});

// 生活就像一盒巧克力，总是想吃，吃多了却很腻
function runForrestRun(tabId) {
    chrome.tabs.insertCSS(tabId, {
        file: '/css/popup.css'
    }); 
    
    chrome.tabs.insertCSS(tabId, {
        file: '/css/icons.css'
    }); 

    chrome.tabs.executeScript(tabId, {
        file: '/js/content.js'
    });
}

chrome.runtime.onInstalled.addListener(function() {
    // 安装回调
    // 新年快乐
    // by 2019年2月4日 16:49:44
    
    window.open(chrome.runtime.getURL('/options/setting.html'));
});
