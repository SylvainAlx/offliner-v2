import { useState, type FormEvent } from "react";
import { useUser } from "../stores/userStore";

export function useProfile() {
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
  return {
    createdAt: user.createdAt,
    name,
    setName,
    isSaved,
    setIsSaved,
    handleSubmit,
  };
}
