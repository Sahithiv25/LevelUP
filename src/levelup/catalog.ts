// LevelUp V3 — synthetic practice curriculum. No real child content is used.
export type MissionKind = 'chat' | 'feed' | 'settings' | 'ai' | 'shop' | 'device' | 'studio';
export type Lens = 'thoughtful' | 'try-again' | 'talk';
export type Choice = { id: string; label: string; consequence: string; lens: Lens; takeaway: string };
export type Mission = {
  id: string;
  title: string;
  subtitle: string;
  kind: MissionKind;
  objective: string;
  sceneTitle: string;
  sender: string;
  scene: string;
  context: string;
  choices: Choice[];
  reflect: string;
  parentPrompt: string;
};
export type World = {
  id: string;
  name: string;
  descriptor: string;
  tagline: string;
  icon: string;
  color: string;
  tint: string;
  age: string;
  object: string;
  parentIntro: string;
  missions: Mission[];
};
const c = (id:string,label:string,consequence:string,lens:Lens,takeaway:string):Choice => ({id,label,consequence,lens,takeaway});
const m = (id:string,title:string,subtitle:string,kind:MissionKind,objective:string,sceneTitle:string,sender:string,scene:string,context:string,choices:Choice[],reflect:string,parentPrompt:string):Mission => ({id,title,subtitle,kind,objective,sceneTitle,sender,scene,context,choices,reflect,parentPrompt});
export const WORLDS:World[] = [
  {
    id:'instagram',name:'Instagram',descriptor:'Social media',tagline:'Your first little corner of the internet.',icon:'camera-outline',color:'#DF765D',tint:'#FBE7DD',age:'13+',object:'An Instagram account',
    parentIntro:'Discuss public identity, unfamiliar contacts, group pressure, and what support looks like when something goes wrong.',
    missions:[
      m('ig-profile','Your digital footprint','Choose what the world can see','settings','Privacy and identity','Set up your profile','Profile setup','You\'re about to share your first photo. A friend says private accounts never get popular.','The profile has your school name in its bio and location tags turned on.',[
        c('private','Make the account private and remove identifying details','Your friends can still follow you, but strangers see far less about your daily life.','thoughtful','A private account reduces exposure but doesn\'t remove every risk.'),
        c('public','Keep it public because you want more followers','A stranger can now see details you didn\'t realize were visible.','try-again','Attention online has a real privacy tradeoff.'),
        c('ask','Save the draft and talk through the settings first','You take time to understand the settings before sharing.','thoughtful','Asking questions before posting is a useful habit.')
      ],'What would you feel comfortable sharing publicly—and what would you keep private?','How will we decide together what is okay to post?'),
      m('ig-follow','The mystery follower','Not everyone is who they say','chat','Trust and boundaries','You have a request','@notquitealex','Hey! I know Maya from school. Can you accept me? 😄','Their profile is new and they have three mutual followers.',[
        c('verify','Ask Maya separately if she knows them','Maya has never heard of this account. You have more information before deciding.','thoughtful','A mutual connection is not proof of identity.'),
        c('accept','Accept without checking','They can now see your followers-only posts and begin asking personal questions.','try-again','A friendly profile is not the same thing as a trusted person.'),
        c('pending','Leave it pending and keep browsing','The request stays unanswered. Nothing bad happens because you took your time.','thoughtful','You do not owe strangers a response.')
      ],'If someone made you uncomfortable online, who would you go to first?','How could I respond if you came to me about an uncomfortable message?'),
      m('ig-group','The group chat moment','Friendship can be complicated','feed','Empathy and peer pressure','Someone shared a clip','School friends','A short, embarrassing clip of a classmate is spreading. Someone says: “Send it to our private chat 😂”','You did not record the clip, but your friends are waiting for a reaction.',[
        c('support','Do not forward it; check in with the classmate','You avoid spreading the clip and make space to support the person affected.','thoughtful','Private resharing can still cause harm.'),
        c('forward','Send it, but only to close friends','Someone else forwards it again. You can no longer control who sees it.','try-again','A screenshot or forwarded post can travel far beyond its original audience.'),
        c('leave','Step away and ask a trusted adult what to do','You avoid taking part and get help thinking through a tricky situation.','thoughtful','Getting support is often a strong, independent choice.')
      ],'What would make it easier to speak up when friends are pressuring you?','How can we talk about mistakes without immediately taking away the app?')
    ]
  },
  {
    id:'roblox',name:'Roblox',descriptor:'Online games',tagline:'More fun, fewer unexpected surprises.',icon:'game-controller-outline',color:'#6276D7',tint:'#E5EAFF',age:'10+',object:'Online gaming privileges',
    parentIntro:'Discuss gaming friendships, in-game purchases, and boundaries with new people.',missions:[
      m('rb-chat','A new teammate','Keep the fun in the game','chat','Online friendships','A message in the lobby','DragonBuilder47','You seem cool! Let\'s chat somewhere private. What\'s your number?','You\'ve played together once. You do not know them offline.',[
        c('stay','Keep chatting only through approved game features','You can still enjoy the game without giving away personal contact information.','thoughtful','Staying on moderated, age-appropriate channels adds protection.'),
        c('number','Give your phone number to stay friends','Now someone you barely know can contact you outside the game.','try-again','Personal contact details create connections that are harder to control.'),
        c('adult','Ask a trusted adult what to do','You get a second perspective before moving a conversation elsewhere.','thoughtful','Support and independence can exist together.')
      ],'How do you decide when an online friend has earned your trust?','What gaming interactions would you want me to help with?'),
      m('rb-coins','The limited-time offer','Big feelings, small purchases','shop','Money and purchase pressure','15 minutes left!','Game store','Buy the exclusive bundle for 1,200 coins. The timer is counting down.','You saved coins for weeks, but the purchase uses almost all of them.',[
        c('pause','Check the real cost and wait before deciding','The timer ends, but you still have your coins and can compare other options.','thoughtful','Countdowns can create artificial urgency.'),
        c('buy','Purchase immediately before it disappears','You get the bundle but realize it wasn\'t worth using all your coins.','try-again','It helps to check the total cost before spending.'),
        c('plan','Ask for a spending budget for future items','You and your parent can agree on a limit before the next offer appears.','thoughtful','A budget makes future purchases less stressful.')
      ],'What makes an in-game purchase worth the price to you?','What spending limit would feel fair?'),
      m('rb-privacy','The secret club','Requests that cross a line','device','Secrecy and help-seeking','A private invitation','SecretClubAdmin','Join our group and get special perks, but don\'t tell your parents.','The invitation promises access to an exclusive gaming world.',[
        c('decline','Decline the invitation and keep playing','You keep your options open without agreeing to secrecy.','thoughtful','Secrecy requests can be a warning sign.'),
        c('join','Join because the perks sound exciting','The group immediately asks for more personal information.','try-again','Promises of special rewards can disguise unhealthy pressure.'),
        c('share','Show the invitation to a trusted adult','You can discuss the invitation before taking action.','thoughtful','Having someone in your corner makes online decisions easier.')
      ],'What kind of request would make you stop and ask for help?','Can we agree you won\'t be punished simply for asking about a suspicious invitation?')
    ]
  },
  {
    id:'chatgpt',name:'ChatGPT',descriptor:'AI tools',tagline:'Use AI brilliantly. Keep your own brain switched on.',icon:'sparkles-outline',color:'#2F987D',tint:'#DEF3E9',age:'13+',object:'Permission to use an AI assistant',
    parentIntro:'Discuss age-appropriate use, independent thinking, fact-checking, and privacy. A simulated exercise does not establish eligibility under any AI provider\'s policies.',missions:[
      m('ai-boundaries','The uncomfortable prompt','Knowing when to say no','ai','Age-appropriate AI use','A friend sends a prompt','Classmate','“Try asking the chatbot for adult-only content. It might answer if you word it differently.”','Your friend is curious and encourages you to bypass the chatbot\'s safeguards.',[
        c('redirect','Skip that request and explore an age-appropriate topic','You keep your AI use within boundaries that support your wellbeing.','thoughtful','Trying to bypass age safeguards is not necessary to learn with AI.'),
        c('test','Keep trying different words to get around the safeguards','The session turns into an attempt to defeat a protection meant for younger users.','try-again','Respecting age-appropriate limits is part of responsible AI use.'),
        c('discuss','Ask why the topic is restricted and talk to a trusted adult','You learn about the boundary without requesting the restricted material.','thoughtful','Curiosity and safe boundaries can coexist.')
      ],'What kinds of AI questions would you feel uncertain about?','Which AI topics should we agree are off-limits or require a conversation?'),
      m('ai-homework','Too good to be true','AI can be confidently wrong','ai','Verification and learning','The instant answer','StudyBuddy AI','“The capital of Australia is Sydney. You can copy this into your homework!”','The answer sounds confident, but you aren\'t sure it is right.',[
        c('verify','Check a reliable source and write the answer yourself','You discover the actual capital is Canberra and learn why verifying matters.','thoughtful','AI can state incorrect facts with confidence.'),
        c('copy','Copy the answer into homework without checking','Your homework now contains a factual error.','try-again','Checking information is more important than how confident it sounds.'),
        c('hint','Ask AI to explain its reasoning, then verify independently','You gain useful context and still check the final answer.','thoughtful','AI can be a learning partner without replacing your thinking.')
      ],'When does AI help you learn, and when does it do too much?','What would fair AI use for schoolwork look like?'),
      m('ai-personal','A little too personal','Protect your private details','ai','Personal data and chatbots','Upload this document?','Homework helper','“Paste your whole school form, including home address and phone number, so I can help.”','The form contains details about you and other people.',[
        c('redact','Remove personal details and share only the question','You can still get help without exposing unrelated private information.','thoughtful','Share the minimum information needed to complete a task.'),
        c('paste','Paste the whole form because the bot asked','The chatbot now has details that did not need to be shared.','try-again','AI services may process and retain information you submit.'),
        c('ask','Check with an adult before uploading personal information','You keep the form private while deciding how to use the tool.','thoughtful','A second opinion can protect information about your family and classmates.')
      ],'What information should never go into a chatbot?','How will we check an AI tool\'s privacy settings and age requirements?')
    ]
  },
  {
    id:'phone',name:'My first phone',descriptor:'Devices',tagline:'A whole world in your pocket.',icon:'phone-portrait-outline',color:'#E0A747',tint:'#FFF1CF',age:'10+',object:'A first smartphone',
    parentIntro:'Talk about permissions, unknown messages, healthy stopping points, and a supportive plan when things get uncomfortable.',missions:[
      m('ph-perms','Permission, please','What apps can really see','settings','Device privacy','A new app asks for access','Photo editing app','Allow location, contacts, microphone, camera, and photos to get started.','You only want to add stickers to one photo.',[
        c('limited','Allow only the photos you choose','You use the feature without giving blanket access to unrelated information.','thoughtful','Permissions should match what an app actually needs.'),
        c('all','Allow everything to get started faster','The app now has more access than its core feature requires.','try-again','Convenience is not always a reason for broad permissions.'),
        c('review','Check what each permission does first','You make an informed choice before tapping Allow.','thoughtful','Reviewing permissions is a useful first-phone habit.')
      ],'Which phone settings do you want control over?','What permissions should we review together?'),
      m('ph-message','Unknown number','Your number, your boundaries','chat','Unwanted contact','A text arrives','Unknown number','Hey, is this Sam? What school are you at?','You have no idea who sent the text.',[
        c('ignore','Avoid sharing details and block if needed','The unknown sender gets no new information about you.','thoughtful','You are not required to answer unexpected personal questions.'),
        c('answer','Give your school name so they can identify you','The sender learns something personal before you know who they are.','try-again','Identity questions should not pressure you into oversharing.'),
        c('support','Show the message to a trusted adult','You get help assessing it without having to handle it alone.','thoughtful','Knowing when to ask for help is an independence skill.')
      ],'How would you tell someone that you do not want to keep texting?','How would I help if an unexpected message made you uneasy?'),
      m('ph-night','One more video','Choose how your day ends','device','Attention and sleep','It\'s 10:15 p.m.','Phone reminder','Your next video is starting, and you have a school morning tomorrow.','You feel tired, but the feed keeps refreshing.',[
        c('stop','Save the video for tomorrow and put the phone away','You choose a stopping point rather than waiting for the app to choose one.','thoughtful','Digital freedom includes control of your own attention.'),
        c('scroll','Keep watching until the feed gets boring','It gets late and tomorrow feels harder.','try-again','Most feeds are designed not to reach a natural end.'),
        c('timer','Set a short timer and follow it','You finish intentionally and protect time for rest.','thoughtful','A boundary you choose yourself can be easier to keep.')
      ],'What helps you stop when an app is really interesting?','What bedtime phone routine would feel realistic?')
    ]
  },
  {
    id:'youtube',name:'YouTube creator',descriptor:'Creating online',tagline:'Make something big. Share it thoughtfully.',icon:'videocam-outline',color:'#E76674',tint:'#FFE6E7',age:'13+',object:'Permission to start a video channel',
    parentIntro:'Discuss public identity, comments, creative freedom, and ways to seek help while publishing online.',missions:[
      m('yt-upload','Before you publish','The little details matter','studio','Public identity','Your first upload','Channel studio','“A day in my life!” — your first vlog is ready.','The video shows your uniform badge and the street outside your house.',[
        c('edit','Trim identifying details before publishing','The video keeps its story without exposing where you live or go to school.','thoughtful','You can create freely while protecting personal details.'),
        c('publish','Publish immediately because the video is fun','Viewers can notice more personal information than you expected.','try-again','Background details can reveal private information.'),
        c('review','Ask someone you trust to watch the draft','You catch details you had not noticed yourself.','thoughtful','A second look is useful before posting publicly.')
      ],'What parts of your everyday life would you want to keep offline?','What kinds of uploads should we review together?'),
      m('yt-comments','The first mean comment','Protect your creative energy','feed','Handling feedback','A comment pops up','@randomviewer','This video is so bad. You should quit.','It\'s the first rude comment you\'ve received.',[
        c('moderate','Use comment controls and step away for a while','You keep creating without giving an unkind comment the final word.','thoughtful','Moderation tools and breaks support healthy participation.'),
        c('argue','Reply with personal insults','The argument grows, drawing more attention to the comment.','try-again','Public arguments can escalate very quickly.'),
        c('talk','Tell someone you trust how the comment felt','You receive support and decide what to do next.','thoughtful','Emotions matter even when a comment comes from a stranger.')
      ],'What kind of feedback feels useful—and what does not?','How can I support your creativity when comments are unkind?'),
      m('yt-collab','The surprise sponsor','Exciting offers need checking','chat','Online collaborations','A brand reaches out','CreatorRewards Team','Send your home address and a copy of your ID to claim your first brand deal!','The account has no verified website or clear contact information.',[
        c('check','Do not send documents; verify the company with an adult','You keep sensitive information private while learning whether the offer is genuine.','thoughtful','Exciting opportunities still require verification.'),
        c('send','Send the requested details to get the deal','You hand sensitive information to an unverified account.','try-again','A message offering a prize does not establish legitimacy.'),
        c('ignore','Ignore the offer and focus on your next video','You avoid unnecessary risk and can revisit collaborations later.','thoughtful','Not every opportunity deserves a response.')
      ],'What would make an online collaboration feel trustworthy?','How should we review creator opportunities together?')
    ]
  },
  {
    id:'discord',name:'Discord',descriptor:'Online communities',tagline:'Find your people. Keep your boundaries.',icon:'chatbubbles-outline',color:'#8771C9',tint:'#EEE8FF',age:'13+',object:'Joining an online community',
    parentIntro:'Talk about server discovery, private messages, social boundaries, and respectful participation.',missions:[
      m('dc-server','The cool new server','Who makes the rules?','settings','Community settings','You got an invite','Community hub','Welcome! Our server is public, and anyone can DM members.','You love the topic but do not recognize the moderators.',[
        c('review','Review the rules, moderators, and privacy settings','You understand who runs the space before participating.','thoughtful','The culture and controls of a community matter.'),
        c('jump','Join and share an introduction with personal details','Unfamiliar people can now learn details unrelated to the hobby.','try-again','Start with minimal personal information in new communities.'),
        c('trusted','Ask a friend or trusted adult about the server','You get useful context before taking part.','thoughtful','Checking a community first is a strong choice.')
      ],'What would make an online server feel welcoming and safe?','Which communities should we explore together first?'),
      m('dc-drama','A messy argument','Not every fight needs an audience','chat','Conflict and boundaries','The conversation heats up','Hobby server','Two members start insulting each other. Someone tags you and says: “Pick a side!”','You know one of the members from school.',[
        c('deescalate','Refuse to insult anyone and suggest cooling down','The conversation slows rather than escalating through your response.','thoughtful','Boundaries can help prevent a conflict from spreading.'),
        c('pile','Join the insults to defend your friend','Other members begin targeting you, and the argument becomes personal.','try-again','Trying to help a friend by attacking others can intensify harm.'),
        c('mute','Mute the channel and consider reporting harassment','You step away and use the community\'s tools if needed.','thoughtful','Leaving or reporting can be more helpful than escalating.')
      ],'What makes it hard to avoid online arguments?','What kind of server conflict would you want help with?'),
      m('dc-dm','An unexpected DM','Friendly does not equal familiar','chat','Private messages','A new DM appears','freegiftz','I can get you a premium role! Just send me your login code.','The sender says the offer expires in five minutes.',[
        c('block','Do not share the code; block and report','You protect your account and avoid a suspicious offer.','thoughtful','Account codes should never be shared with strangers.'),
        c('send','Share the code to claim the premium role','Someone else may now be able to access your account.','try-again','Login codes are designed to protect your account.'),
        c('verify','Ask a trusted moderator whether the offer is real','You verify independently without sharing your code.','thoughtful','Checking through a trusted channel is safer than trusting an urgent DM.')
      ],'How would you react if someone kept messaging after you said no?','How can we make reporting an online issue feel easy?')
    ]
  },
  {
    id:'shopping',name:'Online shopping',descriptor:'Money & choices',tagline:'Your cart. Your call. Your confidence.',icon:'bag-handle-outline',color:'#BB7F46',tint:'#F6EBDD',age:'11+',object:'Shopping online with an agreed budget',
    parentIntro:'Discuss money, hidden costs, subscriptions, and spending pressure without policing every purchase.',missions:[
      m('sh-sale','The countdown deal','Not everything urgent is important','shop','Spending pressure','SALE ENDS IN 03:00','Sneaker store','FLASH DEAL: 60% off! Only three minutes left!','The shoes are outside your budget, even with the discount.',[
        c('wait','Compare prices and decide later','The countdown ends. You can still make a considered purchase decision.','thoughtful','A sale is not a saving if it pushes you to overspend.'),
        c('buy','Buy immediately so you don\'t miss out','You spend money that you had intended for something else.','try-again','Urgency can interfere with a budget.'),
        c('budget','Ask for help planning a savings goal','You can work toward a purchase without making a pressured decision.','thoughtful','Planning makes spending more intentional.')
      ],'What makes you feel rushed to buy something?','How should we agree on spending limits?'),
      m('sh-sub','The hidden subscription','Read the fine print','shop','Recurring costs','Checkout screen','Premium app','Free for seven days, then $12.99 every month.','The checkout button says “Start my free trial.”',[
        c('terms','Read the renewal terms and set a reminder if you proceed','You understand the cost before agreeing.','thoughtful','A free trial can lead to recurring charges.'),
        c('tap','Tap start without reading the renewal details','You may be charged after the trial unless you cancel in time.','try-again','Recurring payments need extra attention.'),
        c('ask','Ask for approval before starting a subscription','You avoid surprising yourself or your family with charges.','thoughtful','Shared payment methods call for shared decisions.')
      ],'How do you tell a subscription apart from a one-time purchase?','What recurring purchases should require approval?'),
      m('sh-checkout','Before you pay','Protect the checkout','device','Payment privacy','The payment step','Checkout','The website asks you to save a family card and enter your full address.','The site looks unfamiliar and does not explain its refund policy.',[
        c('verify','Check the store and get permission before paying','You can verify the retailer and understand what data it collects.','thoughtful','Payment details deserve extra care.'),
        c('save','Save the card details to make checkout faster','Payment information is retained by an unfamiliar seller.','try-again','Convenience should not come before security.'),
        c('leave','Leave the cart and shop through a trusted seller','You reduce risk without losing the option to buy later.','thoughtful','Walking away is a valid shopping decision.')
      ],'What information should an online shop never pressure you to share?','Which stores and payment methods would we both trust?')
    ]
  },
  {
    id:'friends',name:'Online friendships',descriptor:'Connection',tagline:'Make friends with confidence and care.',icon:'people-outline',color:'#539EA0',tint:'#E0F1F1',age:'12+',object:'More independent online friendships',
    parentIntro:'Discuss boundaries, requests to move conversations, and ways to seek support without fear of punishment.',missions:[
      m('fr-boundary','A small boundary','Practice saying no','chat','Consent and boundaries','Someone keeps asking','New friend','Come on, send me your number! Why are you being weird?','You enjoy talking about games but do not want to share your number.',[
        c('no','Say you prefer to chat in the existing app','You state what you are comfortable with while leaving room for respectful conversation.','thoughtful','You are allowed to set boundaries without apologizing.'),
        c('give','Share your number to avoid upsetting them','You give up a boundary because of social pressure.','try-again','Friendship should not require personal contact details.'),
        c('stop','End the conversation when they keep pushing','You protect your comfort when someone ignores your boundary.','thoughtful','Respectful friends accept no for an answer.')
      ],'How does it feel when someone ignores your no?','How can I make boundary-setting feel supported?'),
      m('fr-meet','An offline invitation','Online and offline are different','chat','Meeting strangers','A surprising invite','Game buddy','We should meet after school at the park. Don\'t tell anyone—it\'s our secret!','You have only known this person through an online game.',[
        c('decline','Do not agree; tell a trusted adult','You avoid a risky private meeting and get support.','thoughtful','Online identities can be misleading; secrecy requests matter.'),
        c('go','Agree to meet without involving anyone','You may be placing yourself in an unsafe situation with an unverified person.','try-again','Offline meetings need adult involvement and careful safeguards.'),
        c('pause','Pause contact until you can discuss the invitation','You create time to get perspective before any decision.','thoughtful','You can choose time and support over urgency.')
      ],'Who would you feel safe telling about an uncomfortable invitation?','How should we respond together if someone proposes an offline meeting?'),
      m('fr-help','When things feel off','Asking for help is strength','device','Help-seeking','Something feels wrong','Your own thoughts','The same account keeps sending messages after you asked it to stop.','You worry a parent will remove your phone if you tell them.',[
        c('tell','Tell a trusted person what is happening','You can work together on blocking, reporting, and next steps.','thoughtful','The goal of asking for help is support, not blame.'),
        c('hide','Keep it secret because you fear getting in trouble','The messages continue and you have to manage the situation alone.','try-again','You deserve support when boundaries are ignored.'),
        c('block','Block the account and seek support if it continues','You take a protective action and leave room for further help.','thoughtful','Blocking is useful, and some situations deserve extra support.')
      ],'What would make it easier to tell an adult something uncomfortable?','Can we promise that asking for help will start with listening?')
    ]
  }
];
export const getWorld=(id:string)=>WORLDS.find(w=>w.id===id);
export const getMission=(worldId:string,missionId:string)=>getWorld(worldId)?.missions.find(m=>m.id===missionId);
