# professional-presentation · 专业展示生成器

把文档、数据和图片组织为信息忠实、逻辑清楚的单文件 HTML 演示。不是专用周报/月报工具。

## 使用

以 `SKILL.md` 为入口；先建立信息台账和标题链，再选页面构成。
默认模板为 `assets/template-professional.html`，可直接离线打开。模板包含虚构方案比较与预算示例，不含真实业务材料。

支持翻页、目录、图片放大、全屏、自动隐藏演示导航及打印样式。封面大字居中、正文自然换行、金额右对齐，末页 THANKS。保留关键事实与条件，不为版式过度改写内容。

新增演示沿用默认模板的交互即可；兼容相同 DOM 的旧页面可使用 `scripts/enhance-deck.mjs` 导出的 `enhanceDeck(html)`。其为幂等增强，不会重复加入控件。

运行结构检查：

```sh
node scripts/validate-professional-deck.mjs assets/template-professional.html
```

结构检查不等于真实视觉或交互验收。需要实际浏览器检查宽屏、常规屏幕及打印分页；未实际导出检查的 PDF 不应声称已验收。

## 隐私与发布

内部阅读版和对外展示版分开。公开仓库仅保存通用模板与技能资源；不提交原文、账号截图、财务材料或个人路径。对外版本仍需由资料所有者审核商业信息。
材料矛盾和编辑诊断输出制作控制台；原文中的业务风险和限制保留在展示中。

旧 consulting / magazine 模板保留用于历史兼容，不作为新演示默认样式。
