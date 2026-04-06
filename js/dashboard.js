'use strict';

/* ── 참고 데이터 기반 17개 지역 (가나다 순) ── */
const REGION_STATS = [
  { code:'gangwon',   label:'강원',  rivers:18,  crossing:43268,  inside:15126 },
  { code:'gyeonggi',  label:'경기',  rivers:44,  crossing:100566, inside:33264 },
  { code:'gyeongnam', label:'경남',  rivers:22,  crossing:66778,  inside:19413 },
  { code:'gyeongbuk', label:'경북',  rivers:23,  crossing:100582, inside:36194 },
  { code:'gwangju',   label:'광주',  rivers:5,   crossing:3764,   inside:1797  },
  { code:'daegu',     label:'대구',  rivers:9,   crossing:19274,  inside:12545 },
  { code:'daejeon',   label:'대전',  rivers:5,   crossing:3176,   inside:1805  },
  { code:'busan',     label:'부산',  rivers:16,  crossing:10632,  inside:8384  },
  { code:'seoul',     label:'서울',  rivers:25,  crossing:11816,  inside:13953 },
  { code:'sejong',    label:'세종',  rivers:1,   crossing:2068,   inside:929   },
  { code:'ulsan',     label:'울산',  rivers:5,   crossing:7228,   inside:3161  },
  { code:'incheon',   label:'인천',  rivers:10,  crossing:1736,   inside:959   },
  { code:'jeonnam',   label:'전남',  rivers:22,  crossing:25668,  inside:12086 },
  { code:'jeonbuk',   label:'전북',  rivers:15,  crossing:20753,  inside:11965 },
  { code:'jeju',      label:'제주',  rivers:2,   crossing:3138,   inside:1083  },
  { code:'chungnam',  label:'충남',  rivers:16,  crossing:20435,  inside:12251 },
  { code:'chungbuk',  label:'충북',  rivers:14,  crossing:19982,  inside:12152 },
];

/* ── 세부 지역 데이터 (강원 예시) ── */
const SUB_REGION_STATS = {
  'gangwon': [
    { label:'강릉시', crossing:1794,  inside:677 },
    { label:'고성군', crossing:220,   inside:64 },
    { label:'동해시', crossing:466,   inside:143 },
    { label:'삼척시', crossing:2712,  inside:882 },
    { label:'속초시', crossing:298,   inside:48 },
    { label:'양구군', crossing:886,   inside:266 },
    { label:'양양군', crossing:1270,  inside:616 },
    { label:'영월군', crossing:3164,  inside:1186 },
    { label:'원주시', crossing:2936,  inside:1276 },
    { label:'인제군', crossing:1872,  inside:771 },
    { label:'정선군', crossing:2656,  inside:883 },
    { label:'철원군', crossing:626,   inside:147 },
    { label:'춘천시', crossing:10648, inside:2923 },
    { label:'태백시', crossing:1046,  inside:173 },
    { label:'평창군', crossing:2952,  inside:1356 },
    { label:'홍천군', crossing:5370,  inside:2234 },
    { label:'화천군', crossing:1834,  inside:664 },
    { label:'횡성군', crossing:2518,  inside:817 }
  ],
  'gyeonggi': [
    { label:'가평군', crossing:7732, inside:2787 },
    { label:'고양시 덕양구', crossing:2732, inside:1252 },
    { label:'고양시 일산동구', crossing:948, inside:304 },
    { label:'고양시 일산서구', crossing:262, inside:151 },
    { label:'과천시', crossing:580, inside:225 },
    { label:'광명시', crossing:1168, inside:754 },
    { label:'광주시', crossing:7380, inside:2303 },
    { label:'구리시', crossing:392, inside:420 },
    { label:'군포시', crossing:1042, inside:222 },
    { label:'김포시', crossing:988, inside:625 },
    { label:'남양주시', crossing:5142, inside:1403 },
    { label:'동두천시', crossing:1642, inside:270 },
    { label:'부천시 소사구', crossing:302, inside:199 },
    { label:'부천시 오정구', crossing:406, inside:166 },
    { label:'부천시 원미구', crossing:66, inside:27 },
    { label:'성남시 분당구', crossing:710, inside:216 },
    { label:'성남시 수정구', crossing:370, inside:95 },
    { label:'성남시 중원구', crossing:156, inside:47 },
    { label:'수원시 권선구', crossing:882, inside:261 },
    { label:'수원시 영통구', crossing:426, inside:122 },
    { label:'수원시 장안구', crossing:490, inside:105 },
    { label:'수원시 팔달구', crossing:148, inside:50 },
    { label:'시흥시', crossing:2058, inside:811 },
    { label:'안산시 단원구', crossing:364, inside:135 },
    { label:'안산시 상록구', crossing:766, inside:246 },
    { label:'안성시', crossing:4322, inside:1034 },
    { label:'안양시 동안구', crossing:484, inside:120 },
    { label:'안양시 만안구', crossing:864, inside:223 },
    { label:'양주시', crossing:6496, inside:1250 },
    { label:'양평군', crossing:7630, inside:2876 },
    { label:'여주시', crossing:3392, inside:1410 },
    { label:'연천군', crossing:636, inside:281 },
    { label:'오산시', crossing:494, inside:142 },
    { label:'용인시 기흥구', crossing:554, inside:118 },
    { label:'용인시 수지구', crossing:678, inside:198 },
    { label:'용인시 처인구', crossing:6366, inside:1910 },
    { label:'의왕시', crossing:864, inside:141 },
    { label:'의정부시', crossing:1638, inside:542 },
    { label:'이천시', crossing:3846, inside:954 },
    { label:'파주시', crossing:1852, inside:393 },
    { label:'평택시', crossing:1688, inside:631 },
    { label:'포천시', crossing:9382, inside:3365 },
    { label:'하남시', crossing:1580, inside:589 },
    { label:'화성시', crossing:8844, inside:1242 }
  ],
  'gyeongbuk': [
    { label:'경산시', crossing:5130, inside:1824 },
    { label:'경주시', crossing:7732, inside:2259 },
    { label:'고령군', crossing:13928, inside:5604 },
    { label:'구미시', crossing:3454, inside:1233 },
    { label:'김천시', crossing:5548, inside:1641 },
    { label:'문경시', crossing:5300, inside:1586 },
    { label:'봉화군', crossing:3748, inside:1400 },
    { label:'상주시', crossing:4678, inside:1718 },
    { label:'성주군', crossing:3760, inside:1477 },
    { label:'안동시', crossing:4558, inside:2583 },
    { label:'영덕군', crossing:2834, inside:1257 },
    { label:'영양군', crossing:1712, inside:691 },
    { label:'영주시', crossing:3414, inside:1005 },
    { label:'영천시', crossing:6290, inside:2519 },
    { label:'예천군', crossing:2234, inside:816 },
    { label:'울릉군', crossing:82, inside:25 },
    { label:'울진군', crossing:1472, inside:459 },
    { label:'의성군', crossing:4328, inside:1448 },
    { label:'청도군', crossing:5192, inside:1597 },
    { label:'청송군', crossing:4740, inside:1792 },
    { label:'칠곡군', crossing:3320, inside:1378 },
    { label:'포항시 남구', crossing:1682, inside:491 },
    { label:'포항시 북구', crossing:3446, inside:1391 }
  ],
  'daegu': [
    { label:'군위군', crossing:3280, inside:1070 },
    { label:'남구',   crossing:576,  inside:387 },
    { label:'달서구', crossing:910,  inside:504 },
    { label:'달성군', crossing:7942, inside:6172 },
    { label:'동구',   crossing:2522, inside:1755 },
    { label:'북구',   crossing:1552, inside:955 },
    { label:'서구',   crossing:122,  inside:134 },
    { label:'수성구', crossing:2038, inside:1423 },
    { label:'중구',   crossing:332,  inside:145 }
  ],
  'gyeongnam': [
    { label:'거제시', crossing:2118, inside:297 },
    { label:'거창군', crossing:2840, inside:586 },
    { label:'고성군', crossing:3534, inside:582 },
    { label:'김해시', crossing:8436, inside:2696 },
    { label:'남해군', crossing:1752, inside:202 },
    { label:'밀양시', crossing:5830, inside:2006 },
    { label:'사천시', crossing:2036, inside:820 },
    { label:'산청군', crossing:3848, inside:792 },
    { label:'양산시', crossing:3144, inside:1386 },
    { label:'의령군', crossing:2532, inside:562 },
    { label:'진주시', crossing:2496, inside:1196 },
    { label:'창녕군', crossing:2600, inside:1319 },
    { label:'창원시 마산합포구', crossing:1178, inside:241 },
    { label:'창원시 마산회원구', crossing:942, inside:157 },
    { label:'창원시 성산구', crossing:488, inside:68 },
    { label:'창원시 의창구', crossing:4748, inside:1153 },
    { label:'창원시 진해구', crossing:786, inside:121 },
    { label:'통영시', crossing:1460, inside:172 },
    { label:'하동군', crossing:2966, inside:1267 },
    { label:'함안군', crossing:4480, inside:1554 },
    { label:'함양군', crossing:2698, inside:499 },
    { label:'합천군', crossing:5866, inside:1737 }
  ],
  'jeonnam': [
    { label:'강진군', crossing:1276, inside:281 },
    { label:'고흥군', crossing:3846, inside:580 },
    { label:'곡성군', crossing:1695, inside:797 },
    { label:'광양시', crossing:1609, inside:1048 },
    { label:'구례군', crossing:1046, inside:587 },
    { label:'나주시', crossing:1345, inside:1026 },
    { label:'담양군', crossing:1905, inside:831 },
    { label:'목포시', crossing:60, inside:86 },
    { label:'무안군', crossing:187, inside:202 },
    { label:'보성군', crossing:1155, inside:436 },
    { label:'순천시', crossing:1549, inside:1225 },
    { label:'신안군', crossing:319, inside:132 },
    { label:'여수시', crossing:751, inside:221 },
    { label:'영광군', crossing:778, inside:403 },
    { label:'영암군', crossing:523, inside:318 },
    { label:'완도군', crossing:545, inside:271 },
    { label:'장성군', crossing:1505, inside:801 },
    { label:'장흥군', crossing:653, inside:223 },
    { label:'진도군', crossing:496, inside:261 },
    { label:'함평군', crossing:759, inside:345 },
    { label:'해남군', crossing:1346, inside:951 },
    { label:'화순군', crossing:2320, inside:1061 }
  ],
  'seoul': [
    { label:'강남구', crossing:282, inside:490 },
    { label:'강동구', crossing:268, inside:319 },
    { label:'강서구', crossing:196, inside:302 },
    { label:'광진구', crossing:588, inside:827 },
    { label:'마포구', crossing:490, inside:612 },
    { label:'서대문구', crossing:178, inside:210 },
    { label:'성동구', crossing:324, inside:456 },
    { label:'송파구', crossing:312, inside:398 },
    { label:'영등포구', crossing:410, inside:520 },
    { label:'용산구', crossing:286, inside:345 },
    { label:'종로구', crossing:462, inside:554 }
  ],
  'busan': [
    { label:'강서구', crossing:1824, inside:1205 },
    { label:'금정구', crossing:546, inside:423 },
    { label:'기장군', crossing:2136, inside:1587 },
    { label:'동구', crossing:384, inside:267 },
    { label:'북구', crossing:1248, inside:892 },
    { label:'사상구', crossing:612, inside:445 },
    { label:'사하구', crossing:924, inside:678 },
    { label:'해운대구', crossing:714, inside:543 }
  ],
  'incheon': [
    { label:'강화군', crossing:486, inside:208 },
    { label:'계양구', crossing:124, inside:87 },
    { label:'남동구', crossing:312, inside:198 },
    { label:'부평구', crossing:186, inside:112 },
    { label:'서구', crossing:328, inside:176 },
    { label:'연수구', crossing:148, inside:96 },
    { label:'옹진군', crossing:86, inside:42 },
    { label:'중구', crossing:66, inside:40 }
  ],
  'gwangju': [
    { label:'광산구', crossing:1264, inside:582 },
    { label:'남구', crossing:548, inside:278 },
    { label:'동구', crossing:386, inside:196 },
    { label:'북구', crossing:924, inside:467 },
    { label:'서구', crossing:642, inside:274 }
  ],
  'daejeon': [
    { label:'대덕구', crossing:726, inside:384 },
    { label:'동구', crossing:482, inside:276 },
    { label:'서구', crossing:524, inside:312 },
    { label:'유성구', crossing:968, inside:548 },
    { label:'중구', crossing:476, inside:285 }
  ],
  'ulsan': [
    { label:'남구', crossing:1024, inside:456 },
    { label:'동구', crossing:486, inside:214 },
    { label:'북구', crossing:1248, inside:567 },
    { label:'울주군', crossing:3684, inside:1612 },
    { label:'중구', crossing:786, inside:312 }
  ],
  'sejong': [
    { label:'세종시', crossing:2068, inside:929 }
  ],
  'jeonbuk': [
    { label:'고창군', crossing:1854, inside:987 },
    { label:'군산시', crossing:1248, inside:724 },
    { label:'김제시', crossing:2136, inside:1156 },
    { label:'남원시', crossing:2468, inside:1087 },
    { label:'무주군', crossing:1524, inside:645 },
    { label:'부안군', crossing:986, inside:478 },
    { label:'순창군', crossing:1246, inside:567 },
    { label:'완주군', crossing:2184, inside:1023 },
    { label:'익산시', crossing:1678, inside:934 },
    { label:'임실군', crossing:1124, inside:487 },
    { label:'장수군', crossing:876, inside:378 },
    { label:'전주시', crossing:1524, inside:1856 },
    { label:'정읍시', crossing:1246, inside:678 },
    { label:'진안군', crossing:659, inside:945 }
  ],
  'chungnam': [
    { label:'계룡시', crossing:248, inside:112 },
    { label:'공주시', crossing:2486, inside:1245 },
    { label:'금산군', crossing:1624, inside:786 },
    { label:'논산시', crossing:2148, inside:1067 },
    { label:'당진시', crossing:1246, inside:678 },
    { label:'보령시', crossing:1124, inside:534 },
    { label:'부여군', crossing:1856, inside:945 },
    { label:'서산시', crossing:1468, inside:723 },
    { label:'서천군', crossing:986, inside:478 },
    { label:'아산시', crossing:1648, inside:856 },
    { label:'예산군', crossing:1246, inside:612 },
    { label:'천안시', crossing:1824, inside:1234 },
    { label:'청양군', crossing:748, inside:367 },
    { label:'태안군', crossing:624, inside:298 },
    { label:'홍성군', crossing:1159, inside:316 }
  ],
  'chungbuk': [
    { label:'괴산군', crossing:1824, inside:845 },
    { label:'단양군', crossing:1246, inside:567 },
    { label:'보은군', crossing:1524, inside:678 },
    { label:'영동군', crossing:1648, inside:734 },
    { label:'옥천군', crossing:1856, inside:856 },
    { label:'음성군', crossing:1424, inside:678 },
    { label:'제천시', crossing:2148, inside:1067 },
    { label:'증평군', crossing:486, inside:234 },
    { label:'진천군', crossing:1124, inside:534 },
    { label:'청주시', crossing:4256, inside:3812 },
    { label:'충주시', crossing:2446, inside:2147 }
  ],
  'jeju': [
    { label:'제주시', crossing:2124, inside:712 },
    { label:'서귀포시', crossing:1014, inside:371 }
  ]
};

