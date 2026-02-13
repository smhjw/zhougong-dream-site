const DAILY_KEY = "zhougong_daily_lot_v1";

const todayText = document.getElementById("todayText");
const lotCard = document.getElementById("lotCard");
const lotTitle = document.getElementById("lotTitle");
const lotLevel = document.getElementById("lotLevel");
const lotDream = document.getElementById("lotDream");
const lotDo = document.getElementById("lotDo");
const lotAvoid = document.getElementById("lotAvoid");
const lotLucky = document.getElementById("lotLucky");
const drawBtn = document.getElementById("drawBtn");
const previewBtn = document.getElementById("previewBtn");
const dailyTip = document.getElementById("dailyTip");

const LOTS = [
  { title: "上上签", level: "大吉", dream: "梦见明亮水面或山路开阔，象征阻力变小。", do: "宜推进关键计划", avoid: "忌拖延和反复摇摆", lucky: "晨间、青色" },
  { title: "上签", level: "吉", dream: "梦见顺风前行，代表外部协助增加。", do: "宜主动联系贵人", avoid: "忌闭门独行", lucky: "东南方位、木纹物件" },
  { title: "中上签", level: "小吉", dream: "梦见高处俯瞰，暗示视角提升。", do: "宜做中期规划", avoid: "忌只盯短期得失", lucky: "午后、金色" },
  { title: "中签", level: "平稳", dream: "梦见日常场景重复，提示节奏需要优化。", do: "宜先稳后进", avoid: "忌一次开太多战线", lucky: "白色、整洁桌面" },
  { title: "中签", level: "平", dream: "梦见走路缓慢，代表恢复阶段。", do: "宜补眠与整理", avoid: "忌情绪化决策", lucky: "温水、早睡" },
  { title: "中下签", level: "小阻", dream: "梦见路口迷失，提醒信息过载。", do: "宜减法管理任务", avoid: "忌临时加码", lucky: "灰蓝色、安静环境" },
  { title: "下签", level: "谨慎", dream: "梦见追赶却迟到，反映时间焦虑。", do: "宜卡点复盘", avoid: "忌答应超负荷安排", lucky: "纸笔清单、傍晚散步" },
  { title: "转运签", level: "先抑后扬", dream: "梦见雨后转晴，预示状态正在回升。", do: "宜完成一个旧任务", avoid: "忌反刍旧情绪", lucky: "雨后空气、深呼吸" },
  { title: "守成签", level: "稳中有进", dream: "梦见守门看灯，提示当下以稳为先。", do: "宜守住核心节奏", avoid: "忌冲动换轨", lucky: "暖色灯光、固定作息" },
  { title: "开运签", level: "吉", dream: "梦见开门见光，象征新机会显现。", do: "宜尝试一次新合作", avoid: "忌先入为主", lucky: "赤色点缀、清晨行动" }
];

function getTodayId() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatDateZh(dateId) {
  const [y, m, d] = dateId.split("-");
  return `${y}年${m}月${d}日`;
}

function seededIndex(seedText, max) {
  let hash = 0;
  for (let i = 0; i < seedText.length; i += 1) {
    hash = (hash * 131 + seedText.charCodeAt(i)) >>> 0;
  }
  return hash % max;
}

function readTodayLot(todayId) {
  try {
    const raw = localStorage.getItem(DAILY_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (!parsed || parsed.date !== todayId || typeof parsed.index !== "number") {
      return null;
    }
    return parsed;
  } catch (_) {
    return null;
  }
}

function saveTodayLot(todayId, index) {
  localStorage.setItem(DAILY_KEY, JSON.stringify({ date: todayId, index }));
}

function renderLot(lot, isPreview) {
  lotCard.classList.remove("waiting");
  lotCard.classList.add("revealed");
  lotTitle.textContent = lot.title;
  lotLevel.textContent = `运势：${lot.level}`;
  lotDream.innerHTML = `<strong>梦境提示：</strong>${lot.dream}`;
  lotDo.innerHTML = `<strong>宜：</strong>${lot.do}`;
  lotAvoid.innerHTML = `<strong>忌：</strong>${lot.avoid}`;
  lotLucky.innerHTML = `<strong>幸运象：</strong>${lot.lucky}`;
  dailyTip.textContent = isPreview
    ? "这是试抽签，仅供参考，不会覆盖你的今日签。"
    : "今日签已锁定，你可以明天再来抽取新签。";
}

function triggerRevealAnimation() {
  lotCard.classList.remove("reveal-anim");
  void lotCard.offsetWidth;
  lotCard.classList.add("reveal-anim");
}

function init() {
  const todayId = getTodayId();
  todayText.textContent = formatDateZh(todayId);

  const existing = readTodayLot(todayId);
  if (existing) {
    renderLot(LOTS[existing.index], false);
    drawBtn.textContent = "今日已抽签";
    drawBtn.disabled = true;
    return;
  }

  drawBtn.addEventListener("click", () => {
    const index = seededIndex(`${todayId}-lot`, LOTS.length);
    saveTodayLot(todayId, index);
    triggerRevealAnimation();
    renderLot(LOTS[index], false);
    drawBtn.textContent = "今日已抽签";
    drawBtn.disabled = true;
  });

  previewBtn.addEventListener("click", () => {
    const timestampSeed = `${todayId}-${Date.now()}`;
    const index = seededIndex(timestampSeed, LOTS.length);
    triggerRevealAnimation();
    renderLot(LOTS[index], true);
  });
}

init();
