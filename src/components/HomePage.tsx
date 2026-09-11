import "../styles/HomePage.css";

export default function HomePage({ onPlay }: { onPlay: () => void }) {
  return (
    <main className="home-page">
      <div className="home-page-glow home-page-glow-one" aria-hidden="true" />
      <div className="home-page-glow home-page-glow-two" aria-hidden="true" />

      <div className="home-page-shell">
        <header className="home-page-header">
          <div className="home-page-brand" aria-label="Offliner">
            <span className="home-page-brand-mark" aria-hidden="true">
              ◈
            </span>
            <span>Offliner</span>
          </div>
          <span className="home-page-tagline">Votre village hors-ligne</span>
        </header>

        <section className="home-page-hero" aria-labelledby="home-page-title">
          <div className="home-page-hero-copy">
            <span className="home-page-eyebrow">Un jeu pour décrocher</span>
            <h1 id="home-page-title">
              Éteignez l&apos;écran.
              <br />
              <span>Faites grandir votre village.</span>
            </h1>
            <p className="home-page-lead">
              Offliner transforme votre temps loin du téléphone en progression.
              Fermez l&apos;application, vivez votre période hors ligne, puis
              revenez découvrir les orbes et les habitants gagnés.
            </p>
            <button type="button" className="home-page-play" onClick={onPlay}>
              Jouer <span aria-hidden="true">→</span>
            </button>
          </div>

          <div className="home-page-village-preview" aria-hidden="true">
            <div className="home-page-sun" />
            <div className="home-page-cloud home-page-cloud-one" />
            <div className="home-page-cloud home-page-cloud-two" />
            <div className="home-page-hill home-page-hill-back" />
            <div className="home-page-hill home-page-hill-front" />
            <div className="home-page-house">
              <div className="home-page-roof" />
              <div className="home-page-house-body">
                <div className="home-page-door" />
                <div className="home-page-window" />
              </div>
            </div>
            <span className="home-page-orb home-page-orb-one">✦</span>
            <span className="home-page-orb home-page-orb-two">✦</span>
            <span className="home-page-orb home-page-orb-three">✦</span>
          </div>
        </section>

        <section className="home-page-info-grid" aria-label="À propos d'Offliner">
          <article className="home-page-info-card">
            <span className="home-page-info-icon" aria-hidden="true">
              🌱
            </span>
            <div>
              <h2>Une pause qui compte</h2>
              <p>
                Chaque période sans écran vous rapproche d&apos;un village plus
                vivant, avec des maisons et des compagnons à invoquer.
              </p>
            </div>
          </article>

          <article className="home-page-info-card home-page-install-card">
            <span className="home-page-info-icon" aria-hidden="true">
              📲
            </span>
            <div>
              <h2>À utiliser sur mobile</h2>
              <p>
                Pour une expérience idéale, ouvrez Offliner sur votre téléphone
                et installez-le comme une application.
              </p>
              <ol className="home-page-install-steps">
                <li>
                  Ouvrez le menu de votre navigateur&nbsp;: <strong>⋮</strong>{" "}
                  sur Android ou <strong>Partager</strong> sur iPhone.
                </li>
                <li>
                  Choisissez <strong>Installer l&apos;application</strong> ou{" "}
                  <strong>Sur l&apos;écran d&apos;accueil</strong>.
                </li>
                <li>
                  Confirmez, puis lancez Offliner depuis votre écran d&apos;accueil.
                </li>
              </ol>
            </div>
          </article>
        </section>

        <p className="home-page-footer-note">
          Disponible sur mobile et ordinateur · Installation proposée par votre
          navigateur
        </p>
      </div>
    </main>
  );
}
