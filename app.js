const dreamInput = document.getElementById("dreamInput");
const analyzeBtn = document.getElementById("analyzeBtn");
const resultBox = document.getElementById("resultBox");
const historyList = document.getElementById("historyList");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");
const quickTags = document.querySelectorAll(".quick-tag");

const HISTORY_KEY = "zhougong_dream_history_v1";

const DREAM_DB = [
  {
    keys: ["蛇", "蟒蛇", "毒蛇"],
    title: "梦见蛇",
    meaning: "常被解作潜在压力、直觉增强，或对变化的警觉。",
    advice: "近期可把复杂问题拆小处理，避免情绪累积。",
    luck: "中平"
  },
  {
    keys: ["掉牙", "牙掉", "牙齿掉"],
    title: "梦见掉牙",
    meaning: "多与焦虑、面子压力、关系沟通紧张有关。",
    advice: "先处理睡眠与作息，再和关键人物做一次坦诚沟通。",
    luck: "小凶转平"
  },
  {
    keys: ["考试", "迟到", "考场"],
    title: "梦见考试",
    meaning: "反映对评价体系或截止时间的担忧。",
    advice: "把任务改成可执行清单，先完成最重要的20%。",
    luck: "中平偏吉"
  },
  {
    keys: ["下雨", "大雨", "暴雨"],
    title: "梦见下雨",
    meaning: "象征情绪释放，也可能代表旧事进入整理期。",
    advice: "给自己留一点独处时间，避免连续过载。",
    luck: "先忧后吉"
  },
  {
    keys: ["飞", "飞起来", "腾空"],
    title: "梦见飞行",
    meaning: "往往表示突破束缚、渴望自由与掌控感。",
    advice: "适合推进新计划，但注意落地细节。",
    luck: "吉"
  },
  {
    keys: ["水", "大海", "河", "洪水"],
    title: "梦见水",
    meaning: "常与情绪、财富流动、生活状态变化相关。",
    advice: "优先管理现金流和时间流，避免临时决策。",
    luck: "中吉"
  },
  {
    keys: ["坠落", "掉下去", "下坠"],
    title: "梦见坠落",
    meaning: "通常是失控感或安全感不足的映射。",
    advice: "把担心写下来并逐条验证，减少想象性风险。",
    luck: "中平"
  },
  {
    keys: ["怀孕", "生孩子", "宝宝"],
    title: "梦见孕育",
    meaning: "象征新想法、新身份或新阶段的酝酿。",
    advice: "持续投入一个长期项目，避免三天打鱼两天晒网。",
    luck: "吉"
  },
  {
    keys: ["死亡", "去世", "葬礼"],
    title: "梦见死亡",
    meaning: "传统解释多指旧状态结束、新阶段开启，不必过度恐慌。",
    advice: "主动做一次断舍离，给新机会腾位置。",
    luck: "先凶后吉"
  }
];

function sanitizeText(text) {
  return text.replace(/[<>]/g, "").trim();
}

function findDream(keyword) {
  const normalized = keyword.toLowerCase();
  return DREAM_DB.find((item) =>
    item.keys.some((k) => normalized.includes(k.toLowerCase()))
  );
}

function fallbackDream(keyword) {
  return {
    title: `梦见「${keyword}」`,
    meaning: "未匹配到固定条目。通常这类梦与近期关注点、未完成事项有关。",
    advice: "回想梦里最强烈的情绪，再结合现实压力源进行整理。",
    luck: "中平"
  };
}

function renderResult(result) {
  resultBox.classList.remove("placeholder");
  resultBox.innerHTML = `
    <h3 class="result-title">${result.title}</h3>
    <p class="result-item"><strong>传统释义：</strong>${result.meaning}</p>
    <p class="result-item"><strong>行动建议：</strong>${result.advice}</p>
    <p class="result-item"><strong>运势参考：</strong>${result.luck}</p>
  `;
}

function readHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (_) {
    return [];
  }
}

function writeHistory(list) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(0, 8)));
}

function pushHistory(keyword) {
  const current = readHistory();
  const next = [keyword, ...current.filter((k) => k !== keyword)];
  writeHistory(next);
  renderHistory();
}

function renderHistory() {
  const items = readHistory();
  historyList.innerHTML = "";

  if (!items.length) {
    historyList.innerHTML = `<li class="history-item"><button type="button" disabled>暂无记录</button></li>`;
    return;
  }

  for (const item of items) {
    const li = document.createElement("li");
    li.className = "history-item";
    li.innerHTML = `<button type="button">${item}</button>`;
    li.querySelector("button").addEventListener("click", () => {
      dreamInput.value = item;
      runAnalyze(item);
    });
    historyList.appendChild(li);
  }
}

function runAnalyze(rawText) {
  const keyword = sanitizeText(rawText);
  if (!keyword) {
    resultBox.classList.add("placeholder");
    resultBox.textContent = "请先输入梦境关键词。";
    return;
  }

  const matched = findDream(keyword) || fallbackDream(keyword);
  renderResult(matched);
  pushHistory(keyword);
}

analyzeBtn.addEventListener("click", () => runAnalyze(dreamInput.value));

dreamInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    runAnalyze(dreamInput.value);
  }
});

quickTags.forEach((tag) => {
  tag.addEventListener("click", () => {
    const key = tag.dataset.key || "";
    dreamInput.value = key;
    runAnalyze(key);
  });
});

clearHistoryBtn.addEventListener("click", () => {
  writeHistory([]);
  renderHistory();
});

renderHistory();
