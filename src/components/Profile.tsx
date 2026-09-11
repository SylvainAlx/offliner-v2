import { useState } from "react";
import type { FormEvent } from "react";
import { useUser } from "../stores/userStore";
import "../styles/Profile.css";
import Card from "./ui/Card";
import Button from "./ui/Button";

const createdAtFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export default function Profile() {
  const user = useUser((state) => state.user);
  const updateName = useUser((state) => state.updateName);
  const [name, setName] = useState(user.name);
  const [isSaved, setIsSaved] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;

    updateName(trimmedName);
    setName(trimmedName);
    setIsSaved(true);
  }

  return (
    <Card
      ariaLabel="Profil de l'utilisateur"
      title={user.name}
      subtitle={`Membre depuis le ${createdAtFormatter.format(user.createdAt)}`}
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
