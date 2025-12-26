
import { Location } from '../types';

export const ASSETS = {
  images: {
    paperTexture: "https://www.transparenttextures.com/patterns/handmade-paper.png",
    magistratePortrait: "https://api.dicebear.com/7.x/initials/svg?seed=magistrate&backgroundColor=4a4a4a",
    mainBackground: "https://raw.githubusercontent.com/SylviaDomingo/AI-Game/65cdb71fc4839511515958cef7348719b7c6d1dd/assets/map_picture.png",
    backgrounds: {
      [Location.Office]: "https://raw.githubusercontent.com/SylviaDomingo/AI-Game/65cdb71fc4839511515958cef7348719b7c6d1dd/assets/shengtang_pic.png", 
      [Location.Market]: "https://raw.githubusercontent.com/SylviaDomingo/AI-Game/65cdb71fc4839511515958cef7348719b7c6d1dd/assets/market.png", 
      [Location.Bank]: "https://raw.githubusercontent.com/SylviaDomingo/AI-Game/65cdb71fc4839511515958cef7348719b7c6d1dd/assets/bank.png", 
      [Location.Suburbs]: "https://raw.githubusercontent.com/SylviaDomingo/AI-Game/65cdb71fc4839511515958cef7348719b7c6d1dd/assets/suburb.png", 
      [Location.Farmland]: "https://raw.githubusercontent.com/SylviaDomingo/AI-Game/65cdb71fc4839511515958cef7348719b7c6d1dd/assets/farmland.png" 
    },
    npcPortraits: {
      ButcherLi: "https://api.dicebear.com/7.x/bottts/svg?seed=ButcherLi",
      ShopkeeperLiu: "https://api.dicebear.com/7.x/bottts/svg?seed=ShopkeeperLiu",
      ElderZhang: "https://api.dicebear.com/7.x/bottts/svg?seed=ElderZhang",
      FarmerZhao: "https://api.dicebear.com/7.x/bottts/svg?seed=FarmerZhao",
      VendorWang: "https://api.dicebear.com/7.x/bottts/svg?seed=VendorWang",
      MoneyMasterHan: "https://api.dicebear.com/7.x/bottts/svg?seed=MoneyMasterHan"
    }
  },
  audio: {
    bgm: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    correct: "https://actions.google.com/sounds/v1/alarms/beep_short.ogg",
    wrong: "https://actions.google.com/sounds/v1/cartoon/boing.ogg",
    rest: "https://actions.google.com/sounds/v1/water/crashing_waves.ogg"
  }
};