/* ── 시설물 세부 데이터 (가평군/조종면 예시) ── */
const MOCK_FACILITY_DETAILS = [
  { id: 'FD001', addr: '조종면 상판리 산 121', cat: '국가하천', riverName: '조종천', riverGrade: '지방하천', area: '12㎡', areaNum: 12, occArea: 10, occRate: 83.3, type: 'crossing', pct: '87%', pctVal: 87, lat: 37.892, lng: 127.355 },
  { id: 'FD002', addr: '조종면 상판리 41', cat: '국가하천', riverName: '조종천', riverGrade: '지방하천', area: '15㎡', areaNum: 15, occArea: 15, occRate: 100.0, type: 'inside', pct: '100%', pctVal: 100, lat: 37.894, lng: 127.358 },
  { id: 'FD003', addr: '조종면 상판리 산 121', cat: '국가하천', riverName: '조종천', riverGrade: '지방하천', area: '13㎡', areaNum: 13, occArea: 12, occRate: 92.3, type: 'crossing', pct: '92%', pctVal: 92, lat: 37.895, lng: 127.356 },
  { id: 'FD004', addr: '조종면 상판리 산 121', cat: '국가하천', riverName: '조종천', riverGrade: '지방하천', area: '6㎡', areaNum: 6, occArea: 6, occRate: 100.0, type: 'inside', pct: '100%', pctVal: 100, lat: 37.891, lng: 127.354 },
  { id: 'FD005', addr: '조종면 상판리 산 121', cat: '국가하천', riverName: '조종천', riverGrade: '지방하천', area: '22㎡', areaNum: 22, occArea: 12, occRate: 54.5, type: 'crossing', pct: '55%', pctVal: 55, lat: 37.893, lng: 127.357 },
  { id: 'FD006', addr: '조종면 상판리 603-2', cat: '국가하천', riverName: '조종천', riverGrade: '지방하천', area: '4㎡', areaNum: 4, occArea: 4, occRate: 100.0, type: 'inside', pct: '100%', pctVal: 100, lat: 37.890, lng: 127.352 },
  { id: 'FD007', addr: '조종면 상판리 산 146', cat: '국가하천', riverName: '조종천', riverGrade: '지방하천', area: '2㎡', areaNum: 2, occArea: 1.8, occRate: 90.0, type: 'crossing', pct: '88%', pctVal: 88, lat: 37.896, lng: 127.359 },
  { id: 'FD008', addr: '조종면 상판리 603-2', cat: '국가하천', riverName: '조종천', riverGrade: '지방하천', area: '20㎡', areaNum: 20, occArea: 20, occRate: 100.0, type: 'inside', pct: '100%', pctVal: 100, lat: 37.889, lng: 127.351 },
  { id: 'FD009', addr: '조종면 상판리 491-3', cat: '국가하천', riverName: '조종천', riverGrade: '지방하천', area: '9㎡', areaNum: 9, occArea: 7, occRate: 77.7, type: 'crossing', pct: '78%', pctVal: 78, lat: 37.888, lng: 127.350 },
  { id: 'FD010', addr: '조종면 상판리 491-3', cat: '국가하천', riverName: '조종천', riverGrade: '지방하천', area: '6㎡', areaNum: 6, occArea: 6, occRate: 100.0, type: 'inside', pct: '100%', pctVal: 100, lat: 37.887, lng: 127.349 },
];

/* ── 점용허가 정보 Mock 데이터 (하천 주변 배치) ── */
const MOCK_PERMIT_DATA = [
  /* 한강 주변 (서울) */
  { id:'PM001', lat:37.5285, lng:126.9320, type:'permitted',   name:'한강 하천점용(산책로)',  riverName:'한강', area:520 },
  { id:'PM002', lat:37.5270, lng:126.9380, type:'unpermitted', name:'한강 무허가 시설',       riverName:'한강', area:180 },
  { id:'PM003', lat:37.5195, lng:126.9950, type:'permitted',   name:'한강 교량 점용',         riverName:'한강', area:450 },
  { id:'PM004', lat:37.5180, lng:127.0050, type:'unpermitted', name:'한강 불법 구조물',        riverName:'한강', area:120 },
  { id:'PM005', lat:37.5310, lng:126.9150, type:'permitted',   name:'한강 배수시설 점용',     riverName:'한강', area:310 },
  { id:'PM006', lat:37.5250, lng:126.9550, type:'unpermitted', name:'한강 무허가 시설(축대)', riverName:'한강', area:95  },
  /* 중랑천 주변 */
  { id:'PM007', lat:37.5750, lng:127.0480, type:'permitted',   name:'중랑천 수도관 매설',     riverName:'중랑천', area:210 },
  { id:'PM008', lat:37.5820, lng:127.0500, type:'unpermitted', name:'중랑천 무허가 시설(농경지)', riverName:'중랑천', area:260 },
  { id:'PM009', lat:37.5690, lng:127.0460, type:'permitted',   name:'중랑천 주차장 점용',     riverName:'중랑천', area:380 },
  /* 안양천 주변 */
  { id:'PM010', lat:37.5120, lng:126.9000, type:'permitted',   name:'안양천 산책로 점용',     riverName:'안양천', area:420 },
  { id:'PM011', lat:37.5050, lng:126.8980, type:'unpermitted', name:'안양천 불법 점용',        riverName:'안양천', area:150 },
  /* 탄천 주변 */
  { id:'PM012', lat:37.4950, lng:127.0680, type:'permitted',   name:'탄천 하천점용(도로)',     riverName:'탄천', area:600 },
  { id:'PM013', lat:37.4880, lng:127.0700, type:'unpermitted', name:'탄천 무허가 시설(건축물)', riverName:'탄천', area:200 },
  /* 요천 주변 (남원시) */
  { id:'PM014', lat:35.4170, lng:127.3900, type:'permitted',   name:'요천 교량 점용',          riverName:'요천', area:500 },
  { id:'PM015', lat:35.4130, lng:127.3850, type:'unpermitted', name:'요천 불법 점용',           riverName:'요천', area:180 },
];

