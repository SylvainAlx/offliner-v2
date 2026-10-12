import CompanionSprite from "./CompanionSprite";
import Button from "./ui/Button";
import { useHomePage } from "../hooks/useHomePage";

const companionPositions = [
  "left-[15%] rotate-[-6deg]",
  "left-1/2 -translate-x-1/2",
  "right-[14%] rotate-[6deg]",
];

const companionSizes = ["size-16", "size-[94px]", "size-[70px]"];

const orbPositions = [
  "top-[44%] left-[22%] text-[1.25rem]",
  "top-[31%] left-[71%] text-[0.9rem] [animation-delay:-1.2s]",
  "top-[56%] right-[18%] text-[1.05rem] [animation-delay:-2s]",
];

export default function HomePage({ onPlay }: { onPlay: () => void }) {
  const { companionIds } = useHomePage();

  return (
    <main className="relative min-h-svh overflow-hidden bg-[radial-gradient(circle_at_8%_12%,rgba(170,59,255,0.12),transparent_34%),radial-gradient(circle_at_92%_78%,rgba(34,197,94,0.12),transparent_35%),linear-gradient(145deg,#fcfbff_0%,#ffffff_52%,#f8fff9_100%)] p-6 text-(--gray-900) max-[760px]:px-4 max-[760px]:py-[18px]">
      <div
        className="pointer-events-none absolute top-[-210px] left-1/4 size-[320px] rounded-full bg-[rgba(170,59,255,0.1)] opacity-[0.55] blur-[4px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-[-180px] bottom-[-170px] size-[320px] rounded-full bg-[rgba(34,197,94,0.1)] opacity-[0.55] blur-[4px]"
        aria-hidden="true"
      />

      <div className="relative z-[1] mx-auto w-full max-w-[1050px]">
        <header className="flex items-center justify-between gap-5 py-1 max-[430px]:items-start max-[430px]:flex-col max-[430px]:gap-1.5">
          <div
            className="inline-flex items-center gap-1 text-[2rem] font-extrabold tracking-[-0.03em]"
            aria-label="Offliner"
          >
            <img
              className="size-[50px]"
              src="./logo.png"
              alt="Offliner"
            />
            <span>Offliner</span>
          </div>
        </header>

        <section
          className="grid min-h-[430px] grid-cols-[minmax(0,1.03fr)_minmax(300px,0.97fr)] items-center gap-[clamp(28px,6vw,82px)] py-[56px_40px] max-[760px]:grid-cols-1 max-[760px]:gap-[27px] max-[760px]:min-h-0 max-[760px]:py-[46px_28px] max-[430px]:py-[36px_0]"
          aria-labelledby="home-page-title"
        >
          <div className="max-w-[590px]">
            <h1
              className="mt-[18px] mb-4 max-w-[650px] text-[clamp(2.55rem,5.5vw,4.65rem)] font-extrabold leading-[0.98] tracking-[-0.065em] text-(--gray-900) max-[760px]:text-[clamp(2.45rem,12vw,4rem)] max-[430px]:mt-[15px] max-[430px]:text-[clamp(2.35rem,13vw,3.5rem)]"
              id="home-page-title"
            >
              Déconnectez,
              <br />
              <span className="text-(--green-dark)">Faites grandir votre village.</span>
            </h1>
            <p className="max-w-[520px] text-[clamp(0.92rem,1.5vw,1.04rem)] leading-[1.6] text-(--gray-600)">
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

          <div
            className="relative min-h-[330px] overflow-hidden rounded-[28px] border border-[rgba(170,59,255,0.16)] bg-[linear-gradient(180deg,#f4efff_0%,#f7fff8_67%,#e9f9ed_100%)] shadow-[0_18px_40px_rgba(65,18,100,0.11)] max-[430px]:min-h-[230px] max-[760px]:min-h-[255px] max-[760px]:max-w-[500px]"
            aria-hidden="true"
          >
            <div className="absolute top-[33px] right-[54px] size-[58px] rounded-full bg-[#fcd34d] shadow-[0_0_0_11px_rgba(253,224,71,0.18),0_0_35px_rgba(253,224,71,0.38)]" />
            <div className="absolute top-[78px] left-[42px] h-[19px] w-[72px] scale-[0.8] rounded-full bg-[rgba(255,255,255,0.7)] before:absolute before:right-[30px] before:bottom-0 before:size-[29px] before:rounded-full before:bg-inherit before:content-[''] after:absolute after:right-[9px] after:bottom-0 after:size-[22px] after:rounded-full after:bg-inherit after:content-['']" />
            <div className="absolute top-[130px] right-[120px] h-[19px] w-[72px] scale-[0.55] rounded-full bg-[rgba(255,255,255,0.7)] opacity-65 before:absolute before:right-[30px] before:bottom-0 before:size-[29px] before:rounded-full before:bg-inherit before:content-[''] after:absolute after:right-[9px] after:bottom-0 after:size-[22px] after:rounded-full after:bg-inherit after:content-['']" />
            <div className="absolute right-[-13%] bottom-[-31%] left-[-13%] h-[62%] rotate-[-4deg] rounded-[50%_50%_0_0] bg-[#bbebc6]" />
            <div className="absolute right-[-13%] bottom-[-43%] left-[-13%] h-[62%] rotate-[5deg] rounded-[50%_50%_0_0] bg-[#83cf92]" />
            <div className="absolute inset-x-0 bottom-[76px] z-[2] max-[430px]:bottom-[55px]">
              {companionIds.map((id, index) => (
                <div
                  className={`absolute bottom-0 grid place-items-end justify-center ${companionPositions[index] ?? companionPositions[0]}`}
                  key={id}
                >
                  <CompanionSprite
                    id={id}
                    className={`block ${companionSizes[index] ?? companionSizes[0]} [image-rendering:pixelated] drop-shadow-[0_5px_2px_rgba(17,24,39,0.18)]`}
                  />
                </div>
              ))}
            </div>
            {orbPositions.map((position) => (
              <span
                className={`absolute z-[3] text-[#fff7a8] [text-shadow:0_0_11px_#facc15] animate-[home-page-orb-float_2.8s_ease-in-out_infinite] motion-reduce:animate-none ${position}`}
                key={position}
              >
                ✦
              </span>
            ))}
          </div>
        </section>

        <section
          className="grid grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] gap-3 max-[760px]:grid-cols-1"
          aria-label="À propos d'Offliner"
        >
          <article className="flex items-start gap-[13px] rounded-[17px] border border-(--gray-100) bg-[rgba(255,255,255,0.74)] p-[18px] shadow-[0_8px_22px_rgba(17,24,39,0.045)]">
            <span
              className="grid size-[34px] shrink-0 place-items-center rounded-[10px] bg-(--gray-50) text-[1.05rem]"
              aria-hidden="true"
            >
              🌱
            </span>
            <div>
              <h2 className="mt-px mb-[5px] text-[0.92rem] font-extrabold text-(--gray-900)">
                Une pause qui compte
              </h2>
              <p className="text-[0.76rem] leading-[1.5] text-(--gray-600)">
                Chaque période sans écran vous rapproche d&apos;un village plus
                vivant, avec des maisons et des compagnons à invoquer.
              </p>
            </div>
          </article>

          <article className="flex items-start gap-[13px] rounded-[17px] border border-(--gray-100) bg-[rgba(255,255,255,0.74)] p-[18px] shadow-[0_8px_22px_rgba(17,24,39,0.045)]">
            <span
              className="grid size-[34px] shrink-0 place-items-center rounded-[10px] bg-(--gray-50) text-[1.05rem]"
              aria-hidden="true"
            >
              📲
            </span>
            <div>
              <h2 className="mt-px mb-[5px] text-[0.92rem] font-extrabold text-(--gray-900)">
                À utiliser sur mobile
              </h2>
              <p className="text-[0.76rem] leading-[1.5] text-(--gray-600)">
                Pour une expérience idéale, ouvrez Offliner sur votre téléphone
                et installez-le comme une application.
              </p>
              <ol className="mt-2.5 mb-0 grid gap-[5px] pl-[18px] text-[0.76rem] leading-[1.5] text-(--gray-600)">
                <li>
                    Ouvrez le menu de votre navigateur&nbsp;: <strong className="text-(--gray-800)">⋮</strong>{" "}
                  sur Android ou <strong>Partager</strong> sur iPhone.
                </li>
                <li>
                    Choisissez <strong className="text-(--gray-800)">Installer l&apos;application</strong> ou{" "}
                    <strong className="text-(--gray-800)">Sur l&apos;écran d&apos;accueil</strong>.
                </li>
                <li>
                  Confirmez, puis lancez Offliner depuis votre écran
                  d&apos;accueil.
                </li>
              </ol>
            </div>
          </article>
        </section>

        <p className="px-0 pt-[18px] pb-1 text-center text-[0.68rem] text-(--gray-600)">
          Disponible sur mobile et ordinateur · Installation proposée par votre
          navigateur
        </p>
      </div>
    </main>
  );
}
