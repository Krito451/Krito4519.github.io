// 全局变量
let spiritCount = 5; // 默认每队精灵数量
let banTime = 30; // 默认禁用时间（秒）
let pickTime = 30; // 默认选择时间（秒）
let teamNames = {
    blue: '蓝队',
    red: '红队'
};
let currentTimer;
let isSelectionStarted = false;
let isPaused = false;
let currentStep = 0;
let currentTeam = 'blue';
let currentSlot = 0;
let currentSelectionStart;
let selectionHistory = [];
let shouldShowPhaseNotification = true;

// 在全局变量区域添加
let isDeleteMode = false;

// 定义 phases 数组
const phases = [
    { team: 'blue', action: 'ban' },
    { team: 'red', action: 'ban' },
    { team: 'blue', action: 'ban' },
    { team: 'red', action: 'ban' },
    { team: 'blue', action: 'ban' },
    { team: 'red', action: 'ban' },
    { team: 'blue', action: 'pick' },
    { team: 'red', action: 'pick' },
    { team: 'red', action: 'pick' },
    { team: 'blue', action: 'pick' },
    { team: 'blue', action: 'pick' },
    { team: 'red', action: 'pick' },
    { team: 'blue', action: 'ban' },
    { team: 'red', action: 'ban' },
    { team: 'blue', action: 'ban' },
    { team: 'red', action: 'ban' },
    { team: 'red', action: 'pick' },
    { team: 'blue', action: 'pick' },
    { team: 'blue', action: 'pick' },
    { team: 'red', action: 'pick' }
];

// 在全局变量区域添加
const totalSteps = phases.length;

// 定义 selectedSpirits 和 bannedSpirits
let selectedSpirits = { blue: [], red: [] };
let bannedSpirits = { blue: [], red: [] };

// 将精灵数组设置为空
const spirits = [];

// 在文件开头，全局变量区域添加以下代码

