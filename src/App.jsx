import { useState } from "react";
import "./App.css";

export default function App() {
  const [screen, setScreen] = useState("onboarding");

  return (
    <>
      {screen === "onboarding" && (
        <Onboarding
          onLogin={() => setScreen("login")}
          onRegister={() => setScreen("register")}
        />
      )}

      {screen === "login" && (
        <Login
          onBack={() => setScreen("onboarding")}
          onRegister={() => setScreen("register")}
          onSuccess={() => setScreen("home")}
        />
      )}

      {screen === "register" && (
        <Register
          onBack={() => setScreen("login")}
          onSuccess={() => setScreen("verification")}
        />
      )}

      {screen === "verification" && (
        <Verification
          onBack={() => setScreen("register")}
          onSuccess={() => setScreen("home")}
        />
      )}

      {screen === "home" && (
        <Home
          onLogout={() => setScreen("onboarding")}
        />
      )}
    </>
  );
}

/* =========================
   LOGO
========================= */

function Logo() {
  return (
    <div className="logo">
      <div className="logoMark">
        H
      </div>

      <div>
        <div className="logoText">HELPORA</div>
        <div className="logoSub">
          YAKININDAKİ İYİLİĞİ KEŞFET
        </div>
      </div>
    </div>
  );
}

/* =========================
   ONBOARDING
========================= */

function Onboarding({ onLogin, onRegister }) {
  return (
    <main className="onboarding page">

      <div className="onboardingHero">

        <div className="heroOverlay" />

        <header className="onboardingHeader">
          <Logo />
        </header>

        <div className="heroContent">

          <div className="heroSmall">
            Daha İyi Bir Yarın ♡
          </div>

          <h1>
            Küçük Yardımlar.
            <br />
            <span>Büyük Değişim.</span>
          </h1>

          <p>
            Yardıma ihtiyacı olan insanlara ulaş,
            iyiliği birlikte büyüt.
          </p>

          <button
            className="outlineButton"
            onClick={onRegister}
          >
            Hemen Başla
            <span>→</span>
          </button>

        </div>
      </div>

      <div className="onboardingBottom">

        <div className="dots">
          <i className="active" />
          <i />
          <i />
        </div>

        <button
          className="primaryButton"
          onClick={onRegister}
        >
          Hemen Başla
          <span>→</span>
        </button>

        <button
          className="ghostButton"
          onClick={onLogin}
        >
          Zaten hesabım var
        </button>

        <div className="legal">
          Datenschutz · AGB · Impressum
        </div>

      </div>

    </main>
  );
}

/* =========================
   LOGIN
========================= */

function Login({
  onBack,
  onRegister,
  onSuccess
}) {
  return (
    <main className="authPage page">

      <button
        className="backButton"
        onClick={onBack}
      >
        ←
      </button>

      <div className="authLogo">
        <Logo />
      </div>

      <section className="authCard">

        <div className="authIcon">
          👋
        </div>

        <h1>Tekrar Hoş Geldin</h1>

        <p>
          İyiliğe devam etmek için giriş yap.
        </p>

        <button
          className="socialButton"
          onClick={onSuccess}
        >
          <b>G</b>
          Google ile Giriş Yap
        </button>

        <button
          className="socialButton appleButton"
          onClick={onSuccess}
        >
          <b>●</b>
          Apple ile Giriş Yap
        </button>

        <div className="divider">
          <span />
          veya
          <span />
        </div>

        <label>E-posta adresi</label>

        <input
          type="email"
          placeholder="E-posta adresin"
        />

        <label>Şifre</label>

        <input
          type="password"
          placeholder="Şifren"
        />

        <div className="loginOptions">

          <label className="remember">
            <input type="checkbox" />
            <span>Beni hatırla</span>
          </label>

          <button className="linkButton">
            Şifremi unuttum?
          </button>

        </div>

        <button
          className="primaryButton"
          onClick={onSuccess}
        >
          Giriş Yap
          <span>→</span>
        </button>

        <div className="bottomText">
          Hesabın yok mu?

          <button onClick={onRegister}>
            Hesap Oluştur
          </button>
        </div>

      </section>

    </main>
  );
}

/* =========================
   REGISTER
========================= */

