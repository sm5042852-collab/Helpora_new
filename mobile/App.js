import React, { useEffect, useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { supabase, hasSupabaseConfig } from './lib/supabase';

const C = {
  ink: '#F6F8FF', muted: '#A4ADC2', purple: '#9C83FF', pale: '#17182A',
  bg: '#080B16', white: '#FFFFFF', surface: '#12182A', line: '#252F46',
  green: '#68E5BE', cyan: '#62DFFF',
};

const categories = ['Günlük destek', 'Eşya', 'Ulaşım', 'Dil desteği', 'Diğer'];
const initialRequests = [];

function ActionButton({ title, onPress, secondary = false }) {
  return (
    <Pressable onPress={onPress} style={[styles.actionButton, secondary && styles.secondaryButton]}>
      <Text style={[styles.actionText, secondary && styles.secondaryText]}>{title}</Text>
    </Pressable>
  );
}

function Home({ onCreate, onRequests }) {
  return (
    <ScrollView contentContainerStyle={styles.page}>
      <View style={styles.hero}>
        <View style={styles.brandRow}>
          <Image source={require('./assets/icon.png')} style={styles.brandLogo} />
          <View>
            <Text style={styles.brandName}>HELPORA</Text>
            <Text style={styles.brandTagline}>Birlikte daha güçlüyüz.</Text>
          </View>
        </View>
        <Text style={styles.eyebrow}>HELPORA · YAN YANA</Text>
        <Text style={styles.heroTitle}>İyilik, bir adımla başlar.</Text>
        <Text style={styles.heroBody}>Yardım iste, destek ol, bulunduğun yerde bağ kur.</Text>
        <View style={styles.heroActions}>
          <ActionButton title="Yardım iste" onPress={onCreate} />
          <ActionButton title="İlanlara bak" onPress={onRequests} secondary />
        </View>
      </View>

      <Text style={styles.sectionTitle}>Helpora’da neler yapabilirsin?</Text>
      <View style={styles.featureCard}>
        <Text style={styles.featureIcon}>🤝</Text>
        <View style={styles.featureCopy}>
          <Text style={styles.featureTitle}>Destek iste</Text>
          <Text style={styles.body}>İhtiyacını açıklayıp bir yardım ilanı oluştur.</Text>
        </View>
      </View>
      <View style={styles.featureCard}>
        <Text style={styles.featureIcon}>💜</Text>
        <View style={styles.featureCopy}>
          <Text style={styles.featureTitle}>Birine destek ol</Text>
          <Text style={styles.body}>Yardım ilanlarını incele ve katkı sun.</Text>
        </View>
      </View>
      <View style={styles.notice}>
        <Text style={styles.noticeTitle}>İlk test sürümü</Text>
        <Text style={styles.body}>Bu sürüm cihazında çalışacak arayüz prototipidir. Gerçek hesaplar ve çevrimiçi ilanlar sonraki aşamada bağlanacak.</Text>
      </View>
    </ScrollView>
  );
}

function Requests({ requests, onCreate }) {
  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Text style={styles.pageTitle}>Yardım ilanları</Text>
      <Text style={styles.body}>Topluluk desteği için oluşturulan ilanlar burada görünür.</Text>
      {requests.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🌱</Text>
          <Text style={styles.featureTitle}>Henüz ilan yok</Text>
          <Text style={[styles.body, styles.center]}>İlk ilanı sen oluşturabilirsin. Şimdilik oluşturduğun ilanlar bu cihazda saklanır.</Text>
          <ActionButton title="İlan oluştur" onPress={onCreate} />
        </View>
      ) : requests.map((item) => (
        <View key={item.id} style={styles.requestCard}>
          <Text style={styles.categoryTag}>{item.category}</Text>
          <Text style={styles.featureTitle}>{item.title}</Text>
          {!!item.description && <Text style={styles.body}>{item.description}</Text>}
          <Text style={styles.localTag}>Bu cihazdaki deneme ilanı</Text>
        </View>
      ))}
    </ScrollView>
  );
}

function Community() {
  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Text style={styles.pageTitle}>Topluluk</Text>
      <View style={styles.empty}>
        <Text style={styles.emptyIcon}>💬</Text>
        <Text style={styles.featureTitle}>Topluluk alanı hazırlanıyor</Text>
        <Text style={[styles.body, styles.center]}>Paylaşımlar henüz sunucuya bağlı değil. Bu ekranda şu an gerçek gönderi gösterilmiyor.</Text>
      </View>
    </ScrollView>
  );
}