// 预定义的精灵数据
const predefinedSpirits = [
  {
    "id": 1,
    "name": "[神运]伟大航路·尼莫妮",
    "attribute": "神水",
    "rarity": "神运",
    "types": ["神平衡", "神通灵师"]
  },
  {
    "id": 2,
    "name": "[神运]神谕壮志·青云",
    "attribute": "神水",
    "rarity": "神运",
    "types": ["神速"]
  },
  {
    "id": 3,
    "name": "[神运]辉映溯梦·王者",
    "attribute": "神水",
    "rarity": "神运",
    "types": ["神速", "赋能师"]
  },
  {
    "id": 4,
    "name": "[神运]星穹圣王·帝释天",
    "attribute": "神水",
    "rarity": "神运",
    "types": ["神速"]
  },
  {
    "id": 5,
    "name": "[神运]卓识极睿·哆啦",
    "attribute": "神水",
    "rarity": "神运",
    "types": ["神盾", "超级英雄"]
  },
  {
    "id": 6,
    "name": "[神运]光年信使·蜜西西",
    "attribute": "神水",
    "rarity": "神运",
    "types": ["神速", "超级英雄"]
  },
  {
    "id": 7,
    "name": "[神运]双鱼座·帕希思",
    "attribute": "神水",
    "rarity": "神运",
    "types": ["神平衡"]
  },
  {
    "id": 8,
    "name": "[星迹]神怒王者·秩序",
    "attribute": "神水",
    "rarity": "星迹",
    "types": ["神速", "超级英雄"]
  },
  {
    "id": 9,
    "name": "[星迹]璨星梦启·星绛",
    "attribute": "神水",
    "rarity": "星迹",
    "types": ["神速"]
  },
  {
    "id": 10,
    "name": "[星迹]奇迹濯世·帝释天",
    "attribute": "神水",
    "rarity": "星迹",
    "types": ["神盾"]
  },
  {
    "id": 11,
    "name": "[神运]天地逆命·我自不动",
    "attribute": "神草",
    "rarity": "神运",
    "types": ["神盾"]
  },
  {
    "id": 12,
    "name": "[神运]沉灵诉梦·盖西瑞",
    "attribute": "神草",
    "rarity": "神运",
    "types": ["神盾"]
  },
  {
    "id": 13,
    "name": "[神运]神佑长生·药郎",
    "attribute": "神草",
    "rarity": "神运",
    "types": ["神盾"]
  },
  {
    "id": 14,
    "name": "[神运]创界神机·昆仑",
    "attribute": "神草",
    "rarity": "神运",
    "types": ["神攻", "神通灵师"]
  },
  {
    "id": 15,
    "name": "[神运]仙荒地皇·女娲",
    "attribute": "神草",
    "rarity": "神运",
    "types": ["神攻"]
  },
  {
    "id": 16,
    "name": "[神运]青穹之骑·阿特拉斯",
    "attribute": "神草",
    "rarity": "神运",
    "types": ["神盾"]
  },
  {
    "id": 17,
    "name": "[神运]森邃灵王·阿瑞斯",
    "attribute": "神草",
    "rarity": "神运",
    "types": ["神盾"]
  },
  {
    "id": 18,
    "name": "[神运]八荒伏苍·天蛮王",
    "attribute": "神草",
    "rarity": "神运",
    "types": ["神平衡", "神召唤师", "超级英雄"]
  },
  {
    "id": 19,
    "name": "[神运]知贤沉毅·炼金",
    "attribute": "神草",
    "rarity": "神运",
    "types": ["神平衡", "神召唤师"]
  },
  {
    "id": 20,
    "name": "[神运]森籁圣灵·卡雅",
    "attribute": "神草",
    "rarity": "神运",
    "types": ["神速", "超级英雄"]
  },
  {
    "id": 21,
    "name": "[神运]谋定千古·诸葛亮",
    "attribute": "神草",
    "rarity": "神运",
    "types": ["神平衡"]
  },
  {
    "id": 22,
    "name": "[神运]花间精灵·拇指姑娘",
    "attribute": "神草",
    "rarity": "神运",
    "types": ["神速"]
  },
  {
    "id": 23,
    "name": "[神运]阵法相生·九九",
    "attribute": "神草",
    "rarity": "神运",
    "types": ["神平衡", "元素师"]
  },
  {
    "id": 24,
    "name": "[神运]禅心武圣·熊猫",
    "attribute": "神草",
    "rarity": "神运",
    "types": ["神平衡"]
  },
  {
    "id": 25,
    "name": "[星迹]爱与美神·温",
    "attribute": "神草",
    "rarity": "星迹",
    "types": ["神盾", "神召唤师"]
  },
  {
    "id": 26,
    "name": "[星迹]鹰翎破空·阿瑞斯",
    "attribute": "神草",
    "rarity": "星迹",
    "types": ["元素师", "神召唤师", "超级英雄", "神盾"]
  },
  {
    "id": 27,
    "name": "[星迹]奇迹森辉·阿瑞斯",
    "attribute": "神草",
    "rarity": "星迹",
    "types": ["神盾"]
  },
  {
    "id": 28,
    "name": "[星迹]创界神守·界皇",
    "attribute": "神草",
    "rarity": "星迹",
    "types": ["神速", "赋能师"]
  },
  {
    "id": 29,
    "name": "[星迹]芙蓉如面·大乔",
    "attribute": "神草",
    "rarity": "星迹",
    "types": ["神速"]
  },
  {
    "id": 30,
    "name": "[星迹]虚空之战·苍零式",
    "attribute": "神草",
    "rarity": "星迹",
    "types": ["神攻", "超级英雄"]
  },
  {
    "id": 31,
    "name": "[星迹]拾光森林·芙拉洛",
    "attribute": "神草",
    "rarity": "星迹",
    "types": ["神速"]
  },
  {
    "id": 32,
    "name": "[星迹]序律龙皇·阿瑞斯",
    "attribute": "神水",
    "rarity": "星迹",
    "types": ["神盾"]
  },
  {
    "id": 33,
    "name": "[星迹]诚实之主·鳏夫",
    "attribute": "神水",
    "rarity": "星迹",
    "types": ["神速"]
  },
  {
    "id": 34,
    "name": "[星迹]孤星枭骥·帝释天",
    "attribute": "神水",
    "rarity": "星迹",
    "types": ["神速", "超级英雄", "元素师"]
  },
  {
    "id": 35,
    "name": "[星迹]怒海倾天·兰德斯",
    "attribute": "神水",
    "rarity": "星迹",
    "types": ["神盾", "神通灵师"]
  },
  {
    "id": 36,
    "name": "[星迹]千谎真言·姆米拉",
    "attribute": "神水",
    "rarity": "星迹",
    "types": ["神速", "赋能师"]
  },
  {
    "id": 37,
    "name": "[星迹]归理世清·秩序",
    "attribute": "神水",
    "rarity": "星迹",
    "types": ["神速"]
  },
  {
    "id": 38,
    "name": "[星迹]英雄归来·空皇",
    "attribute": "神水",
    "rarity": "星迹",
    "types": ["神速", "超级英雄"]
  },
  {
    "id": 39,
    "name": "[星迹]冷魄霜华·冰灵王",
    "attribute": "神水",
    "rarity": "星迹",
    "types": ["神盾", "超级英雄"]
  },
  {
    "id": 40,
    "name": "[星迹]肃杀冷星·维多利亚",
    "attribute": "神水",
    "rarity": "星迹",
    "types": ["神速"]
  },
  {
    "id": 41,
    "name": "[星迹]晴雪冷喵·冰奇布",
    "attribute": "神水",
    "rarity": "星迹",
    "types": ["神速", "元素师"]
  },
  {
    "id": 42,
    "name": "[星迹]擎浪·沧海狂神",
    "attribute": "神水",
    "rarity": "星迹",
    "types": ["神盾", "超级英雄"]
  },
  {
    "id": 43,
    "name": "[星迹]天幕秩序·龙尊",
    "attribute": "神水",
    "rarity": "星迹",
    "types": ["神速"]
  },
  {
    "id": 44,
    "name": "[神运]焚业·无烬龙尊",
    "attribute": "神火",
    "rarity": "神运",
    "types": ["神攻"]
  },
  {
    "id": 45,
    "name": "[神运]灼天焚寂·次元龙",
    "attribute": "神火",
    "rarity": "神运",
    "types": ["神攻"]
  },
  {
    "id": 46,
    "name": "[神运]神拾忆梦·弥梦离",
    "attribute": "神火",
    "rarity": "神运",
    "types": ["神平衡"]
  },
  {
    "id": 47,
    "name": "[神运]圣璨玄暝·无烬",
    "attribute": "神火",
    "rarity": "神运",
    "types": ["神平衡", "超级英雄"]
  },
  {
    "id": 48,
    "name": "[神运]创启初元·昆吾",
    "attribute": "神火",
    "rarity": "神运",
    "types": ["神平衡", "神通灵师"]
  },
  {
    "id": 49,
    "name": "[星迹]璨金之王·龙尊",
    "attribute": "神火",
    "rarity": "星迹",
    "types": ["神速", "神召唤师"]
  },
  {
    "id": 50,
    "name": "[神运]神引因缘·满月",
    "attribute": "神火",
    "rarity": "神运",
    "types": ["神攻"]
  },
  {
    "id": 51,
    "name": "[神运]曼欲魅魇·欲蝶",
    "attribute": "神火",
    "rarity": "神运",
    "types": ["神速"]
  },
  {
    "id": 52,
    "name": "[神运]烬狮王者·龙炎",
    "attribute": "神火",
    "rarity": "神运",
    "types": ["神平衡", "超级英雄"]
  },
  {
    "id": 53,
    "name": "[神运]极炽狂神·龙炎",
    "attribute": "神火",
    "rarity": "神运",
    "types": ["神平衡"]
  },
  {
    "id": 54,
    "name": "[神运]烈焰莲凰·末炎",
    "attribute": "神火",
    "rarity": "神运",
    "types": ["神速", "神召唤师", "超级英雄"]
  },
  {
    "id": 55,
    "name": "[神运]燃英炽勇·热血",
    "attribute": "神火",
    "rarity": "神运",
    "types": ["神速"]
  },
  {
    "id": 56,
    "name": "[神运]糖果屋·格莱特",
    "attribute": "神火",
    "rarity": "神运",
    "types": ["神速"]
  },
  {
    "id": 57,
    "name": "[神运]圣空除邪·斗战胜佛",
    "attribute": "神火",
    "rarity": "神运",
    "types": ["神攻"]
  },
  {
    "id": 58,
    "name": "[神运]火羽仙姬·朱雀",
    "attribute": "神火",
    "rarity": "神运",
    "types": ["神攻"]
  },
  {
    "id": 59,
    "name": "[神运]小白鸡",
    "attribute": "神火",
    "rarity": "神运",
    "types": ["神速"]
  },
  {
    "id": 60,
    "name": "[星迹]晨曦炽焰·爱灵",
    "attribute": "神火",
    "rarity": "星迹",
    "types": ["神攻", "神通灵师"]
  },
  {
    "id": 61,
    "name": "[星迹]奇迹焰煌·龙炎",
    "attribute": "神火",
    "rarity": "星迹",
    "types": ["神平衡"]
  },
  {
    "id": 62,
    "name": "[星迹]戮炎龙皇·龙炎",
    "attribute": "神火",
    "rarity": "星迹",
    "types": ["神平衡"]
  },
  {
    "id": 63,
    "name": "[星迹]焱生虚无·伏妖",
    "attribute": "神火",
    "rarity": "星迹",
    "types": ["神平衡", "神通灵师"]
  },
  {
    "id": 64,
    "name": "[星迹]赤骑士·薇科诺",
    "attribute": "神火",
    "rarity": "星迹",
    "types": ["神攻"]
  },
  {
    "id": 65,
    "name": "[星迹]百变万相·幻皇",
    "attribute": "神火",
    "rarity": "星迹",
    "types": ["神平衡", "神召唤师"]
  },
  {
    "id": 66,
    "name": "[星迹]蜜语甜心·茜茜",
    "attribute": "神火",
    "rarity": "星迹",
    "types": ["神速"]
  },
  {
    "id": 67,
    "name": "[星迹]赤妖原烬·御神",
    "attribute": "神火",
    "rarity": "星迹",
    "types": ["神平衡", "超级英雄"]
  },
  {
    "id": 68,
    "name": "[星迹]神诡堕天·路西法",
    "attribute": "神火",
    "rarity": "星迹",
    "types": ["神速", "元素师"]
  },
  {
    "id": 69,
    "name": "[神运]咒梦迷魇·维蕾塔",
    "attribute": "神暗",
    "rarity": "神运",
    "types": ["攻"]
  },
  {
    "id": 70,
    "name": "[神运]冥羽终灭·艾希",
    "attribute": "神暗",
    "rarity": "神运",
    "types": ["神攻"]
  },
  {
    "id": 71,
    "name": "[神运]玄黑之子·伊西多",
    "attribute": "神暗",
    "rarity": "神运",
    "types": ["神平衡", "神召唤师"]
  },
  {
    "id": 72,
    "name": "[神运]黑桃魔王·莉莉丝",
    "attribute": "神暗",
    "rarity": "神运",
    "types": ["神平衡", "超级英雄"]
  },
  {
    "id": 73,
    "name": "[神运]沉冥夙夜·末炎",
    "attribute": "神暗",
    "rarity": "神运",
    "types": ["神速", "神召唤师", "超级英雄"]
  },
  {
    "id": 74,
    "name": "[神运]圣佑缚厄·暗黑",
    "attribute": "神暗",
    "rarity": "神运",
    "types": ["神攻", "神通灵师"]
  },
  {
    "id": 75,
    "name": "[神运]虚言偶影·匹诺曹",
    "attribute": "神暗",
    "rarity": "神运",
    "types": ["神平衡"]
  },
  {
    "id": 76,
    "name": "[神运]夜羽冥离·洛世琦",
    "attribute": "神暗",
    "rarity": "神运",
    "types": ["神平衡"]
  },
  {
    "id": 77,
    "name": "[神运]摩羯座·卡帕莉娅",
    "attribute": "神暗",
    "rarity": "神运",
    "types": ["神盾"]
  },
  {
    "id": 78,
    "name": "[星迹]不灭终妄·巴兰",
    "attribute": "神暗",
    "rarity": "星迹",
    "types": ["神盾", "超级英雄"]
  },
  {
    "id": 79,
    "name": "[星迹]天灾帝狱·但丁",
    "attribute": "神暗",
    "rarity": "星迹",
    "types": ["神盾", "神通灵师"]
  },
  {
    "id": 80,
    "name": "[星迹]奇迹影渊·修尔",
    "attribute": "神暗",
    "rarity": "星迹",
    "types": ["神速"]
  },
  {
    "id": 81,
    "name": "[星迹]蚀血烁刃·黄金",
    "attribute": "神暗",
    "rarity": "星迹",
    "types": ["神盾", "赋能师"]
  },
  {
    "id": 82,
    "name": "[星迹]未完天际·超神",
    "attribute": "神暗",
    "rarity": "星迹",
    "types": ["神速", "超级英雄"]
  },
  {
    "id": 83,
    "name": "[星迹]黯然映夜·弥梦离",
    "attribute": "神暗",
    "rarity": "星迹",
    "types": ["神速"]
  },
  {
    "id": 84,
    "name": "[星迹]未尽美神·玻丽娅",
    "attribute": "神暗",
    "rarity": "星迹",
    "types": ["神速"]
  },
  {
    "id": 85,
    "name": "[星迹]末影狼王·修尔",
    "attribute": "神暗",
    "rarity": "星迹",
    "types": ["神速", "元素师", "超级英雄"]
  },
  {
    "id": 86,
    "name": "[星迹]无止轮回·正理",
    "attribute": "神暗",
    "rarity": "星迹",
    "types": ["神速"]
  },
  {
    "id": 87,
    "name": "[星迹]神灭无生·法纳斯",
    "attribute": "神暗",
    "rarity": "星迹",
    "types": ["神速", "神通灵师"]
  },
  {
    "id": 88,
    "name": "[星迹]黑骑士·布莱德",
    "attribute": "神暗",
    "rarity": "星迹",
    "types": ["神平衡"]
  },
  {
    "id": 89,
    "name": "[星迹]绝灭魔神·修尔",
    "attribute": "神暗",
    "rarity": "星迹",
    "types": ["神速"]
  },
  {
    "id": 90,
    "name": "[星迹]涤罪魔主·多洛莉丝",
    "attribute": "神暗",
    "rarity": "星迹",
    "types": ["神平衡", "赋能师"]
  },
  {
    "id": 91,
    "name": "[星迹]终神无暗·尤列尔",
    "attribute": "神暗",
    "rarity": "星迹",
    "types": ["神攻", "超级英雄"]
  },
  {
    "id": 92,
    "name": "[星迹]魔渊血怒·冥皇",
    "attribute": "神暗",
    "rarity": "迹",
    "types": ["神攻", "赋能师"]
  },
  {
    "id": 93,
    "name": "[星迹]极夜幽影·月影王",
    "attribute": "神暗",
    "rarity": "星迹",
    "types": ["神速", "超级英雄", "神召唤师"]
  },
  {
    "id": 94,
    "name": "[星迹]拾光碎梦·伊丽莎白",
    "attribute": "神暗",
    "rarity": "星迹",
    "types": ["神速"]
  },
  {
    "id": 95,
    "name": "[星迹]沙浪惊波·洛萨",
    "attribute": "神暗",
    "rarity": "星迹",
    "types": ["神速", "超级英雄"]
  },
  {
    "id": 96,
    "name": "[星迹]尘世龙女·耶梦加得",
    "attribute": "神暗",
    "rarity": "星迹",
    "types": ["神速", "元素师"]
  },
  {
    "id": 97,
    "name": "降不休",
    "attribute": "神光",
    "rarity": "神运",
    "types": ["神平衡"]
  },
  {
    "id": 98,
    "name": "空不休",
    "attribute": "神光",
    "rarity": "神运",
    "types": ["神平衡"]
  },
  {
    "id": 99,
    "name": "诛不休",
    "attribute": "神光",
    "rarity": "神运",
    "types": ["神平衡"]
  },
  {
    "id": 100,
    "name": "[神运]神权王者·龙尊",
    "attribute": "神光",
    "rarity": "神运",
    "types": ["神攻"]
  },
  {
    "id": 101,
    "name": "[神运]神刹次元·龙尊",
    "attribute": "神光",
    "rarity": "神运",
    "types": ["神攻"]
  },
  {
    "id": 102,
    "name": "[神运]绝域时空·龙尊",
    "attribute": "神光",
    "rarity": "神运",
    "types": ["神攻"]
  },
  {
    "id": 103,
    "name": "[神运]统界次元·龙尊",
    "attribute": "神光",
    "rarity": "神运",
    "types": ["神盾", "超级英雄"]
  },
  {
    "id": 104,
    "name": "[神运]时驭王者·时空",
    "attribute": "神光",
    "rarity": "神运",
    "types": ["神攻", "超级英雄"]
  },
  {
    "id": 105,
    "name": "[神运]至崇龙尊·圣主",
    "attribute": "神光",
    "rarity": "神运",
    "types": ["神盾", "神召唤师"]
  },
  {
    "id": 106,
    "name": "[神运]日月圣辉·诺雅",
    "attribute": "神光",
    "rarity": "神运",
    "types": ["神平衡", "神通灵师"]
  },
  {
    "id": 107,
    "name": "[神运]天辉星钥·启",
    "attribute": "神光",
    "rarity": "神运",
    "types": ["神平衡", "元素师", "神召唤师"]
  },
  {
    "id": 108,
    "name": "[神运]神愿千金·金玉",
    "attribute": "神光",
    "rarity": "神运",
    "types": ["神平衡"]
  },
  {
    "id": 109,
    "name": "[神运]无上今绝·无敌",
    "attribute": "神光",
    "rarity": "神运",
    "types": ["神攻", "神通灵师"]
  },
  {
    "id": 110,
    "name": "[神运]祈月王者·诺雅",
    "attribute": "神光",
    "rarity": "神运",
    "types": ["神速", "超级英雄"]
  },
  {
    "id": 111,
    "name": "[星迹]日月双昇·诺雅",
    "attribute": "神光",
    "rarity": "星迹",
    "types": ["神平衡", "超级英雄"]
  },
  {
    "id": 112,
    "name": "[神运]掣电霆凰·诺亚",
    "attribute": "神光",
    "rarity": "神运",
    "types": ["神攻", "元素师", "超级英雄"]
  },
  {
    "id": 113,
    "name": "[神运]时运天神·诺亚",
    "attribute": "神光",
    "rarity": "神运",
    "types": ["神攻"]
  },
  {
    "id": 114,
    "name": "[神运]皓光龙魂·光明王",
    "attribute": "神光",
    "rarity": "神运",
    "types": ["神攻", "超级英雄", "神召唤师"]
  },
  {
    "id": 115,
    "name": "[神运]圣洁愈灵·爱心",
    "attribute": "神光",
    "rarity": "神运",
    "types": ["神平衡"]
  },
  {
    "id": 116,
    "name": "[神运]神剑万钧·龙神",
    "attribute": "神光",
    "rarity": "神运",
    "types": ["神速", "超级英雄"]
  },
  {
    "id": 117,
    "name": "[神运]光羽启世·夕",
    "attribute": "神光",
    "rarity": "神运",
    "types": ["神平衡"]
  },
  {
    "id": 118,
    "name": "[神运]神熠圣魔·大天使",
    "attribute": "神光",
    "rarity": "神运",
    "types": ["神平衡", "超级英雄"]
  },
  {
    "id": 119,
    "name": "[神运]遥夜烛光·火柴女孩",
    "attribute": "神光",
    "rarity": "神运",
    "types": ["神速"]
  },
  {
    "id": 120,
    "name": "[神运]梦幻星宴·灰姑娘",
    "attribute": "神光",
    "rarity": "神运",
    "types": ["神速"]
  },
  {
    "id": 121,
    "name": "[神运]狮子座·莉奥",
    "attribute": "神光",
    "rarity": "神运",
    "types": ["神攻"]
  },
  {
    "id": 122,
    "name": "[神运]星芒辰辉·玉麒麟",
    "attribute": "神光",
    "rarity": "神运",
    "types": ["神平衡", "超级英雄"]
  },
  {
    "id": 123,
    "name": "[神运]灭罪神雷·星格",
    "attribute": "神光",
    "rarity": "神运",
    "types": ["神攻"]
  },
  {
    "id": 124,
    "name": "[星迹]一梦此生·诺亚",
    "attribute": "神光",
    "rarity": "星迹",
    "types": ["神平衡"]
  },
  {
    "id": 125,
    "name": "[星迹]崇元龙皇·诺亚",
    "attribute": "神光",
    "rarity": "星迹",
    "types": ["神攻", "元素师"]
  },
  {
    "id": 126,
    "name": "[星迹]行空龙皇·修尔",
    "attribute": "神光",
    "rarity": "星迹",
    "types": ["神速"]
  },
  {
    "id": 127,
    "name": "[星迹]真理符心·图鲁斯",
    "attribute": "神光",
    "rarity": "星迹",
    "types": ["神平衡"]
  },
  {
    "id": 128,
    "name": "[星迹]曜金龙皇·阿瑞斯",
    "attribute": "神光",
    "rarity": "星迹",
    "types": ["神盾"]
  },
  {
    "id": 129,
    "name": "[星迹]御胜黄金·龙尊",
    "attribute": "神光",
    "rarity": "星迹",
    "types": ["神盾", "超级英雄"]
  },
  {
    "id": 130,
    "name": "[星迹]暴戾之雷·噩礼丝",
    "attribute": "神光",
    "rarity": "星迹",
    "types": ["神速"]
  },
  {
    "id": 131,
    "name": "[星迹]始神赋光·拉斐尔",
    "attribute": "神光",
    "rarity": "星迹",
    "types": ["神速"]
  },
  {
    "id": 132,
    "name": "[星迹]圣域曙光·元皇",
    "attribute": "神光",
    "rarity": "星迹",
    "types": ["神盾", "赋能师"]
  },
  {
    "id": 133,
    "name": "[星迹]梦蝶翩舞·潘多拉",
    "attribute": "神光",
    "rarity": "星迹",
    "types": ["神攻"]
  },
  {
    "id": 134,
    "name": "[星迹]静夜梦回·幻心晴",
    "attribute": "神光",
    "rarity": "星迹",
    "types": ["神速"]
  },
  {
    "id": 135,
    "name": "[星迹]荣光圣骑士·白起",
    "attribute": "神光",
    "rarity": "星迹",
    "types": ["神盾", "元素师"]
  },
  {
    "id": 136,
    "name": "[神运]星瀚超神·龙尊",
    "attribute": "神灵",
    "rarity": "神运",
    "types": ["神速"]
  },
  {
    "id": 137,
    "name": "[神运]奥秘·小亚咪",
    "attribute": "神灵",
    "rarity": "神运",
    "types": ["神速", "幻元师"]
  },
  {
    "id": 138,
    "name": "[神运]乐律之神·音织",
    "attribute": "神灵",
    "rarity": "神运",
    "types": ["神盾", "超级英雄"]
  },
  {
    "id": 139,
    "name": "[神运]奇梦筑宇·伊桑",
    "attribute": "神灵",
    "rarity": "神运",
    "types": ["神攻", "神通灵师"]
  },
  {
    "id": 140,
    "name": "[神运]紫晖圣女·菲娜娜",
    "attribute": "神灵",
    "rarity": "神运",
    "types": ["神攻"]
  },
  {
    "id": 141,
    "name": "[神运]造灵王者·以撒",
    "attribute": "神灵",
    "rarity": "神运",
    "types": ["神平衡", "超级英雄", "元素师"]
  },
  {
    "id": 142,
    "name": "[神运]噬梦绮想·梅丽",
    "attribute": "神灵",
    "rarity": "神运",
    "types": ["神攻"]
  },
  {
    "id": 143,
    "name": "[神运]护航战线·希罗德",
    "attribute": "神灵",
    "rarity": "神运",
    "types": ["神平衡", "超级英雄"]
  },
  {
    "id": 144,
    "name": "[神运]造物纪元·以撒",
    "attribute": "神灵",
    "rarity": "神运",
    "types": ["神平衡"]
  },
  {
    "id": 145,
    "name": "[神运]成仁幽烛·坎德尔",
    "attribute": "神灵",
    "rarity": "神运",
    "types": ["神平衡"]
  },
  {
    "id": 146,
    "name": "[神运]神谕命绘·女帝",
    "attribute": "神灵",
    "rarity": "神运",
    "types": ["神盾", "神通灵师"]
  },
  {
    "id": 147,
    "name": "[神运]神决御命·梵天",
    "attribute": "神灵",
    "rarity": "神运",
    "types": ["神速"]
  },
  {
    "id": 148,
    "name": "[神运]识海学神·帝一鸣",
    "attribute": "神灵",
    "rarity": "神运",
    "types": ["神速", "神召唤师", "超级英雄"]
  },
  {
    "id": 149,
    "name": "[神运]超凡傲宇·超能",
    "attribute": "神灵",
    "rarity": "神运",
    "types": ["神攻"]
  },
  {
    "id": 150,
    "name": "[神运]绘梦成境·梅尔",
    "attribute": "神灵",
    "rarity": "神运",
    "types": ["神攻", "超级英雄"]
  },
  {
    "id": 151,
    "name": "[神运]继承兆示·以世",
    "attribute": "神灵",
    "rarity": "神运",
    "types": ["神平衡", "超级英雄"]
  },
  {
    "id": 152,
    "name": "[神运]万界洞悉·塔梨",
    "attribute": "神灵",
    "rarity": "神运",
    "types": ["神盾"]
  },
  {
    "id": 153,
    "name": "[神运]长梦沉眠·玫瑰公主",
    "attribute": "神灵",
    "rarity": "神运",
    "types": ["神盾"]
  },
  {
    "id": 154,
    "name": "[神运]翎梦轻羽·丑小鸭",
    "attribute": "神灵",
    "rarity": "神运",
    "types": ["神攻"]
  },
  {
    "id": 155,
    "name": "[神运]五行道主·乾坤",
    "attribute": "神灵",
    "rarity": "神运",
    "types": ["神速", "元素师"]
  },
  {
    "id": 156,
    "name": "[神运]螭云逸仙·腾蛇",
    "attribute": "神灵",
    "rarity": "神运",
    "types": ["神盾"]
  },
  {
    "id": 157,
    "name": "[星迹]奇迹颂主·蜜蕊可",
    "attribute": "神灵",
    "rarity": "星迹",
    "types": ["神速", "神召唤师"]
  },
  {
    "id": 158,
    "name": "[星迹]掌御星寰·帝释天",
    "attribute": "神灵",
    "rarity": "星迹",
    "types": ["神速"]
  },
  {
    "id": 159,
    "name": "[星迹]天行无序·昧",
    "attribute": "神灵",
    "rarity": "星迹",
    "types": ["神攻"]
  },
  {
    "id": 160,
    "name": "[星迹]白骑士·寺",
    "attribute": "神灵",
    "rarity": "星迹",
    "types": ["神速"]
  },
  {
    "id": 161,
    "name": "[星迹]王始独尊·嬴政",
    "attribute": "神灵",
    "rarity": "星迹",
    "types": ["神攻"]
  },
  {
    "id": 162,
    "name": "[神运]造化神筑·弥娅",
    "attribute": "神幻",
    "rarity": "神运",
    "types": ["神平衡", "神通灵师"]
  },
  {
    "id": 163,
    "name": "[神运]终渊遗音·薄伽丘",
    "attribute": "神幻",
    "rarity": "神运",
    "types": ["神平衡", "超级英雄"]
  },
  {
    "id": 164,
    "name": "[神运]曦日希望·夏因",
    "attribute": "神幻",
    "rarity": "神运",
    "types": ["神平衡", "神召唤师"]
  },
  {
    "id": 165,
    "name": "[神运]无罪冠冕·王者",
    "attribute": "神幻",
    "rarity": "神运",
    "types": ["神平衡", "赋能师"]
  },
  {
    "id": 166,
    "name": "[神运]殛魔幻主·安",
    "attribute": "神幻",
    "rarity": "神运",
    "types": ["神平衡"]
  },
  {
    "id": 167,
    "name": "[神运]魔镜媚影·白雪皇后",
    "attribute": "神幻",
    "rarity": "神运",
    "types": ["神速"]
  },
  {
    "id": 168,
    "name": "[神运]处女座·薇尔戈",
    "attribute": "神幻",
    "rarity": "神运",
    "types": ["神攻"]
  },
  {
    "id": 169,
    "name": "[星迹]封魔之主·黛安娜",
    "attribute": "神幻",
    "rarity": "星迹",
    "types": ["神速", "神通灵师"]
  },
  {
    "id": 170,
    "name": "[星迹]神预龙皇·梵天",
    "attribute": "神幻",
    "rarity": "星迹",
    "types": ["神速", "超级英雄"]
  },
  {
    "id": 171,
    "name": "[星迹]极幻冕下·正理",
    "attribute": "神幻",
    "rarity": "星迹",
    "types": ["神盾", "赋能师"]
  },
  {
    "id": 172,
    "name": "神运幻诺",
    "attribute": "神幻",
    "rarity": "神运",
    "types": ["神攻"]
  },
  {
    "id": 173,
    "name": "[星迹]坠王之途·阿洛伊斯",
    "attribute": "神幻",
    "rarity": "星迹",
    "types": ["神平衡"]
  },
  {
    "id": 174,
    "name": "神运正义",
    "attribute": "神幻",
    "rarity": "神运",
    "types": ["神速", "神召唤师"]
  },
  {
    "id": 175,
    "name": "[星迹]幻光璃梦·洛世琦",
    "attribute": "神幻",
    "rarity": "星迹",
    "types": ["神平衡"]
  },
  {
    "id": 176,
    "name": "神运碎空",
    "attribute": "神幻",
    "rarity": "神运",
    "types": ["神平衡", "超级英雄"]
  },
  {
    "id": 177,
    "name": "[神运]虚湮噬神·薄伽丘",
    "attribute": "神无极",
    "rarity": "神运",
    "types": ["神平衡"]
  },
  {
    "id": 178,
    "name": "[星迹]神狱破魔·路因加德",
    "attribute": "神无极",
    "rarity": "星迹",
    "types": ["神盾", "超级英雄"]
  },
  {
    "id": 179,
    "name": "[星迹]绝命终湮·路因加德",
    "attribute": "神无极",
    "rarity": "星迹",
    "types": ["神速", "天觉者"]
  },
  {
    "id": 180,
    "name": "[神运]神铸希望·夏因",
    "attribute": "神无极",
    "rarity": "神运",
    "types": ["神速"]
  },
  {
    "id": 181,
    "name": "[神运]天鉴圣裁·龙尊",
    "attribute": "神无极",
    "rarity": "神运",
    "types": ["神速"]
  },
  {
    "id": 182,
    "name": "[神运]天断罪裁·龙尊",
    "attribute": "神无极",
    "rarity": "神运",
    "types": ["神攻"]
  },
  {
    "id": 183,
    "name": "[神运]唤灵至高·究",
    "attribute": "神无极",
    "rarity": "神运",
    "types": ["神平衡", "神通灵师"]
  },
  {
    "id": 184,
    "name": "[神运]境迁·无限未来",
    "attribute": "神无极",
    "rarity": "神运",
    "types": ["神平衡", "神通灵师"]
  },
  {
    "id": 185,
    "name": "[星迹]天怒王者·秩序",
    "attribute": "神无极",
    "rarity": "星迹",
    "types": ["神速", "超级英雄"]
  },
  {
    "id": 186,
    "name": "[星迹]万世一灭·极",
    "attribute": "神无极",
    "rarity": "星迹",
    "types": ["神平衡", "神召唤师"]
  },
  {
    "id": 187,
    "name": "[星迹]龙煌王者·极",
    "attribute": "神无极",
    "rarity": "星迹",
    "types": ["神速", "超级英雄"]
  },
  {
    "id": 188,
    "name": "[星迹]至元穹尊·极",
    "attribute": "神无极",
    "rarity": "星迹",
    "types": ["神平衡", "元素师"]
  },
  {
    "id": 189,
    "name": "[星迹]遥月幻歌·诺雅",
    "attribute": "神幻",
    "rarity": "星迹",
    "types": ["神速", "元素师"]
  }
];

