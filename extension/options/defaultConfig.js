
/**
 * @param boolean in_the_menu 添加划词右键菜单
 * @param boolean show_float_icon 划词显示搜索图标
 * @param boolean show_on_hover 鼠标移至搜索图标打开搜索窗口
 * @param boolean auto_close 点击网页任意位置自动关闭搜索窗口
 * @param boolean fixed_modal 基于浏览器可视区域定位搜索窗口
 * @param boolean custom_style 自定义样式
 * @param boolean custom_style_on 自定义样式生效
 */

window.defaultConfig = {
    in_the_menu: false,
    show_float_icon: true,
    show_on_hover: false,
    show_contextmenu_icon: false,
    auto_close: true,
    fixed_modal: true,
    custom_style_on: true,
    custom_style: '',
    searchEngines: [
        {
            name: '必应',
            position: 0,
            show_icon: true,
            url: 'https://service-ntpkq63u-1256936457.ap-guangzhou.apigateway.myqcloud.com/release/hcSearcheBingTest?s=%s&paged=%p',
            type: 'ajax',
            icon_class: 'bing'
        },
        {
            name: '百度',
            position: 1,
            show_icon: true,
            url: 'https://m.baidu.com/s?wd=%s',
            type: 'iframe',
            icon_class: 'baidu'
        },
        {
            name: '谷歌',
            position: 2,
            show_icon: true,
            url: 'https://www.google.com/search?q=%s',
            type: 'newtab',
            icon_class: 'google'
        }
    ]
};


