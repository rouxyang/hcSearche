
+ function() {

    // 把返回结果处理成 HTML
    function itemToHtml(item, paged) {

        if (typeof item.body === 'string') {
            
            let html = item.body;
            
            html += '<div class="m-3 text-center text-muted small clearfix">';
            
                let pageNumber = '第 ' + paged + ' 页';
                
                html += item.page_url ? '<a href="'+item.page_url+'" target="_blank" class="text-muted" title="在新标签页中打开">'+pageNumber+'</a>' : pageNumber;

                
            html += '</div>';
            
            return html;
        }
        
        if (item.error) {
            
            let error_msg = '接口数据有误';
            
            switch (item.error) {
                case 'content-type-error' :
                    error_msg = '接口返回内容不是 JSON 格式';
                break;
                case 'json-error' :
                    error_msg = '接口返回的 JSON 数据格式有误';
                break;
            }
            
            return '\
                <div class="toast m-3 fade show" role="alert" aria-live="assertive" aria-atomic="true">\
                    <div class="toast-header">\
                        <strong class="mr-auto text-danger">'+error_msg+'</strong>\
                        <small>访问接口失败</small>\
                    </div>\
                    <div class="toast-body">\
                        <p>常见接口错误一览：</p>\
                        <ol>\
                            <li>接口不可用</li>\
                            <li>接口跨域访问权限有误</li>\
                            <li>返回格式有误</li>\
                        </ol>\
                    </div>\
                </div>\
            ';

        }
    }
    
    // check json
    let $modalData = $('#modalData');
    if ($modalData.length < 1)
        return false;
    
    $modalData.remove();
    
    let modalDataStr = $modalData.val().trim();
    let data = JSON.parse(modalDataStr);
    
    // dom
    
    let $app = $('#iframeApp');
    
    let headerTemplate = (function(){/*
        <div id="searchInputGroup" class="input-group input-group-sm">
            <div class="input-group-prepend">
                <span id="searchEngineName" class="input-group-text"></span>
            </div>
            <input type="text" id="s" class="form-control" placeholder="搜索词">
        </div>
    */}).toString().split('\n').slice(1,-1).join('\n') + '\n';
    
    let $header = $(headerTemplate);
    $header.find('#searchEngineName').html(data.searchEngineName);
    $header.find('#s').val(data.queryStr);

    $app.append($header);

    if (data.pages) {
        for (let paged=1; paged<=data.pages.length; paged++) {
            
            if (paged > 1)
                $app.append($('<hr/>').addClass('mb-3'));
            
            let resHtml = itemToHtml(data.pages[paged-1], paged);
            
            let $result = $('<api-result/>').html(resHtml);

            $app.append($result);
            
            if (paged === data.pages.length) {
                $('html, body').animate({ scrollTop: $result.offset().top }, 500);
            }
        }
    }
    
    if (data.loading === true) {
        
        $app.append($('<div id="loading"><div class="loading_text"><div class="lds-dual-ring"></div>正在获取接口数据</div></div>'));
        
        $('html, body').animate({ scrollTop: $('#loading').offset().top }, 500);
    }


    return false;
}();
