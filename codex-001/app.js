const fallbackReports = {
  updatedAt: "2026-06-10T03:10:00+08:00",
  timezone: "Asia/Shanghai",
  reports: [
    {
      id: "mexico-south-africa-2026-06-12",
      competition: "世界杯 A组",
      homeTeam: "墨西哥",
      awayTeam: "南非",
      kickoffLocal: "2026-06-11 13:00 墨西哥城",
      kickoffBeijing: "2026-06-12 03:00 北京时间",
      venue: "Estadio Azteca / Mexico City Stadium",
      recommendation: "墨西哥胜",
      probabilities: { home: 60, draw: 24, away: 16 },
      scorePrediction: "1-0 / 2-0",
      snapshot: [
        "墨西哥拥有主场与高海拔适应优势。",
        "南非客场作战，旅途与赛前适应时间是关键变量。",
        "若皇冠主盘在墨西哥 -1 附近，主胜合理但穿盘需谨慎。"
      ],
      news: [
        "墨西哥热身赛进攻状态较好，但揭幕战压力会压低节奏。",
        "南非核心门将 Ronwen Williams 具备拖住比分的能力。"
      ],
      marketRead: "参考皇冠亚洲盘分析法：墨西哥 -0.75 可接受，-1 偏谨慎，升至 -1.25 后不建议追热。大小球若在 2.25/2.5，低比分方向更符合模型。",
      marketMovement: "重点观察临场是否从 -0.75 升到 -1 或 -1.25，以及主队水位是否持续下降。若升盘但水位不稳，可能是热度推动而非真实优势扩大。",
      lineup: [
        "墨西哥：重点核对首发门将、Edson Alvarez 状态、Raul Jimenez 是否首发。",
        "南非：重点核对 Ronwen Williams、Lyle Foster 以及主力中卫组合。"
      ],
      formData: [
        "墨西哥近期热身赛进攻效率较好，但防线早段注意力仍需观察。",
        "南非更依赖低位防守和定位球，若先失球，追分能力是疑问。"
      ],
      modelNote: "模型倾向墨西哥小胜。若盘口停在 -0.75，墨西哥方向价值较好；若升到 -1.25，胜率提升但盘口性价比下降。",
      factors: [
        "海拔：墨西哥城约 2200 米，高原环境偏向主队。",
        "赛程：揭幕战通常节奏谨慎，强队早段试探时间更长。",
        "阵容：墨西哥中前场深度更好，南非更依赖防守和反击效率。"
      ],
      risk: "最大风险是墨西哥只赢一球导致让球盘走盘或输半；若临场主队水位持续走低，需防市场过热。",
      sources: [
        { label: "FIFA 赛程", url: "https://www.fifa.com/" },
        { label: "盘口需临场复核", url: "https://www.oddsportal.com/" }
      ]
    }
  ]
};

const state = {
  reports: [],
  filter: "all"
};

const dateFormatter = new Intl.DateTimeFormat("zh-CN", {
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit"
});

function toPercent(value) {
  return `${Number(value || 0).toFixed(0)}%`;
}

function textList(items) {
  return (items || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function classifyReport(report) {
  const date = report.kickoffBeijing?.slice(0, 10);
  const now = new Date();
  const today = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(now);
  const tomorrowDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const tomorrow = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(tomorrowDate);

  if (date === today) return "today";
  if (date === tomorrow) return "tomorrow";
  return "other";
}

function render(reports) {
  const container = document.querySelector("#reports");
  const empty = document.querySelector("#emptyState");
  const template = document.querySelector("#reportTemplate");
  container.innerHTML = "";

  const filtered = reports.filter((report) => {
    if (state.filter === "all") return true;
    return classifyReport(report) === state.filter;
  });

  empty.hidden = filtered.length > 0;

  filtered.forEach((report) => {
    const node = template.content.cloneNode(true);
    node.querySelector(".competition").textContent = report.competition || "世界杯";
    node.querySelector(".match-title").textContent = `${report.homeTeam} vs ${report.awayTeam}`;
    node.querySelector(".kickoff").textContent = `${report.kickoffBeijing || ""} · ${report.venue || ""}`;
    node.querySelector(".pick").textContent = report.recommendation || "等待盘口";
    node.querySelector(".home-win").textContent = toPercent(report.probabilities?.home);
    node.querySelector(".draw").textContent = toPercent(report.probabilities?.draw);
    node.querySelector(".away-win").textContent = toPercent(report.probabilities?.away);
    node.querySelector(".score").textContent = report.scorePrediction || "-";
    node.querySelector(".snapshot").innerHTML = textList(report.snapshot);
    node.querySelector(".news").innerHTML = textList(report.news);
    node.querySelector(".market").textContent = report.marketRead || "暂无盘口解读。";
    node.querySelector(".market-movement").textContent = report.marketMovement || "暂无盘口变化数据。";
    node.querySelector(".lineup").innerHTML = textList(report.lineup);
    node.querySelector(".form-data").innerHTML = textList(report.formData);
    node.querySelector(".factors").innerHTML = textList(report.factors);
    node.querySelector(".model-note").textContent = report.modelNote || "暂无模型判断。";
    node.querySelector(".risk").textContent = report.risk || "暂无风险提示。";

    const sourceHtml = (report.sources || [])
      .map((source) => `<a href="${escapeHtml(source.url)}" target="_blank" rel="noreferrer">${escapeHtml(source.label)}</a>`)
      .join("");
    node.querySelector(".sources").innerHTML = sourceHtml || "<span>暂无来源链接</span>";
    container.appendChild(node);
  });
}

async function loadReports() {
  let payload = fallbackReports;
  try {
    const response = await fetch("data/reports.json", { cache: "no-store" });
    if (response.ok) {
      payload = await response.json();
    }
  } catch (error) {
    console.warn("Using fallback reports", error);
  }

  state.reports = payload.reports || [];
  const updated = payload.updatedAt ? dateFormatter.format(new Date(payload.updatedAt)) : "暂无更新时间";
  document.querySelector("#updatedAt").textContent = `更新 ${updated}`;
  render(state.reports);
}

document.querySelectorAll(".seg").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".seg").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    state.filter = button.dataset.filter;
    render(state.reports);
  });
});

loadReports();
