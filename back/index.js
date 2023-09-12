const express = require('express');
var cors = require('cors');
const puppeteer = require('puppeteer');
const app = express();
app.use(cors());
const port = 3001;

app.use(express.json());

app.post('/html-to-pdf', async (req, res) => {
  const { html } = req.body;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html);
  const pdfBuffer = await page.pdf();

  await browser.close();

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=export.pdf');
  res.send(pdfBuffer);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