// 添加一个函数来添加新的精灵
function addSpirit(name, attribute, rarity, types) {
    const newId = spirits.length > 0 ? Math.max(...spirits.map(s => s.id)) + 1 : 1;
    const newSpirit = { id: newId, name, attribute, rarity, types };
    spirits.push(newSpirit);
    saveSpirits();
    showSpiritPool();
    updateSpellPool();
}

// 添加一个函数来保存精灵数据
function saveSpirits() {
    localStorage.setItem('spirits', JSON.stringify(spirits));
}

// 添加一个函数来加载精灵数据
function loadSpirits() {
    const savedSpirits = localStorage.getItem('spirits');
    if (savedSpirits) {
        spirits.push(...JSON.parse(savedSpirits));
    } else {
        // 如果本地存储中没有精灵数据，则使用预定义的数据
        spirits.push(...predefinedSpirits);
        saveSpirits(); // 将预定义的数据保存到本地存储
    }
}

// 在 init 函数中调用 loadSpirits
function init() {
    console.log('Initializing application');
    loadSettings();
    loadSelectionHistory();
    loadSpirits();
    setupEventListeners();
    updateSpiritCount();
    populateSpellPool();
    setupBackgroundChange(); // 添加这行
    console.log('Initialization complete');
}

// 添加一个函数来显示添加精灵的表单
function showAddSpiritForm() {
    const form = document.createElement('form');
    form.innerHTML = `
        <h3>添加新精灵</h3>
        <input type="text" id="spirit-name" placeholder="精灵名称" required>
        <select id="spirit-attribute" required>
            <option value="">选择属性</option>
            <option value="神火">神火</option>
            <option value="神水">神水</option>
            <option value="神草">神草</option>
            <option value="神光">神光</option>
            <option value="神暗">神暗</option>
            <option value="神灵">神灵</option>
            <option value="���幻">神幻</option>
            <option value="神无极">神无极</option>
        </select>
        <select id="spirit-rarity" required>
            <option value="">选择时代</option>
            <option value="启元">启元</option>
            <option value="星迹">星迹</option>
            <option value="神运">神运</option>
        </select>
        <div id="spirit-types">
            <label><input type="checkbox" name="spirit-type" value="神平衡"> 神平衡</label>
            <label><input type="checkbox" name="spirit-type" value="神攻"> 神攻</label>
            <label><input type="checkbox" name="spirit-type" value="神速"> 神速</label>
            <label><input type="checkbox" name="spirit-type" value="神盾"> 神盾</label>
            <label><input type="checkbox" name="spirit-type" value="神通灵师"> 神通灵师</label>
            <label><input type="checkbox" name="spirit-type" value="超级英雄"> 超级英雄</label>
            <label><input type="checkbox" name="spirit-type" value="神召唤师"> 神召唤师</label>
            <label><input type="checkbox" name="spirit-type" value="幻元师"> 幻元师</label>
            <label><input type="checkbox" name="spirit-type" value="元素师"> 元素师</label>
            <label><input type="checkbox" name="spirit-type" value="赋能师"> 赋能师</label>
            <label><input type="checkbox" name="spirit-type" value="天觉者"> 天觉者</label>
        </div>
        <button type="submit">添加精灵</button>
    `;
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('spirit-name').value;
        const attribute = document.getElementById('spirit-attribute').value;
        const rarity = document.getElementById('spirit-rarity').value;
        const types = Array.from(document.querySelectorAll('input[name="spirit-type"]:checked')).map(input => input.value);
        if (types.length === 0) {
            alert('请至少选择一个职业');
            return;
        }
        addSpirit(name, attribute, rarity, types);
        this.reset();
    });
    
    const modalContent = document.querySelector('#spirit-pool-modal .modal-content');
    modalContent.appendChild(form);
}