/* ── 남원시 데이터 (사료작물/비닐하우스/농지 과제용) ── */
const NAMWON_REGION_STATS = [
  { code:'namwon', label:'남원시', rivers:12, crossing:245, inside:112 }
];
const NAMWON_SUB_STATS = {
  namwon: [
    { label:'주천면', crossing:42, inside:18 },
    { label:'수지면', crossing:38, inside:15 },
    { label:'송동면', crossing:28, inside:12 },
    { label:'주생면', crossing:25, inside:11 },
    { label:'대강면', crossing:22, inside:10 },
    { label:'산동면', crossing:20, inside:9 },
    { label:'이백면', crossing:18, inside:8 },
    { label:'금지면', crossing:15, inside:7 },
    { label:'대산면', crossing:12, inside:6 },
    { label:'보절면', crossing:10, inside:5 },
    { label:'산내면', crossing:8, inside:5 },
    { label:'운봉읍', crossing:7, inside:6 }
  ]
};
const NAMWON_BOUNDS = [[35.30, 127.20], [35.55, 127.65]];

/* ── 과제별 분석 데이터 ── */
const TASK_ANALYSIS_DATA = {
  river: {
    '2025-10-all':      { year: '2025.10', region: '전국', count: '461,234' },
    '2025-08-all':      { year: '2025.08', region: '전국', count: '423,891' },
    '2025-08-seoul':    { year: '2025.08', region: '서울', count: '118,163' },
    '2025-06-gyeonggi': { year: '2025.06', region: '경기', count: '100,566' },
    '2025-05-busan':    { year: '2025.05', region: '부산', count: '10,632' },
    '2024-12-all':      { year: '2024.12', region: '전국', count: '398,210' },
    '2024-10-seoul':    { year: '2024.10', region: '서울', count: '105,420' },
    '2024-09-gyeonggi': { year: '2024.09', region: '경기', count: '94,831' },
    '2023-11-all':      { year: '2023.11', region: '전국', count: '372,105' },
    '2023-09-seoul':    { year: '2023.09', region: '서울', count: '98,712' }
  },
  forage: {
    '2025-10-namwon':   { year: '2025.10', region: '남원시', count: '1,842' },
    '2025-09-namwon':   { year: '2025.09', region: '남원시', count: '1,567' },
    '2025-03-namwon':   { year: '2025.03', region: '남원시', count: '1,324' }
  },
  greenhouse: {
    '2025-11-namwon':   { year: '2025.11', region: '남원시', count: '3,218' },
    '2025-08-namwon':   { year: '2025.08', region: '남원시', count: '2,945' },
    '2025-02-namwon':   { year: '2025.02', region: '남원시', count: '2,712' }
  },
  farmland: {
    '2025-12-namwon':   { year: '2025.12', region: '남원시', count: '5,632' },
    '2025-07-namwon':   { year: '2025.07', region: '남원시', count: '4,891' },
    '2025-01-namwon':   { year: '2025.01', region: '남원시', count: '4,205' }
  }
};

/* ── 과제 상태 ── */
let currentTask = 'river';

/* ── 시설물 뷰 상태 ── */
let currentFacFilter = 'all'; // all, crossing, inside
let currentFacSort   = 'cross-desc'; // cross-desc, inside-desc, cross-asc, inside-asc, name-asc, name-desc

/* 숫자 천단위 포맷 */
function fmtNum(n) { return n.toLocaleString('ko-KR'); }

/* ── 사이드바 뷰 전환 ── */
function switchSidebarView(viewId) {
  document.querySelectorAll('.db-sidebar-view').forEach(v => v.classList.remove('active'));
  const target = document.getElementById(viewId);
  if (target) target.classList.add('active');
  
  // 뷰 전환 시 필터/정렬 상태 초기화 (항상 기본값으로 시작)
  if (viewId === 'sidebar-detail-view' || viewId === 'sidebar-main-view') {
    currentFacFilter = 'all';
    currentFacSort   = 'cross-desc';
    
    // UI 초기화
    document.querySelectorAll('.detail-mode .rbl').forEach(el => el.classList.remove('active'));
    const lblSort = document.getElementById('fac-sort-label');
    if (lblSort) lblSort.textContent = '걸침 많은 순';
    
    const ddown = document.getElementById('fac-sort-dropdown');
    if (ddown) {
      ddown.querySelectorAll('.dsd-item').forEach(i => {
        i.classList.remove('active');
        if (i.dataset.sort === 'cross-desc') i.classList.add('active');
      });
    }

    // 레이어 설정창은 항상 표시 (detail-mode 클래스만 토글)
    if (viewId === 'sidebar-detail-view') {
      document.body.classList.add('detail-mode-active');
    } else {
      document.body.classList.remove('detail-mode-active');
    }

    // 지역별 현황 카드 내부 바디 A/B 전환
    var regionBody = document.getElementById('region-body');
    var detailBody = document.getElementById('sidebar-detail-view');
    var titleEl = document.getElementById('panel-region-title');
    if (viewId === 'sidebar-detail-view') {
      if (regionBody) regionBody.style.display = 'none';
      if (detailBody) detailBody.classList.add('active');
      if (titleEl) titleEl.textContent = '시설물 목록';
    } else {
      if (regionBody) regionBody.style.display = '';
      if (detailBody) detailBody.classList.remove('active');
      if (titleEl) titleEl.textContent = '지역별 현황';
    }
  }
}

/* ── 시설물 목록 렌더링 ── */
function renderFacilityList(subName, forceQuery = '') {
  const container = document.getElementById('facility-list');
  const titleEl   = document.getElementById('side-detail-title');
  if (titleEl) titleEl.textContent = `${subName} 시설물 목록`;

  // 1. 검색어 필터 (기존 input 값 사용)
  const q = forceQuery || document.getElementById('facility-search-input').value.trim();
  
  let result = MOCK_FACILITY_DETAILS;
  
  if (q) {
    result = result.filter(f => f.addr.includes(q));
  }

  // 2. 상태 필터 (걸침/구역내)
  if (currentFacFilter !== 'all') {
    result = result.filter(f => f.type === currentFacFilter);
  }

  // 3. 정렬 (전체 목록과 동일한 기준)
  result = [...result].sort((a, b) => {
    if (currentFacSort === 'cross-desc') {
      if (a.type !== b.type) return (a.type === 'crossing') ? -1 : 1;
      if (b.pctVal !== a.pctVal) return b.pctVal - a.pctVal; // 퍼센트 우선
      return b.areaNum - a.areaNum;
    }
    if (currentFacSort === 'inside-desc') {
      if (a.type !== b.type) return (a.type === 'inside') ? -1 : 1;
      if (b.pctVal !== a.pctVal) return b.pctVal - a.pctVal; // 퍼센트 우선
      return b.areaNum - a.areaNum;
    }
    if (currentFacSort === 'cross-asc') {
      if (a.type !== b.type) return (a.type === 'inside') ? -1 : 1;
      if (b.pctVal !== a.pctVal) return a.pctVal - b.pctVal; // 퍼센트 낮은 순
      return a.areaNum - b.areaNum;
    }
    if (currentFacSort === 'inside-asc') {
      if (a.type !== b.type) return (a.type === 'crossing') ? -1 : 1;
      if (b.pctVal !== a.pctVal) return a.pctVal - b.pctVal; // 퍼센트 낮은 순
      return a.areaNum - b.areaNum;
    }
    if (currentFacSort === 'name-asc')  return a.addr.localeCompare(b.addr, 'ko');
    if (currentFacSort === 'name-desc') return b.addr.localeCompare(a.addr, 'ko');
    return 0;
  });

  container.innerHTML = result.map(f => {
    const statusClass = f.type === 'crossing' ? 'crossing' : 'inside';
    return `
      <div class="facility-item ${statusClass}" role="listitem" data-id="${f.id}">
        <div class="fi-status ${statusClass}"></div>
        <div class="fi-content">
          <div class="fi-addr">${f.addr}</div>
          <div class="fi-meta">${f.cat} · ${f.area}</div>
        </div>
        <div class="fi-badge">${f.pct}</div>
      </div>
    `;
  }).join('');

  // 클릭 이벤트 바인딩
  container.querySelectorAll('.facility-item').forEach(item => {
    item.addEventListener('click', () => {
      const fid = item.dataset.id;
      const facility = result.find(f => f.id === fid);
      
      // 1. 활성 상태 표시
      container.querySelectorAll('.facility-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      // 2. 지도 강조 및 이동
      if (facility) {
        MapModule.highlightFacility(facility);
      }
    });
  });

  if (result.length === 0) {
    container.innerHTML = '<div class="sub-region-empty">조건에 맞는 시설물이 없습니다.</div>';
  }
}

/* ── KPI 업데이트 (단일 지역 또는 전체 배열) ── */
function updateKPI(data) {
  let title = '전국 현황';
  let cross = 0;
  let inside = 0;

  if (Array.isArray(data)) {
    // 전국 합계
    cross = data.reduce((s, r) => s + r.crossing, 0);
    inside = data.reduce((s, r) => s + r.inside, 0);
  } else if (data) {
    // 단일 지역
    title = `${data.label} 현황`;
    cross = data.crossing;
    inside = data.inside;
  }

  const total = (cross + inside) || 1;
  const crossPct = (cross / total * 100).toFixed(1);
  const insidePct = (inside / total * 100).toFixed(1);

  // UI 업데이트 (Consolidated Map Summary Card)
  const titleEl  = document.getElementById('summary-title');
  const crossEl  = document.getElementById('sum-crossing');
  const insideEl = document.getElementById('sum-inside');

  if (titleEl)  titleEl.textContent = title;
  if (crossEl)  crossEl.textContent = fmtNum(cross);
  if (insideEl) insideEl.textContent = fmtNum(inside);

  // 미니 차트 업데이트
  const barCross  = document.getElementById('sum-bar-crossing');
  const barInside = document.getElementById('sum-bar-inside');
  if (barCross && barInside) {
    barCross.style.width = crossPct + '%';
    barInside.style.width = insidePct + '%';
  }

  // 모바일 리본 업데이트 (걸침, 구역내)
  const mKpiCross = document.getElementById('m-kpi-cross');
  const mKpiInside = document.getElementById('m-kpi-inside');
  if (mKpiCross) {
    mKpiCross.textContent = cross >= 10000 ? (cross / 10000).toFixed(1) + '만' : cross.toLocaleString();
  }
  if (mKpiInside) {
    mKpiInside.textContent = inside >= 10000 ? (inside / 10000).toFixed(1) + '만' : inside.toLocaleString();
  }
}

/* ── 세부 지역 렌더링 (Compact Style) ── */
function renderSubRegions(regionCode, container) {
  const subs = SUB_REGION_STATS[regionCode] || [];
  if (subs.length === 0) {
    container.innerHTML = '<div class="sub-region-empty">세부 데이터가 없습니다.</div>';
    return;
  }

  container.innerHTML = subs.map(s => {
    const total = (s.crossing + s.inside) || 1;
    const crossPct = (s.crossing / total * 100).toFixed(1);
    const insidePct = (s.inside / total * 100).toFixed(1);
    return `
      <div class="sub-region-item" data-sub-name="${s.label}">
        <div class="sri-name">${s.label}</div>
        <div class="sri-nums">
          <span class="n-cross">${fmtNum(s.crossing)}</span>
          <span class="sep">/</span>
          <span class="n-in">${fmtNum(s.inside)}</span>
        </div>
        <div class="sri-visual">
          <div class="sri-bar-track">
            <div class="bar-seg crossing" style="width:${crossPct}%"></div>
            <div class="bar-seg inside"   style="width:${insidePct}%"></div>
          </div>
        </div>
      </div>`;
  }).join('');

  // 하위 지역 클릭 -> 시설물 목록으로 전환 + 요약 카드 업데이트
  container.querySelectorAll('.sub-region-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      const subName = item.dataset.subName;
      const subData = subs.find(s => s.label === subName);
      
      // 1. 시설물 데이터 준비 (목록은 바텀시트에서 보여줄 예정)
      renderFacilityList(subName);
      
      // 2. 지도 시설물 레이어 표시
      MapModule.renderFacilityLayer(MOCK_FACILITY_DETAILS);
      
      // 3. 하단 요약 카드 및 모바일 리본 업데이트
      if (subData) updateKPI(subData);
      
      const mCurrRegion = document.getElementById('m-curr-region');
      if (mCurrRegion) mCurrRegion.textContent = subName;

      // 4. 모바일인 경우 사이드바 닫고 목록 보기 버튼 노출 + 바텀 시트 즉시 열기
      if (window.innerWidth <= 768) {
        document.getElementById('db-left-panel').classList.remove('open');
        document.getElementById('sidebar-backdrop').classList.remove('active');
        
        toggleMobileFloatingButtons(false); 
        
        const detailSheet = document.getElementById('sidebar-detail-view');
        if (detailSheet) detailSheet.classList.add('active');
        
        // 상세 모드 활성화 플래그 추가 (버튼 노출 제어용)
        document.body.classList.add('detail-mode-active');
      } else {
        // 데스크탑은 기존처럼 사이드바 뷰 전환
        switchSidebarView('sidebar-detail-view');
      }
      
      UI.toast(`${subName} 시설물 목록을 불러왔습니다.`, 'info', 1500);
    });
  });
}

