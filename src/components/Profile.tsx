import Card from "./ui/Card";
import Button from "./ui/Button";
import { useProfile } from "../hooks/useProfile";

const createdAtFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export default function Profile() {
  const { createdAt, handleSubmit, name, setName, isSaved, setIsSaved } =
    useProfile();

  return (
    <Card
      ariaLabel="Profil de l'utilisateur"
      title={name}
      subtitle={`Membre depuis le ${createdAtFormatter.format(createdAt)}`}
    >
      <form className="mt-4 w-full" onSubmit={handleSubmit}>
        <label
          className="mb-1.5 block text-[0.8rem] font-semibold text-(--gray-700)"
          htmlFor="profile-name-input"
        >
          Modifier votre nom
        </label>
        <div className="flex flex-col gap-2">
          <input
            id="profile-name-input"
            className="min-h-11 w-full rounded-[10px] border border-(--gray-200) bg-white px-3 py-2.5 font-inherit text-[0.9rem] text-(--gray-900) outline-offset-1 focus:outline-2 focus:outline-(--accent-border)"
            type="text"
            value={name}
            maxLength={40}
            onChange={(event) => {
              setName(event.target.value);
              setIsSaved(false);
            }}
            required
          />
          <Button onClick={() => {}} type="submit">
            Enregistrer
          </Button>
        </div>
        {isSaved && (
          <p className="mt-1.5 text-[0.8rem] text-(--green-dark)">
            Nom enregistré.
          </p>
        )}
      </form>
    </Card>
  );
}
