import AsyncStorage from '@react-native-async-storage/async-storage';
export type MissionRecord={choiceId:string;reflection:string;completedAt:string};
export type ParentDecision={status:'approved'|'practice'|'wait';message:string;decidedAt:string};
export type KidState={
  completions:Record<string,MissionRecord>;
  submitted:Record<string,string>;
  decisions:Record<string,ParentDecision>;
  redeemed:Record<string,string>;
};
export const EMPTY_STATE:KidState={completions:{},submitted:{},decisions:{},redeemed:{}};
const KEY='levelup-v3-demo-2026-10';
export async function loadState():Promise<KidState>{
  try{const raw=await AsyncStorage.getItem(KEY); if(!raw)return EMPTY_STATE;
    const parsed=JSON.parse(raw);return {completions:parsed.completions||{},submitted:parsed.submitted||{},decisions:parsed.decisions||{},redeemed:parsed.redeemed||{}};
  }catch{return EMPTY_STATE;}
}
export async function saveState(value:KidState){await AsyncStorage.setItem(KEY,JSON.stringify(value));}
export const keyOf=(w:string,m:string)=>`${w}:${m}`;
export const completedCount=(state:KidState,w:string)=>Object.keys(state.completions).filter(k=>k.startsWith(w+':')).length;
export const totalStars=(state:KidState)=>Object.keys(state.completions).length;
