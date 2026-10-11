import React, { useEffect, useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { supabase, hasSupabaseConfig } from './lib/supabase';

const C = { ink:'#F6F8FF', muted:'#A4ADC2', purple:'#9C83FF', pale:'#17182A', bg:'#080B16', white:'#FFFFFF', surface:'#12182A', line:'#252F46', green:'#68E5BE', cyan:'#62DFFF', red:'#FF7D9B' };
const STORE_REQUESTS = 'helpora.preview.requests.v1';
const STORE_POSTS = 'helpora.preview.posts.v1';
const categories = ['Günlük destek','Eşya','Ulaşım','Dil desteği','Diğer'];
const tabs = [{id:'home',label:'Ana sayfa',icon:'⌂'},{id:'requests',label:'Yardım',icon:'♡'},{id:'community',label:'Topluluk',icon:'◎'},{id:'profile',label:'Profil',icon:'◯'}];

function Button({title,onPress,secondary=false,disabled=false}) {
  return <Pressable disabled={disabled} onPress={onPress} style={[styles.button,secondary&&styles.buttonSecondary,disabled&&{opacity:.55}]}><Text style={[styles.buttonText,secondary&&styles.buttonSecondaryText]}>{title}</Text></Pressable>;
}
function Brand({large=false}) {
  return <View style={styles.brandRow}><Image source={require('./assets/icon.png')} style={large?styles.logoLarge:styles.logo}/><View><Text style={styles.brand}>HELPORA</Text><Text style={styles.tagline}>Birlikte daha güçlüyüz.</Text></View></View>;
}
function Home({onCreate,onRequests,demo}) {
  return <ScrollView contentContainerStyle={styles.page}>
    <View style={styles.hero}><Brand/><Text style={styles.eyebrow}>YAN YANA DAHA GÜÇLÜ</Text><Text style={styles.heroTitle}>İyilik, bir adımla başlar.</Text><Text style={styles.body}>İhtiyacını paylaş, yakınındaki dayanışmanın parçası ol.</Text><View style={styles.gap}/><Button title="Yardım iste  →" onPress={onCreate}/><Button title="Yardım ilanlarını keşfet" secondary onPress={onRequests}/></View>
    {demo&&<View style={styles.notice}><Text style={styles.noticeTitle}>Önizleme hesabı</Text><Text style={styles.body}>Burada oluşturduğun içerikler yalnızca bu cihazda saklanır. Çevrimiçi paylaşım için sunucu ayarı gerekir.</Text></View>}
    <Text style={styles.sectionTitle}>Helpora ile</Text>
    <View style={styles.feature}><Text style={styles.featureIcon}>🤝</Text><View style={styles.flex}><Text style={styles.featureTitle}>Destek iste</Text><Text style={styles.body}>İhtiyacını güvenli bir toplulukla paylaş.</Text></View></View>
    <View style={styles.feature}><Text style={styles.featureIcon}>💜</Text><View style={styles.flex}><Text style={styles.featureTitle}>Destek ol</Text><Text style={styles.body}>Yardım edebileceğin bir ilanı bul.</Text></View></View>
    <View style={styles.feature}><Text style={styles.featureIcon}>🌍</Text><View style={styles.flex}><Text style={styles.featureTitle}>Bağ kur</Text><Text style={styles.body}>Dayanışma, küçük adımlarla büyür.</Text></View></View>
  </ScrollView>;
}
function Requests({items,onCreate,loading,onRefresh}) {
  return <ScrollView contentContainerStyle={styles.page}>
    <Text style={styles.pageTitle}>Yardım ilanları</Text><Text style={styles.body}>Topluluğun paylaştığı destek ihtiyaçları.</Text>
    {loading&&<Text style={styles.helper}>İlanlar yükleniyor…</Text>}
    {!loading&&items.length===0?<View style={styles.empty}><Text style={styles.emptyIcon}>🌱</Text><Text style={styles.featureTitle}>İlk adım senden</Text><Text style={[styles.body,styles.center]}>Henüz ilan yok. İhtiyacını paylaşarak başlayabilirsin.</Text><Button title="İlan oluştur" onPress={onCreate}/></View>:items.map(x=><View key={x.id} style={styles.card}><Text style={styles.category}>{x.category}</Text><Text style={styles.featureTitle}>{x.title}</Text>{!!x.description&&<Text style={styles.body}>{x.description}</Text>}<Text style={styles.helper}>{x.city?x.city+' · ':''}{new Date(x.created_at||Date.now()).toLocaleDateString('tr-TR')}</Text></View>)}
    <Button title="+  Yardım ilanı oluştur" onPress={onCreate}/>
    {!!onRefresh&&<Pressable onPress={onRefresh}><Text style={styles.link}>Yenile</Text></Pressable>}
  </ScrollView>;
}
function Community({posts,onPost,loading}) {
  const [draft,setDraft]=useState('');
  return <ScrollView contentContainerStyle={styles.page}><Text style={styles.pageTitle}>Topluluk</Text><Text style={styles.body}>Bir teşekkür, küçük bir haber ya da dayanışma çağrısı paylaş.</Text>
    <View style={styles.card}><TextInput value={draft} onChangeText={setDraft} placeholder="Topluluğa ne söylemek istersin?" placeholderTextColor={C.muted} style={[styles.input,styles.multiline]} multiline maxLength={1000}/><Text style={styles.helper}>{draft.length}/1000</Text><Button title="Paylaş" disabled={!draft.trim()} onPress={()=>{onPost(draft.trim());setDraft('')}}/></View>
    {loading&&<Text style={styles.helper}>Paylaşımlar yükleniyor…</Text>}
    {posts.length===0?<View style={styles.empty}><Text style={styles.emptyIcon}>💬</Text><Text style={styles.featureTitle}>İlk paylaşımını sen yap</Text><Text style={[styles.body,styles.center]}>Topluluk alanında henüz paylaşım yok.</Text></View>:posts.map(p=><View key={p.id} style={styles.card}><Text style={styles.featureTitle}>{p.author||'Helpora üyesi'}</Text><Text style={styles.body}>{p.content}</Text><Text style={styles.helper}>{new Date(p.created_at||Date.now()).toLocaleDateString('tr-TR')}</Text></View>)}
  </ScrollView>;
}
function CreateRequest({onCancel,onSave,busy}) {
  const [title,setTitle]=useState(''),[description,setDescription]=useState(''),[city,setCity]=useState(''),[category,setCategory]=useState(categories[0]);
  return <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS==='ios'?'padding':undefined}><ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
    <Pressable onPress={onCancel}><Text style={styles.link}>‹  Geri</Text></Pressable><Text style={styles.pageTitle}>Yardım iste</Text><Text style={styles.body}>İhtiyacını kısa, açık ve güvenli biçimde anlat.</Text>
    <Text style={styles.label}>Kategori</Text><View style={styles.chips}>{categories.map(c=><Pressable key={c} onPress={()=>setCategory(c)} style={[styles.chip,category===c&&styles.chipOn]}><Text style={[styles.chipText,category===c&&{color:C.purple}]}>{c}</Text></Pressable>)}</View>
    <Text style={styles.label}>Başlık</Text><TextInput value={title} onChangeText={setTitle} placeholder="Örn. Taşınma için destek arıyorum" placeholderTextColor={C.muted} style={styles.input} maxLength={80}/>
    <Text style={styles.label}>Açıklama</Text><TextInput value={description} onChangeText={setDescription} placeholder="Ne tür bir desteğe ihtiyacın var?" placeholderTextColor={C.muted} style={[styles.input,styles.multiline]} multiline textAlignVertical="top" maxLength={1000}/>
    <Text style={styles.label}>Şehir (isteğe bağlı)</Text><TextInput value={city} onChangeText={setCity} placeholder="Örn. Berlin" placeholderTextColor={C.muted} style={styles.input} maxLength={80}/>
    <Text style={styles.helper}>Adres, telefon veya hassas kişisel bilgilerini ilanda paylaşma.</Text><Button title={busy?'Kaydediliyor…':'İlanı paylaş'} disabled={busy||title.trim().length<3} onPress={()=>onSave({title:title.trim(),description:description.trim(),category,city:city.trim()})}/>
  </ScrollView></KeyboardAvoidingView>;
}
function Profile({user,onLogout,demo,onSetting}) {
  const name=user?.user_metadata?.display_name||user?.email?.split('@')[0]||'Helpora üyesi';
  return <ScrollView contentContainerStyle={styles.page}><Text style={styles.pageTitle}>Profil</Text><View style={styles.profile}><View style={styles.avatar}><Text style={styles.avatarText}>{name.slice(0,1).toUpperCase()}</Text></View><Text style={styles.featureTitle}>{name}</Text><Text style={styles.body}>{user?.email||'Cihaz içi önizleme'}</Text><Text style={styles.helper}>{demo?'Önizleme hesabı · içerikler bu cihazda':'Helpora hesabı'}</Text></View>
    <Text style={styles.sectionTitle}>Hesap ve uygulama</Text><View style={styles.menu}>
      <Pressable onPress={()=>onSetting('language')} style={styles.menuRow}><Text style={styles.menuText}>🌐   Dil ve bölge</Text><Text style={styles.chevron}>›</Text></Pressable>
      <Pressable onPress={()=>onSetting('notifications')} style={styles.menuRow}><Text style={styles.menuText}>🔔   Bildirim tercihleri</Text><Text style={styles.chevron}>›</Text></Pressable>
      <Pressable onPress={()=>onSetting('privacy')} style={styles.menuRow}><Text style={styles.menuText}>🛡️   Güvenlik ve gizlilik</Text><Text style={styles.chevron}>›</Text></Pressable>
      <Pressable onPress={()=>onSetting('help')} style={[styles.menuRow,{borderBottomWidth:0}]}><Text style={styles.menuText}>❓   Yardım merkezi</Text><Text style={styles.chevron}>›</Text></Pressable>
    </View><Button title={demo?'Önizlemeden çık':'Çıkış yap'} secondary onPress={onLogout}/></ScrollView>;
}
function Auth({onComplete,configured}) {
  const [mode,setMode]=useState('welcome'),[name,setName]=useState(''),[email,setEmail]=useState(''),[password,setPassword]=useState(''),[error,setError]=useState(''),[message,setMessage]=useState(''),[busy,setBusy]=useState(false);
  async function submit(){
    setError('');setMessage('');
    if(!configured||!supabase)return setError('Gerçek hesap bağlantısı için sunucu ayarı gerekiyor.');
    if(mode==='register'&&name.trim().length<2)return setError('Adını en az 2 harfle yaz.');
    if(!email.includes('@'))return setError('Geçerli bir e-posta adresi yaz.');
    if(mode!=='forgot'&&password.length<8)return setError('Şifre en az 8 karakter olmalı.');
    setBusy(true);
    try {
      let r;
      if(mode==='login')r=await supabase.auth.signInWithPassword({email:email.trim(),password});
      else if(mode==='register')r=await supabase.auth.signUp({email:email.trim(),password,options:{data:{display_name:name.trim()}}});
      else r=await supabase.auth.resetPasswordForEmail(email.trim());
      if(r.error)setError(r.error.message);
      else if(mode==='forgot')setMessage('Şifre yenileme bağlantısı e-posta adresine gönderildi.');
      else if(r.data?.session&&r.data?.user)onComplete(r.data.user);
      else setMessage('Hesap oluşturuldu. Giriş yapmadan önce e-postanı doğrula.');
    } catch {setError('Bağlantı kurulamadı. İnternetini ve sunucu ayarlarını kontrol et.');}
    finally{setBusy(false);}
  }
  return <KeyboardAvoidingView style={styles.auth} behavior={Platform.OS==='ios'?'padding':undefined}><ScrollView contentContainerStyle={styles.authPage} keyboardShouldPersistTaps="handled">
    <Brand large/>
    {mode==='welcome'?<><Text style={styles.authTitle}>İyilik, yan yana başlayınca büyür.</Text><Text style={[styles.body,styles.center]}>Yakınındaki insanlarla dayanışma kur.</Text><Button title="Giriş yap" onPress={()=>setMode('login')}/><Button title="Ücretsiz hesap oluştur" secondary onPress={()=>setMode('register')}/>{!configured&&<><Text style={styles.authNote}>Sunucu ayarı yapılana kadar uygulamayı cihaz içi önizleme hesabıyla deneyebilirsin.</Text><Button title="Önizlemeyi aç" secondary onPress={()=>onComplete({id:'preview',email:'',user_metadata:{display_name:'Önizleme üyesi'},isDemo:true})}/></>}</>:<>
      <Pressable onPress={()=>{setMode('welcome');setError('');setMessage('')}}><Text style={styles.link}>‹  Geri</Text></Pressable><Text style={styles.authTitle}>{mode==='login'?'Tekrar hoş geldin':mode==='register'?'Aramıza katıl':'Şifremi yenile'}</Text>
      {mode==='register'&&<TextInput value={name} onChangeText={setName} placeholder="Adın" placeholderTextColor={C.muted} style={styles.input} autoCapitalize="words"/>}
      <TextInput value={email} onChangeText={setEmail} placeholder="E-posta" placeholderTextColor={C.muted} style={styles.input} keyboardType="email-address" autoCapitalize="none" autoComplete="email"/>
      {mode!=='forgot'&&<TextInput value={password} onChangeText={setPassword} placeholder="Şifre (en az 8 karakter)" placeholderTextColor={C.muted} style={styles.input} secureTextEntry autoCapitalize="none"/>}
      {!!error&&<Text style={styles.error}>{error}</Text>}{!!message&&<Text style={styles.success}>{message}</Text>}
      <Button title={busy?'Bekle…':mode==='login'?'Giriş yap':mode==='register'?'Hesap oluştur':'Bağlantı gönder'} disabled={busy} onPress={submit}/>
      {mode==='login'&&<Pressable onPress={()=>setMode('forgot')}><Text style={styles.link}>Şifremi unuttum</Text></Pressable>}
      <Text style={styles.authNote}>{configured?'Hesabın Supabase Auth ile korunur.':'Gerçek hesap açma, sunucu anahtarı eklenince kullanılabilir.'}</Text>
    </>}
  </ScrollView></KeyboardAvoidingView>;
}