function Profile({ user, onLogout }) {
  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Text style={styles.pageTitle}>Profil</Text>
      <View style={styles.profileCard}>
        <View style={styles.avatar}><Text style={styles.avatarText}>{(user?.user_metadata?.display_name || user?.email || 'H').slice(0, 1).toUpperCase()}</Text></View>
        <Text style={styles.featureTitle}>{user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'Helpora üyesi'}</Text>
        <Text style={styles.body}>{user?.email || ''}</Text>
        <Text style={styles.localTag}>Deneme oturumu · yalnızca bu cihazda</Text>
      </View>
      <View style={styles.menuCard}>
        <Text style={styles.menuRow}>🔔   Bildirim tercihleri</Text>
        <Text style={styles.menuRow}>🌐   Dil ve bölge</Text>
        <Text style={styles.menuRow}>🛡️   Güvenlik ve gizlilik</Text>
        <Text style={styles.menuRow}>❓   Yardım merkezi</Text>
      </View>
      <ActionButton title="Çıkış yap" onPress={onLogout} secondary />
    </ScrollView>
  );
}

function CreateRequest({ onCancel, onSave }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(categories[0]);

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.page}>
        <Pressable onPress={onCancel}><Text style={styles.back}>‹  Geri</Text></Pressable>
        <Text style={styles.pageTitle}>Yardım iste</Text>
        <Text style={styles.body}>İhtiyacını kısa ve açık şekilde anlat.</Text>
        <Text style={styles.label}>Kategori</Text>
        <View style={styles.chips}>
          {categories.map((item) => (
            <Pressable key={item} onPress={() => setCategory(item)} style={[styles.chip, category === item && styles.chipSelected]}>
              <Text style={[styles.chipText, category === item && styles.chipTextSelected]}>{item}</Text>
            </Pressable>
          ))}
        </View>
        <Text style={styles.label}>Başlık</Text>
        <TextInput value={title} onChangeText={setTitle} placeholder="Örn. Taşınma için destek arıyorum" style={styles.input} maxLength={80} />
        <Text style={styles.label}>Açıklama</Text>
        <TextInput value={description} onChangeText={setDescription} placeholder="Ne tür bir desteğe ihtiyacın var?" style={[styles.input, styles.multiline]} multiline textAlignVertical="top" maxLength={500} />
        <Text style={styles.helper}>Deneme sürümünde bu ilan yalnızca bu cihazda kalır.</Text>
        <ActionButton title="İlanı kaydet" onPress={() => title.trim() && onSave({ title: title.trim(), description: description.trim(), category })} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const tabs = [
  { id: 'home', label: 'Başlangıç', icon: '⌂' },
  { id: 'requests', label: 'Yardım', icon: '♡' },
  { id: 'community', label: 'Topluluk', icon: '◎' },
  { id: 'profile', label: 'Profil', icon: '◯' },
];

