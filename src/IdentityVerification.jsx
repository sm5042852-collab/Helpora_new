import { useState } from "react";
import "./IdentityVerification.css";

export default function IdentityVerification({ onBack, onVerified }) {
  const [step, setStep] = useState("start");

  const startVerification = () => {
    setStep("checking");

    setTimeout(() => {
      setStep("success");
    }, 2500);
  };

  return (
    <main className="verificationPage">
      <button className="verificationBack" onClick={onBack}>
        ←
      </button>

      <div className="verificationLogo">
        <div className="verificationLogoMark">H</div>
        <strong>HELPORA</strong>
      </div>

      {step === "start" && (
        <section className="verificationCard">
          <div className="verificationIcon">🪪</div>

          <div className="verifiedBadge">GÜVENLİ DOĞRULAMA</div>

          <h1>Kimliğini doğrula</h1>

          <p>
            HELPORA topluluğunu daha güvenli hale getirmek için
            kimliğini doğrulaman gerekiyor.
          </p>

          <div className="verificationInfo">
            <div>
              <span>✓</span>
              Personalausweis
            </div>

            <div>
              <span>✓</span>
              Elektronischer Aufenthaltstitel
            </div>

            <div>
              <span>✓</span>
              eID-Karte
            </div>
          </div>

          <div className="privacyBox">
            <span>🔒</span>
            <div>
              <strong>Gizliliğin korunur</strong>
              <p>
                Kimlik bilgilerini gereksiz şekilde saklamayız.
                Doğrulama güvenli bir kimlik hizmeti üzerinden yapılır.
              </p>
            </div>
          </div>

          <button
            className="verificationButton"
            onClick={startVerification}
          >
            Ausweis ile doğrula
            <span>→</span>
          </button>

          <button className="alternativeButton">
            Doğrulama hakkında bilgi
          </button>
        </section>
      )}

      {step === "checking" && (
        <section className="verificationCard">
          <div className="loadingCircle">
            <div />
          </div>

          <h1>Doğrulama başlatılıyor...</h1>

          <p>
            Güvenli kimlik doğrulama hizmetine bağlanıyoruz.
          </p>

          <div className="processSteps">
            <div className="processActive">
              <span>✓</span>
              Güvenli bağlantı
            </div>

            <div>
              <span>2</span>
              Kimlik doğrulama
            </div>

            <div>
              <span>3</span>
              Profil doğrulama
            </div>
          </div>

          <small>
            Lütfen bu ekranı kapatma.
          </small>
        </section>
      )}

      {step === "success" && (
        <section className="verificationCard successCard">
          <div className="successIcon">✓</div>

          <div className="verifiedBadge successBadge">
            IDENTITÄT VERIFIZIERT
          </div>

          <h1>Kimliğin doğrulandı</h1>

          <p>
            HELPORA hesabın artık doğrulanmış bir hesap.
          </p>

          <div className="verifiedProfile">
            <div className="miniAvatar">W</div>

            <div>
              <strong>Welat</strong>
              <span>✓ Kimlik doğrulandı</span>
            </div>
          </div>

          <div className="verificationBenefits">
            <div>✓ Doğrulanmış profil</div>
            <div>✓ Daha güvenli iletişim</div>
            <div>✓ Topluluk özelliklerine erişim</div>
          </div>

          <button
            className="verificationButton"
            onClick={onVerified}
          >
            Profile devam et
            <span>→</span>
          </button>
        </section>
      )}
    </main>
  );
}