function Register({
  onBack,
  onSuccess
}) {
  return (
    <main className="authPage page">

      <button
        className="backButton"
        onClick={onBack}
      >
        ←
      </button>

      <div className="authLogo">
        <Logo />
      </div>

      <section className="authCard">

        <div className="authIcon">
          ✨
        </div>

        <h1>Hesap Oluştur</h1>

        <p>
          HELPORA topluluğuna katıl.
        </p>

        <div className="twoInputs">

          <input placeholder="Ad" />

          <input placeholder="Soyad" />

        </div>

        <input
          type="email"
          placeholder="E-posta adresi"
        />

        <input
          type="tel"
          placeholder="Telefon numarası"
        />

        <input
          placeholder="Kullanıcı adı"
        />

        <input
          type="password"
          placeholder="Şifre"
        />

        <label className="terms">

          <input type="checkbox" />

          <span>
            Kullanım koşullarını ve
            gizlilik politikasını kabul
            ediyorum.
          </span>

        </label>

        <button
          className="primaryButton"
          onClick={onSuccess}
        >
          Hesap Oluştur
          <span>→</span>
        </button>

        <div className="bottomText">

          Zaten hesabın var mı?

          <button onClick={onBack}>
            Giriş Yap
          </button>

        </div>

      </section>

    </main>
  );
}

/* =========================
   VERIFICATION
========================= */

function Verification({
  onBack,
  onSuccess
}) {
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);

  function startVerification() {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setVerified(true);
    }, 2500);
  }

  if (verified) {
    return (
      <main className="verificationPage page">

        <button
          className="backButton"
          onClick={onBack}
        >
          ←
        </button>

        <div className="verificationLogo">
          <Logo />
        </div>

        <section className="verificationCard">

          <div className="successCircle">
            ✓
          </div>

          <div className="verifiedLabel">
            IDENTITÄT VERIFIZIERT
          </div>

          <h1>Kimliğin doğrulandı</h1>

          <p>
            Hesabın başarıyla doğrulandı.
            Artık HELPORA'nın tüm
            topluluk özelliklerini
            kullanabilirsin.
          </p>

          <div className="verifiedUser">

            <div className="userAvatar">
              W
            </div>

            <div>
              <strong>HELPORA Kullanıcısı</strong>

              <span>
                ✓ Kimlik doğrulandı
              </span>
            </div>

          </div>

          <div className="benefits">

            <div>
              ✓ Doğrulanmış profil
            </div>

            <div>
              ✓ Güvenli topluluk
            </div>

            <div>
              ✓ Yardım özelliklerine erişim
            </div>

          </div>

          <button
            className="primaryButton"
            onClick={onSuccess}
          >
            HELPORA'ya Devam Et
            <span>→</span>
          </button>

        </section>

      </main>
    );
  }

  return (
    <main className="verificationPage page">

      <button
        className="backButton"
        onClick={onBack}
      >
        ←
      </button>

      <div className="verificationLogo">
        <Logo />
      </div>

      <section className="verificationCard">

        {!loading ? (
          <>

            <div className="idIcon">
              🪪
            </div>

            <div className="verifiedLabel">
              GÜVENLİ DOĞRULAMA
            </div>

            <h1>Kimliğini doğrula</h1>

            <p>
              HELPORA'da güvenli bir
              topluluk oluşturmak için
              kimlik doğrulaması gereklidir.
            </p>

            <div className="idOptions">

              <div>
                <span>✓</span>
                Personalausweis
              </div>

              <div>
                <span>✓</span>
                Aufenthaltstitel
              </div>

              <div>
                <span>✓</span>
                eID-Karte
              </div>

            </div>

            <div className="secureBox">

              <div>🔒</div>

              <div>
                <strong>Güvenli ve özel</strong>

                <p>
                  Kimlik doğrulama güvenli
                  eID sistemi üzerinden
                  gerçekleştirilir.
                </p>
              </div>

            </div>

            <button
              className="primaryButton"
              onClick={startVerification}
            >
              Ausweis ile Doğrula
              <span>→</span>
            </button>

            <div className="verificationNote">
              Bu doğrulama HELPORA hesabını
              aktif hale getirmek için gereklidir.
            </div>

          </>
        ) : (
          <>

            <div className="loadingCircle" />

            <h1>
              Doğrulama başlatılıyor...
            </h1>

            <p>
              Güvenli kimlik doğrulama
              bağlantısı kuruluyor.
            </p>

            <div className="checkingSteps">

              <div className="activeStep">
                ✓ Güvenli bağlantı
              </div>

              <div>
                2 · Kimlik kontrolü
              </div>

              <div>
                3 · Profil aktivasyonu
              </div>

            </div>

          </>
        )}

      </section>

    </main>
  );
}