// 修改 setupEventListeners 函数
function setupEventListeners() {
    const addEventListenerSafely = (id, event, handler) => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener(event, handler);
        } else {
            console.warn(`Element with id "${id}" not found`);
        }
    };

    addEventListenerSafely('attribute-filter', 'change', filterSpirits);
    addEventListenerSafely('rarity-filter', 'change', filterSpirits);
    addEventListenerSafely('type-filter', 'change', filterSpirits);
    addEventListenerSafely('search-input', 'input', filterSpirits);
    addEventListenerSafely('pause-button', 'click', togglePause);
    addEventListenerSafely('start-button', 'click', startSelection);
    addEventListenerSafely('spirit-count', 'change', updateSpiritCount);
    addEventListenerSafely('reset-button', 'click', resetSelection);
    addEventListenerSafely('history-button', 'click', showHistory);
    addEventListenerSafely('clear-history-button', 'click', clearHistory);
    addEventListenerSafely('timer-settings-button', 'click', showTimerSettings);
    addEventListenerSafely('save-timer-settings', 'click', saveTimerSettings);
    addEventListenerSafely('spirit-pool-button', 'click', showSpiritPool);
    addEventListenerSafely('add-spirit-button', 'click', showAddSpiritForm);
    addEventListenerSafely('import-spirits-button', 'click', () => {
        document.getElementById('import-spirits-file').click();
    });
    addEventListenerSafely('import-images-button', 'click', () => {
        document.getElementById('import-images-file').click();
    });
    addEventListenerSafely('import-images-file', 'change', handleImageFilesSelect);

    document.querySelectorAll('.close').forEach(el => {
        el.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });

    document.querySelectorAll('.edit-team-name').forEach(button => {
        button.addEventListener('click', editTeamName);
    });

    const deleteModeButton = document.getElementById('delete-mode-button');
    if (deleteModeButton) {
        deleteModeButton.addEventListener('click', toggleDeleteMode);
    }

    document.getElementById('type-filter-button').addEventListener('click', showTypeFilterModal);
    document.querySelector('#type-filter-modal .close').addEventListener('click', closeTypeFilterModal);
    document.getElementById('apply-type-filter').addEventListener('click', applyTypeFilter);

    // 为每个复选框添加事件监听器
    document.querySelectorAll('#type-filter-options input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', filterSpirits);
    });
}