function AuthFlow({ onComplete, isConfigured }) {
  const [mode, setMode] = useState('welcome');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit() {
    setError('');
    setMessage('');
    if (!isConfigured || !supabase) return setError('Sunucu bağlantısı henüz kurulmadı.');
    if (mode === 'register' && name.trim().length < 2) return setError('Adını en az 2 harfle yaz.');
    if (!email.includes('@')) return setError('Geçerli bir e-posta adresi yaz.');
    if (password.length < 8) return setError('Şifre en az 8 karakter olmalı.');
    setBusy(true);
    try {
      const result = mode === 'login'
        ? await supabase.auth.signInWithPassword({ email: email.trim(), password })
        : await supabase.auth.signUp({ email: email.trim(), password, options: { data: { display_name: name.trim() } } });
      if (result.error) setError(result.error.message);
      else if (result.data.session && result.data.user) onComplete(result.data.user);
      else if (result.data.user) setMessage('Hesabın oluşturuldu. Giriş yapmadan önce e-postanı doğrula.');
    } catch {
      setError('Bağlantı kurulamadı. İnternetini ve Supabase ayarlarını kontrol et.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.authWrap} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.authPage} keyboardShouldPersistTaps="handled">
        <Image source={require('./assets/icon.png')} style={styles.authLogo} />
        <Text style={styles.authBrand}>HELPORA</Text>
        <Text style={styles.authTagline}>Birlikte daha güçlüyüz.</Text>
        {mode === 'welcome' ? (
          <>
            <Text style={styles.authTitle}>İyilik, yan yana başlayınca büyür.</Text>
            <Text style={[styles.body, styles.center]}>Yakınındaki insanlarla dayanışma kur.</Text>
            <ActionButton title="Giriş yap" onPress={() => setMode('login')} />
            <ActionButton title="Ücretsiz hesap oluştur" onPress={() => setMode('register')} secondary />
            <Text style={[styles.authFoot, styles.center]}>Önizleme sürümü · gerçek hesap bağlantısı henüz yok</Text>
          </>
        ) : (
          <>
            <Pressable onPress={() => { setMode('welcome'); setError(''); }}><Text style={styles.back}>‹  Geri</Text></Pressable>
            <Text style={styles.authTitle}>{mode === 'login' ? 'Tekrar hoş geldin' : 'Aramıza katıl'}</Text>
            <Text style={styles.body}>{mode === 'login' ? 'Giriş bilgilerini yaz.' : 'Yeni hesabını oluştur.'}</Text>
            {mode === 'register' && <TextInput value={name} onChangeText={setName} placeholder="Adın" placeholderTextColor={C.muted} style={styles.input} autoCapitalize="words" />}
            <TextInput value={email} onChangeText={setEmail} placeholder="E-posta" placeholderTextColor={C.muted} style={styles.input} keyboardType="email-address" autoCapitalize="none" autoComplete="email" />
            <TextInput value={password} onChangeText={setPassword} placeholder="Şifre" placeholderTextColor={C.muted} style={styles.input} secureTextEntry autoCapitalize="none" />
            {!!error && <Text style={styles.error}>{error}</Text>}{!!message && <Text style={styles.success}>{message}</Text>}
            <ActionButton title={busy ? 'Bekle…' : mode === 'login' ? 'Giriş yap' : 'Hesap oluştur'} onPress={busy ? undefined : submit} />
            <Text style={[styles.authFoot, styles.center]}>{isConfigured ? 'Şifren Supabase üzerinden güvenli biçimde doğrulanır.' : 'Gerçek hesap açmak için Supabase sunucu ayarları bekleniyor.'}</Text>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [tab, setTab] = useState('home');

  useEffect(() => {
    if (!hasSupabaseConfig || !supabase) { setAuthReady(true); return; }
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (active) { setUser(data.session?.user ?? null); setAuthReady(true); }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => { active = false; subscription.unsubscribe(); };
  }, []);
  const [creating, setCreating] = useState(false);
  const [requests, setRequests] = useState(initialRequests);

  function saveRequest(item) {
    setRequests((current) => [{ ...item, id: String(Date.now()) }, ...current]);
    setCreating(false);
    setTab('requests');
  }

  if (!authReady) return <SafeAreaView style={styles.safe}><StatusBar style="light" /><View style={styles.loading}><Text style={styles.body}>Helpora açılıyor…</Text></View></SafeAreaView>;
  if (!user) return <SafeAreaView style={styles.safe}><StatusBar style="light" /><AuthFlow onComplete={setUser} isConfigured={hasSupabaseConfig} /></SafeAreaView>;

  let screen;
  if (creating) screen = <CreateRequest onCancel={() => setCreating(false)} onSave={saveRequest} />;
  else if (tab === 'home') screen = <Home onCreate={() => setCreating(true)} onRequests={() => setTab('requests')} />;
  else if (tab === 'requests') screen = <Requests requests={requests} onCreate={() => setCreating(true)} />;
  else if (tab === 'community') screen = <Community />;
  else screen = <Profile user={user} onLogout={async () => { await supabase?.auth.signOut(); setUser(null); setTab('home'); }} />;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <View style={styles.flex}>{screen}</View>
      {!creating && (
        <View style={styles.tabBar}>
          {tabs.map((item) => (
            <Pressable key={item.id} onPress={() => setTab(item.id)} style={styles.tab}>
              <Text style={[styles.tabIcon, tab === item.id && styles.activeTab]}>{item.icon}</Text>
              <Text style={[styles.tabLabel, tab === item.id && styles.activeTab]}>{item.label}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  authWrap: { flex: 1, backgroundColor: C.bg },
  authPage: { flexGrow: 1, justifyContent: 'center', padding: 26, paddingTop: 48, paddingBottom: 36, gap: 15 },
  authLogo: { width: 94, height: 94, borderRadius: 26, alignSelf: 'center', marginBottom: 4 },
  authBrand: { color: C.ink, fontSize: 25, fontWeight: '900', letterSpacing: 3, textAlign: 'center' },
  authTagline: { color: C.cyan, fontSize: 14, fontWeight: '600', textAlign: 'center', marginBottom: 20 },
  authTitle: { color: C.ink, fontSize: 29, lineHeight: 35, fontWeight: '800', textAlign: 'center', marginTop: 12 },
  authFoot: { color: C.muted, fontSize: 11, lineHeight: 16, marginTop: 14 },
  error: { color: '#FF7D9B', fontSize: 13, fontWeight: '600' },
  success: { color: C.green, fontSize: 13, fontWeight: '600' },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  profileCard: { backgroundColor: C.surface, borderColor: C.line, borderWidth: 1, borderRadius: 20, padding: 24, alignItems: 'center', gap: 9, marginTop: 18 },
  avatar: { width: 70, height: 70, borderRadius: 24, backgroundColor: C.pale, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  avatarText: { color: C.cyan, fontSize: 30, fontWeight: '800' },
  menuCard: { backgroundColor: C.surface, borderColor: C.line, borderWidth: 1, borderRadius: 18, paddingHorizontal: 16, marginTop: 4 },
  menuRow: { color: C.ink, fontSize: 14, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: C.line },
  flex: { flex: 1 },
  page: { padding: 22, paddingBottom: 30, gap: 16 },
  hero: { padding: 23, borderRadius: 26, backgroundColor: C.pale, marginBottom: 6 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 18 },
  brandLogo: { width: 54, height: 54, borderRadius: 15 },
  brandName: { color: C.ink, fontSize: 17, fontWeight: '900', letterSpacing: 1.5 },
  brandTagline: { color: C.muted, fontSize: 12, marginTop: 3 },
  eyebrow: { color: C.purple, fontSize: 11, fontWeight: '800', letterSpacing: 1.2, marginBottom: 14 },
  heroTitle: { color: C.ink, fontSize: 32, lineHeight: 37, fontWeight: '800', letterSpacing: -0.6 },
  heroBody: { color: C.muted, fontSize: 15, lineHeight: 22, marginTop: 10 },
  heroActions: { gap: 10, marginTop: 20 },
  actionButton: { minHeight: 50, borderRadius: 15, backgroundColor: C.purple, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18 },
  actionText: { color: C.white, fontWeight: '700', fontSize: 15 },
  secondaryButton: { backgroundColor: C.surface, borderWidth: 1, borderColor: C.line },
  secondaryText: { color: C.ink },
  sectionTitle: { color: C.ink, fontSize: 19, fontWeight: '800', marginTop: 4 },
  featureCard: { backgroundColor: C.surface, borderColor: C.line, borderWidth: 1, borderRadius: 18, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14 },
  featureIcon: { fontSize: 25 },
  featureCopy: { flex: 1, gap: 5 },
  featureTitle: { color: C.ink, fontSize: 16, fontWeight: '800' },
  body: { color: C.muted, fontSize: 14, lineHeight: 21 },
  notice: { backgroundColor: '#EDF7F3', borderRadius: 16, padding: 16, gap: 6, marginTop: 2 },
  noticeTitle: { color: C.green, fontWeight: '800', fontSize: 14 },
  pageTitle: { color: C.ink, fontSize: 28, lineHeight: 34, fontWeight: '800', marginTop: 5 },
  empty: { alignItems: 'center', justifyContent: 'center', backgroundColor: C.surface, borderColor: C.line, borderWidth: 1, borderRadius: 20, padding: 24, gap: 12, marginTop: 22 },
  emptyIcon: { fontSize: 35, marginBottom: 3 },
  center: { textAlign: 'center' },
  requestCard: { backgroundColor: C.surface, borderColor: C.line, borderWidth: 1, borderRadius: 18, padding: 17, gap: 9 },
  categoryTag: { color: C.purple, fontSize: 12, fontWeight: '800' },
  localTag: { color: C.green, fontSize: 12, fontWeight: '700', marginTop: 2 },
  label: { color: C.ink, fontWeight: '700', marginTop: 4 },
  input: { borderColor: C.line, borderWidth: 1, borderRadius: 13, backgroundColor: C.surface, padding: 14, color: C.ink, fontSize: 15 },
  multiline: { minHeight: 110 },
  helper: { color: C.muted, fontSize: 12, lineHeight: 18 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderWidth: 1, borderColor: C.line, borderRadius: 20, paddingVertical: 9, paddingHorizontal: 12, backgroundColor: C.white },
  chipSelected: { borderColor: C.purple, backgroundColor: C.pale },
  chipText: { color: C.muted, fontSize: 12, fontWeight: '600' },
  chipTextSelected: { color: C.purple },
  back: { color: C.purple, fontSize: 16, fontWeight: '700', marginBottom: 4 },
  tabBar: { flexDirection: 'row', backgroundColor: C.surface, borderTopColor: C.line, borderTopWidth: 1, paddingTop: 9, paddingBottom: Platform.OS === 'ios' ? 8 : 10 },
  tab: { flex: 1, alignItems: 'center', gap: 3 },
  tabIcon: { color: C.muted, fontSize: 20, fontWeight: '600' },
  activeTab: { color: C.purple },
  tabLabel: { color: C.muted, fontSize: 10, fontWeight: '600' },
});
