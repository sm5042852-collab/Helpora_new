import React, { useState } from 'react';
import { Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const C = {
  ink: '#15213B',
  muted: '#68738A',
  purple: '#6655D9',
  pale: '#F2F0FF',
  bg: '#F7F8FC',
  white: '#FFFFFF',
  line: '#E5E8F0',
  green: '#1C8B68',
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

function Profile() {
  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Text style={styles.pageTitle}>Profil</Text>
      <View style={styles.empty}>
        <Text style={styles.emptyIcon}>👤</Text>
        <Text style={styles.featureTitle}>Hesap sistemi sıradaki aşamada</Text>
        <Text style={[styles.body, styles.center]}>Bu prototipte kayıt ve giriş yapılmıyor. Gerçek hesap bilgisi istemiyoruz.</Text>
      </View>
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

export default function App() {
  const [tab, setTab] = useState('home');
  const [creating, setCreating] = useState(false);
  const [requests, setRequests] = useState(initialRequests);

  function saveRequest(item) {
    setRequests((current) => [{ ...item, id: String(Date.now()) }, ...current]);
    setCreating(false);
    setTab('requests');
  }

  let screen;
  if (creating) screen = <CreateRequest onCancel={() => setCreating(false)} onSave={saveRequest} />;
  else if (tab === 'home') screen = <Home onCreate={() => setCreating(true)} onRequests={() => setTab('requests')} />;
  else if (tab === 'requests') screen = <Requests requests={requests} onCreate={() => setCreating(true)} />;
  else if (tab === 'community') screen = <Community />;
  else screen = <Profile />;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
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
  flex: { flex: 1 },
  page: { padding: 22, paddingBottom: 30, gap: 16 },
  hero: { padding: 23, borderRadius: 26, backgroundColor: C.pale, marginBottom: 6 },
  eyebrow: { color: C.purple, fontSize: 11, fontWeight: '800', letterSpacing: 1.2, marginBottom: 14 },
  heroTitle: { color: C.ink, fontSize: 32, lineHeight: 37, fontWeight: '800', letterSpacing: -0.6 },
  heroBody: { color: C.muted, fontSize: 15, lineHeight: 22, marginTop: 10 },
  heroActions: { gap: 10, marginTop: 20 },
  actionButton: { minHeight: 50, borderRadius: 15, backgroundColor: C.purple, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18 },
  actionText: { color: C.white, fontWeight: '700', fontSize: 15 },
  secondaryButton: { backgroundColor: C.white, borderWidth: 1, borderColor: C.line },
  secondaryText: { color: C.ink },
  sectionTitle: { color: C.ink, fontSize: 19, fontWeight: '800', marginTop: 4 },
  featureCard: { backgroundColor: C.white, borderColor: C.line, borderWidth: 1, borderRadius: 18, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14 },
  featureIcon: { fontSize: 25 },
  featureCopy: { flex: 1, gap: 5 },
  featureTitle: { color: C.ink, fontSize: 16, fontWeight: '800' },
  body: { color: C.muted, fontSize: 14, lineHeight: 21 },
  notice: { backgroundColor: '#EDF7F3', borderRadius: 16, padding: 16, gap: 6, marginTop: 2 },
  noticeTitle: { color: C.green, fontWeight: '800', fontSize: 14 },
  pageTitle: { color: C.ink, fontSize: 28, lineHeight: 34, fontWeight: '800', marginTop: 5 },
  empty: { alignItems: 'center', justifyContent: 'center', backgroundColor: C.white, borderColor: C.line, borderWidth: 1, borderRadius: 20, padding: 24, gap: 12, marginTop: 22 },
  emptyIcon: { fontSize: 35, marginBottom: 3 },
  center: { textAlign: 'center' },
  requestCard: { backgroundColor: C.white, borderColor: C.line, borderWidth: 1, borderRadius: 18, padding: 17, gap: 9 },
  categoryTag: { color: C.purple, fontSize: 12, fontWeight: '800' },
  localTag: { color: C.green, fontSize: 12, fontWeight: '700', marginTop: 2 },
  label: { color: C.ink, fontWeight: '700', marginTop: 4 },
  input: { borderColor: C.line, borderWidth: 1, borderRadius: 13, backgroundColor: C.white, padding: 14, color: C.ink, fontSize: 15 },
  multiline: { minHeight: 110 },
  helper: { color: C.muted, fontSize: 12, lineHeight: 18 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderWidth: 1, borderColor: C.line, borderRadius: 20, paddingVertical: 9, paddingHorizontal: 12, backgroundColor: C.white },
  chipSelected: { borderColor: C.purple, backgroundColor: C.pale },
  chipText: { color: C.muted, fontSize: 12, fontWeight: '600' },
  chipTextSelected: { color: C.purple },
  back: { color: C.purple, fontSize: 16, fontWeight: '700', marginBottom: 4 },
  tabBar: { flexDirection: 'row', backgroundColor: C.white, borderTopColor: C.line, borderTopWidth: 1, paddingTop: 9, paddingBottom: Platform.OS === 'ios' ? 8 : 10 },
  tab: { flex: 1, alignItems: 'center', gap: 3 },
  tabIcon: { color: C.muted, fontSize: 20, fontWeight: '600' },
  activeTab: { color: C.purple },
  tabLabel: { color: C.muted, fontSize: 10, fontWeight: '600' },
});
