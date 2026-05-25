# 纯 CSS + JS 实现丝滑动画的秘诀

不使用任何动画库，只用原生 API 如何做出顶级流畅的网页动画？分享几个实战心得。

## 1. 选对 easing 函数

动画的「感觉」90% 来自缓动曲线。CSS 默认的 `ease` 其实很不错，但如果想要更精致的效果：

```css
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
--ease-out-back: cubic-bezier(0.34, 1.56, 0.64, 1);
```

Expo 缓出最适合元素入场，因为它快速启动然后优雅减速。Back 缓出带一点回弹，适合按钮反馈。

## 2. IntersectionObserver 替代 scroll 事件

不要在 `scroll` 事件里做任何事。用 IntersectionObserver：

```js
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target); // 只触发一次
    }
  });
}, { threshold: 0.15 });
```

性能差距巨大——Observer 是浏览器原生优化，scroll 事件里做 getBoundingClientRect 会让主线程卡顿。

## 3. FLIP 动画技巧

页面过渡最难的是元素从一页变形到另一页。FLIP（First, Last, Invert, Play）是解决方案：

1. **First**: 记录元素当前的位置和尺寸
2. **Last**: 渲染目标页面的该元素，记录新位置
3. **Invert**: 用 `transform` 把元素从新位置拉回旧位置
4. **Play**: 取消 transform，让浏览器自动插值过渡

更多细节以后展开写。先到这里！
