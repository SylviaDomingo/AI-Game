
import { NPC, Location, TimeOfDay } from '../types';
import { ASSETS } from '../constants/assets';

export const NPCS: NPC[] = [
  {
    id: 'master_clerk',
    name: '师爷',
    title: '官衙二把手',
    portrait: "https://api.dicebear.com/7.x/bottts/svg?seed=MasterClerk",
    location: Location.Office,
    greeting: '大人，这是新送达的公文卷宗，请批阅。',
    availableTimes: [TimeOfDay.Morning, TimeOfDay.Noon, TimeOfDay.Dusk]
  },
  {
    id: 'li_butcher',
    name: '李屠夫',
    title: '市集豪爽人',
    portrait: ASSETS.images.npcPortraits.ButcherLi,
    location: Location.Market,
    greeting: '嘿！县令大人，这账目有些算不明白，您给瞧瞧？',
    availableTimes: [TimeOfDay.Morning, TimeOfDay.Noon]
  },
  {
    id: 'wang_vendor',
    name: '王货郎',
    title: '走街串巷商',
    portrait: ASSETS.images.npcPortraits.VendorWang,
    location: Location.Market,
    greeting: '大人，这批货的斤两，小的实在不敢拿准。',
    availableTimes: [TimeOfDay.Morning, TimeOfDay.Noon, TimeOfDay.Dusk]
  },
  {
    id: 'han_money_master',
    name: '韩大掌柜',
    title: '大通钱庄主',
    portrait: ASSETS.images.npcPortraits.MoneyMasterHan,
    location: Location.Bank,
    greeting: '大人，近日钱庄账目有异，还请大人清察。',
    availableTimes: [TimeOfDay.Morning, TimeOfDay.Noon]
  },
  {
    id: 'zhang_elder',
    name: '张老伯',
    title: '乡野百事通',
    portrait: ASSETS.images.npcPortraits.ElderZhang,
    location: Location.Suburbs,
    greeting: '大人巡视至此，老朽刚好发现此处石碑大有深意。',
    availableTimes: [TimeOfDay.Morning, TimeOfDay.Noon, TimeOfDay.Dusk]
  },
  {
    id: 'zhao_farmer',
    name: '赵老农',
    title: '田间勤劳人',
    portrait: ASSETS.images.npcPortraits.FarmerZhao,
    location: Location.Farmland,
    greeting: '大人，今年这亩产估算，老汉我心里实在没底。',
    availableTimes: [TimeOfDay.Morning, TimeOfDay.Noon, TimeOfDay.Dusk]
  },
  {
    id: 'scholar_lin',
    name: '林山长',
    title: '书院大儒',
    portrait: ASSETS.images.npcPortraits.ScholarLin,
    location: Location.Academy,
    greeting: '大人大驾光临，学子们正有些诗经释义想向大人请教。',
    availableTimes: [TimeOfDay.Morning, TimeOfDay.Noon, TimeOfDay.Dusk]
  },
  {
    id: 'wei_eunuch',
    name: '魏公公',
    title: '内廷总管',
    portrait: ASSETS.images.npcPortraits.EunuchWei,
    location: Location.ImperialCity,
    greeting: '官家口谕，命尔速查此桩御史失踪案。',
    availableTimes: [TimeOfDay.Morning, TimeOfDay.Noon, TimeOfDay.Dusk, TimeOfDay.Night]
  }
];
