// ── Mock data for KOC StyleSoul MVP ──

export const mockUser = {
  name: 'gaopengfei',
  platform: 'B站',
  url: 'https://space.bilibili.com/example',
  bound: true,
  lastAnalyzed: '2天前',
}

export const mockDNA = {
  // 第零层：赛道定位
  track: {
    platform: 'B站',
    bound: true,
    mainTrack: '知识区',
    subTrack: '科学科普',
    role: '趣味入门向讲解者',
    competitionLevel: '高' as const,
    competitionDesc: '头部集中',
  },
  // 第一～五层：风格维度（含赛道均值对比）
  dimensions: [
    {
      key: 'narrative',
      label: '叙事节奏',
      score: 72,
      avg: 55,
      desc: '悬念驱动型',
      range: ['平铺直叙', '悬念驱动'],
      subMetrics: [
        { label: '知识块密度', value: '4.2个/分钟', avgValue: '赛道均值 3.1', higher: true },
        { label: '案例引入频率', value: '每2.4分钟一次', avgValue: '赛道均值 3.2分钟', higher: true },
      ],
      conclusion: '你的开场悬念密度高于赛道均值，知识块切割节奏快，能有效锁住观众注意力。',
      suggestion: '可尝试在视频中段增加1个小反转，进一步提升完播率。',
    },
    {
      key: 'density',
      label: '内容浓度',
      score: 42,
      avg: 60,
      desc: '娱乐化偏强',
      range: ['纯娱乐体验', '纯信息密度'],
      subMetrics: [
        { label: '白话类比使用率', value: '高于均值 35%', avgValue: '赛道中位', higher: true },
        { label: '术语密度', value: '2.1个/分钟', avgValue: '赛道均值 4.8', higher: false },
      ],
      conclusion: '娱乐化偏高，知识密度低于赛道均值，亲切感强但专业感略弱。',
      suggestion: '适当增加「专业术语 + 即时白话解释」组合，提升内容可信度。',
    },
    {
      key: 'visual',
      label: '视觉指纹',
      score: 85,
      avg: 62,
      desc: '高辨识封面风格',
      range: ['简洁极简', '视觉丰富'],
      subMetrics: [
        { label: '封面风格', value: '对比色系+问题式标题', avgValue: '赛道多为纯文字', higher: true },
        { label: '字幕密度', value: '高（无板书）', avgValue: '赛道均值中等', higher: true },
      ],
      conclusion: '封面识别度高，字幕密度强，视觉标识在赛道中属前25%。',
      suggestion: '可加入偶尔的动画示意图，提升复杂概念的理解效率。',
    },
    {
      key: 'language',
      label: '语言风格',
      score: 28,
      avg: 50,
      desc: '强口语化',
      range: ['高度书面', '纯口语化'],
      subMetrics: [
        { label: '情感词汇密度', value: '高', avgValue: '赛道均值偏低', higher: true },
        { label: '术语引用规范性', value: '低', avgValue: '赛道均值中等', higher: false },
      ],
      conclusion: '语言高度口语化，亲和力强，但专业性内容的表达略显随意。',
      suggestion: '在核心观点处保留口语化，关键数据/结论可采用更精炼的表达。',
    },
    {
      key: 'community',
      label: '社区共鸣',
      score: 78,
      avg: 58,
      desc: '辩论型+求知型为主',
      range: ['情感共情', '知识触发'],
      subMetrics: [
        { label: '互动情感类型', value: '辩论型 · 求知型', avgValue: '赛道多以感谢型为主', higher: true },
        { label: '弹幕互动埋点', value: '每期平均 3.2处', avgValue: '赛道均值 1.8', higher: true },
      ],
      conclusion: '社区共鸣得分高于赛道均值，弹幕互动质量佳，辩论型内容能激发二次传播。',
      suggestion: '在视频末尾加入「你认为……」式提问，可进一步放大辩论效应。',
    },
  ],
  tags: ['B站科普区', '娱乐化科普', '强悬念开场', '弹幕友好型'],
  history: [
    {
      date: '04-01',
      scores: { narrative: 60, density: 35, visual: 78, language: 32, community: 68 },
      insight: '风格以娱乐优先，知识密度较低',
    },
    {
      date: '04-22',
      scores: { narrative: 66, density: 38, visual: 82, language: 30, community: 73 },
      insight: '内容浓度开始向知识密度方向移动',
    },
    {
      date: '05-06',
      scores: { narrative: 72, density: 42, visual: 85, language: 28, community: 78 },
      insight: '社区共鸣从共情型逐步转向辩论型',
    },
  ],
  historyTrends: [
    '内容浓度正在向知识密度方向移动（+7分）',
    '社区共鸣从共情型逐步转向辩论型',
  ],
  insight: '悬念驱动强度持续提升，娱乐化科普定位逐渐清晰，本月社区互动质量明显跃升。',
}