/* =========================
   HOME
========================= */

function Home({ onLogout }) {

  const categories = [
    {
      icon: "🚨",
      title: "SOS Yardım",
      text: "Acil durumda hızlı destek",
      className: "red"
    },
    {
      icon: "💜",
      title: "Yardım İste / Et",
      text: "İhtiyaç paylaş veya yardım et",
      className: "purple"
    },
    {
      icon: "📅",
      title: "Treffen & Events",
      text: "Etkinlik oluştur ve katıl",
      className: "pink"
    },
    {
      icon: "💼",
      title: "Jobs Sofort",
      text: "Hemen başlayabileceğin işler",
      className: "green"
    },
    {
      icon: "🏠",
      title: "Wohnung Sofort",
      text: "Ev ve oda ilanları",
      className: "yellow"
    },
    {
      icon: "🤲",
      title: "Bedarfshilfe",
      text: "Gıda, kıyafet ve ihtiyaç",
      className: "cyan"
    }
  ];

  return (
    <main className="homePage page">

      <header className="homeHeader">

        <Logo />

        <div className="location">
          📍 Hann. Münden
        </div>

        <div className="headerButtons">

          <button>♧</button>

          <button className="avatar">
            W
          </button>

        </div>

      </header>

      <section className="homeHero">

        <div className="homeHeroOverlay" />

        <div className="homeHeroContent">

          <small>
            KÜÇÜK YARDIMLAR · BÜYÜK DEĞİŞİM
          </small>

          <h1>
            Daha İyi Bir Yarın
            <br />
            <span>Birlikte Mümkün.</span>
          </h1>

          <p>
            İyiliği paylaş.
            İnsanlara ulaş.
            Birlikte değiştir.
          </p>

        </div>

      </section>

      <section className="welcomeCard">

        <div className="welcomeIcon">
          ✦
        </div>

        <div>
          <h2>
            Merhaba! 👋
          </h2>

          <p>
            Bugün ne yapmak istiyorsun?
          </p>
        </div>

      </section>

      <section className="categoryGrid">

        {categories.map((item) => (

          <button
            className={`categoryCard ${item.className}`}
            key={item.title}
          >

            <div className="categoryIcon">
              {item.icon}
            </div>

            <strong>
              {item.title}
            </strong>

            <small>
              {item.text}
            </small>

            <span className="arrow">
              →
            </span>

          </button>

        ))}

      </section>

      <section className="rankingCard">

        <div className="rankingTop">

          <div className="trophy">
            🏆
          </div>

          <div>
            <strong>
              Şehir Sıralaması
            </strong>

            <p>
              Bu ay en çok yardım edenler
            </p>
          </div>

        </div>

        <div className="rankingUsers">

          <span>🥇 Welat</span>
          <span>🥈 Emre</span>
          <span>🥉 Elif</span>

        </div>

      </section>

      <section className="communityCard">

        <div>

          <small>
            HELPORA COMMUNITY
          </small>

          <h2>
            Birlikte Daha
            <span> Güçlüyüz.</span>
          </h2>

          <p>
            Yardımlaşma topluluğuna katıl.
          </p>

          <button>
            Topluluğa Katıl →
          </button>

        </div>

      </section>

      <nav className="bottomNav">

        <button className="selected">
          <span>⌂</span>
          Home
        </button>

        <button>
          <span>☷</span>
          Beiträge
        </button>

        <button className="plusButton">
          +
        </button>

        <button>
          <span>◌</span>
          Nachrichten
        </button>

        <button>
          <span>♙</span>
          Profil
        </button>

      </nav>

      <button
        className="logoutTest"
        onClick={onLogout}
      >
        Test Çıkış
      </button>

    </main>
  );
}