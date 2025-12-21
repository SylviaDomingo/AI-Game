
import { NPC, Location, TimeOfDay } from '../types';
import { ASSETS } from '../constants/assets';

export const NPCS: NPC[] = [
  {
    id: 'master_clerk',
    name: '师爷',
    title: '县衙二把手',
    portrait: "https://api.dicebear.com/7.x/bottts/svg?seed=MasterClerk",
    location: Location.Office,
    greeting: '大人，这是新送达的卷宗，请过目。',
    availableTimes: [TimeOfDay.Morning, TimeOfDay.Noon, TimeOfDay.Dusk]
  },
  {
    id: 'li_butcher',
    name: '李屠夫',
    title: '市集豪爽人',
    portrait: ASSETS.images.npcPortraits.ButcherLi,
    location: Location.Market,
    greeting: '嘿！县令大人，正好有个算不明白的账，您给瞧瞧？',
    availableTimes: [TimeOfDay.Morning, TimeOfDay.Noon]
  },
  {
    id: 'wang_vendor',
    name: '王货郎',
    title: '走街串巷商',
    portrait: ASSETS.images.npcPortraits.VendorWang,
    location: Location.Market,
    greeting: '大人，这批货物的成色，小的实在拿不准。',
    availableTimes: [TimeOfDay.Morning, TimeOfDay.Noon, TimeOfDay.Dusk]
  },
  {
    id: 'han_money_master',
    name: '韩大掌柜',
    title: '大通钱庄主',
    portrait: ASSETS.images.npcPortraits.MoneyMasterHan,
    location: Location.Bank,
    greeting: '大人，近日钱庄账目有些出入，还请大人协助清查。',
    availableTimes: [TimeOfDay.Morning, TimeOfDay.Noon]
  },
  {
    id: 'zhang_elder',
    name: '张老伯',
    title: '县郊百事通',
    portrait: ASSETS.images.npcPortraits.ElderZhang,
    location: Location.Suburbs,
    greeting: '大人巡视至此，老朽刚好发现此处石碑有些蹊跷。',
    availableTimes: [TimeOfDay.Morning, TimeOfDay.Noon, TimeOfDay.Dusk]
  },
  {
    id: 'zhao_farmer',
    name: '赵老农',
    title: '田间勤劳人',
    portrait: ASSETS.images.npcPortraits.FarmerZhao,
    location: Location.Farmland,
    greeting: '大人，今年这田里的收成估算，老汉我心里没底。',
    availableTimes: [TimeOfDay.Morning, TimeOfDay.Noon, TimeOfDay.Dusk]
  }
];
