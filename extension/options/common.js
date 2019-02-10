
// 删除数据用于测试
// chrome.storage.sync.remove(Object.keys(defaultConfig), function() {});

// 翻译一下可能会出现的错误提示
let alertError = function(message) {
    message = message.split(' ')[0];
    switch (message) {
        case 'QUOTA_BYTES':
            message = "保存失败：当前设置内容总长度超过了同步存储允许的102,400字节。\n" + 
                      "解决方法：缩短自定义设置的内容。";
        break;
        case 'QUOTA_BYTES_PER_ITEM':
            message = "保存失败：设置子项内容长度超过了同步存储允许的8,192字节。\n" + 
                      "解决方法：找到超出长度的子项并缩短其内容。";
        break;
        case 'MAX_WRITE_OPERATIONS_PER_HOUR':
            message = "保存失败：操作次数超过了同步存储允许的每小时1,800次。\n" + 
                      "解决方法：过一段时间再进行操作。";
        break;
        case 'MAX_WRITE_OPERATIONS_PER_MINUTE':
            message = "保存失败：操作次数超过了同步存储允许的每分钟120次。\n" + 
                      "解决方法：等待一分钟后再进行操作。";
        break;
    }
    alert(message);
};

// 用来防止或消除数据绑定
let copyAsData = function(obj) {
    let newObj = Object.assign({}, obj);
    return newObj;
};

let storageSet = function(items, callback) {
    chrome.storage.sync.set(items, function(){
        if (chrome.runtime.lastError) {
            alertError(chrome.runtime.lastError.message);
        } else {
            if (callback)
                callback();
        }
    });
};

// 目前没有获取单项设置的场景，直接省略掉 keys 参数
let storageGet = function(callback) {
    chrome.storage.sync.get(defaultConfig, function(items) {
        callback(items);
    });
};

+function($){

    window.showAlert = function(msg, type='success', showclose=true) {

        let close_btn_html = showclose ? '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' : '';
        
        // 加个 alert_break 是为了换行，因为 .alert 为了居中用 inline-block
        // 多个消息弹窗逐个消失往上挤的效果不好，先凑合着用吧
        let $alert = $('<div class="alert alert-'+type+' fade" role="alert">'+ msg + ' '+ close_btn_html + '</div>');
        
        let $alertWrap = $('#alerts');
        if ($alertWrap.length === 0) {
            $alertWrap = $('<div/>').attr('id', 'alerts');
            $('body').append($alertWrap);
        }
        
        $alertWrap.append($alert).append($('<div class="alert_break"></div>'));
        
        // 移除多余的 .alert_break ，因为移除弹窗的时候没有移除
        $('#alerts .alert_break + .alert_break').remove();
        
        setTimeout(function(){
            $alert.addClass('show');
        }, 10)

        return $alert;
    }
    
    // 最多只显示一个的提示
    window.showTips = function(msg = 'updated') {

        let tipsId = 'updateTips';
        
        let $lastTips = $('#'+tipsId);
        if ($lastTips.length > 0) {
            $lastTips.remove();
        }

        if (msg === 'updated')
            msg = '设置修改成功';
        
        let $alert = showAlert(msg);
        
        $alert.attr('id', tipsId);
        
        // 3秒自动移除

        setTimeout(function(){
            $alert.find('[data-dismiss="alert"]').trigger('click');
        }, 3000);
    }

    // 读取数据后再渲染有延迟，会导致闪烁，不喜欢，所以整个页面逐步渐入
    $('.page_mod').each(function(index){
        let $mod = $(this);
        setTimeout(function(){
            $mod.addClass('show');
        }, 200 * index)
    });
    
}(jQuery);