export default function App(){
  const [user,setUser]=useState(null),[authReady,setAuthReady]=useState(false),[tab,setTab]=useState('home'),[creating,setCreating]=useState(false);
  const [requests,setRequests]=useState([]),[posts,setPosts]=useState([]),[busy,setBusy]=useState(false),[loading,setLoading]=useState(false);
  useEffect(()=>{
    let active=true;
    if(!hasSupabaseConfig||!supabase){setAuthReady(true);return()=>{active=false};}
    supabase.auth.getSession().then(({data})=>{if(active){setUser(data.session?.user||null);setAuthReady(true)}}).catch(()=>{if(active)setAuthReady(true)});
    const {data:{subscription}}=supabase.auth.onAuthStateChange((_event,session)=>setUser(session?.user||null));
    return()=>{active=false;subscription.unsubscribe()};
  },[]);
  useEffect(()=>{
    let active=true;
    async function load(){
      if(!user){setRequests([]);setPosts([]);return}
      setLoading(true);
      try{
        if(user.isDemo){
          const [r,p]=await Promise.all([AsyncStorage.getItem(STORE_REQUESTS),AsyncStorage.getItem(STORE_POSTS)]);
          if(active){setRequests(r?JSON.parse(r):[]);setPosts(p?JSON.parse(p):[]);}
        }else if(supabase){
          const [r,p]=await Promise.all([supabase.from('help_requests').select('*').eq('status','open').order('created_at',{ascending:false}),supabase.from('community_posts').select('*').order('created_at',{ascending:false})]);
          if(r.error)throw r.error;if(p.error)throw p.error;
          if(active){setRequests(r.data||[]);setPosts((p.data||[]).map(x=>({...x,author:x.user_id===user.id?(user.user_metadata?.display_name||'Sen'):'Helpora üyesi'})));}
        }
      }catch(e){Alert.alert('İçerikler yüklenemedi',e.message||'Bağlantını kontrol edip yeniden dene.')}
      finally{if(active){setLoading(false)}}
    }
    load();return()=>{active=false};
  },[user]);
  async function saveRequest(item){
    setBusy(true);
    try{
      if(user.isDemo){const next=[{...item,id:String(Date.now()),created_at:new Date().toISOString()},...requests];await AsyncStorage.setItem(STORE_REQUESTS,JSON.stringify(next));setRequests(next);}
      else{const {data,error}=await supabase.from('help_requests').insert({...item,user_id:user.id}).select().single();if(error)throw error;setRequests([data,...requests]);}
      setCreating(false);setTab('requests');
    }catch(e){Alert.alert('İlan kaydedilemedi',e.message||'Biraz sonra yeniden dene.')}
    finally{setBusy(false)}
  }
  async function savePost(content){
    try{
      if(user.isDemo){const next=[{id:String(Date.now()),content,created_at:new Date().toISOString(),author:'Önizleme üyesi'},...posts];await AsyncStorage.setItem(STORE_POSTS,JSON.stringify(next));setPosts(next);}
      else{const {data,error}=await supabase.from('community_posts').insert({content,user_id:user.id}).select().single();if(error)throw error;setPosts([{...data,author:'Sen'},...posts]);}
    }catch(e){Alert.alert('Paylaşım gönderilemedi',e.message||'Biraz sonra yeniden dene.')}
  }
  async function logout(){
    if(user?.isDemo){setUser(null);setTab('home');return}
    const {error}=await supabase.auth.signOut();if(error)Alert.alert('Çıkış yapılamadı',error.message);else{setUser(null);setTab('home')}
  }
  function setting(key){
    const info={
      language:['Dil ve bölge','Uygulama dili: Türkçe. Çoklu dil desteği sonraki sürümde açılacak.'],
      notifications:['Bildirim tercihleri','Bildirimler henüz etkin değil. Yeni sürümde tercihlerini buradan yönetebilirsin.'],
      privacy:['Güvenlik ve gizlilik','İlanlarda açık adres, telefon veya finansal bilgi paylaşma. Hesap verilerin Supabase oturumuyla korunur.'],
      help:['Yardım merkezi','Helpora destek: uygulama yöneticinle iletişime geç. Acil durumlarda yerel acil yardım hattını ara.']
    }[key];
    Alert.alert(info[0],info[1]);
  }
  if(!authReady)return <SafeAreaView style={styles.safe}><StatusBar style="light"/><View style={styles.loading}><Text style={styles.body}>Helpora açılıyor…</Text></View></SafeAreaView>;
  if(!user)return <SafeAreaView style={styles.safe}><StatusBar style="light"/><Auth onComplete={setUser} configured={hasSupabaseConfig}/></SafeAreaView>;
  let screen;
  if(creating)screen=<CreateRequest onCancel={()=>setCreating(false)} onSave={saveRequest} busy={busy}/>;
  else if(tab==='home')screen=<Home demo={!!user.isDemo} onCreate={()=>setCreating(true)} onRequests={()=>setTab('requests')}/>;
  else if(tab==='requests')screen=<Requests items={requests} loading={loading} onRefresh={()=>setTab('home')} onCreate={()=>setCreating(true)}/>;
  else if(tab==='community')screen=<Community posts={posts} loading={loading} onPost={savePost}/>;
  else screen=<Profile user={user} demo={!!user.isDemo} onLogout={logout} onSetting={setting}/>;
  return <SafeAreaView style={styles.safe}><StatusBar style="light"/><View style={styles.flex}>{screen}</View>{!creating&&<View style={styles.tabBar}>{tabs.map(t=><Pressable key={t.id} onPress={()=>setTab(t.id)} style={styles.tab}><Text style={[styles.tabIcon,tab===t.id&&styles.active]}>{t.icon}</Text><Text style={[styles.tabLabel,tab===t.id&&styles.active]}>{t.label}</Text></Pressable>)}</View>}</SafeAreaView>;
}

