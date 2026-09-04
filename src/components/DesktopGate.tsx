import "../styles/DesktopGate.css";

export default function DesktopGate({
  onContinue,
}: {
  onContinue: () => void;
}) {
  return (
    <div className="gate-container">
      <div className="gate-card">
        <div className="gate-icon" aria-hidden="true">
          <div className="phone-svg">
            <div className="phone-body">
              <div className="phone-notch"></div>
              <div className="phone-screen">
                <div className="phone-wave"></div>
              </div>
              <div className="phone-button"></div>
            </div>
            <div className="phone-arrow">→</div>
          </div>
        </div>

        <h1 className="gate-title">Utilisez Offliner sur mobile</h1>
        <p className="gate-lead">
          Offliner est conçu pour vous aider à <strong>déconnecter</strong>{" "}
          depuis votre téléphone.
        </p>

        <ul className="gate-reasons">
          <li>
            <span className="gate-bullet">🌱</span>
            Retrouvez la maîtrise de votre temps d'écran
          </li>
          <li>
            <span className="gate-bullet">📴</span>
            Activez le mode avion et suivez vos sessions
          </li>
          <li>
            <span className="gate-bullet">🎯</span>
            Des habitudes numériques plus saines
          </li>
        </ul>

        <div className="gate-cta">
          <p className="gate-cta-text">
            Ouvrez cette page dans le navigateur de votre téléphone :
          </p>
          <div className="gate-url" title="URL de la page">
            {typeof window !== "undefined" ? window.location.href : "..."}
          </div>
        </div>

        <button type="button" className="gate-bypass" onClick={onContinue}>
          Continuer sur desktop (aperçu)
        </button>
      </div>
    </div>
  );
}
