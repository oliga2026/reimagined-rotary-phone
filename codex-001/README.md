# 世界杯赛前盘口情报网页

这是一个静态网页，用来展示每天自动更新的世界杯赛前盘口情报。数据文件是 `data/reports.json`，页面文件可以直接发布到 GitHub Pages。

## 本地预览

1. 在本目录运行：

   ```powershell
   powershell -NoProfile -ExecutionPolicy Bypass -File .\serve.ps1
   ```

2. 电脑浏览器访问 `http://localhost:8787`。
3. 手机和电脑连接同一个 Wi-Fi，手机访问 `http://电脑局域网IP:8787`。

## 发布到 GitHub Pages

1. 在 GitHub 新建一个仓库，例如 `worldcup-report`。
2. 在本目录执行：

   ```powershell
   git init
   git branch -M main
   git add .
   git commit -m "Initial World Cup report site"
   git remote add origin https://github.com/你的用户名/worldcup-report.git
   git push -u origin main
   ```

3. 打开 GitHub 仓库的 `Settings -> Pages`。
4. `Build and deployment` 选择 `Deploy from a branch`。
5. Branch 选择 `main`，目录选择 `/ (root)`，保存。
6. 等待部署完成后，手机可访问：

   ```text
   https://你的用户名.github.io/worldcup-report/
   ```

## 每天自动更新

Codex 自动任务会每天更新 `data/reports.json`。如果已经配置好 GitHub 远程仓库，可以运行：

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\publish_report.ps1 -Message "Update reports 2026-06-12"
```

脚本会提交报告数据并推送到 GitHub，GitHub Pages 随后自动刷新网页。
