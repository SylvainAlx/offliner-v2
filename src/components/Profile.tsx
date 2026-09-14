import "../styles/Profile.css";
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
      <form className="profile-form" onSubmit={handleSubmit}>
        <label className="profile-label" htmlFor="profile-name-input">
          Modifier votre nom
        </label>
        <div className="profile-form-row">
          <input
            id="profile-name-input"
            className="profile-input"
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
        {isSaved && <p className="profile-feedback">Nom enregistré.</p>}
      </form>
    </Card>
  );
}