const styles=StyleSheet.create({
  safe:{flex:1,backgroundColor:C.bg},auth:{flex:1,backgroundColor:C.bg},authPage:{flexGrow:1,justifyContent:'center',padding:25,paddingTop:42,paddingBottom:34,gap:14},
  logo:{width:50,height:50,borderRadius:15},logoLarge:{width:78,height:78,borderRadius:23},brandRow:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:12,marginBottom:14},brand:{color:C.ink,fontSize:18,fontWeight:'900',letterSpacing:2},tagline:{color:C.cyan,fontSize:12,marginTop:3},
  authTitle:{color:C.ink,fontSize:28,lineHeight:35,fontWeight:'800',textAlign:'center',marginTop:12},authNote:{color:C.muted,fontSize:12,lineHeight:18,textAlign:'center',marginTop:5},
  page:{padding:21,paddingBottom:30,gap:15},hero:{padding:21,borderRadius:25,backgroundColor:C.pale,borderWidth:1,borderColor:'#2A2B48',gap:11},eyebrow:{color:C.cyan,fontSize:10,fontWeight:'800',letterSpacing:1.5,marginTop:7},heroTitle:{color:C.ink,fontSize:32,lineHeight:37,fontWeight:'800',letterSpacing:-.6},body:{color:C.muted,fontSize:14,lineHeight:21},gap:{height:3},
  button:{minHeight:49,borderRadius:15,backgroundColor:C.purple,alignItems:'center',justifyContent:'center',paddingHorizontal:16,marginTop:3},buttonText:{color:C.white,fontSize:15,fontWeight:'700'},buttonSecondary:{backgroundColor:C.surface,borderWidth:1,borderColor:C.line},buttonSecondaryText:{color:C.ink},
  notice:{padding:15,borderRadius:16,backgroundColor:'#10251F',borderWidth:1,borderColor:'#21483D',gap:5},noticeTitle:{color:C.green,fontSize:14,fontWeight:'800'},sectionTitle:{color:C.ink,fontSize:18,fontWeight:'800',marginTop:3},
  feature:{backgroundColor:C.surface,borderWidth:1,borderColor:C.line,borderRadius:17,padding:15,flexDirection:'row',alignItems:'center',gap:13},featureIcon:{fontSize:24},featureTitle:{color:C.ink,fontSize:15,fontWeight:'800'},flex:{flex:1},
  pageTitle:{color:C.ink,fontSize:28,lineHeight:34,fontWeight:'800',marginTop:5},card:{backgroundColor:C.surface,borderWidth:1,borderColor:C.line,borderRadius:18,padding:16,gap:10},category:{color:C.purple,fontSize:12,fontWeight:'800'},helper:{color:C.muted,fontSize:11,lineHeight:16},empty:{alignItems:'center',backgroundColor:C.surface,borderWidth:1,borderColor:C.line,borderRadius:20,padding:23,gap:11,marginTop:15},emptyIcon:{fontSize:34},center:{textAlign:'center'},
  input:{borderWidth:1,borderColor:C.line,borderRadius:13,backgroundColor:C.surface,padding:14,color:C.ink,fontSize:15},multiline:{minHeight:105,textAlignVertical:'top'},label:{color:C.ink,fontWeight:'700',marginTop:2},chips:{flexDirection:'row',flexWrap:'wrap',gap:8},chip:{borderWidth:1,borderColor:C.line,borderRadius:22,paddingVertical:9,paddingHorizontal:12,backgroundColor:C.surface},chipOn:{borderColor:C.purple,backgroundColor:C.pale},chipText:{color:C.muted,fontSize:12,fontWeight:'600'},
  link:{color:C.purple,fontSize:15,fontWeight:'700',paddingVertical:6},error:{color:C.red,fontSize:13,fontWeight:'600'},success:{color:C.green,fontSize:13,fontWeight:'600'},profile:{backgroundColor:C.surface,borderWidth:1,borderColor:C.line,borderRadius:20,padding:22,alignItems:'center',gap:9},avatar:{width:68,height:68,borderRadius:23,backgroundColor:C.pale,alignItems:'center',justifyContent:'center'},avatarText:{color:C.cyan,fontSize:29,fontWeight:'800'},
  menu:{backgroundColor:C.surface,borderWidth:1,borderColor:C.line,borderRadius:17,paddingHorizontal:15},menuRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingVertical:16,borderBottomWidth:1,borderBottomColor:C.line},menuText:{color:C.ink,fontSize:14},chevron:{color:C.muted,fontSize:22},
  tabBar:{flexDirection:'row',backgroundColor:C.surface,borderTopWidth:1,borderTopColor:C.line,paddingTop:9,paddingBottom:Platform.OS==='ios'?8:10},tab:{flex:1,alignItems:'center',gap:3},tabIcon:{color:C.muted,fontSize:20},tabLabel:{color:C.muted,fontSize:10,fontWeight:'600'},active:{color:C.purple},loading:{flex:1,alignItems:'center',justifyContent:'center'}
});