/* ── 지역 목록 렌더링 ── */
function renderRegionList() {
  const list     = document.getElementById('region-list');
  const maxTotal = Math.max(...REGION_STATS.map(r => r.crossing + r.inside), 1);

  list.innerHTML = REGION_STATS.map(r => {
    const total    = r.crossing + r.inside;
    const crossPct = (r.crossing / maxTotal * 100).toFixed(1);
    const insidePct= (r.inside   / maxTotal * 100).toFixed(1);
    return `
      <div class="region-card" role="listitem" data-region="${r.code}" tabindex="0">
        <div class="region-card-master">
          <div class="region-row1">
            <div class="region-name-txt">
              ${r.label}
              <span class="region-rivers">${r.rivers}개</span>
            </div>
            <div class="region-nums">
              <span class="n-cross">${fmtNum(r.crossing)}</span>
              <span class="n-in">${fmtNum(r.inside)}</span>
            </div>
          </div>
          <div class="region-bar-track">
            <div class="bar-seg crossing" style="width:${crossPct}%"></div>
            <div class="bar-seg inside"   style="width:${insidePct}%"></div>
          </div>
        </div>
        <div class="sub-region-list" id="sub-list-${r.code}"></div>
      </div>`;
  }).join('');

  list.querySelectorAll('.region-card').forEach(card => {
    const master = card.querySelector('.region-card-master');
    const handler = (e) => {
      e.stopPropagation();
      const code = card.dataset.region;
      const isActive = card.classList.contains('active');
      const subList = card.querySelector('.sub-region-list');

      // 다른 카드 닫기
      list.querySelectorAll('.region-card').forEach(c => {
        if (c !== card) c.classList.remove('active');
      });

      if (!isActive) {
        card.classList.add('active');
        renderSubRegions(code, subList);
        
        const regionObj = REGION_STATS.find(r => r.code === code);
        updateKPI(regionObj);
        
        // 모바일 리본 지역명 업데이트
        const mCurrRegion = document.getElementById('m-curr-region');
        if (mCurrRegion && regionObj) mCurrRegion.textContent = regionObj.label;

        MapModule.renderSigunguClusters(code);
      } else {
        card.classList.remove('active');
        updateKPI(REGION_STATS);
        MapModule.renderRegionSummaries(REGION_STATS);
        
        // 모바일 리본 지역명 리셋
        const mCurrRegion = document.getElementById('m-curr-region');
        if (mCurrRegion) mCurrRegion.textContent = '전국';

        MapModule.map.flyTo([36.5, 127.8], 7, { duration: 0.8 });
      }
    };
    master.addEventListener('click', handler);
  });
}