// 更新精灵数量
function updateSpiritCount() {
    const spiritCountInput = document.getElementById('spirit-count');
    if (spiritCountInput) {
        spiritCount = parseInt(spiritCountInput.value);
        createCharacterSlots();
        saveSettings(); // 保存设置
    }
}

// 创建角色槽位
function createCharacterSlots() {
    const blueSlots = document.querySelector('#blue-team .character-slots');
    const redSlots = document.querySelector('#red-team .character-slots');

    if (!blueSlots || !redSlots) {
        console.error('Character slots elements not found');
        return;
    }

    blueSlots.innerHTML = '';
    redSlots.innerHTML = '';

    for (let i = 0; i < spiritCount; i++) {
        const blueSlot = document.createElement('div');
        blueSlot.className = 'character-slot';
        blueSlot.dataset.team = 'blue';
        blueSlot.dataset.slot = i;
        blueSlots.appendChild(blueSlot);

        const redSlot = document.createElement('div');
        redSlot.className = 'character-slot';
        redSlot.dataset.team = 'red';
        redSlot.dataset.slot = i;
        redSlots.appendChild(redSlot);
    }
}

// 开始选择
function startSelection() {
    console.log('Starting selection');
    isSelectionStarted = true;
    isPaused = false;
    document.getElementById('start-button').style.display = 'none';
    document.getElementById('pause-button').style.display = 'inline-block';
    document.getElementById('pause-button').textContent = '暂停';
    
    const spiritCountInput = document.getElementById('spirit-count');
    const banTimeInput = document.getElementById('ban-time');
    const pickTimeInput = document.getElementById('pick-time');
    if (spiritCountInput) spiritCountInput.disabled = true;
    if (banTimeInput) banTimeInput.disabled = true;
    if (pickTimeInput) pickTimeInput.disabled = true;
    
    selectedSpirits = { blue: [], red: [] };
    bannedSpirits = { blue: [], red: [] };
    currentStep = 0;
    currentTeam = 'blue';
    currentSlot = 0;
    currentSelectionStart = new Date();

    // 清空之前的选择和禁用显示
    document.querySelector('#blue-team .banned-spirits').innerHTML = '';
    document.querySelector('#red-team .banned-spirits').innerHTML = '';
    document.querySelector('#blue-team .selected-spirits').innerHTML = '';
    document.querySelector('#red-team .selected-spirits').innerHTML = '';

    // 显示开始选择的提醒
    showNotification('精灵选择开始！', true, 1000);

    // 确保显示第一个阶段的提示
    shouldShowPhaseNotification = true;

    // 延迟更新阶段显示，以确保开始提示和第一个阶段提示不重叠
    setTimeout(() => {
        updatePhaseDisplay();
        updateSpellPool();
        startTurnTimer();
    }, 1100);
}

