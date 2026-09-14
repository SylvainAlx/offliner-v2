import CompanionSprite from "./CompanionSprite";
import "../styles/HomePage.css";
import Button from "./ui/Button";
import { useHomePage } from "../hooks/useHomePage";

export default function HomePage({ onPlay }: { onPlay: () => void }) {
  const { companionIds } = useHomePage();

  return (
    <main className="home-page">
      <div className="home-page-glow home-page-glow-one" aria-hidden="true" />
      <div className="home-page-glow home-page-glow-two" aria-hidden="true" />

      <div className="home-page-shell">
        <header className="home-page-header">
          <div className="home-page-brand" aria-label="Offliner">
            <img
              className="home-page-brand-image"
              src="./logo.png"
              alt="Offliner"
            />
            <span>Offliner</span>
          </div>
        </header>

        <section className="home-page-hero" aria-labelledby="home-page-title">
          <div className="home-page-hero-copy">
            <h1 id="home-page-title">
              Déconnectez,
              <br />
              <span>Faites grandir votre village.</span>
            </h1>
            <p className="home-page-lead">
              Offliner transforme votre temps hors-ligne en un village vivant,
              avec des maisons et des compagnons à invoquer. Accordez-vous une
              pause d'internet et regardez votre village prospérer pendant que
              vous êtes déconnecté.
            </p>
            {/* <button type="button" className="home-page-play" onClick={onPlay}>
              Jouer <span aria-hidden="true">→</span>
            </button> */}
            <Button onClick={onPlay}>
              Jouer <span aria-hidden="true">→</span>
            </Button>
          </div>

          <div className="home-page-village-preview" aria-hidden="true">
            <div className="home-page-sun" />
            <div className="home-page-cloud home-page-cloud-one" />
            <div className="home-page-cloud home-page-cloud-two" />
            <div className="home-page-hill home-page-hill-back" />
            <div className="home-page-hill home-page-hill-front" />
            <div className="home-page-companions">
              {companionIds.map((id, index) => (
                <div
                  className={`home-page-companion home-page-companion-${index + 1}`}
                  key={id}
                >
                  <CompanionSprite
                    id={id}
                    className="home-page-companion-sprite"
                  />
                </div>
              ))}
            </div>
            <span className="home-page-orb home-page-orb-one">✦</span>
            <span className="home-page-orb home-page-orb-two">✦</span>
            <span className="home-page-orb home-page-orb-three">✦</span>
          </div>
        </section>

        <section
          className="home-page-info-grid"
          aria-label="À propos d'Offliner"
        >
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
                  Confirmez, puis lancez Offliner depuis votre écran
                  d&apos;accueil.
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