export const mockTrending = [
  { id: 1, rank: 1,  title: 'AI工具改变工作流：我的亲测体验',       heat: 98, match: 92, tag: '科技' },
  { id: 2, rank: 2,  title: '每日只需15分钟，坚持30天的变化',         heat: 94, match: 88, tag: '成长' },
  { id: 3, rank: 3,  title: '2026年最值得学的3项技能',               heat: 91, match: 95, tag: '职场' },
  { id: 4, rank: 4,  title: '我是如何从0粉到10万的完整复盘',           heat: 87, match: 84, tag: '创作' },
  { id: 5, rank: 5,  title: '深度测评：这款笔记软件让我效率翻倍',       heat: 83, match: 76, tag: '效率' },
]

export const mockTopics = [
  {
    id: 1,
    title: '「反转认知」你以为AI让人变懒，其实它让你更清醒',
    reason: '匹配你的悬念驱动风格 × 当前AI热点',
    score: 97,
    skills: ['反转认知选题', '悬念开场技巧'],
    tag: '精准推荐',
  },
  {
    id: 2,
    title: '我用30天测试了5种笔记系统，最后只留下这1个',
    reason: '契合干货密度高的内容基因',
    score: 91,
    skills: ['横评对比结构', '数字化标题'],
    tag: '高潜力',
  },
  {
    id: 3,
    title: '每个创作者都应该知道的「内容 DNA」是什么',
    reason: '与你的视觉标识强特质共振',
    score: 86,
    skills: ['概念解读框架'],
    tag: '差异化',
  },
]

// ── 随心搭：技能卡积木 ──
export const mockBuilderCards = [
  {
    id: 'topic',
    icon: '🪝',
    name: '选题卡',
    desc: '反转认知选题法',
    color: 'red',
    outputLabel: '5条标题候选 + 切入角度',
    subCards: [
      { id: 'topic-1', name: '反转认知选题法', desc: '"你以为…其实…"爆款结构', icon: '🔄', source: '@影视飓风', tags: ['反转', '认知差'] },
      { id: 'topic-2', name: '数字化标题法', desc: '"5个/30天/3种"高点击标题', icon: '🔢', source: '@科技美学', tags: ['数字', '清单'] },
      { id: 'topic-3', name: '痛点共情选题', desc: '从用户痛点出发的高共鸣选题', icon: '💡', source: '@小Lin说', tags: ['痛点', '共情'] },
    ],
  },
  {
    id: 'narrative',
    icon: '📖',
    name: '叙事卡',
    desc: '悬念叙事结构',
    color: 'blue',
    outputLabel: '内容结构大纲',
    subCards: [
      { id: 'narrative-1', name: '悬念叙事结构', desc: '开场悬念→案例递进→反转结尾', icon: '🎭', source: '@老番茄', tags: ['悬念', '留存'] },
      { id: 'narrative-2', name: '横评对比结构', desc: 'A vs B 真实测评式对比', icon: '⚖️', source: '@科技美学', tags: ['对比', '干货'] },
      { id: 'narrative-3', name: '故事化叙事', desc: '第一视角沉浸式讲述', icon: '📝', source: '@朱一旦', tags: ['故事', '沉浸'] },
    ],
  },
  {
    id: 'speech',
    icon: '🎤',
    name: '表达卡',
    desc: '轻松口语化风格',
    color: 'green',
    outputLabel: '口播脚本草稿',
    subCards: [
      { id: 'speech-1', name: '3秒悬念钩子', desc: '前3秒必抓注意力的开场公式', icon: '⚡', source: '@老番茄', tags: ['开场', '钩子'] },
      { id: 'speech-2', name: '口语化脚本', desc: '轻松对话感，零门槛表达', icon: '💬', source: '@回形针', tags: ['口语', '亲切'] },
      { id: 'speech-3', name: '金句密度提升', desc: '每分钟1句可截图的金句', icon: '✨', source: '@小Lin说', tags: ['金句', '传播'] },
    ],
  },
  {
    id: 'edit',
    icon: '🎬',
    name: '剪辑卡',
    desc: '卡点节奏剪辑',
    color: 'purple',
    outputLabel: '剪辑节奏建议',
    subCards: [
      { id: 'edit-1', name: '卡点节奏剪辑', desc: '3-5秒一切，情绪点配音效', icon: '🎵', source: '@影视飓风', tags: ['卡点', '节奏'] },
      { id: 'edit-2', name: '大字幕覆盖流', desc: '满屏字幕强化关键词', icon: '📺', source: '@朱一旦', tags: ['字幕', '视觉'] },
      { id: 'edit-3', name: '高能片段前置', desc: '把最精彩片段剪到片头', icon: '🏆', source: '@老番茄', tags: ['前置', '完播'] },
    ],
  },
  {
    id: 'ops',
    icon: '📊',
    name: '运营卡',
    desc: '黄金发布时间',
    color: 'yellow',
    outputLabel: '发布指导单',
    subCards: [
      { id: 'ops-1', name: '黄金时段发布', desc: '工作日12点/20点，周末10点', icon: '⏰', source: '平台数据', tags: ['时间', '曝光'] },
      { id: 'ops-2', name: '评论区埋雷法', desc: '置顶争议性问题引爆互动', icon: '💣', source: '@小Lin说', tags: ['互动', '评论'] },
      { id: 'ops-3', name: '话题标签组合', desc: '大话题+小话题+品牌话题', icon: '🏷️', source: '运营经验', tags: ['标签', '流量'] },
    ],
  },
]

