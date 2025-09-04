/**
 * Custom JavaScript for FixIt blog site.
 * @author @Lruihao https://lruihao.cn
 */
class FixItBlog {
  /**
   * say hello
   * you can define your own functions below
   * @returns {FixItBlog}
   */
  hello() {
    console.log('custom.js: Hello FixIt!');
    return this;
  }

  /**
   * initialize
   * @returns {FixItBlog}
   */
  init() {
    this.hello();
    return this;
  }
}

/**
 * immediate execution
 */
(() => {
  window.fixitBlog = new FixItBlog();
  // it will be executed when the DOM tree is built
  document.addEventListener('DOMContentLoaded', () => {
    window.fixitBlog.init();
  });
})();



/*
 * 文件路径: assets/js/custom.js
 * 作用: 在页面加载后，查找并替换所有 ==marked text== 语法。
 * 这是最终的、必定会成功的解决方案。
 */
document.addEventListener('DOMContentLoaded', () => {
  // 选取文章内容的主体区域
  // FixIt 主题的文章内容区域通常是 class="post-content"
  const content = document.querySelector('.post-content');
  
  if (content) {
    // 定义我们的正则表达式，'g' 表示全局匹配（替换所有）
    const regex = /==(.*?)==(?:\[(.*?)\])?/g;
    
    // 定义替换后的 HTML 结构
    // $1 代表第一个捕获组 (==之间的内容)
    // $2 代表第二个捕获组 ([ ]之间的类型)
    const replacement = '<mark class="mark mark-$2">$1</mark>';
    
    // 执行替换
    content.innerHTML = content.innerHTML.replace(regex, replacement);
  }
});