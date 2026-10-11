import SwiftUI

private enum HelporaTab: Hashable {
    case home
    case requests
    case community
    case profile
}

struct ContentView: View {
    @State private var selectedTab: HelporaTab = .home

    var body: some View {
        TabView(selection: $selectedTab) {
            HomeView(onShowRequests: { selectedTab = .requests })
                .tabItem { Label("Başlangıç", systemImage: "house") }
                .tag(HelporaTab.home)

            RequestsView()
                .tabItem { Label("Yardım", systemImage: "hand.raised") }
                .tag(HelporaTab.requests)

            CommunityView()
                .tabItem { Label("Topluluk", systemImage: "person.3") }
                .tag(HelporaTab.community)

            ProfileView()
                .tabItem { Label("Profil", systemImage: "person.crop.circle") }
                .tag(HelporaTab.profile)
        }
        .tint(Color.indigo)
    }
}

private struct HomeView: View {
    let onShowRequests: () -> Void

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Yardıma ihtiyacın olduğunda")
                            .font(.largeTitle.bold())
                        Text("Helpora, insanların birbirine destek olması için tasarlanıyor.")
                            .font(.body)
                            .foregroundStyle(.secondary)
                    }

                    Button(action: onShowRequests) {
                        Label("Yardım seçeneklerini gör", systemImage: "arrow.right")
                            .font(.headline)
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(Color.indigo, in: RoundedRectangle(cornerRadius: 14))
                            .foregroundStyle(.white)
                    }

                    Label("İlk sürüm hazırlanıyor", systemImage: "hammer")
                        .font(.subheadline.weight(.medium))
                        .foregroundStyle(.secondary)
                        .padding(.top, 8)
                }
                .padding()
            }
            .navigationTitle("Helpora")
        }
    }
}

private struct RequestsView: View {
    var body: some View {
        NavigationStack {
            ContentUnavailableView(
                "Henüz yardım ilanı yok",
                systemImage: "hand.raised",
                description: Text("Gerçek yardım ilanları, backend bağlantısı eklendikten sonra burada görünecek.")
            )
            .navigationTitle("Yardım")
        }
    }
}

private struct CommunityView: View {
    var body: some View {
        NavigationStack {
            ContentUnavailableView(
                "Topluluk hazırlanıyor",
                systemImage: "person.3",
                description: Text("Topluluk içerikleri henüz bağlı değil.")
            )
            .navigationTitle("Topluluk")
        }
    }
}

private struct ProfileView: View {
    var body: some View {
        NavigationStack {
            ContentUnavailableView(
                "Profil",
                systemImage: "person.crop.circle",
                description: Text("Gerçek hesap ve giriş sistemi henüz eklenmedi.")
            )
            .navigationTitle("Profil")
        }
    }
}

#Preview {
    ContentView()
}
