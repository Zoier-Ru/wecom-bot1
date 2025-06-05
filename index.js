const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

const figmaLinks = {
  "西瓜": "https://www.figma.com/file/example/watermelon-logo",
  "苹果": "https://www.figma.com/file/example/apple-logo",
  "logo": "https://www.figma.com/file/example/generic-logo"
};

function extractKeywords(text) {
  const keywords = Object.keys(figmaLinks);
  return keywords.filter(keyword => text.includes(keyword));
}

app.post('/wecom', (req, res) => {
  const content = req.body.Text && req.body.Text.Content;
  if (!content) {
    return res.send('No content found.');
  }

  const hits = extractKeywords(content);
  if (hits.length > 0) {
    const links = hits.map(k => `${k} 图链接: ${figmaLinks[k]}`).join("\n");
    res.json({ msgtype: "text", text: { content: links } });
  } else {
    res.json({ msgtype: "text", text: { content: "未找到相关图标，正在生成中..." } });
  }
});

app.get('/', (req, res) => {
  res.send('WeCom Bot is running.');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Bot running on port ${port}`);
});