// 更阶段示
function updatePhaseDisplay() {
    const phaseElement = document.getElementById('phase-display');
    const currentPhase = phases[currentStep];
    const teamName = teamNames[currentPhase.team];
    const action = currentPhase.action === 'ban' ? '禁用' : '选择';
    const message = `${teamName}${action}`;
    phaseElement.textContent = message;

    if (shouldShowPhaseNotification) {
        showNotification(`现在是${message}阶段`, true, 1000);
    }
}

// 选择精灵
function selectSpirit(spirit) {
    console.log('Attempting to select spirit:', spirit);
    if (!isSelectionStarted || isPaused) return;

    const currentPhase = phases[currentStep];
    
    // 检查精灵是否已被禁用或被任何一方选择
    if (bannedSpirits.blue.includes(spirit) || 
        bannedSpirits.red.includes(spirit) || 
        selectedSpirits.blue.includes(spirit) || 
        selectedSpirits.red.includes(spirit)) {
        console.log('This spirit is banned or already selected and cannot be chosen');
        return;
    }

    if (currentPhase.action === 'ban') {
        banSpirit(spirit, currentPhase.team);
    } else {
        pickSpirit(spirit, currentPhase.team);
    }

    currentStep++;
    console.log('Current step:', currentStep, 'Total steps:', totalSteps);
    if (currentStep >= totalSteps) {
        console.log('Selection process completed');
        endSelection();
    } else {
        updatePhaseDisplay();
        resetTurnTimer();
    }
    
    // 更新精灵池显示
    updateSpellPool();
}

// 禁用精灵
function banSpirit(spirit, team) {
    bannedSpirits[team].push(spirit);
    updateBannedSpirits(team, spirit);
    console.log(`${team} banned ${spirit.name}`);
}

// 选择精灵
function pickSpirit(spirit, team) {
    selectedSpirits[team].push(spirit);
    updateSelectedSpirits(team, spirit);
    updateCharacterSlot(team, selectedSpirits[team].length - 1, spirit);
    console.log(`${team} picked ${spirit.name}`);
}

// 更新禁用的精灵显示
function updateBannedSpirits(team, spirit) {
    const bannedArea = document.querySelector(`#${team}-team .banned-spirits`);
    const spiritElement = document.createElement('div');
    spiritElement.className = 'banned-spirit';
    spiritElement.textContent = spirit.name;
    bannedArea.appendChild(spiritElement);
}

// 更新选择的精灵显示
function updateSelectedSpirits(team, spirit) {
    const selectedArea = document.querySelector(`#${team}-team .selected-spirits`);
    const spiritElement = document.createElement('div');
    spiritElement.className = 'selected-spirit';
    spiritElement.textContent = spirit.name;
    selectedArea.appendChild(spiritElement);
}

// 更新角色槽位
function updateCharacterSlot(team, slot, spirit) {
    console.log('Updating slot:', team, slot, spirit);
    const slotElement = document.querySelector(`#${team}-team .character-slots .character-slot:nth-child(${slot + 1})`);
    if (slotElement) {
        slotElement.innerHTML = ''; // 清空槽位
        if (spirit.imageData) {
            const img = document.createElement('img');
            img.src = spirit.imageData;
            img.alt = spirit.name;
            img.title = `${spirit.name}\n属性: ${spirit.attribute}\n时代: ${spirit.rarity}\n职业: ${spirit.types.join(', ')}`;
            slotElement.appendChild(img);
        } else {
            slotElement.textContent = spirit.name;
        }
        slotElement.title = `${spirit.name}\n属性: ${spirit.attribute}\n时代: ${spirit.rarity}\n职业: ${spirit.types.join(', ')}`;
    } else {
        console.error('Slot element not found:', team, slot);
    }
}

// 过滤精灵
function filterSpirits() {
    const attribute = document.getElementById('attribute-filter').value;
    const rarity = document.getElementById('rarity-filter').value;
    const selectedTypes = Array.from(document.querySelectorAll('#type-filter-modal input:checked')).map(input => input.value);
    const search = document.getElementById('search-input').value.toLowerCase();

    const spiritsGrid = document.getElementById('spirits-grid');
    spiritsGrid.innerHTML = '';

    spirits.filter(spirit => {
        const attributeMatch = attribute === '' || spirit.attribute === attribute;
        const rarityMatch = rarity === '' || spirit.rarity === rarity;
        const typeMatch = selectedTypes.length === 0 || selectedTypes.every(type => spirit.types.includes(type));
        const searchMatch = search === '' || spirit.name.toLowerCase().includes(search) || spirit.id.toString().includes(search);

        return attributeMatch && rarityMatch && typeMatch && searchMatch;
    }).forEach(spirit => {
        const spiritItem = document.createElement('div');
        spiritItem.className = 'spirit-item';
        if (spirit.imageData) {
            spiritItem.innerHTML = `<img src="${spirit.imageData}" alt="${spirit.name}" title="${spirit.name}">`;
        } else {
            spiritItem.innerHTML = `<span>${spirit.name}</span>`;
        }
        spiritItem.title = `${spirit.name}\n属性: ${spirit.attribute}\n时代: ${spirit.rarity}\n职业: ${spirit.types.join(', ')}`;
        
        if (isDeleteMode) {
            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-spirit';
            deleteButton.textContent = '删除';
            deleteButton.onclick = (e) => {
                e.stopPropagation();
                deleteSpirit(spirit.id);
            };
            spiritItem.appendChild(deleteButton);
        } else {
            if (bannedSpirits.blue.includes(spirit)) {
                spiritItem.classList.add('banned', 'banned-blue');
            } else if (bannedSpirits.red.includes(spirit)) {
                spiritItem.classList.add('banned', 'banned-red');
            } else if (selectedSpirits.blue.includes(spirit)) {
                spiritItem.classList.add('selected', 'selected-blue');
            } else if (selectedSpirits.red.includes(spirit)) {
                spiritItem.classList.add('selected', 'selected-red');
            } else {
                spiritItem.addEventListener('click', () => selectSpirit(spirit));
            }
        }
        
        spiritsGrid.appendChild(spiritItem);
    });
}

// 确保在页面加载完成后添加事件监听器
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('attribute-filter').addEventListener('change', filterSpirits);
    document.getElementById('rarity-filter').addEventListener('change', filterSpirits);
    document.querySelectorAll('#type-filter-options input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', filterSpirits);
    });
    document.getElementById('search-input').addEventListener('input', filterSpirits);
});

// 开始回合计时器
function startTurnTimer() {
    if (currentStep >= phases.length) {
        console.log('Selection process completed');
        endSelection();
        return;
    }

    const currentPhase = phases[currentStep];
    let timeLeft;
    
    // 检查是否是选择两只精灵的阶段
    if (currentPhase.action === 'pick' && 
        ((currentStep === 7 && currentPhase.team === 'red') || 
         (currentStep === 9 && currentPhase.team === 'blue'))) {
        timeLeft = Math.round(pickTime * 1.5); // 1.5倍选择时间，四舍五入到整数
    } else {
        timeLeft = currentPhase.action === 'ban' ? banTime : pickTime;
    }

    const timerElement = document.querySelector(`#${currentPhase.team}-team .team-timer`);

    function updateTimer() {
        if (isPaused) return;

        timerElement.textContent = timeLeft.toString().padStart(2, '0');
        timerElement.classList.toggle('warning', timeLeft <= 10);

        if (timeLeft > 0) {
            timeLeft--;
            currentTimer = setTimeout(updateTimer, 1000);
        } else {
            handleTimeout();
        }
    }

    clearTimeout(currentTimer);
    updateTimer();
}

// 重置回合计时器
function resetTurnTimer() {
    document.querySelectorAll('.team-timer').forEach(el => {
        el.textContent = '';
        el.classList.remove('warning');
    });
    startTurnTimer();
}

