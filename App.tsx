import React, {useEffect,useMemo,useRef,useState} from 'react';
import {Animated, Dimensions, KeyboardAvoidingView, Platform, Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {LinearGradient} from 'expo-linear-gradient';
import {Ionicons} from '@expo/vector-icons';
import {WORLDS,World,Mission,Choice,MissionKind,getWorld,getMission} from './src/levelup/catalog';
import {EMPTY_STATE,KidState,keyOf,loadState,saveState,completedCount,totalStars} from './src/levelup/store';

// LevelUp V3 is an adult-operated, SAME-DEVICE DEMO. No real child accounts or remote parent messaging.
const C={bg:'#FCF9F2',ink:'#24233E',sub:'#716F83',line:'#E8E4DA',purple:'#6152C4',mint:'#CFF1DD',green:'#246D5A',orange:'#FF906E',sun:'#FFD46A',lilac:'#EAE4FF',paper:'#FFFFFF',dark:'#30295E'};
const SERIF=Platform.OS==='ios'?'Georgia':'serif';
const WIDTH=Dimensions.get('window').width;
type Page='home'|'explore'|'world'|'mission'|'missionDone'|'rewards'|'profile'|'parent'|'parentReview'|'guide';
type Role='teen'|'parent';
type Filter='All'|'Social'|'Games'|'AI'|'Everyday';
const GROUPS:Record<Filter,string[]>={All:WORLDS.map(w=>w.id),Social:['instagram','youtube','discord','friends'],Games:['roblox'],AI:['chatgpt'],Everyday:['phone','shopping']};
const REWARDS=[
  {id:'first',n:3,icon:'sparkles-outline',title:'The first big step',subtitle:'Choose a new age-appropriate app to explore with a parent',color:'#E6E0FF'},
  {id:'play',n:6,icon:'game-controller-outline',title:'You call the shots',subtitle:'Choose the family game or weekend activity',color:'#DDF1E7'},
  {id:'dream',n:12,icon:'gift-outline',title:'The wishlist moment',subtitle:'Start a conversation about a new tech privilege or purchase',color:'#FDE8CD'},
  {id:'legend',n:20,icon:'trophy-outline',title:'Digital explorer',subtitle:'Plan a special milestone celebration together',color:'#FDE0E7'},
];
const jarSlots=[
  [12,10],[33,9],[56,9],[72,16],[22,25],[43,23],[60,30],[8,39],[31,42],[52,43],[75,46],
  [14,57],[39,60],[63,60],[26,74],[53,75],[74,76],[8,86],[32,87],[55,88],[70,91],[19,34],[45,53],[70,36]
];
function Ic({name,size=22,color=C.ink}: {name:string,size?:number,color?:string}){return <Ionicons name={name as any} size={size} color={color}/>;}
function Label({children,color=C.purple}: {children:React.ReactNode;color?:string}){return <Text style={[S.eyebrow,{color}]}>{children}</Text>;}
function Button({title,onPress,variant='dark',icon,disabled=false,small=false}: {title:string,onPress:()=>void;variant?:'dark'|'light'|'line'|'coral';icon?:string;disabled?:boolean;small?:boolean}){
 const bg=variant==='dark'?C.dark:variant==='coral'?C.orange:variant==='light'?'white':'transparent';
 const fg=variant==='dark'?'white':C.ink;
 return <Pressable disabled={disabled} onPress={onPress} style={({pressed})=>[S.button,{backgroundColor:bg,borderWidth:variant==='line'?1.5:0,borderColor:C.line,opacity:disabled ? 0.48 : pressed ? 0.82 : 1,paddingVertical:small?12:16,paddingHorizontal:small?16:21}]}>
  <Text style={[S.buttonText,{color:fg,fontSize:small?13:15}]}>{title}</Text>{icon?<Ic name={icon} size={17} color={fg}/>:null}
 </Pressable>;
}
function Pill({text,bg=C.lilac,color=C.ink,icon}: {text:string,bg?:string,color?:string,icon?:string}){return <View style={[S.pill,{backgroundColor:bg}]}>{icon?<Ic name={icon} size={14} color={color}/>:null}<Text style={{fontWeight:'800',fontSize:11,color,letterSpacing:.2}}>{text}</Text></View>;}
function Divider(){return <View style={{height:1,backgroundColor:C.line,marginVertical:14}}/>;}
function SectionTitle({kicker,title,sub}: {kicker?:string,title:string,sub?:string}){return <View style={{marginBottom:17}}>{kicker?<Label>{kicker}</Label>:null}<Text style={S.sectionTitle}>{title}</Text>{sub?<Text style={S.sectionSub}>{sub}</Text>:null}</View>;}
function WorldArt({world,size=66}: {world:World,size?:number}){return <View style={[S.worldArt,{height:size,width:size,borderRadius:size*.31,backgroundColor:world.tint}]}>
 <View style={{position:'absolute',right:size*.07,top:size*.08,width:size*.22,height:size*.22,borderRadius:100,backgroundColor:'#FFFFFF77'}}/>
 <Ic name={world.icon} color={world.color} size={size*.48}/>
 </View>;}
function ProgressBar({progress,color=C.purple,height=7}: {progress:number;color?:string;height?:number}){return <View style={{height,borderRadius:20,backgroundColor:C.line,overflow:'hidden',flex:1}}><View style={{height:'100%',width:`${Math.min(100,Math.max(0,progress*100))}%`,borderRadius:20,backgroundColor:color}}/></View>;}
function TopBar({role,onToggle,onHome}: {role:Role,onToggle:()=>void,onHome:()=>void}){return <View style={S.topBar}>
  <Pressable onPress={onHome} style={{flexDirection:'row',alignItems:'center',gap:10}}><View style={S.logo}><Ic name="arrow-up" size={24} color="white"/></View><View><Text style={S.logoText}>levelup<Text style={{color:C.orange}}>.</Text></Text><Text style={S.logoSub}>a little braver, every day</Text></View></Pressable>
  <Pressable onPress={onToggle} style={S.roleSwitch}><Ic name={role==='teen'?'people-outline':'happy-outline'} size={16} color={C.dark}/><Text style={S.roleText}>{role==='teen'?'Parent view':'Teen view'}</Text></Pressable>
 </View>;}
function Nav({page,setPage,role}:{page:Page,setPage:(p:Page)=>void,role:Role}){const active=(p:Page)=>p===page||(p==='explore'&&['world','mission','missionDone'].includes(page));
 const tabs: {page:Page,label:string,icon:string,active:string}[]=role==='teen'?
  [{page:'home',label:'Home',icon:'home-outline',active:'home'},{page:'explore',label:'Explore',icon:'compass-outline',active:'compass'},{page:'rewards',label:'Rewards',icon:'star-outline',active:'star'},{page:'profile',label:'Me',icon:'person-outline',active:'person'}]:
  [{page:'parent',label:'Home',icon:'home-outline',active:'home'},{page:'parentReview',label:'Requests',icon:'mail-outline',active:'mail'},{page:'rewards',label:'Rewards',icon:'star-outline',active:'star'},{page:'profile',label:'Profile',icon:'person-outline',active:'person'}];
 return <View style={S.nav}>{tabs.map(t=><Pressable key={t.label} onPress={()=>setPage(t.page)} style={S.navItem}>
   <Ic name={active(t.page)?t.active:t.icon} color={active(t.page)?C.purple:'#AAA6BA'} size={22}/><Text style={[S.navLabel,{color:active(t.page)?C.purple:C.sub,fontWeight:active(t.page)?'900':'600'}]}>{t.label}</Text>
   {active(t.page)?<View style={S.activeDot}/>:null}
 </Pressable>)}</View>;
}
function StarterHero({goExplore,goGuide}: {goExplore:()=>void,goGuide:()=>void}){return <LinearGradient colors={['#353067','#27234E']} style={S.hero} start={{x:0,y:0}} end={{x:1,y:1}}>
  <View style={[S.heroOrb,{right:-50,top:-20,width:190,height:190,backgroundColor:'#7564C9'}]}/><View style={[S.heroOrb,{right:30,bottom:-90,width:195,height:195,backgroundColor:'#4C417D'}]}/>
  <View style={{position:'absolute',right:28,top:34,transform:[{rotate:'-18deg'}]}}><Ic name="star" size={65} color={C.sun}/></View>
  <View style={{position:'absolute',right:27,top:110,transform:[{rotate:'24deg'}]}}><Ic name="sparkles" size={28} color="#F9B6B5"/></View>
  <Pill text="YOUR NEXT CHAPTER" bg="#6C5CA4" color="#FFFFFF" icon="flash"/>
  <Text style={S.heroTitle}>Big dreams.{'\n'}Small <Text style={{color:C.sun,fontStyle:'italic'}}>brave</Text>{'\n'}steps.</Text>
  <Text style={S.heroSub}>Explore the digital world, practice real decisions, and unlock more freedom together.</Text>
  <View style={{flexDirection:'row',gap:9,alignItems:'center',marginTop:23}}><Button title="Find my quests" variant="coral" onPress={goExplore} icon="arrow-forward"/><Pressable onPress={goGuide} style={{padding:12}}><Text style={{color:'white',fontWeight:'800',fontSize:12}}>How it works</Text></Pressable></View>
 </LinearGradient>;
}
function WorldCard({world,count,onPress,compact=false}: {world:World,count:number,onPress:()=>void,compact?:boolean}){return <Pressable onPress={onPress} style={({pressed})=>[S.worldCard,{opacity:pressed ? 0.84 : 1,padding:compact?15:17}]}>
 <WorldArt world={world} size={compact?61:71}/><View style={{flex:1,gap:4}}>
  <Text style={S.worldName}>{world.name}</Text><Text style={S.worldDesc} numberOfLines={2}>{world.tagline}</Text>
  <View style={{flexDirection:'row',alignItems:'center',gap:7,marginTop:4}}><Text style={{color:world.color,fontWeight:'800',fontSize:11}}>{world.descriptor} · {world.age}</Text>{count>0?<Pill text={`${count}/3 done`} bg={world.tint} color={world.color}/>:null}</View>
 </View><Ic name="arrow-forward" size={19} color="#A19BAF"/>
 </Pressable>}
function Home({data,onExplore,onWorld,onGuide}: {data:KidState,onExplore:()=>void,onWorld:(id:string)=>void,onGuide:()=>void}){
 const featured=WORLDS.find(w=>completedCount(data,w.id)>0&&completedCount(data,w.id)<3)||WORLDS[0];
 const progress=completedCount(data,featured.id);
 const stars=totalStars(data);
 return <><View style={{paddingHorizontal:22,paddingTop:23}}><View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:16}}><View><Label>HEY, EXPLORER <Ic name="sparkles" size={12} color={C.purple}/></Label><Text style={S.pageTitle}>Your world awaits.</Text></View><View style={{backgroundColor:C.sun,borderRadius:20,paddingHorizontal:12,paddingVertical:11,flexDirection:'row',alignItems:'center',gap:6}}><Ic name="star" size={17}/><Text style={{fontSize:17,fontWeight:'900',color:C.ink}}>{stars}</Text></View></View>
 <StarterHero goExplore={onExplore} goGuide={onGuide}/>
 <View style={{marginTop:29}}><SectionTitle kicker="PICK UP WHERE YOU LEFT OFF" title="Your next adventure"/>
 <Pressable onPress={()=>onWorld(featured.id)} style={[S.featureCard,{backgroundColor:featured.tint}]}><View style={{flex:1,marginRight:5}}><Pill text={progress===0?'START HERE':`${progress} OF 3 MISSIONS`} bg="#FFFFFFAA" color={featured.color}/><Text style={[S.featureTitle,{color:C.ink}]}>{featured.name}</Text><Text style={{fontSize:13,color:C.ink,opacity:.76,lineHeight:19}}>{featured.tagline}</Text><View style={{flexDirection:'row',alignItems:'center',marginTop:18,gap:9}}><Text style={{fontWeight:'900',color:featured.color}}>Let’s go</Text><Ic name="arrow-forward" color={featured.color} size={17}/></View></View><WorldArt world={featured} size={102}/></Pressable>
 </View>
 <View style={{marginTop:29,marginBottom:26}}><SectionTitle kicker="THE LEVELUP WAY" title="Freedom is a team sport."/>
 <View style={S.stepsRow}>{[{n:'01',title:'Ask',caption:'Choose a new privilege.'},{n:'02',title:'Practice',caption:'Try real-life missions.'},{n:'03',title:'Decide',caption:'Talk it through together.'}].map((item,i)=><View key={item.n} style={{flex:1,alignItems:'flex-start',padding:11,backgroundColor:i===1?'#ECE8FB':'#F1EEE6',borderRadius:17}}><Text style={{fontFamily:SERIF,fontSize:26,fontWeight:'bold',color:i===1?C.purple:C.dark}}>{item.n}</Text><Text style={{fontWeight:'900',fontSize:13,marginTop:4,color:C.ink}}>{item.title}</Text><Text style={{color:C.sub,fontSize:11,lineHeight:16,marginTop:3}}>{item.caption}</Text></View>)}</View>
 </View></View></>;
}
function Explore({data,onWorld}:{data:KidState,onWorld:(id:string)=>void}){const [filter,setFilter]=useState<Filter>('All');const worlds=WORLDS.filter(w=>GROUPS[filter].includes(w.id));
 return <View style={{paddingHorizontal:22,paddingTop:24}}><Label>THE QUEST LIBRARY</Label><Text style={S.pageTitle}>What’s your{ '\n'}next big <Text style={{fontStyle:'italic',color:C.purple}}>ask?</Text></Text><Text style={[S.sectionSub,{marginTop:10,marginBottom:20}]}>Pick something you want to try. Every adventure has three missions, then a real conversation with your parent.</Text>
  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginHorizontal:-22,marginBottom:17}} contentContainerStyle={{paddingHorizontal:22,gap:8}}>{(Object.keys(GROUPS) as Filter[]).map(f=><Pressable key={f} onPress={()=>setFilter(f)} style={[S.filter,{backgroundColor:filter===f?C.dark:'#EFEBE5'}]}><Text style={{color:filter===f?'white':C.sub,fontWeight:'900',fontSize:12}}>{f}</Text></Pressable>)}</ScrollView>
  <View style={{gap:11}}>{worlds.map(w=><WorldCard key={w.id} world={w} count={completedCount(data,w.id)} onPress={()=>onWorld(w.id)}/>)}</View>
  <Text style={S.miniFoot}>Every quest is practice, never a test of your worth. Your parent makes the final decision.</Text>
 </View>;
}
function MissionItem({mission,index,done,onPress,color}: {mission:Mission,index:number,done:boolean,onPress:()=>void,color:string}){return <Pressable onPress={onPress} style={({pressed})=>[S.missionRow,{opacity:pressed ? 0.78 : 1}]}>
  <View style={[S.missionNum,{backgroundColor:done?'#DDF2E5':'#F2F0F6'}]}>{done?<Ic name="checkmark" color={C.green} size={20}/>:<Text style={{fontWeight:'900',fontSize:18,color}}>{String(index+1).padStart(2,'0')}</Text>}</View>
  <View style={{flex:1}}><Text style={{fontWeight:'900',fontSize:16,color:C.ink}}>{mission.title}</Text><Text style={{color:C.sub,fontSize:12,marginTop:4,lineHeight:18}}>{mission.subtitle}</Text></View>
  <Ic name={done?'checkmark-circle':'arrow-forward-circle-outline'} color={done?C.green:color} size={23}/>
 </Pressable>}
