
import { Location } from '../types';

export const ASSETS = {
  images: {
    paperTexture: "https://www.transparenttextures.com/patterns/handmade-paper.png",
    magistratePortrait: "https://api.dicebear.com/7.x/initials/svg?seed=magistrate&backgroundColor=4a4a4a",
    mainBackground: "https://raw.githubusercontent.com/SylviaDomingo/AI-Game/57cee5c11fda11244a15d9cb701a4b5bc5a02a4f/assets/map_picture.png",
    backgrounds: {
      [Location.Office]: "https://raw.githubusercontent.com/SylviaDomingo/AI-Game/57cee5c11fda11244a15d9cb701a4b5bc5a02a4f/assets/shengtang_pic.png", 
      [Location.Market]: "https://images.unsplash.com/photo-1578926375605-eaf7559b1458?q=80&w=1000&auto=format&fit=crop", 
      [Location.Bank]: "https://images.unsplash.com/photo-1621508650119-74676174a69c?q=80&w=1000&auto=format&fit=crop", 
      [Location.Suburbs]: "https://images.unsplash.com/photo-1542361345-89e58247f2d5?q=80&w=1000&auto=format&fit=crop", 
      [Location.Farmland]: "https://images.unsplash.com/photo-1444858291040-58f756a3bdd6?q=80&w=1000&auto=format&fit=crop" 
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