// 组合数量 → 输出类型映射
export const outputTypeMap: Record<number, { label: string; desc: string; depth: string }> = {
  1: { label: '选题方向',      desc: '5条标题候选 + 切入角度说明',    depth: '轻量' },
  2: { label: '内容 Brief',   desc: '选题方向 + 结构大纲',           depth: '中等' },
  3: { label: '脚本草稿',     desc: '完整口播脚本可直接使用',         depth: '完整' },
  4: { label: '制作发布单',   desc: '剪辑指导 + 发布计划一体',        depth: '完整' },
  5: { label: '完整创作方案', desc: '全流程方案，可一键发给 Agent 执行', depth: '完整' },
}

export const mockSkills = [
  {
    id: 1, type: '选题', icon: '🪝',
    name: '反转认知选题法',
    source: '@影视飓风',
    template: '"你以为[大众认知]，其实[反转真相]"',
    cases: ['《你以为读书没用，其实...》128w播放'],
    tags: ['选题', '反转', '认知差'],
    match: 4,
    status: 'saved',
  },
  {
    id: 2, type: '开场', icon: '🎬',
    name: '3秒悬念钩子',
    source: '@老番茄',
    template: '"[问题抛出] — [反直觉现象] — [等我告诉你]"',
    cases: ['《为什么聪明人总是记不住知识？》89w播放'],
    tags: ['开场', '留存', '悬念'],
    match: 5,
    status: 'practiced',
  },
  {
    id: 3, type: '结构', icon: '📐',
    name: '横评对比结构',
    source: '@科技美学',
    template: '"[产品A] vs [产品B]：我测了[N]天的真实结论"',
    cases: ['《5款笔记软件横评》210w播放'],
    tags: ['结构', '横评', '干货'],
    match: 3,
    status: 'saved',
  },
  {
    id: 4, type: '封面', icon: '🖼',
    name: '大字冲击封面',
    source: '@朱一旦',
    template: '主色调背景 + 1句核心话术 + 主角表情特写',
    cases: ['CTR均值高于同类视频40%'],
    tags: ['封面', '视觉', '点击率'],
    match: 4,
    status: 'pending',
  },
  {
    id: 5, type: '互动', icon: '💬',
    name: '评论区埋雷法',
    source: '@小Lin说',
    template: '"在评论区留一个[争议性问题]引发用户表态"',
    cases: ['《月薪2万是高薪吗》评论区破万'],
    tags: ['互动', '评论', '留存'],
    match: 5,
    status: 'pending',
  },
  {
    id: 6, type: '结尾', icon: '🎯',
    name: '行动号召结尾',
    source: '@回形针PaperClip',
    template: '"[本期核心结论] + [下期预告] + [互动引导]"',
    cases: ['完播率均值提升23%'],
    tags: ['结尾', '完播率', '涨粉'],
    match: 3,
    status: 'saved',
  },
]