function WorldDetail({world,data,onBack,onMission,onSend}: {world:World,data:KidState,onBack:()=>void,onMission:(id:string)=>void,onSend:()=>void}){
 const done=completedCount(data,world.id);const submitted=data.submitted[world.id];const decision=data.decisions[world.id];
 return <View style={{paddingHorizontal:22,paddingTop:15}}><Pressable onPress={onBack} style={S.back}><Ic name="arrow-back" size={18}/><Text style={S.backText}>All adventures</Text></Pressable>
 <View style={[S.worldHero,{backgroundColor:world.tint}]}><View style={{flex:1}}><Label color={world.color}>YOUR NEW ADVENTURE</Label><Text style={[S.worldHeroTitle,{color:C.ink}]}>{world.name}</Text><Text style={[S.worldHeroSub,{color:C.ink}]}>{world.tagline}</Text></View><WorldArt world={world} size={100}/></View>
 <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:22,marginBottom:8}}><Text style={{fontSize:16,fontWeight:'900',color:C.ink}}>Your mission map</Text><Pill text={`${done} of ${world.missions.length} complete`} bg={world.tint} color={world.color}/></View>
 <ProgressBar progress={done/world.missions.length} color={world.color}/><View style={{marginTop:13}}>{world.missions.map((mission,i)=><MissionItem key={mission.id} mission={mission} index={i} color={world.color} done={!!data.completions[keyOf(world.id,mission.id)]} onPress={()=>onMission(mission.id)}/>)}</View>
 {done===world.missions.length?<View style={[S.submitBox,{borderColor:'#B5DFC8',backgroundColor:'#E7F6ED'}]}><Ic name="ribbon-outline" color={C.green} size={27}/><Text style={{fontFamily:SERIF,fontSize:21,color:C.ink,fontWeight:'bold'}}>All missions complete!</Text><Text style={S.sectionSub}>Ready to share your choices and reflections with your parent, and talk about {world.object.toLowerCase()}?</Text>
 {decision?<><Pill text={decision.status==='approved'?'PARENT APPROVED':decision.status==='practice'?'PRACTICE REQUESTED':'NOT YET'} bg="#FFFFFF" color={C.green}/><Text style={S.sectionSub}>Parent note: {decision.message||'No note added.'}</Text><Button title="Review missions again" onPress={()=>onMission(world.missions[0].id)} variant="light"/></>:
 submitted?<><Pill text="WAITING FOR PARENT REVIEW" bg="#FFFFFF" color={C.green}/><Text style={S.sectionSub}>Shared in the same-device demo. Tap “Parent view” at the top to review.</Text></>:<Button title="Share with parent" onPress={onSend} icon="arrow-forward"/>}
 </View>:<View style={S.tipBox}><Ic name="heart" color={C.purple} size={20}/><Text style={[S.sectionSub,{flex:1,marginTop:0}]}>Try each mission in any order. Your choices are for conversation, not a score.</Text></View>}
 </View>;
}
function MockWorld({mission,world}:{mission:Mission,world:World}){
 const kind=mission.kind;
 return <View style={S.mockWindow}>
  <View style={S.mockTop}><View style={{flexDirection:'row',gap:5}}>{['#F49C87','#F3CA68','#9FD9B9'].map(x=><View key={x} style={{width:8,height:8,borderRadius:4,backgroundColor:x}}/>)}</View><Text style={{fontSize:11,fontWeight:'900',color:C.sub}}>{kind==='ai'?'ASK AN ASSISTANT':kind==='shop'?'CHECKOUT':kind==='settings'||kind==='device'?'PREFERENCES':kind==='studio'?'CREATOR STUDIO':kind==='feed'?'YOUR FEED':'MESSAGES'}</Text><Ic name="ellipsis-horizontal" size={17} color={C.sub}/></View>
  {kind==='chat'?<View style={{padding:17,gap:12}}><View style={{flexDirection:'row',alignItems:'center',gap:9}}><View style={{backgroundColor:world.tint,borderRadius:30,padding:9}}><Ic name="person-outline" color={world.color} size={19}/></View><View><Text style={{fontWeight:'900',fontSize:13,color:C.ink}}>{mission.sender}</Text><Text style={{fontSize:10,color:C.sub}}>fictional conversation · now</Text></View></View><View style={S.fakeBubble}><Text style={{fontSize:14,color:C.ink,lineHeight:21}}>{mission.scene}</Text></View><View style={{flexDirection:'row',gap:9,alignItems:'center',marginTop:9,opacity:.6}}><View style={{flex:1,backgroundColor:'#F7F5F1',borderRadius:30,padding:10}}><Text style={{color:'#A5A0A8',fontSize:12}}>Your reply...</Text></View><Ic name="send" color={world.color} size={18}/></View></View>:
  kind==='ai'?<View style={{padding:18,gap:13}}><View style={{flexDirection:'row',gap:9,alignItems:'center'}}><View style={{padding:9,borderRadius:12,backgroundColor:'#DDF2E8'}}><Ic name="sparkles" color="#327B69" size={19}/></View><Text style={{fontWeight:'900',color:C.ink,fontSize:13}}>{mission.sender}</Text></View><View style={{backgroundColor:'#F5F3EE',padding:15,borderRadius:15,borderTopLeftRadius:3}}><Text style={{color:C.ink,lineHeight:21,fontSize:14}}>{mission.scene}</Text></View><View style={{borderWidth:1,borderColor:C.line,borderRadius:22,padding:11,flexDirection:'row',justifyContent:'space-between'}}><Text style={{color:'#AAA4B3'}}>Ask something...</Text><Ic name="arrow-up-circle" color={world.color}/></View></View>:
  kind==='settings'||kind==='device'?<View style={{padding:17,gap:12}}><View style={{flexDirection:'row',alignItems:'center',gap:8}}><Ic name={kind==='device'?'phone-portrait-outline':'options-outline'} color={world.color}/><Text style={{fontWeight:'900',fontSize:15,color:C.ink}}>{mission.sender}</Text></View><Text style={{fontSize:14,lineHeight:21,color:C.ink}}>{mission.scene}</Text>{['Share location','Allow messages','Share with others'].map((x,i)=><View key={x} style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',borderTopWidth:1,borderColor:C.line,paddingTop:9}}><Text style={{color:C.sub,fontSize:12}}>{x}</Text><View style={{width:33,height:20,backgroundColor:i===1?world.color:'#DAD6D1',borderRadius:20,alignItems:i===1?'flex-end':'flex-start',padding:2}}><View style={{width:16,height:16,borderRadius:8,backgroundColor:'white'}}/></View></View>)}</View>:
 kind==='shop'?<View style={{padding:17,gap:11,alignItems:'center'}}><View style={{backgroundColor:world.tint,padding:19,borderRadius:25}}><Ic name="bag-handle" color={world.color} size={42}/></View><Pill text="SPECIAL OFFER" bg="#FFE0D8" color="#9A4237"/><Text style={{fontWeight:'900',fontSize:16,color:C.ink,textAlign:'center'}}>{mission.sender}</Text><Text style={{fontSize:14,color:C.ink,textAlign:'center',lineHeight:21}}>{mission.scene}</Text><View style={{borderWidth:1,borderColor:C.line,borderRadius:9,padding:10,alignSelf:'stretch',marginTop:4}}><Text style={{color:world.color,fontWeight:'900',textAlign:'center'}}>REVIEW BEFORE YOU BUY</Text></View></View>:
 <View style={{padding:17,gap:10}}><View style={{flexDirection:'row',alignItems:'center',gap:10}}><View style={{padding:8,borderRadius:23,backgroundColor:world.tint}}><Ic name="person" color={world.color}/></View><Text style={{fontWeight:'900',color:C.ink}}>{mission.sender}</Text></View><LinearGradient colors={[world.tint,'#FEF5EB']} style={{height:118,borderRadius:16,justifyContent:'center',alignItems:'center'}}><Ic name={kind==='studio'?'videocam-outline':'image-outline'} size={48} color={world.color}/><Ic name="sparkles" size={21} color={world.color}/></LinearGradient><Text style={{color:C.ink,lineHeight:20,fontSize:14}}>{mission.scene}</Text><View style={{flexDirection:'row',gap:13}}><Ic name="heart-outline" size={19}/><Ic name="chatbubble-outline" size={19}/><Ic name="paper-plane-outline" size={19}/></View></View>}
 </View>;
}
function MissionPlay({world,mission,previous,onBack,onComplete}:{world:World,mission:Mission,previous?:{choiceId:string;reflection:string},onBack:()=>void,onComplete:(choiceId:string,reflection:string)=>void}){
 const [picked,setPicked]=useState<string|null>(null);const [reflection,setReflection]=useState(previous?.reflection||'');
 const selected=mission.choices.find(ch=>ch.id===picked);
 useEffect(()=>{setPicked(null);setReflection(previous?.reflection||'');},[mission.id]);
 return <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':undefined}>
  <View style={{paddingHorizontal:22,paddingTop:15}}><Pressable onPress={onBack} style={S.back}><Ic name="arrow-back" size={18}/><Text style={S.backText}>{world.name} missions</Text></Pressable><Pill text={world.descriptor.toUpperCase()} bg={world.tint} color={world.color}/>
  <Text style={[S.pageTitle,{marginTop:13}]}>{mission.title}<Text style={{color:C.orange}}>.</Text></Text><Text style={[S.sectionSub,{marginTop:7,marginBottom:22}]}>{mission.subtitle}</Text>
  <MockWorld mission={mission} world={world}/>
  <View style={{marginTop:21,paddingBottom:25}}><Label>THE SITUATION</Label><Text style={{fontSize:16,color:C.ink,lineHeight:25,marginTop:7}}>{mission.context}</Text></View>
  <View><Label>WHAT WOULD YOU DO?</Label><Text style={{color:C.sub,fontSize:12,marginTop:4,marginBottom:12}}>Choose an action and see what happens. There isn't a perfect score.</Text></View>
  <View style={{gap:10}}>{mission.choices.map((ch,i)=><Pressable key={ch.id} onPress={()=>setPicked(ch.id)} style={({pressed})=>[S.actionCard,{borderColor:picked===ch.id?world.color:C.line,backgroundColor:picked===ch.id?world.tint:'white',opacity:pressed ? 0.82 : 1}]}>
    <View style={[S.actionIcon,{backgroundColor:picked===ch.id?'#FFFFFFBB':'#F3F1EE'}]}><Ic name={picked===ch.id?'checkmark':'arrow-up-forward'} color={picked===ch.id?world.color:C.sub} size={16}/></View><Text style={{flex:1,color:C.ink,fontSize:14,fontWeight:'800',lineHeight:20}}>{ch.label}</Text><Ic name={picked===ch.id?'radio-button-on':'radio-button-off'} color={picked===ch.id?world.color:'#C8C4CC'} size={20}/></Pressable>)}</View>
  {selected?<View style={[S.outcomeBox,{borderLeftColor:world.color}]}><Label color={world.color}>HERE'S WHAT HAPPENS</Label><Text style={{fontFamily:SERIF,fontSize:20,fontWeight:'bold',marginTop:6,lineHeight:27,color:C.ink}}>{selected.consequence}</Text><Text style={{fontSize:13,lineHeight:20,color:C.sub,marginTop:8}}>{selected.takeaway}</Text>
    <Divider/><Text style={{fontWeight:'900',color:C.ink,fontSize:14,marginBottom:8}}>Your voice matters</Text><Text style={{fontSize:13,lineHeight:19,color:C.sub,marginBottom:11}}>{mission.reflect}</Text>
    <TextInput style={S.noteInput} multiline placeholder="Tell your parent what you were thinking (optional)" placeholderTextColor="#9C96A4" value={reflection} onChangeText={setReflection} maxLength={450} textAlignVertical="top"/>
    <Text style={{color:C.sub,fontSize:11,marginTop:7,marginBottom:13}}>Only this mission decision and your optional note will be included in the parent review.</Text>
    <Button title={previous?'Save this mission':'Finish mission · collect a star'} onPress={()=>onComplete(selected.id,reflection)} icon="star"/>
  </View>:null}</View>
 </KeyboardAvoidingView>;
}
function MissionDone({world,mission,onNext,onMap}:{world:World,mission:Mission,onNext:()=>void,onMap:()=>void}){
 const y=useRef(new Animated.Value(-100)).current;const rot=useRef(new Animated.Value(0)).current;useEffect(()=>{y.setValue(-100);rot.setValue(0);Animated.parallel([Animated.spring(y,{toValue:0,friction:5,tension:55,useNativeDriver:true}),Animated.timing(rot,{toValue:1,duration:650,useNativeDriver:true})]).start();},[mission.id]);
 return <View style={{paddingHorizontal:22,paddingTop:44,alignItems:'center'}}><Label>THE LITTLE WINS ADD UP</Label><View style={{width:250,height:230,alignItems:'center',justifyContent:'center'}}><View style={{position:'absolute',backgroundColor:world.tint,width:195,height:195,borderRadius:100}}/><Animated.View style={{transform:[{translateY:y},{rotate:rot.interpolate({inputRange:[0,1],outputRange:['-24deg','8deg']})}]}}><Ic name="star" size={107} color={C.sun}/></Animated.View><View style={{position:'absolute',right:24,top:28}}><Ic name="sparkles" color={world.color} size={28}/></View><View style={{position:'absolute',left:27,bottom:36}}><Ic name="sparkles" color={C.orange} size={20}/></View></View>
  <Text style={[S.pageTitle,{textAlign:'center'}]}>A star for showing up.</Text><Text style={[S.sectionSub,{textAlign:'center',marginTop:11}]}>You completed <Text style={{fontWeight:'900',color:C.ink}}>{mission.title}</Text>. Every choice teaches you something new.</Text><View style={{height:22}}/><View style={{alignSelf:'stretch',gap:11}}><Button title="Continue exploring" onPress={onNext} icon="arrow-forward"/><Button title="Back to mission map" variant="line" onPress={onMap}/></View>
 </View>;
}
function Jar({stars}:{stars:number}){const bounce=useRef(new Animated.Value(0)).current;useEffect(()=>{Animated.sequence([Animated.timing(bounce,{toValue:-12,duration:280,useNativeDriver:true}),Animated.spring(bounce,{toValue:0,useNativeDriver:true,friction:4})]).start();},[stars]);return <View style={{height:292,alignItems:'center',justifyContent:'center',marginTop:10,marginBottom:4}}>
  <View style={{position:'absolute',width:285,height:285,borderRadius:180,backgroundColor:'#EDE7FB'}}/>
  <View style={{position:'absolute',left:42,top:37}}><Ic name="sparkles" color="#EAA655" size={28}/></View><View style={{position:'absolute',right:42,top:60}}><Ic name="star" color={C.orange} size={20}/></View>
  <Animated.View style={{width:203,height:224,transform:[{translateY:bounce}],alignItems:'center',marginTop:32}}>
    <View style={{width:160,height:25,borderRadius:10,borderWidth:5,borderColor:'#7972B1',backgroundColor:'#DDD6FE',zIndex:3,position:'absolute',top:3}}/>
    <View style={{position:'absolute',top:24,width:179,height:188,borderWidth:5,borderColor:'#8880B8',borderTopWidth:6,borderBottomLeftRadius:38,borderBottomRightRadius:38,borderTopLeftRadius:21,borderTopRightRadius:21,backgroundColor:'#E7F9F5A8',overflow:'hidden'}}>
      <View style={{position:'absolute',top:8,left:15,width:10,height:140,borderRadius:12,backgroundColor:'#FFFFFF99'}}/>
      {jarSlots.slice(0,Math.min(stars,jarSlots.length)).map(([left,bottom],i)=><View key={i} style={{position:'absolute',left:`${left}%`,bottom:`${Math.min(bottom-4,92)}%`,transform:[{rotate:`${(i*39)%45-20}deg`}]}}><Ic name="star" size={23} color={i%3===0?C.orange:i%3===1?'#7D65D6':C.sun}/></View>)}
      <View style={{position:'absolute',bottom:7,alignSelf:'center',backgroundColor:'#FFFFFFDD',paddingHorizontal:11,paddingVertical:5,borderRadius:13}}><Text style={{fontWeight:'900',color:C.dark,fontSize:12}}>{stars} star{stars===1?'':'s'}</Text></View>
    </View>
  </Animated.View>
 </View>}
function Rewards({data,role,onCelebrate}:{data:KidState,role:Role,onCelebrate:(id:string)=>void}){
 const stars=totalStars(data);
 return <View style={{paddingHorizontal:22,paddingTop:23}}><Label>THE GOOD STUFF</Label><Text style={S.pageTitle}>Make room for{ '\n'}a little <Text style={{color:C.purple,fontStyle:'italic'}}>magic.</Text></Text><Text style={[S.sectionSub,{marginTop:10}]}>Every completed mission adds a star to your jar. What you unlock is a conversation—not an automatic purchase.</Text>
  <Jar stars={stars}/><Text style={{fontFamily:SERIF,fontSize:24,color:C.ink,fontWeight:'bold',textAlign:'center'}}>Collect courage, not perfect answers.</Text>
  <View style={{marginTop:25,gap:11}}>{REWARDS.map(r=>{const reached=stars>=r.n;const celebrated=!!data.redeemed[r.id];return <View key={r.id} style={S.rewardCard}>
    <View style={{width:54,height:54,borderRadius:19,backgroundColor:r.color,alignItems:'center',justifyContent:'center'}}><Ic name={r.icon} size={27} color={C.dark}/></View><View style={{flex:1,gap:4}}><Text style={{fontSize:15,fontWeight:'900',color:C.ink}}>{r.title}</Text><Text style={{fontSize:12,lineHeight:18,color:C.sub}}>{r.subtitle}</Text><Text style={{fontWeight:'900',fontSize:11,color:reached?C.green:C.purple,marginTop:4}}>{celebrated?'Celebrated together ✓':reached?'Ready to discuss with parent':`${r.n-stars} more stars to go`}</Text></View><View style={{alignItems:'center',gap:6}}><Ic name={reached?'star':'lock-closed-outline'} color={reached?C.sun:'#B2AEC0'} size={25}/>{role==='parent'&&reached&&!celebrated?<Pressable onPress={()=>onCelebrate(r.id)}><Text style={{fontSize:10,color:C.purple,fontWeight:'900'}}>Mark done</Text></Pressable>:null}</View>
  </View>})}</View>
  <Text style={S.miniFoot}>Parents choose which rewards are appropriate, affordable, and agreed upon. LevelUp never purchases or installs anything.</Text>
 </View>;
}
function Profile({data,role}:{data:KidState,role:Role}){
 const stars=totalStars(data),explored=WORLDS.filter(w=>completedCount(data,w.id)>0).length,approvals=Object.values(data.decisions).filter(x=>x.status==='approved').length;
 return <View style={{paddingHorizontal:22,paddingTop:25}}><Label>YOUR SPACE</Label><Text style={S.pageTitle}>Look how far{ '\n'}you've <Text style={{color:C.purple,fontStyle:'italic'}}>come.</Text></Text>
  <View style={S.profileHero}><View style={{width:84,height:84,borderRadius:26,backgroundColor:C.lilac,alignItems:'center',justifyContent:'center'}}><Ic name={role==='teen'?'happy-outline':'people-outline'} color={C.purple} size={44}/></View><View style={{flex:1,gap:5}}><Text style={{fontFamily:SERIF,fontSize:27,fontWeight:'bold',color:C.ink}}>{role==='teen'?'Explorer Alex':'Family space'}</Text><Text style={{fontSize:12,color:C.sub,lineHeight:19}}>{role==='teen'?'Growing digital confidence, one choice at a time.':'Supporting independence through open conversations.'}</Text></View></View>
  <View style={{flexDirection:'row',gap:10,marginTop:17}}>{[{v:stars,t:'Missions',i:'flag-outline',bg:'#EAE5FF'},{v:explored,t:'Adventures',i:'compass-outline',bg:'#DDF1E7'},{v:approvals,t:'Approved',i:'heart-outline',bg:'#FFE6D9'}].map(x=><View key={x.t} style={[S.statTile,{flex:1,backgroundColor:x.bg}]}><Ic name={x.i} color={C.dark} size={21}/><Text style={{fontFamily:SERIF,fontWeight:'bold',fontSize:29,color:C.ink,marginTop:7}}>{x.v}</Text><Text style={{fontSize:11,fontWeight:'900',color:C.sub}}>{x.t}</Text></View>)}</View>
  <View style={{marginTop:30}}><SectionTitle kicker="THE JOURNEY SO FAR" title="Your adventure book"/><View style={{gap:9}}>{WORLDS.filter(w=>completedCount(data,w.id)>0).map(w=><View key={w.id} style={S.progressRow}><WorldArt world={w} size={46}/><View style={{flex:1,gap:7}}><Text style={{fontSize:14,fontWeight:'900',color:C.ink}}>{w.name}</Text><ProgressBar progress={completedCount(data,w.id)/w.missions.length} color={w.color} height={6}/></View><Text style={{fontWeight:'900',fontSize:12,color:C.sub}}>{completedCount(data,w.id)}/{w.missions.length}</Text></View>)}{explored===0?<View style={S.emptyBox}><Ic name="trail-sign-outline" color={C.purple} size={31}/><Text style={{color:C.ink,fontWeight:'900',marginTop:7}}>The story starts with one mission.</Text><Text style={S.sectionSub}>Your adventures will appear here as you explore.</Text></View>:null}</View></View>
  <View style={[S.tipBox,{marginTop:26}]}><Ic name="shield-checkmark-outline" size={22} color={C.green}/><Text style={[S.sectionSub,{flex:1,marginTop:0}]}>Prototype mode: progress stays on this device. No real child's identity, age verification, or parent account is collected.</Text></View>
 </View>;
}
function ParentHome({data,onReview,onTeen}:{data:KidState,onReview:(id:string)=>void,onTeen:()=>void}){
 const pending=WORLDS.filter(w=>data.submitted[w.id]&&!data.decisions[w.id]);
 const decided=WORLDS.filter(w=>!!data.decisions[w.id]);
 return <View style={{paddingHorizontal:22,paddingTop:24}}><Pill text="PARENT SPACE · DEMO" bg={C.mint} color={C.green}/><Text style={[S.pageTitle,{marginTop:18}]}>More trust.{ '\n'}Less <Text style={{color:C.purple,fontStyle:'italic'}}>guesswork.</Text></Text><Text style={[S.sectionSub,{marginTop:9,marginBottom:23}]}>See how your teen approached meaningful situations, talk about their thinking, and make the decision together.</Text>
  <LinearGradient colors={['#EEE8FF','#E3DEFA']} style={{padding:21,borderRadius:23,marginBottom:27,flexDirection:'row',alignItems:'center',gap:13}}><View style={{flex:1}}><Label>PARENT TIP</Label><Text style={{fontFamily:SERIF,fontSize:23,fontWeight:'bold',color:C.ink,marginTop:8}}>Lead with curiosity.</Text><Text style={{fontSize:12,lineHeight:19,color:C.sub,marginTop:7}}>“Walk me through what you were thinking.” is more helpful than “Why did you get that wrong?”</Text></View><Ic name="heart-circle-outline" color={C.purple} size={65}/></LinearGradient>
 <SectionTitle kicker="NEEDS YOUR ATTENTION" title={`Requests to review (${pending.length})`}/>
 {pending.length?pending.map(w=><Pressable key={w.id} onPress={()=>onReview(w.id)} style={S.parentReq}><WorldArt world={w} size={58}/><View style={{flex:1}}><Text style={{fontWeight:'900',fontSize:15,color:C.ink}}>{w.name}</Text><Text style={{color:C.sub,fontSize:12,marginTop:4}}>3 missions · choices ready to discuss</Text></View><Ic name="arrow-forward" color={C.purple}/></Pressable>):<View style={S.emptyBox}><Ic name="mail-open-outline" size={29} color={C.green}/><Text style={{fontWeight:'900',color:C.ink,marginTop:8}}>All caught up.</Text><Text style={S.sectionSub}>When a teen shares a completed adventure, it appears here on this device.</Text><Button title="Try the teen experience" variant="line" small onPress={onTeen}/></View>}
 {decided.length?<View style={{marginTop:22}}><SectionTitle title="Already discussed"/>{decided.map(w=><Pressable onPress={()=>onReview(w.id)} key={w.id} style={S.parentReq}><WorldArt world={w} size={48}/><View style={{flex:1}}><Text style={{fontWeight:'900',color:C.ink}}>{w.name}</Text><Text style={{color:C.sub,fontSize:12,marginTop:4}}>{data.decisions[w.id].status==='approved'?'Approved together':data.decisions[w.id].status==='practice'?'More practice requested':'Waiting for another discussion'}</Text></View><Ic name="chevron-forward" size={18} color={C.sub}/></Pressable>)}</View>:null}
 <Text style={S.miniFoot}>Same-device presentation mode only. Actual parent notifications and identity verification require a secure backend.</Text>
 </View>;
}
function ParentReview({world,data,onBack,onDecide}:{world:World,data:KidState,onBack:()=>void,onDecide:(status:'approved'|'practice'|'wait',message:string)=>void}){
 const [note,setNote]=useState(data.decisions[world.id]?.message||'');const done=completedCount(data,world.id);
 return <View style={{paddingHorizontal:22,paddingTop:12}}><Pressable onPress={onBack} style={S.back}><Ic name="arrow-back" size={18}/><Text style={S.backText}>Parent requests</Text></Pressable><Label>LET'S TALK IT THROUGH</Label><Text style={[S.pageTitle,{marginTop:9}]}>{world.name}{'\n'}<Text style={{fontStyle:'italic',color:C.purple}}>together.</Text></Text><Text style={[S.sectionSub,{marginTop:9}]}>{world.parentIntro}</Text>
 <View style={[S.tipBox,{marginVertical:20}]}><Ic name="hand-left-outline" size={23} color={C.green}/><Text style={[S.sectionSub,{flex:1,marginTop:0}]}>These are practice observations, not a readiness score. Consider your teen's real-life habits, maturity, and platform age requirements too.</Text></View>
 <SectionTitle kicker="WHAT THEY CHOSE" title={`${done} mission reflections`}/>
 {world.missions.map((mission,i)=>{const record=data.completions[keyOf(world.id,mission.id)];const choice=mission.choices.find(ch=>ch.id===record?.choiceId);return <View key={mission.id} style={S.reviewCard}>
  <View style={{flexDirection:'row',alignItems:'center',gap:8}}><View style={{width:27,height:27,borderRadius:9,backgroundColor:world.tint,alignItems:'center',justifyContent:'center'}}><Text style={{fontWeight:'900',color:world.color}}>{i+1}</Text></View><Text style={{fontSize:15,fontWeight:'900',color:C.ink,flex:1}}>{mission.title}</Text></View>
  {record&&choice?<><Text style={S.reviewLabel}>THEIR DECISION</Text><Text style={{color:C.ink,fontSize:14,lineHeight:21,fontWeight:'700'}}>{choice.label}</Text><Text style={{color:C.sub,fontSize:12,lineHeight:19,marginTop:5}}>{choice.consequence}</Text><Divider/><Text style={S.reviewLabel}>IN THEIR OWN WORDS</Text><Text style={{color:C.ink,fontSize:13,lineHeight:21,fontStyle:record.reflection?'normal':'italic'}}>{record.reflection||'They chose not to add a written reflection.'}</Text></>:<Text style={S.sectionSub}>Mission not yet completed.</Text>}
  <View style={{backgroundColor:C.bg,padding:11,borderRadius:11,marginTop:13}}><Text style={{fontSize:12,lineHeight:19,color:C.sub}}><Text style={{color:C.purple,fontWeight:'900'}}>Conversation starter: </Text>{mission.parentPrompt}</Text></View>
 </View>})}
 <View style={S.decisionPanel}><Label>YOUR DECISION, TOGETHER</Label><Text style={{fontFamily:SERIF,fontSize:22,fontWeight:'bold',color:C.ink,marginTop:6}}>What feels right for your family?</Text><Text style={[S.sectionSub,{marginTop:6,marginBottom:13}]}>There is no automatic pass/fail. Approval is a family decision, not an AI judgment.</Text><TextInput style={S.noteInput} multiline placeholder="Your note for the teen (optional)" placeholderTextColor="#9C96A4" value={note} onChangeText={setNote} maxLength={500} textAlignVertical="top"/>
 <View style={{gap:9,marginTop:14}}><Button title="Approve this request" icon="checkmark-circle" onPress={()=>onDecide('approved',note)}/><Button title="Suggest more practice" variant="light" icon="refresh-outline" onPress={()=>onDecide('practice',note)}/><Button title="Not right now" variant="line" onPress={()=>onDecide('wait',note)}/></View><Text style={[S.sectionSub,{fontSize:11,marginTop:11}]}>This records your sample decision inside LevelUp only. It does not install apps, enable permissions, buy devices, or contact a real family account.</Text></View>
 </View>;
}
function Guide({onBack,onExplore}:{onBack:()=>void,onExplore:()=>void}){return <View style={{paddingHorizontal:22,paddingTop:16}}><Pressable onPress={onBack} style={S.back}><Ic name="arrow-back" size={18}/><Text style={S.backText}>Back home</Text></Pressable><Label>THE IDEA BEHIND LEVELUP</Label><Text style={[S.pageTitle,{marginTop:10}]}>No spying.{'\n'}No scores.{'\n'}<Text style={{fontStyle:'italic',color:C.purple}}>Just growing.</Text></Text><Text style={[S.sectionSub,{marginVertical:19}]}>Want a new app, your own phone, or a YouTube channel? LevelUp gives families a better way to say “let's figure this out.”</Text>
 {[
  {icon:'hand-left-outline',name:'Make a request',desc:'Choose something you want to explore or earn.'},
  {icon:'game-controller-outline',name:'Try 3 mini-missions',desc:'Experience realistic moments and see how decisions unfold.'},
  {icon:'heart-outline',name:'Share what you think',desc:'Your parent sees your relevant choices and optional reflections.'},
  {icon:'ribbon-outline',name:'Decide together',desc:'Your parent can approve, suggest practice, or wait. Each mission adds a star to your jar.'},
 ].map((x,i)=><View key={i} style={S.guideRow}><View style={{width:50,height:50,borderRadius:18,backgroundColor:i%2?C.mint:C.lilac,alignItems:'center',justifyContent:'center'}}><Ic name={x.icon} color={C.dark}/></View><View style={{flex:1}}><Text style={{fontWeight:'900',fontSize:16,color:C.ink}}>{x.name}</Text><Text style={{fontSize:13,lineHeight:20,color:C.sub,marginTop:4}}>{x.desc}</Text></View></View>)}
 <View style={{marginTop:20}}><Button title="Explore the adventures" onPress={onExplore} icon="arrow-forward"/></View>
 </View>}
export default function App(){
 const [data,setData]=useState<KidState>(EMPTY_STATE);const [hydrated,setHydrated]=useState(false);
 const [role,setRole]=useState<Role>('teen');const [page,setPage]=useState<Page>('home');const [worldId,setWorldId]=useState('instagram');const [missionId,setMissionId]=useState('ig-profile');
 const scroll=useRef<ScrollView>(null);
 useEffect(()=>{let live=true;loadState().then(result=>{if(live){setData(result);setHydrated(true)}});return()=>{live=false};},[]);
 useEffect(()=>{if(hydrated)saveState(data).catch(()=>{});},[data,hydrated]);
 const go=(next:Page)=>{setPage(next);scroll.current?.scrollTo({y:0,animated:false});};
 const chooseWorld=(id:string)=>{setWorldId(id);go('world');};
 const chooseMission=(id:string)=>{setMissionId(id);go('mission');};
 const world=getWorld(worldId)||WORLDS[0];const mission=getMission(worldId,missionId)||world.missions[0];
 const finishMission=(choiceId:string,reflection:string)=>{
  const key=keyOf(world.id,mission.id);
  setData(p=>({...p,completions:{...p.completions,[key]:{choiceId,reflection:reflection.trim(),completedAt:new Date().toISOString()}},submitted:Object.fromEntries(Object.entries(p.submitted).filter(([k])=>k!==world.id)),decisions:Object.fromEntries(Object.entries(p.decisions).filter(([k])=>k!==world.id))}));go('missionDone');
 };
 const submit=()=>{setData(p=>({...p,submitted:{...p.submitted,[world.id]:new Date().toISOString()},decisions:Object.fromEntries(Object.entries(p.decisions).filter(([k])=>k!==world.id))}));go('world');};
 const parentDecision=(status:'approved'|'practice'|'wait',message:string)=>{setData(p=>({...p,decisions:{...p.decisions,[world.id]:{status,message:message.trim(),decidedAt:new Date().toISOString()}}}));go('parent');};
 const toggleRole=()=>{setRole(p=>p==='teen'?'parent':'teen');go(role==='teen'?'parent':'home');};
 const nextMission=()=>{const idx=world.missions.findIndex(x=>x.id===mission.id);const next=world.missions[(idx+1)%world.missions.length];if(idx+1>=world.missions.length)go('world');else chooseMission(next.id);};
 const navTo=(p:Page)=>{if(role==='parent'&&p==='parentReview'){const pending=WORLDS.find(w=>data.submitted[w.id]&&!data.decisions[w.id])||WORLDS.find(w=>data.submitted[w.id]);if(pending){setWorldId(pending.id);go('parentReview');}else go('parent');}else go(p);};
 if(!hydrated){return <SafeAreaView style={[S.safe,{alignItems:'center',justifyContent:'center'}]}><Ic name="star" color={C.purple} size={50}/><Text style={[S.logoText,{marginTop:13}]}>levelup.</Text></SafeAreaView>}
 return <SafeAreaView style={S.safe} edges={['top','left','right','bottom']}><StatusBar barStyle="dark-content" backgroundColor={C.bg}/><TopBar role={role} onToggle={toggleRole} onHome={()=>go(role==='teen'?'home':'parent')}/>
 <ScrollView ref={scroll} key={`${page}-${page==='mission'?mission.id:''}-${page==='parentReview'?world.id:''}`} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom:34}} style={{flex:1}}>
  {page==='home'?<Home data={data} onExplore={()=>go('explore')} onWorld={chooseWorld} onGuide={()=>go('guide')}/>:null}
  {page==='explore'?<Explore data={data} onWorld={chooseWorld}/>:null}
  {page==='world'?<WorldDetail world={world} data={data} onBack={()=>go('explore')} onMission={chooseMission} onSend={submit}/>:null}
  {page==='mission'?<MissionPlay key={mission.id} world={world} mission={mission} previous={data.completions[keyOf(world.id,mission.id)]} onBack={()=>go('world')} onComplete={finishMission}/>:null}
  {page==='missionDone'?<MissionDone world={world} mission={mission} onMap={()=>go('world')} onNext={nextMission}/>:null}
  {page==='rewards'?<Rewards data={data} role={role} onCelebrate={id=>setData(p=>({...p,redeemed:{...p.redeemed,[id]:new Date().toISOString()}}))}/>:null}
  {page==='profile'?<Profile data={data} role={role}/>:null}
  {page==='parent'?<ParentHome data={data} onReview={id=>{setWorldId(id);go('parentReview')}} onTeen={toggleRole}/>:null}
  {page==='parentReview'?<ParentReview key={world.id} world={world} data={data} onBack={()=>go('parent')} onDecide={parentDecision}/>:null}
  {page==='guide'?<Guide onBack={()=>go('home')} onExplore={()=>go('explore')}/>:null}
 </ScrollView>
 <Nav page={page} role={role} setPage={navTo}/></SafeAreaView>;
}
const S=StyleSheet.create({
 safe:{flex:1,backgroundColor:C.bg},topBar:{paddingHorizontal:21,paddingTop:9,paddingBottom:13,borderBottomWidth:1,borderColor:'#ECE8E1',flexDirection:'row',alignItems:'center',justifyContent:'space-between',backgroundColor:C.bg},logo:{backgroundColor:C.purple,width:37,height:37,borderRadius:13,justifyContent:'center',alignItems:'center',transform:[{rotate:'-9deg'}]},logoText:{fontSize:23,fontWeight:'900',letterSpacing:-1.2,color:C.ink},logoSub:{fontSize:8,color:C.sub,fontWeight:'700',letterSpacing:.5},roleSwitch:{borderRadius:25,backgroundColor:'#EEEAE5',paddingHorizontal:12,paddingVertical:10,flexDirection:'row',alignItems:'center',gap:5},roleText:{fontSize:11,fontWeight:'900',color:C.ink},nav:{flexDirection:'row',borderTopWidth:1,borderColor:'#EAE6E0',paddingTop:12,paddingBottom:5,backgroundColor:'#FFFFFF'},navItem:{flex:1,alignItems:'center',gap:4,justifyContent:'center',height:46},navLabel:{fontSize:10},activeDot:{width:5,height:5,borderRadius:3,backgroundColor:C.purple,position:'absolute',bottom:-3},
 eyebrow:{fontSize:10,fontWeight:'900',letterSpacing:1.65,textTransform:'uppercase'},pageTitle:{fontFamily:SERIF,fontWeight:'bold',fontSize:34,lineHeight:40,letterSpacing:-.9,color:C.ink},sectionTitle:{fontFamily:SERIF,fontWeight:'bold',fontSize:24,lineHeight:29,color:C.ink,marginTop:6},sectionSub:{color:C.sub,fontSize:13.5,lineHeight:21},
 button:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:9,borderRadius:15,alignSelf:'stretch'},buttonText:{fontWeight:'900',letterSpacing:.1},pill:{alignSelf:'flex-start',paddingVertical:7,paddingHorizontal:10,borderRadius:10,flexDirection:'row',alignItems:'center',gap:5},
 hero:{borderRadius:28,paddingTop:25,paddingBottom:27,paddingHorizontal:23,overflow:'hidden',minHeight:335},heroOrb:{position:'absolute',borderRadius:100,opacity:.43},heroTitle:{fontFamily:SERIF,fontSize:36,color:'white',lineHeight:42,fontWeight:'bold',marginTop:23,letterSpacing:-.7},heroSub:{fontSize:13,color:'#E6E0FD',lineHeight:20,marginTop:12,maxWidth:'87%'},featureCard:{borderRadius:24,padding:21,flexDirection:'row',alignItems:'center'},featureTitle:{fontFamily:SERIF,fontWeight:'bold',fontSize:26,marginTop:12,marginBottom:4},stepsRow:{flexDirection:'row',gap:8},
 worldArt:{justifyContent:'center',alignItems:'center',overflow:'hidden'},worldCard:{backgroundColor:'white',borderWidth:1,borderColor:C.line,borderRadius:22,flexDirection:'row',gap:12,alignItems:'center'},worldName:{fontSize:16,fontWeight:'900',color:C.ink},worldDesc:{color:C.sub,fontSize:12,lineHeight:18},filter:{borderRadius:20,paddingVertical:11,paddingHorizontal:16},miniFoot:{fontSize:11,color:C.sub,textAlign:'center',lineHeight:17,marginTop:24,marginBottom:16},
 back:{flexDirection:'row',alignItems:'center',gap:8,alignSelf:'flex-start',paddingVertical:10,marginBottom:8},backText:{fontSize:12,fontWeight:'900',color:C.ink},worldHero:{padding:21,borderRadius:25,flexDirection:'row',alignItems:'center',minHeight:179,overflow:'hidden'},worldHeroTitle:{fontFamily:SERIF,fontSize:33,fontWeight:'bold',letterSpacing:-.8,marginTop:14},worldHeroSub:{fontSize:13,lineHeight:20,marginTop:7,maxWidth:180},missionRow:{borderBottomWidth:1,borderColor:C.line,paddingVertical:18,flexDirection:'row',gap:12,alignItems:'center'},missionNum:{width:44,height:44,borderRadius:15,alignItems:'center',justifyContent:'center'},submitBox:{borderWidth:1.5,borderRadius:22,padding:19,gap:10,marginTop:20,alignItems:'flex-start'},tipBox:{padding:15,backgroundColor:'#F1EEE7',borderRadius:17,flexDirection:'row',gap:11,alignItems:'flex-start',marginTop:24},
 mockWindow:{backgroundColor:'white',borderRadius:23,borderColor:C.line,borderWidth:1,overflow:'hidden',shadowColor:'#1D153B',shadowOpacity:.06,shadowOffset:{width:0,height:7},shadowRadius:17,elevation:2},mockTop:{height:45,paddingHorizontal:15,flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderBottomWidth:1,borderColor:C.line},fakeBubble:{backgroundColor:'#F1EEFE',borderRadius:17,borderTopLeftRadius:3,padding:14,marginRight:25},actionCard:{flexDirection:'row',alignItems:'center',gap:12,padding:14,minHeight:65,borderWidth:1.7,borderRadius:15},actionIcon:{width:28,height:28,borderRadius:10,alignItems:'center',justifyContent:'center'},outcomeBox:{marginTop:20,backgroundColor:'white',borderWidth:1,borderColor:C.line,borderLeftWidth:5,borderRadius:19,padding:20},noteInput:{borderWidth:1,borderColor:'#DDD8E5',borderRadius:13,backgroundColor:'#FCFAF6',minHeight:86,padding:13,color:C.ink,fontSize:14,lineHeight:21},
 rewardCard:{backgroundColor:'white',borderRadius:20,borderWidth:1,borderColor:C.line,padding:14,flexDirection:'row',alignItems:'center',gap:13},profileHero:{backgroundColor:'white',borderWidth:1,borderColor:C.line,padding:20,borderRadius:24,flexDirection:'row',gap:16,alignItems:'center',marginTop:21},statTile:{padding:14,borderRadius:20},progressRow:{flexDirection:'row',alignItems:'center',gap:12,backgroundColor:'white',padding:13,borderRadius:17,borderWidth:1,borderColor:C.line},
 emptyBox:{backgroundColor:'white',borderRadius:21,borderWidth:1,borderColor:C.line,alignItems:'center',padding:23,gap:8},parentReq:{backgroundColor:'white',borderRadius:20,borderWidth:1,borderColor:C.line,padding:15,flexDirection:'row',gap:13,alignItems:'center',marginBottom:10},reviewCard:{backgroundColor:'white',borderWidth:1,borderColor:C.line,borderRadius:20,padding:18,marginBottom:12},reviewLabel:{fontWeight:'900',fontSize:10,letterSpacing:1.1,color:C.purple,marginBottom:6,marginTop:13},decisionPanel:{backgroundColor:'#ECE8FA',borderRadius:24,padding:19,marginTop:17,marginBottom:25},guideRow:{flexDirection:'row',gap:13,alignItems:'center',marginVertical:14},
});
