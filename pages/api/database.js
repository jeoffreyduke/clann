import { getDatabase, ref, set, onValue, update } from "firebase/database";

export function createUser(userId, name, email, imageUrl) {
  const db = getDatabase();
  const userRef = ref(db, "users/" + userId);

  set(userRef, {
    name: name,
    email: email,
    profile_pic: imageUrl,
  });
}