// 处理超时
function handleTimeout() {
    if (currentStep >= phases.length) {
        console.log('Selection process completed');
        endSelection();
        return;
    }

    const currentPhase = phases[currentStep];
    if (currentPhase.action === 'ban') {
        // 如果是禁用阶段超时，直接进入下一步
        currentStep++;
        if (currentStep >= phases.length) {
            endSelection();
        } else {
            updatePhaseDisplay();
            startTurnTimer();
        }
    } else {
        // 如果是选择阶段超时
        const availableSpirits = spirits.filter(spirit => 
            !bannedSpirits.blue.includes(spirit) && 
            !bannedSpirits.red.includes(spirit) && 
            !selectedSpirits.blue.includes(spirit) && 
            !selectedSpirits.red.includes(spirit)
        );
        
        // 检查是否是选择两只精灵的阶段
        const selectCount = (currentStep === 7 && currentPhase.team === 'red') || 
                            (currentStep === 9 && currentPhase.team === 'blue') ? 2 : 1;
        
        for (let i = 0; i < selectCount; i++) {
            if (availableSpirits.length > 0) {
                const randomSpirit = availableSpirits[Math.floor(Math.random() * availableSpirits.length)];
                selectSpirit(randomSpirit);
                // 从可用精灵列表中移除已选择的精灵
                const index = availableSpirits.indexOf(randomSpirit);
                if (index > -1) {
                    availableSpirits.splice(index, 1);
                }
            } else {
                // 如果没有可用的精灵，直接进入下一步
                break;
            }
        }
        
        // 更新步骤
        currentStep++;
        if (currentStep >= phases.length) {
            endSelection();
        } else {
            updatePhaseDisplay();
            startTurnTimer();
        }
    }
}

// 切换暂停状态
function togglePause() {
    isPaused = !isPaused;
    document.getElementById('pause-button').textContent = isPaused ? '继续' : '暂停';
}

// 结束选择
function endSelection() {
    isSelectionStarted = false;
    document.getElementById('start-button').style.display = 'inline-block';
    document.getElementById('pause-button').style.display = 'none';
    
    const spiritCountInput = document.getElementById('spirit-count');
    if (spiritCountInput) {
        spiritCountInput.disabled = false;
    }
    
    // 添加本次选择记录到历史
    selectionHistory.push({
        id: Date.now(),
        timestamp: currentSelectionStart,
        teamNames: { ...teamNames }, // 保存当前的队伍名称
        blueTeam: {
            banned: bannedSpirits.blue.map(s => s.name),
            selected: selectedSpirits.blue.map(s => s.name)
        },
        redTeam: {
            banned: bannedSpirits.red.map(s => s.name),
            selected: selectedSpirits.red.map(s => s.name)
        }
    });
    
    saveSelectionHistory(); // 保存历史记录
    
    alert('精灵选择已结束！');
    console.log('Final selection:', selectedSpirits);
    console.log('Banned spirits:', bannedSpirits);
    console.log('Selection history:', selectionHistory);
}

// 填充精灵池
function populateSpellPool() {
    updateSpellPool();
}

// 更新精灵池显示
function updateSpellPool() {
    console.log('Updating spell pool');
    const spiritsGrid = document.getElementById('spirits-grid');
    spiritsGrid.innerHTML = '';

    spirits.forEach(spirit => {
        const spiritItem = document.createElement('div');
        spiritItem.className = 'spirit-item';
        if (spirit.imageData) {
            spiritItem.innerHTML = `<img src="${spirit.imageData}" alt="${spirit.name}" title="${spirit.name}">`;
        } else {
            spiritItem.innerHTML = `<span>${spirit.name}</span>`;
        }
        spiritItem.title = `${spirit.name}\n属性: ${spirit.attribute}\n时代: ${spirit.rarity}\n职业: ${spirit.types.join(', ')}`;
        
        if (isDeleteMode) {
            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-spirit';
            deleteButton.textContent = '删除';
            deleteButton.onclick = (e) => {
                e.stopPropagation();
                deleteSpirit(spirit.id);
            };
            spiritItem.appendChild(deleteButton);
        } else {
            if (bannedSpirits.blue.includes(spirit)) {
                spiritItem.classList.add('banned', 'banned-blue');
            } else if (bannedSpirits.red.includes(spirit)) {
                spiritItem.classList.add('banned', 'banned-red');
            } else if (selectedSpirits.blue.includes(spirit)) {
                spiritItem.classList.add('selected', 'selected-blue');
            } else if (selectedSpirits.red.includes(spirit)) {
                spiritItem.classList.add('selected', 'selected-red');
            } else {
                spiritItem.addEventListener('click', () => selectSpirit(spirit));
            }
        }
        
        spiritsGrid.appendChild(spiritItem);
    });
    console.log('Spell pool updated');
}

// 重置选择
function resetSelection() {
    if (confirm('确定要重置择吗？这将清除当前的选择，但不会影响历史记录。')) {
        // 设置标志为 false，阻止显示阶段提示
        shouldShowPhaseNotification = false;

        // 重置选择状态
        selectedSpirits = { blue: [], red: [] };
        bannedSpirits = { blue: [], red: [] };
        currentStep = 0;
        currentTeam = 'blue';
        currentSlot = 0;
        isSelectionStarted = false;
        isPaused = false;

        // 更新界面
        updatePhaseDisplay();
        updateSpellPool();
        createCharacterSlots();
        
        // 清空禁用和选择的精灵显示
        document.querySelector('#blue-team .banned-spirits').innerHTML = '';
        document.querySelector('#red-team .banned-spirits').innerHTML = '';
        document.querySelector('#blue-team .selected-spirits').innerHTML = '';
        document.querySelector('#red-team .selected-spirits').innerHTML = '';
        
        // 重置按钮状态
        document.getElementById('start-button').style.display = 'inline-block';
        document.getElementById('pause-button').style.display = 'none';
        document.getElementById('pause-button').textContent = '暂停';
        
        // 重置计时器
        clearTimeout(currentTimer);
        document.querySelectorAll('.team-timer').forEach(timer => {
            timer.textContent = '';
        });
        
        // 用精灵数量输入
        const spiritCountInput = document.getElementById('spirit-count');
        if (spiritCountInput) {
            spiritCountInput.disabled = false;
        }

        console.log('Selection reset');

        // 重新绑定事件监听器
        setupEventListeners();

        // 重置成后，将标志设回 true
        shouldShowPhaseNotification = true;
    }
}

// 显示史
function showHistory() {
    const historyContent = document.getElementById('history-content');
    historyContent.innerHTML = '';
    const filteredHistory = selectionHistory.filter(record => record.action !== 'reset');
    
    if (filteredHistory.length === 0) {
        historyContent.innerHTML = '<p>暂无历史记录</p>';
        document.getElementById('clear-history-button').style.display = 'none';
    } else {
        document.getElementById('clear-history-button').style.display = 'block';
        filteredHistory.forEach((record) => {
            if (record.timestamp && record.blueTeam && record.redTeam) {
                const recordElement = document.createElement('div');
                recordElement.className = 'history-record';
                const date = new Date(record.timestamp);
                recordElement.innerHTML = `
                    <h3>选择 - ${date.toLocaleString()}</h3>
                    <div class="team-history">
                        <div class="blue-team">
                            <h4>${record.teamNames?.blue || '蓝队'}</h4>
                            <p>禁用: ${record.blueTeam.banned ? record.blueTeam.banned.join(', ') : '无'}</p>
                            <p>选择: ${record.blueTeam.selected ? record.blueTeam.selected.join(', ') : '无'}</p>
                        </div>
                        <div class="red-team">
                            <h4>${record.teamNames?.red || '红队'}</h4>
                            <p>禁用: ${record.redTeam.banned ? record.redTeam.banned.join(', ') : '无'}</p>
                            <p>选择: ${record.redTeam.selected ? record.redTeam.selected.join(', ') : '无'}</p>
                        </div>
                    </div>
                    <button class="delete-record" data-id="${record.id}">删除此记录</button>
                `;
                historyContent.appendChild(recordElement);
            }
        });
        
        // 为所有删除按钮添加事件监听器
        document.querySelectorAll('.delete-record').forEach(button => {
            button.addEventListener('click', function() {
                deleteRecord(this.dataset.id);
            });
        });
    }
    document.getElementById('history-modal').style.display = 'block';
}

// 关闭历史模态框
function closeHistory() {
    document.getElementById('history-modal').style.display = 'none';
}

// 添加删除单条记录的函
function deleteRecord(id) {
    if (confirm('确定要删除这条记录吗？')) {
        selectionHistory = selectionHistory.filter(record => record.id != id);
        saveSelectionHistory();
        showHistory(); // 重新显示历史记录
    }
}

// 修改 clearHistory 函数
function clearHistory() {
    if (confirm('确定要清除所有历史记录吗？此操作不可撤销。')) {
        selectionHistory = [];
        saveSelectionHistory();
        showHistory(); // 重新显示空的历史记录
        console.log('History cleared');
    }
}

// 加载历史记录
function loadSelectionHistory() {
    const savedHistory = localStorage.getItem('selectionHistory');
    if (savedHistory) {
        selectionHistory = JSON.parse(savedHistory);
    }
}

// 保存历史记录
function saveSelectionHistory() {
    localStorage.setItem('selectionHistory', JSON.stringify(selectionHistory));
}

// 添加提醒函数
function showNotification(message, isCenter = false, duration = 1000) {
    const existingNotification = document.querySelector('.notification, .center-notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = isCenter ? 'center-notification' : 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        if (document.body.contains(notification)) {
            document.body.removeChild(notification);
        }
    }, duration);
}