/** 지도 마커 클릭 -> 사이드바 동기화 */
window.handleRegionClick = function(code, label) {
  const card = document.querySelector(`.region-card[data-region="${code}"]`);
  if (card) {
    const master = card.querySelector('.region-card-master');
    // 이미 열려있지 않은 경우에만 클릭 실행
    if (!card.classList.contains('active')) {
      master.click();
    }
    // 해당 카드로 부드럽게 스크롤
    card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
};

/* ── 검색 오버레이 ── */
function initSearch() {
  const toggleBtn = document.getElementById('btn-search-toggle');
  const overlay   = document.getElementById('db-search-overlay');
  const resetBtn  = document.getElementById('btn-search-reset');
  const mCloseBtn = document.getElementById('btn-search-m-close');
  const input     = document.getElementById('db-search-input');
  const resPanel  = document.getElementById('db-search-results');

  function restoreRightCards() {
    const kpi = document.getElementById('db-map-summary');
    const layer = document.getElementById('db-layer-settings');
    if (kpi) kpi.classList.remove('minimized');
    if (layer) layer.classList.remove('minimized');
  }

  if (toggleBtn && overlay) {
    const closeSearch = () => {
      overlay.classList.remove('open');
      toggleBtn.classList.remove('active');
      if (resPanel) resPanel.classList.remove('active');
      restoreRightCards();
    };

    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = overlay.classList.contains('open');
      if (!isOpen) {
        overlay.classList.add('open');
        toggleBtn.classList.add('active');
        if (input) input.focus();
      } else {
        closeSearch();
      }
    });

    if (mCloseBtn) {
      mCloseBtn.addEventListener('click', closeSearch);
    }
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (input) {
        input.value = '';
        input.focus();
      }
      if (resPanel) resPanel.classList.remove('active');
      resetBtn.classList.remove('active');
    });
  }

  if (input) {
    input.addEventListener('input', () => {
      if (input.value.trim().length > 0) {
        resetBtn.classList.add('active');
      } else {
        resetBtn.classList.remove('active');
        if (resPanel) resPanel.classList.remove('active');
      }
    });
  }

  /* ── 검색 결과 목업 데이터 확장 ── */
  const MOCK_SEARCH_RESULTS = {
    name: Array.from({length: 18}, (_, i) => ({ 
      title: `운봉읍_${i + 1}`, 
      sub: i % 2 === 0 ? "읍면동구역경계 > 읍" : "기타정보서비스업 > 국가가변전광표지판", 
      type: "lot", 
      addr: `전북특별자치도 남원시 운봉읍 동천리 ${642 + i}-${i % 5}` 
    })),
    road: Array.from({length: 15}, (_, i) => ({ 
      title: `운봉읍_도로_${i + 1}`, 
      sub: i % 3 === 0 ? "도로시설 > 주차장" : "도로명주소", 
      type: "road", 
      addr: `전북특별자치도 남원시 운봉읍 용은길 ${38 + i}-${i % 3}` 
    })),
    lot: Array.from({length: 22}, (_, i) => ({ 
      title: `운봉읍_지번_${i + 1}`, 
      sub: "지번주소", 
      type: "lot", 
      addr: `전북특별자치도 남원시 운봉읍 가산리 ${i + 1}` 
    }))
  };

  const ITEMS_PER_PAGE = 5;

  const renderPagination = (totalItems, currentPage, onPageChange) => {
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    if (totalPages <= 1) return "";

    let html = '<div class="res-pagination">';
    for (let i = 1; i <= totalPages; i++) {
      html += `<button class="pg-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
    }
    html += '</div>';

    // 이벤트 위임은 renderSearchResults를 호출한 곳에서 처리하거나 타이머 사용
    return html;
  };

  const renderSearchResults = (query, tab = 'all', pageNum = 1) => {
    const list = document.getElementById('res-content-list');
    const queryVal = document.getElementById('res-query-val');
    const totalVal = document.getElementById('res-total-val');
    
    if (!list) return;
    
    queryVal.textContent = query;
    list.innerHTML = '';
    
    const categories = {
      name: { label: "명칭", data: MOCK_SEARCH_RESULTS.name },
      road: { label: "도로명", data: MOCK_SEARCH_RESULTS.road },
      lot: { label: "지번", data: MOCK_SEARCH_RESULTS.lot }
    };

    const renderItem = (item) => `
      <div class="res-item">
        <div class="res-item-title">${item.title}</div>
        <div class="res-item-sub">${item.sub}</div>
        <div class="res-item-addr">
          <span class="addr-badge ${item.type}">${item.type === 'lot' ? '지번' : '도로명'}</span>
          ${item.addr}
        </div>
      </div>
    `;

    const renderSection = (key, cat, isAllTab) => {
      if (cat.data.length === 0) return '';
      
      let displayData = cat.data;
      let paginationHtml = "";

      if (isAllTab) {
        // 전체 탭인 경우 상위 2개만 노출 + 더보기 버튼
        displayData = cat.data.slice(0, 2);
      } else {
        // 특정 탭인 경우 페이지네이션 적용
        const start = (pageNum - 1) * ITEMS_PER_PAGE;
        displayData = cat.data.slice(start, start + ITEMS_PER_PAGE);
        paginationHtml = renderPagination(cat.data.length, pageNum, (p) => renderSearchResults(query, tab, p));
      }

      return `
        <div class="res-sec">
          <div class="res-sec-hd">
            <span>${cat.label} <span class="res-sec-count">${cat.data.length.toLocaleString()}</span> 건</span>
            ${isAllTab ? `
            <a href="javascript:void(0);" class="res-more" data-tab-target="${key}">
              ${cat.label} 더 보기
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </a>` : ""}
          </div>
          <div class="res-list">
            ${displayData.map(renderItem).join('')}
          </div>
          ${paginationHtml}
        </div>
      `;
    };

    let totalCount = 0;
    if (tab === 'all') {
      totalCount = Object.values(categories).reduce((acc, cat) => acc + cat.data.length, 0);
      list.innerHTML = Object.keys(categories).map(key => renderSection(key, categories[key], true)).join('');
    } else {
      totalCount = categories[tab].data.length;
      list.innerHTML = renderSection(tab, categories[tab], false);
    }

    totalVal.textContent = (totalCount).toLocaleString();

    // 페이지네이션 클릭 이벤트 바인딩
    list.querySelectorAll('.pg-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const p = parseInt(btn.dataset.page);
        renderSearchResults(query, tab, p);
      });
    });
  };

  const btnResClose = document.getElementById('btn-res-close');
  const btnSearchExec = document.getElementById('btn-search-exec');

  const executeSearch = () => {
    const q = input.value.trim();
    if (q.length > 0) {
      resPanel.classList.add('active');
      renderSearchResults(q, 'all');
      /* 검색 결과 표시 시 우측 카드 접기 */
      const kpi = document.getElementById('db-map-summary');
      const layer = document.getElementById('db-layer-settings');
      if (kpi) kpi.classList.add('minimized');
      if (layer) layer.classList.add('minimized');
    }
  };

  input.addEventListener('input', () => {
    if (input.value.trim().length === 0) {
      resPanel.classList.remove('active');
    }
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      executeSearch();
    }
  });

  if (btnSearchExec) {
    btnSearchExec.addEventListener('click', executeSearch);
  }

  // 탭 전환
  document.querySelectorAll('.res-tab').forEach(tabBtn => {
    tabBtn.addEventListener('click', () => {
      document.querySelectorAll('.res-tab').forEach(b => b.classList.remove('active'));
      tabBtn.classList.add('active');
      renderSearchResults(input.value.trim(), tabBtn.dataset.tab);
    });
  });

  if (resPanel) {
    resPanel.addEventListener('click', e => {
      const moreLink = e.target.closest('.res-more');
      if (moreLink) {
        const targetTab = moreLink.dataset.tabTarget;
        const tabBtn = document.querySelector(`.res-tab[data-tab="${targetTab}"]`);
        if (tabBtn) tabBtn.click();
      }
    });
  }

  if (btnResClose) {
    btnResClose.addEventListener('click', () => {
      if (resPanel) resPanel.classList.remove('active');
      restoreRightCards();
    });
  }

  /* Esc 로 닫기 */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) {
      overlay.classList.remove('open');
      if (resPanel) resPanel.classList.remove('active');
      toggleBtn.classList.remove('active');
    }
  });
}

/* ── 사용자 드롭다운 ── */
function initUserDropdown(user) {
  const btn      = document.getElementById('btn-logout');
  const dropdown = document.getElementById('user-dropdown');
  document.getElementById('header-user-name').textContent = user.name + '님';
  document.getElementById('dd-user-name').textContent  = user.name;
  document.getElementById('dd-user-org').textContent   = user.org;
  document.getElementById('dd-user-role').textContent  = user.roleLabel;

  btn.addEventListener('click', e => {
    e.stopPropagation();
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
  });
  document.addEventListener('click', () => { dropdown.style.display = 'none'; });
}

/* ── 리스트 정렬 초기화 ── */
function initSorting() {
  const toggleBtn = document.getElementById('btn-sort-toggle');
  const dropdown  = document.getElementById('sort-dropdown');
  const label     = document.getElementById('sort-label');

  if (!toggleBtn || !dropdown) return;

  toggleBtn.addEventListener('click', e => {
    e.stopPropagation();
    dropdown.classList.toggle('active');
  });

  document.addEventListener('click', () => dropdown.classList.remove('active'));

  dropdown.querySelectorAll('.dsd-item').forEach(item => {
    item.addEventListener('click', () => {
      const type = item.dataset.sort;
      const text = item.textContent;

      // 1. 레이블 변경
      label.textContent = text;
      
      // 2. 데이터 정렬
      applySort(type);

      // 3. 리스트 재렌더링
      renderRegionList();

      // 4. 활성 표시
      dropdown.querySelectorAll('.dsd-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      
      dropdown.classList.remove('active');
      UI.toast(`'${text}' 기준으로 정렬되었습니다.`, 'info', 1500);
    });
  });
}

function applySort(type) {
  switch (type) {
    case 'cross-desc':
      REGION_STATS.sort((a, b) => b.crossing - a.crossing);
      break;
    case 'inside-desc':
      REGION_STATS.sort((a, b) => b.inside - a.inside);
      break;
    case 'cross-asc':
      REGION_STATS.sort((a, b) => a.crossing - b.crossing);
      break;
    case 'inside-asc':
      REGION_STATS.sort((a, b) => a.inside - b.inside);
      break;
    case 'name-asc':
      REGION_STATS.sort((a, b) => a.label.localeCompare(b.label, 'ko'));
      break;
    case 'name-desc':
      REGION_STATS.sort((a, b) => b.label.localeCompare(a.label, 'ko'));
      break;
  }
}

/* ── 초기화 ── */
document.addEventListener('DOMContentLoaded', () => {
  const user = Auth.requireLogin();
  if (!user) return;

  initUserDropdown(user);

  // 관리자 권한 체크: 관리자가 아닌 경우 헤더의 관리 버튼 숨김
  const btnNavAdmin = document.getElementById('btn-nav-admin');
  if (btnNavAdmin && user.role !== 'admin') {
    btnNavAdmin.style.display = 'none';
  }

  /* 지도 (위성 기본) */
  window.REGION_STATS = REGION_STATS;
  MapModule.init('map', { center: [36.5, 127.8], zoom: 7 });
  MapModule.renderRegionSummaries(REGION_STATS);

  updateKPI(REGION_STATS);
  applySort('cross-desc'); // 초기 정렬: 걸침 많은 순
  renderRegionList();
  initSearch();
  initSorting(); // 정렬 초기화 추가

  /* 줌 버튼 */
  document.getElementById('btn-zoom-in') .addEventListener('click', () => MapModule.map.zoomIn());
  document.getElementById('btn-zoom-out').addEventListener('click', () => MapModule.map.zoomOut());

  /* 배경지도/측정/그리기 메뉴 토글 공통 로직 */
  const btnBasemap = document.getElementById('btn-basemap');
  const menuBasemap = document.getElementById('basemap-menu');
  const btnMeasure = document.getElementById('btn-measure');
  const menuMeasure = document.getElementById('measure-menu');
  const btnDraw = document.getElementById('btn-draw');
  const menuDraw = document.getElementById('draw-menu');
  
  const closeAllMenus = () => {
    [menuBasemap, menuMeasure, menuDraw].forEach(m => m?.classList.remove('open'));
    [btnBasemap, btnMeasure, btnDraw].forEach(b => b?.classList.remove('active'));
  };

  if (btnBasemap && menuBasemap) {
    btnBasemap.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = menuBasemap.classList.contains('open');
      closeAllMenus();
      if (!isOpen) {
        menuBasemap.classList.add('open');
        btnBasemap.classList.add('active');
      }
    });

    menuBasemap.querySelectorAll('.bm-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const type = item.dataset.type;
        const label = MapModule.setBasemap(type);
        menuBasemap.querySelectorAll('.bm-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        closeAllMenus();
        UI.toast(`${label}로 전환했습니다.`, 'info', 1800);
      });
    });
  }

  if (btnMeasure && menuMeasure) {
    btnMeasure.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = menuMeasure.classList.contains('open');
      closeAllMenus();
      if (!isOpen) {
        menuMeasure.classList.add('open');
        btnMeasure.classList.add('active');
      }
    });

    menuMeasure.querySelectorAll('.bm-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        menuMeasure.querySelectorAll('.bm-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        closeAllMenus();
      });
    });
  }

  if (btnDraw && menuDraw) {
    btnDraw.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = menuDraw.classList.contains('open');
      closeAllMenus();
      if (!isOpen) {
        menuDraw.classList.add('open');
        btnDraw.classList.add('active');
      }
    });

    menuDraw.querySelectorAll('.bm-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        menuDraw.querySelectorAll('.bm-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        closeAllMenus();
      });
    });
  }

  // 외부 클릭 시 모든 메뉴 닫기
  document.addEventListener('click', (e) => {
    if (menuBasemap && !btnBasemap.contains(e.target) && !menuBasemap.contains(e.target)) {
      menuBasemap.classList.remove('open');
      btnBasemap.classList.remove('active');
    }
    if (menuMeasure && !btnMeasure.contains(e.target) && !menuMeasure.contains(e.target)) {
      menuMeasure.classList.remove('open');
      btnMeasure.classList.remove('active');
    }
    if (menuDraw && !btnDraw.contains(e.target) && !menuDraw.contains(e.target)) {
      menuDraw.classList.remove('open');
      btnDraw.classList.remove('active');
    }
  });

  /* ── 보안 서약서 모달 제어 ── */
  const btnExport = document.getElementById('btn-export-tool');
  const modalPledge = document.getElementById('modal-pledge');
  const btnPledgeClose = document.getElementById('btn-pledge-close');
  const btnPledgeCancel = document.getElementById('btn-pledge-cancel');
  const btnPledgeExec = document.getElementById('btn-pledge-exec');

  if (btnExport && modalPledge) {
    btnExport.addEventListener('click', () => {
      modalPledge.classList.add('active');
    });
  }

  const closePledgeModal = () => {
    modalPledge.classList.remove('active');
  };

  if (btnPledgeClose) btnPledgeClose.addEventListener('click', closePledgeModal);
  if (btnPledgeCancel) btnPledgeCancel.addEventListener('click', closePledgeModal);

  if (btnPledgeExec) {
    btnPledgeExec.addEventListener('click', () => {
      const agreeCheck = document.getElementById('pledge-agree');
      const reqNameInput = document.getElementById('p-req-name');
      const startDateInput = document.getElementById('p-start-date');
      const endDateInput = document.getElementById('p-end-date');
      const purposeInput = document.getElementById('p-purpose');

      // 기존 에러 초기화
      document.querySelectorAll('.p-form-group').forEach(group => group.classList.remove('has-error'));

      let hasError = false;

      // 필수 항목 검증
      if (!reqNameInput.value.trim()) {
        reqNameInput.closest('.p-form-group').classList.add('has-error');
        hasError = true;
      }
      if (!startDateInput.value || !endDateInput.value) {
        startDateInput.closest('.p-form-group').classList.add('has-error');
        hasError = true;
      }
      if (!purposeInput.value.trim()) {
        purposeInput.closest('.p-form-group').classList.add('has-error');
        hasError = true;
      }

      if (hasError) {
        return;
      }

      if (!agreeCheck.checked) {
        agreeCheck.closest('.p-form-group').classList.add('has-error');
        return;
      }

      // 성공 -> 2단계로 전환
      UI.toast('보안 서약이 완료되었습니다.', 'success', 1500);
      
      const pledgeBox = document.querySelector('.modal-pledge-box');
      const saveMapBox = document.getElementById('modal-save-map');
      
      if (pledgeBox && saveMapBox) {
        pledgeBox.style.display = 'none';
        saveMapBox.style.display = 'block';
        
        // 미리보기 레이어 (예시설정 — 현재 베이스맵에 따라 이미지 다르게 가능)
        const previewImg = document.getElementById('img-map-preview');
        // 예: MapModule._currentBase 에 따라 분기 가능
      }
    });
  }

  /* ── 지도 저장 모달 제어 (2단계) ── */
  const btnSaveMapClose = document.getElementById('btn-save-map-close');
  const btnSaveMapCancel = document.getElementById('btn-save-map-cancel');
  const btnMapPrint = document.getElementById('btn-map-print');
  const memoInput = document.getElementById('memo-input');
  const currMemoLen = document.getElementById('curr-memo-len');

  const closeAllModals = () => {
    modalPledge.classList.remove('active');
    // 리셋 로직
    setTimeout(() => {
      document.querySelector('.modal-pledge-box').style.display = 'block';
      document.getElementById('modal-save-map').style.display = 'none';
      if (memoInput) memoInput.value = '';
      if (currMemoLen) currMemoLen.textContent = '0';
    }, 4000);
  };

  if (btnSaveMapClose) btnSaveMapClose.addEventListener('click', closeAllModals);
  if (btnSaveMapCancel) btnSaveMapCancel.addEventListener('click', closeAllModals);

  if (memoInput && currMemoLen) {
    memoInput.addEventListener('input', () => {
      currMemoLen.textContent = memoInput.value.length;
    });
  }

  if (btnMapPrint) {
    btnMapPrint.addEventListener('click', () => {
      UI.toast('지도가 출력(저장)되었습니다.', 'success');
      closeAllModals();
    });
  }

  /* 상세 뷰: 뒤로가기 */
  /* 상세 뷰: 뒤로가기 (전체 목록 버튼) */
  const btnSidebarBack = document.getElementById('btn-sidebar-back');
  if (btnSidebarBack) {
    btnSidebarBack.addEventListener('click', () => {
      // 데스크탑 전용: 지역 목록으로 복구 (모바일에서는 .btn-back이 숨김처리됨)
      if (window.innerWidth > 768) {
        switchSidebarView('sidebar-main-view');
        
        // 2. 데이터 및 UI 초기화
        updateKPI(REGION_STATS); 
        document.querySelectorAll('.region-card').forEach(c => c.classList.remove('active'));
        
        // 3. 지도 초기화
        MapModule.map.flyTo([36.5, 127.8], 7, { duration: 0.8 });
        MapModule.renderRegionSummaries(REGION_STATS);
        MapModule.clearFacilityLayers(); 

        // 4. 플래그 제거
        document.body.classList.remove('detail-mode-active');
      }
    });
  }

  /* 상세 뷰: 시설물 검색 */
  const facSearch = document.getElementById('facility-search-input');
  if (facSearch) {
    facSearch.addEventListener('input', () => {
      const title = document.getElementById('side-detail-title').textContent.replace(' 시설물 목록', '');
      renderFacilityList(title, facSearch.value.trim());
    });
  }

  initLayerControls();
  initRiverToggle();
  initCadastralToggle();
  initPermitToggle();
  initModeToggle();
  initFacilityControls(); // 시설물 상세 컨트롤 초기화
});

/* ── 시설물 상세 컨트롤 (필터/정렬) ── */
function initFacilityControls() {
  const crossingBtn = document.getElementById('fac-filter-crossing');
  const insideBtn   = document.getElementById('fac-filter-inside');

  const btnSort   = document.getElementById('btn-fac-sort');
  const ddownSort = document.getElementById('fac-sort-dropdown');
  const lblSort   = document.getElementById('fac-sort-label');

  if (!crossingBtn || !insideBtn) return;

  // 1. 필터링 (걸침)
  crossingBtn.addEventListener('click', () => {
    if (currentFacFilter === 'crossing') {
      currentFacFilter = 'all';
      crossingBtn.classList.remove('active');
    } else {
      currentFacFilter = 'crossing';
      crossingBtn.classList.add('active');
      insideBtn.classList.remove('active');
    }
    const title = document.getElementById('side-detail-title').textContent.replace(' 시설물 목록', '');
    renderFacilityList(title);
  });

  // 1. 필터링 (구역내)
  insideBtn.addEventListener('click', () => {
    if (currentFacFilter === 'inside') {
      currentFacFilter = 'all';
      insideBtn.classList.remove('active');
    } else {
      currentFacFilter = 'inside';
      insideBtn.classList.add('active');
      crossingBtn.classList.remove('active');
    }
    const title = document.getElementById('side-detail-title').textContent.replace(' 시설물 목록', '');
    renderFacilityList(title);
  });

  // 2. 정렬 토글
  if (btnSort) {
    btnSort.addEventListener('click', e => {
      e.stopPropagation();
      ddownSort.classList.toggle('active');
    });
    document.addEventListener('click', () => ddownSort.classList.remove('active'));
  }

  // 3. 정렬 항목 클릭
  if (ddownSort) {
    ddownSort.querySelectorAll('.dsd-item').forEach(item => {
      item.addEventListener('click', () => {
        const type = item.dataset.sort;
        const text = item.textContent;

        currentFacSort = type;
        lblSort.textContent = text;

        ddownSort.querySelectorAll('.dsd-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        const title = document.getElementById('side-detail-title').textContent.replace(' 시설물 목록', '');
        renderFacilityList(title);
        UI.toast(`시설물 목록이 '${text}' 기준으로 정렬되었습니다.`, 'info', 1200);
      });
    });
  }
}

/* ── 지적도 레이어 토글 ── */
function initRiverToggle() {
  var chk = document.getElementById('chk-river');
  if (chk) {
    chk.addEventListener('change', function() {
      MapModule.toggleRiver(chk.checked);
    });
  }
}

function initCadastralToggle() {
  const chk = document.getElementById('chk-cadastral');
  if (chk) {
    chk.addEventListener('change', () => {
      MapModule.toggleCadastral(chk.checked);
    });
  }
}

function initPermitToggle() {
  var chk = document.getElementById('chk-permit');
  var legend = document.getElementById('permit-legend');
  if (chk) {
    chk.addEventListener('change', function() {
      MapModule.togglePermit(chk.checked, MOCK_PERMIT_DATA);
      if (legend) legend.style.display = chk.checked ? '' : 'none';
    });
  }
}

/* ── 기본/비교 모드 토글 ── */
function initModeToggle() {
  var bar = document.getElementById('mode-toggle-bar');
  var btns = bar ? bar.querySelectorAll('.mode-btn') : [];
  var leftLabel = document.getElementById('compare-left-label');
  var rightLabel = document.getElementById('compare-right-label');
  var btnLeft = document.getElementById('btn-compare-left');
  var btnRight = document.getElementById('btn-compare-right');

  if (!bar || !btns.length) return;

  /* 기본 선택 (관리자 사전 지정 — 처음 2개씩) */
  var leftSelected = [];
  var rightSelected = [];

  function getDefaultSelections() {
    var data = TASK_ANALYSIS_DATA[currentTask];
    if (!data) return [[], []];
    var keys = Object.keys(data);
    return [keys.slice(0, 2), keys.slice(0, 2)];
  }

  function formatLabel(selections, prefix) {
    var data = TASK_ANALYSIS_DATA[currentTask];
    if (!data || selections.length === 0) return prefix + ' 미선택';
    var first = data[selections[0]];
    if (!first) return prefix + ' 미선택';
    var yearStr = first.year.replace('.', '년 ') + '월';
    var regionStr = first.region;
    if (selections.length === 1) {
      return yearStr + ' ' + regionStr;
    }
    return yearStr + ' ' + regionStr + ' 외 ' + (selections.length - 1) + '건';
  }

  function updateLabels() {
    if (leftLabel) leftLabel.textContent = formatLabel(leftSelected, '기준 결과');
    if (rightLabel) rightLabel.textContent = formatLabel(rightSelected, '비교 결과');
  }

  function enterCompareMode() {
    bar.classList.add('compare-mode');
    var defaults = getDefaultSelections();
    leftSelected = defaults[0];
    rightSelected = defaults[1];
    updateLabels();
    /* 좌측 사이드바 분석 결과 / 지역별 분석 결과 카드 숨기기 */
    var panelAnalysis = document.getElementById('panel-analysis');
    var panelRegion = document.getElementById('panel-region');
    if (panelAnalysis) panelAnalysis.style.display = 'none';
    if (panelRegion) panelRegion.style.display = 'none';
    /* 현재 배경지도를 양쪽 모두 유지 */
    var baseUrl = MapModule.getCurrentBasemapUrl();
    MapModule.initCompareMode(baseUrl, baseUrl);
  }

  function exitCompareMode() {
    bar.classList.remove('compare-mode');
    /* 좌측 사이드바 카드 복원 */
    var panelAnalysis = document.getElementById('panel-analysis');
    var panelRegion = document.getElementById('panel-region');
    if (panelAnalysis) panelAnalysis.style.display = '';
    if (panelRegion) panelRegion.style.display = '';
    MapModule.exitCompareMode();
  }

  btns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      btns.forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      if (btn.dataset.mode === 'compare') {
        enterCompareMode();
      } else {
        exitCompareMode();
      }
    });
  });

  /* 설정 버튼 클릭 → 분석 목록 설정 모달 열기 */
  var _compareTarget = null; // 'left' | 'right'

  function openCompareModal(side) {
    _compareTarget = side;
    var modal = document.getElementById('modal-analysis-setting');
    var title = modal ? modal.querySelector('.pledge-header h1') : null;
    if (title) {
      title.textContent = side === 'left' ? '기준 분석 결과 설정' : '비교 분석 결과 설정';
    }
    /* 현재 과제의 분석 결과로 모달 체크박스 갱신 */
    if (typeof updateAnalysisModal === 'function') updateAnalysisModal(currentTask);
    if (modal) modal.classList.add('active');
  }

  if (btnLeft) {
    btnLeft.addEventListener('click', function() { openCompareModal('left'); });
  }
  if (btnRight) {
    btnRight.addEventListener('click', function() { openCompareModal('right'); });
  }

  /* 모달 적용 시 선택 키 배열과 라벨 업데이트 */
  window._onCompareModalApply = function(checkedKeys) {
    if (_compareTarget === 'left') {
      leftSelected = checkedKeys;
    } else if (_compareTarget === 'right') {
      rightSelected = checkedKeys;
    }
    updateLabels();
    _compareTarget = null;
  };
}

/* ── 레이어 설정 및 모바일 인터랙션 ── */
function initLayerControls() {
  /* ── 모바일 상단 메인 버튼 인터랙션 ── */
  const btnMSidebar  = document.getElementById('btn-m-sidebar-toggle');
  const btnMSideClose = document.getElementById('btn-m-sidebar-close');
  const btnMTools    = document.getElementById('btn-m-tools-toggle');
  const btnMListOpen  = document.getElementById('btn-m-list-open');
  const btnMLayerOpen = document.getElementById('btn-m-layer-open');
  
  const backdrop     = document.getElementById('sidebar-backdrop');
  const leftPanel    = document.getElementById('db-left-panel');
  const detailSheet  = document.getElementById('sidebar-detail-view');
  const toolGroup    = document.getElementById('db-right-tools');

  const layerBox = document.getElementById('db-layer-settings');
  const btnMin  = document.getElementById('btn-layer-minimize');

  // 사이드바 열기
  if (btnMSidebar) {
    btnMSidebar.addEventListener('click', (e) => {
      e.stopPropagation();
      leftPanel.classList.add('open');
      if (backdrop) backdrop.classList.add('active');
      // 사이드바 열 때 목록/레이어 버튼 숨김
      toggleMobileFloatingButtons(false);
      if (detailSheet) detailSheet.classList.remove('active');
    });
  }

  // 레이어 설정 최소화 (데스크탑) / 닫기 (모바일)
  if (btnMin && layerBox) {
    btnMin.addEventListener('click', (e) => {
      e.stopPropagation();
      if (window.innerWidth <= 768) {
        layerBox.classList.remove('m-open');
      } else {
        layerBox.classList.toggle('minimized');
      }
    });
  }

  // 사이드바 닫기 (X 버튼)
  if (btnMSideClose) {
    btnMSideClose.addEventListener('click', () => {
      leftPanel.classList.remove('open');
      if (backdrop) backdrop.classList.remove('active');
      
      // 사이드바가 닫힐 때 분석 중이라면 플로팅 버튼들 다시 표시
      if (document.body.classList.contains('detail-mode-active')) {
        toggleMobileFloatingButtons(true);
      }
    });
  }

  // 백드롭 클릭 시 상황에 맞춰 닫기
  if (backdrop) {
    backdrop.addEventListener('click', () => {
      if (leftPanel && leftPanel.classList.contains('open')) {
        // 1. 사이드바가 열려있으면 사이드바만 닫음
        leftPanel.classList.remove('open');
        backdrop.classList.remove('active');
        // 상세 분석 중이면 플로팅 버튼들 복구
        if (document.body.classList.contains('detail-mode-active')) {
          toggleMobileFloatingButtons(true);
        }
      } else if (detailSheet && detailSheet.classList.contains('active')) {
        // 2. 사이드바는 닫혀있고 상세 시트만 열려있으면 시트 닫음
        detailSheet.classList.remove('active');
        backdrop.classList.remove('active');
        toggleMobileFloatingButtons(true);
      }
    });
  }

  // 도구 버튼 토글
  if (btnMTools) {
    btnMTools.addEventListener('click', (e) => {
      e.stopPropagation();
      btnMTools.classList.toggle('active');
      if (toolGroup) toolGroup.classList.toggle('active');
    });
  }

  // ── [모바일 전용] 이벤트 위임 (목록 보기 / 레이어 설정) ──
  document.addEventListener('click', (e) => {
    // 1. 목록 보기 버튼 클릭
    const listBtn = e.target.closest('#btn-m-list-open');
    if (listBtn) {
      e.stopPropagation();
      console.log('Mobile: "Show List" button clicked.');
      if (detailSheet) {
        detailSheet.classList.add('active');
        if (backdrop) backdrop.classList.add('active');
        toggleMobileFloatingButtons(false); // 열릴 때 버튼들 숨김
      }
      return;
    }

    // 2. 레이어 설정 버튼 클릭 (모바일 플로팅 버튼 → 표시/숨김)
    const layerBtn = e.target.closest('#btn-m-layer-open');
    if (layerBtn) {
      e.stopPropagation();
      if (layerBox) {
        layerBox.classList.toggle('m-open');
      }
      return;
    }

    // 3. 레이어 설정 헤더 닫기 버튼 클릭 (모바일 X 버튼 → 완전 숨김)
    const layerCloseBtn = e.target.closest('#btn-layer-m-close');
    if (layerCloseBtn) {
      e.stopPropagation();
      if (layerBox) {
        layerBox.classList.remove('m-open');
      }
      return;
    }
  });

  // 모바일 전용 닫기 버튼 (비파괴적 닫기)
  const btnMCloseTab = document.getElementById('btn-sidebar-m-close');
  if (btnMCloseTab) {
    btnMCloseTab.addEventListener('click', (e) => {
      e.stopPropagation();
      if (detailSheet) detailSheet.classList.remove('active');
      if (backdrop) backdrop.classList.remove('active');
      
      // 닫힐 때 버튼 다시 표시
      toggleMobileFloatingButtons(true);
      // 지도 초기화나 KPI 초기화 하지 않음 (사용자 요구사항)
    });
  }
}

/** 사이드바 뷰 전환 (지역목록 <-> 시설물 목록) — 데스크탑 용/공통 */
/* 중복 switchSidebarView 제거 — 307줄의 함수가 메인 */

/** 모바일 플로팅 버튼들 제어 (목록보기/레이어설정 쌍으로 동작) */
function toggleMobileFloatingButtons(show) {
  const btnGroup = document.querySelector('.m-floating-btn-group');
  const layerPanel = document.getElementById('db-layer-settings');

  if (show) {
    // 상세 모드 진입 시 버튼 그룹 노출
    if (btnGroup) btnGroup.classList.add('visible');
  } else {
    // 사이드바/시트 열릴 때 버튼 그룹 숨김
    if (btnGroup) btnGroup.classList.remove('visible');
    
    // 버튼이 숨겨질 때 레이어 패널을 강제로 닫지는 않음
    // (사이드바가 화면을 덮으면 CSS z-index로 자연스럽게 가려지며,
    // 사이드바를 닫았을 때 레이어 패널이 이전 상태를 유지하게 함)
  }
}

/* ══════════════════════════════════════════════
   사이드바 섹션 접기/펴기 + 분석 설정 모달
   ══════════════════════════════════════════════ */

// 카드 패널 접기/펴기
document.querySelectorAll('.sb-section-header[data-panel]').forEach(function(header) {
  header.addEventListener('click', function(e) {
    // 설정 버튼 클릭은 제외
    if (e.target.closest('.sb-section-setting')) return;
    var panelId = header.getAttribute('data-panel');
    var panel = document.getElementById(panelId);
    if (!panel) return;
    // KPI, 레이어 설정, 범례는 minimized 클래스 사용
    if (panelId === 'db-map-summary' || panelId === 'db-layer-settings' || panelId === 'permit-legend') {
      panel.classList.toggle('minimized');
    } else {
      panel.classList.toggle('collapsed');
    }
  });
});

/* ── 과제 선택 모달 ── */
(function() {
  var taskModal = document.getElementById('modal-task-select');
  var btnTaskOpen = document.getElementById('btn-task-select');
  var btnTaskClose = document.getElementById('btn-task-modal-close');
  if (!taskModal || !btnTaskOpen) return;

  var TASK_NAMES = {
    river: '하천 계곡 정비',
    forage: '사료작물 탐지',
    greenhouse: '비닐하우스 탐지',
    farmland: '농지 활용 분석'
  };

  var TASK_ICONS = {
    river: '<path d="M2 6c2-2 4 0 6-2s4 0 6-2 4 0 6-2"/><path d="M2 12c2-2 4 0 6-2s4 0 6-2 4 0 6-2"/><path d="M2 18c2-2 4 0 6-2s4 0 6-2 4 0 6-2"/>',
    forage: '<path d="M12 22V8"/><path d="M8 10c0-4 4-8 4-8s4 4 4 8"/><path d="M5 14c0-3 3-5 3-5"/><path d="M19 14c0-3-3-5-3-5"/>',
    greenhouse: '<path d="M3 20h18"/><path d="M4 20V10l8-6 8 6v10"/><path d="M4 10h16"/><path d="M8 10v10"/><path d="M12 10v10"/><path d="M16 10v10"/>',
    farmland: '<rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/>'
  };

  function openTaskModal(e) {
    e.stopPropagation();
    taskModal.classList.add('active');
  }
  function closeTaskModal() {
    taskModal.classList.remove('active');
  }

  btnTaskOpen.addEventListener('click', openTaskModal);
  btnTaskClose.addEventListener('click', closeTaskModal);
  taskModal.addEventListener('click', function(e) {
    if (e.target === taskModal) closeTaskModal();
  });

  // 과제 항목 클릭
  taskModal.querySelectorAll('.task-modal-item').forEach(function(item) {
    item.addEventListener('click', function() {
      var taskId = item.dataset.task;
      currentTask = taskId;

      // 모달 active 토글
      taskModal.querySelectorAll('.task-modal-item').forEach(function(i) { i.classList.remove('active'); });
      item.classList.add('active');

      // 현재 과제 텍스트 업데이트
      var nameEl = document.getElementById('task-current-name');
      if (nameEl) nameEl.textContent = TASK_NAMES[taskId];

      // 분석 결과 목록 갱신
      updateAnalysisList(taskId);

      // 레이어 설정 항목 전환
      updateLayerGroupForTask(taskId);

      // 지역 목록 갱신
      updateRegionForTask(taskId);

      closeTaskModal();
    });
  });

  /* 분석 결과 목록을 과제에 맞게 갱신 */
  /* 레이어 설정 항목을 과제에 맞게 전환 */
  window.updateLayerGroupForTask = function(taskId) {
    document.querySelectorAll('.layer-task-group').forEach(function(group) {
      group.style.display = group.dataset.taskLayer === taskId ? '' : 'none';
    });
  };

  window.updateAnalysisList = function(taskId) {
    var data = TASK_ANALYSIS_DATA[taskId];
    if (!data) return;
    var list = document.getElementById('analysis-list');
    if (!list) return;

    var keys = Object.keys(data);
    // 기본 체크: 처음 3개
    var html = '';
    keys.slice(0, 3).forEach(function(key) {
      var d = data[key];
      html += '<div class="analysis-card" data-id="' + key + '">'
        + '<span class="analysis-year">' + d.year + '</span>'
        + '<span class="analysis-region">' + d.region + '</span>'
        + '</div>';
    });
    list.innerHTML = html;

    // 모달 체크박스 목록도 갱신
    updateAnalysisModal(taskId);
  };

  /* 분석 설정 모달의 체크박스 목록을 과제에 맞게 갱신 */
  window.updateAnalysisModal = function(taskId) {
    var data = TASK_ANALYSIS_DATA[taskId];
    if (!data) return;
    var modalList = document.getElementById('analysis-modal-list');
    if (!modalList) return;

    var keys = Object.keys(data);
    var html = '';
    keys.forEach(function(key, idx) {
      var d = data[key];
      var checked = idx < 3 ? ' checked' : '';
      html += '<li class="analysis-modal-item">'
        + '<label class="pledge-agree-check">'
        + '<input type="checkbox" value="' + key + '"' + checked + '>'
        + '<span class="check-txt"><span class="analysis-modal-year">' + d.year.replace('.', '년 ') + '월</span>'
        + '<span class="analysis-modal-region">' + d.region + '</span></span>'
        + '</label></li>';
    });
    modalList.innerHTML = html;
  };

  /* 지역 목록을 과제에 맞게 갱신 */
  window.updateRegionForTask = function(taskId) {
    var list = document.getElementById('region-list');
    if (!list) return;

    if (taskId === 'river') {
      // 전국 표시
      window.REGION_STATS = REGION_STATS;
      renderRegionList();
      updateKPI(REGION_STATS);
      MapModule.renderRegionSummaries(REGION_STATS);
      MapModule.map.flyTo([36.5, 127.8], 7, { duration: 0.8 });
    } else {
      // 남원시만 표시
      var stats = NAMWON_REGION_STATS;
      var maxTotal = Math.max(...stats.map(function(r) { return r.crossing + r.inside; }), 1);

      list.innerHTML = stats.map(function(r) {
        var total = r.crossing + r.inside;
        var crossPct = (r.crossing / maxTotal * 100).toFixed(1);
        var insidePct = (r.inside / maxTotal * 100).toFixed(1);
        return '<div class="region-card" role="listitem" data-region="' + r.code + '" tabindex="0">'
          + '<div class="region-card-master">'
          + '<div class="region-row1">'
          + '<div class="region-name-txt">' + r.label + '<span class="region-rivers">' + r.rivers + '개</span></div>'
          + '<div class="region-nums"><span class="n-cross">' + fmtNum(r.crossing) + '</span><span class="n-in">' + fmtNum(r.inside) + '</span></div>'
          + '</div>'
          + '<div class="region-bar-track">'
          + '<div class="bar-seg crossing" style="width:' + crossPct + '%"></div>'
          + '<div class="bar-seg inside" style="width:' + insidePct + '%"></div>'
          + '</div></div>'
          + '<div class="sub-region-list" id="sub-list-' + r.code + '"></div>'
          + '</div>';
      }).join('');

      // 남원시 카드 클릭 이벤트
      list.querySelectorAll('.region-card').forEach(function(card) {
        var master = card.querySelector('.region-card-master');
        master.addEventListener('click', function(e) {
          e.stopPropagation();
          var code = card.dataset.region;
          var isActive = card.classList.contains('active');
          var subList = card.querySelector('.sub-region-list');

          if (!isActive) {
            card.classList.add('active');
            // 남원시 서브리전 렌더
            var subs = NAMWON_SUB_STATS[code];
            if (subs && subList) {
              var maxSub = Math.max(...subs.map(function(s) { return s.crossing + s.inside; }), 1);
              subList.innerHTML = subs.map(function(s) {
                var sCrossPct = (s.crossing / maxSub * 100).toFixed(1);
                var sInsidePct = (s.inside / maxSub * 100).toFixed(1);
                return '<div class="sub-region-item" data-sub-name="' + s.label + '">'
                  + '<div class="sri-name">' + s.label + '</div>'
                  + '<div class="sri-nums"><span class="n-cross">' + fmtNum(s.crossing) + '</span><span class="sep">/</span><span class="n-in">' + fmtNum(s.inside) + '</span></div>'
                  + '<div class="sri-visual"><div class="sri-bar-track">'
                  + '<div class="bar-seg crossing" style="width:' + sCrossPct + '%"></div>'
                  + '<div class="bar-seg inside" style="width:' + sInsidePct + '%"></div>'
                  + '</div></div></div>';
              }).join('');
            }
          } else {
            card.classList.remove('active');
          }
        });
      });

      // KPI 업데이트
      var sumCross = stats.reduce(function(s, r) { return s + r.crossing; }, 0);
      var sumInside = stats.reduce(function(s, r) { return s + r.inside; }, 0);
      var sumEl = document.getElementById('sum-crossing');
      var inEl = document.getElementById('sum-inside');
      var titleEl = document.getElementById('summary-title');
      if (sumEl) sumEl.textContent = fmtNum(sumCross);
      if (inEl) inEl.textContent = fmtNum(sumInside);
      if (titleEl) titleEl.textContent = '남원시 현황';

      // 지도 남원시로 이동
      MapModule.regionSummaryGroup.clearLayers();
      MapModule.clearFacilityLayers();
      if (MapModule.clusterGroup && MapModule.map.hasLayer(MapModule.clusterGroup)) {
        MapModule.map.removeLayer(MapModule.clusterGroup);
      }
      MapModule.map.flyToBounds(NAMWON_BOUNDS, { padding: [40, 40], duration: 0.8 });
    }
  };
})();

// 분석 설정 모달
(function() {
  var modal = document.getElementById('modal-analysis-setting');
  var btnOpen = document.getElementById('btn-analysis-setting');
  var btnClose = document.getElementById('btn-analysis-modal-close');
  var btnCancel = document.getElementById('btn-analysis-modal-cancel');
  var btnApply = document.getElementById('btn-analysis-modal-apply');

  if (!modal || !btnOpen) return;

  function openModal(e) {
    e.stopPropagation();
    var title = modal.querySelector('.pledge-header h1');
    if (title) title.textContent = '분석 목록 설정';
    modal.classList.add('active');
  }

  function closeModal() {
    modal.classList.remove('active');
  }

  btnOpen.addEventListener('click', openModal);
  btnClose.addEventListener('click', closeModal);
  btnCancel.addEventListener('click', closeModal);
  modal.addEventListener('click', function(e) {
    if (e.target === modal) closeModal();
  });

  btnApply.addEventListener('click', function() {
    var data = TASK_ANALYSIS_DATA[currentTask];
    if (!data) return;
    var checked = modal.querySelectorAll('input[type="checkbox"]:checked');
    var list = document.getElementById('analysis-list');
    if (!list) return;

    var html = '';
    checked.forEach(function(cb) {
      var d = data[cb.value];
      if (!d) return;
      html += '<div class="analysis-card" data-id="' + cb.value + '">'
        + '<span class="analysis-year">' + d.year + '</span>'
        + '<span class="analysis-region">' + d.region + '</span>'
        + '</div>';
    });

    /* 비교 모드에서 호출된 경우 선택 키 업데이트 */
    if (typeof window._onCompareModalApply === 'function' && document.getElementById('mode-toggle-bar').classList.contains('compare-mode')) {
      var keys = [];
      checked.forEach(function(cb) { keys.push(cb.value); });
      window._onCompareModalApply(keys);
    } else {
      list.innerHTML = html;
    }
    closeModal();
  });

})();