function showTimerSettings() {
    document.getElementById('ban-time').value = banTime;
    document.getElementById('pick-time').value = pickTime;
    document.getElementById('timer-settings-modal').style.display = 'block';
}

function closeTimerSettings() {
    document.getElementById('timer-settings-modal').style.display = 'none';
}

function saveTimerSettings() {
    banTime = parseInt(document.getElementById('ban-time').value);
    pickTime = parseInt(document.getElementById('pick-time').value);
    closeTimerSettings();
    saveSettings(); // 保存设置
}

// 添加编辑队伍名称的函数
function editTeamName(event) {
    const team = event.target.dataset.team;
    const newName = prompt(`请输入${team === 'blue' ? '蓝队' : '红队'}的新名称：`, teamNames[team]);
    if (newName && newName.trim() !== '') {
        teamNames[team] = newName.trim();
        document.querySelector(`#${team}-team .team-name`).textContent = newName.trim();
        saveSettings(); // 保存设置
    }
}

// 添加这个函数到文件中的适当位置，比如在 loadSelectionHistory 函数附近

// 加载设置
function loadSettings() {
    const savedSpiritCount = localStorage.getItem('spiritCount');
    const savedBanTime = localStorage.getItem('banTime');
    const savedPickTime = localStorage.getItem('pickTime');
    const savedTeamNames = localStorage.getItem('teamNames');

    if (savedSpiritCount) {
        spiritCount = parseInt(savedSpiritCount);
        document.getElementById('spirit-count').value = spiritCount;
    }
    if (savedBanTime) {
        banTime = parseInt(savedBanTime);
        document.getElementById('ban-time').value = banTime;
    }
    if (savedPickTime) {
        pickTime = parseInt(savedPickTime);
        document.getElementById('pick-time').value = pickTime;
    }
    if (savedTeamNames) {
        teamNames = JSON.parse(savedTeamNames);
        document.querySelector('#blue-team .team-name').textContent = teamNames.blue;
        document.querySelector('#red-team .team-name').textContent = teamNames.red;
    }
}

// 保存设置
function saveSettings() {
    localStorage.setItem('spiritCount', spiritCount);
    localStorage.setItem('banTime', banTime);
    localStorage.setItem('pickTime', pickTime);
    localStorage.setItem('teamNames', JSON.stringify(teamNames));
}

// 初始化应用
document.addEventListener('DOMContentLoaded', init);

// 修改 toggleDeleteMode 函数
function toggleDeleteMode() {
    isDeleteMode = !isDeleteMode;
    const deleteModeButton = document.getElementById('delete-mode-button');
    if (deleteModeButton) {
        deleteModeButton.textContent = isDeleteMode ? '退出删除模式' : '删除';
        deleteModeButton.classList.toggle('active', isDeleteMode);
    }
    updateSpellPool(); // 刷新精灵池显示
}

// 修改 showSpiritPool 函数
function showSpiritPool() {
    const spiritPoolModal = document.getElementById('spirit-pool-modal');
    const modalContent = spiritPoolModal.querySelector('.modal-content');
    
    // 清空现有内容
    modalContent.innerHTML = `
        <span class="close">&times;</span>
        <h2>精灵池</h2>
        <div class="spirit-pool-buttons">
            <button id="add-spirit-button">添加新精灵</button>
            <button id="import-spirits-button">导入精灵数据</button>
            <button id="import-images-button">导入图片</button>
        </div>
        <input type="file" id="import-spirits-file" accept=".json" style="display: none;">
        <input type="file" id="import-images-file" accept="image/*" multiple style="display: none;">
        <div id="spirit-pool-list"></div>
    `;

    // 重新添加事件监听器
    modalContent.querySelector('.close').addEventListener('click', closeSpiritPool);
    document.getElementById('add-spirit-button').addEventListener('click', showAddSpiritForm);
    document.getElementById('import-spirits-button').addEventListener('click', () => {
        document.getElementById('import-spirits-file').click();
    });
    document.getElementById('import-images-button').addEventListener('click', () => {
        document.getElementById('import-images-file').click();
    });
    document.getElementById('import-spirits-file').addEventListener('change', handleSpiritFileSelect);
    document.getElementById('import-images-file').addEventListener('change', handleImageFilesSelect);

    // 显示精灵列表
    const spiritPoolList = document.getElementById('spirit-pool-list');
    spiritPoolList.innerHTML = '';
    spirits.forEach(spirit => {
        const spiritItem = document.createElement('div');
        spiritItem.className = 'spirit-item';
        if (spirit.imageData) {
            spiritItem.innerHTML = `<img src="${spirit.imageData}" alt="${spirit.name}">`;
        } else {
            spiritItem.innerHTML = `<span>${spirit.name}</span>`;
        }
        spiritItem.innerHTML += `
            <span>${spirit.attribute} | ${spirit.rarity} | ${spirit.types.join(', ')}</span>
        `;
        spiritPoolList.appendChild(spiritItem);
    });

    spiritPoolModal.style.display = 'block';
}

// 添加关闭精灵池的函数
function closeSpiritPool() {
    document.getElementById('spirit-pool-modal').style.display = 'none';
}

// 修 deleteSpirit 函数
function deleteSpirit(id) {
    const password = prompt('请输入密码以删除精灵：');
    if (password === '17704638160') {
        const index = spirits.findIndex(spirit => spirit.id === id);
        if (index !== -1) {
            if (confirm(`确定要删除精灵 "${spirits[index].name}" 吗？`)) {
                spirits.splice(index, 1);
                saveSpirits();
                updateSpellPool(); // 更新主界面的精灵池显示
            }
        }
    } else {
        alert('密码错误，无法删除精灵。');
    }
}

// 修改 importSpirits 函数
function importSpirits() {
    // 不再直接触发文件选择
    alert('请先选择精灵数据的 JSON 文件，然后选择对应的图片文件。');
}

// 修改 handleSpiritFileSelect 函数
function handleSpiritFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const content = e.target.result;
            try {
                const importedSpirits = JSON.parse(content);
                spirits.push(...importedSpirits);
                saveSpirits();
                updateSpellPool();
                showSpiritPool();
                alert('精灵据导入成功请现在选择对应的图片文件。');
                // 不再动触发图片择
            } catch (error) {
                alert('无效的 JSON 文件。请检查文件格式。');
            }
        };
        reader.readAsText(file);
    }
}

// 处理图片文件选择
function handleImageFilesSelect(event) {
    console.log('Image files selected:', event.target.files);
    const files = event.target.files;
    if (files.length > 0) {
        let processedCount = 0;
        let successCount = 0;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            console.log('Processing file:', file.name);
            const reader = new FileReader();
            reader.onload = function(e) {
                console.log('File read successfully:', file.name);
                const fileName = file.name.split('.')[0];
                const spiritId = parseInt(fileName);
                console.log('Searching for spirit with ID:', spiritId);
                const spirit = spirits.find(s => s.id === spiritId);
                if (spirit) {
                    console.log('Spirit found:', spirit.name);
                    spirit.imageData = e.target.result;
                    successCount++;
                    console.log(`Successfully processed image for spirit: ${spirit.name}`);
                } else {
                    console.warn(`No matching spirit found for image: ${file.name}`);
                }
                processedCount++;

                if (processedCount === files.length) {
                    console.log('All files processed');
                    saveSpirits();
                    updateSpellPool();
                    showSpiritPool();
                    alert(`处理完成！成功导入 ${successCount} 张图片，失败 ${files.length - successCount} 张。`);
                }
            };
            reader.onerror = function(e) {
                console.error('Error reading file:', file.name, e);
                processedCount++;
            };
            reader.readAsDataURL(file);
        }
    } else {
        console.log('No image files selected');
        alert('没有选择任何图片文件。');
    }
}

// 添加以下函数
function showTypeFilterModal() {
    document.getElementById('type-filter-modal').style.display = 'block';
}

function closeTypeFilterModal() {
    document.getElementById('type-filter-modal').style.display = 'none';
}

function applyTypeFilter() {
    filterSpirits();
    closeTypeFilterModal();
}

function setupBackgroundChange() {
    const backgroundInput = document.getElementById('background-image-input');
    const changeBackgroundButton = document.getElementById('change-background-button');

    changeBackgroundButton.addEventListener('click', () => {
        backgroundInput.click();
    });

    backgroundInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.body.style.backgroundImage = `url(${e.target.result})`;
                // 保存背景图片到本地存储
                localStorage.setItem('backgroundImage', e.target.result);
            };
            reader.readAsDataURL(file);
        }
    });

    // 页面加载时检查是否有保存的背景图片
    const savedBackgroundImage = localStorage.getItem('backgroundImage');
    if (savedBackgroundImage) {
        document.body.style.backgroundImage = `url(${savedBackgroundImage})`;
    }
}

// 在 init 函数中调用 setupBackgroundChange
function init() {
    console.log('Initializing application');
    loadSettings();
    loadSelectionHistory();
    loadSpirits();
    setupEventListeners();
    updateSpiritCount();
    populateSpellPool();
    setupBackgroundChange(); // 添加这行
    console.log('Initialization complete');
}