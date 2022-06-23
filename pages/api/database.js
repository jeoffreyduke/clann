import { getDatabase, ref, set, onValue, update } from "firebase/database";

export function createUser(
  userId,
  name,
  username,
  email,
  password,
  date,
  imageUrl
) {
  const db = getDatabase();
  const userRef = ref(db, "users/" + userId);

  set(userRef, {
    name: name,
    username: username,
    email: email,
    password: password,
    date: date,
    profile_pic: imageUrl,
  });
}

export function createRoom(
  roomId,
  name,
  subject,
  inviteOnly,
  adultsOnly,
  anonymous
) {
  const db = getDatabase();
  const roomRef = ref(db, "rooms/" + roomId);

  set(roomRef, {
    name: name,
    subject: subject,
    inviteOnly: inviteOnly,
    adultsOnly: adultsOnly,
    anonymous: anonymous,
  });
}
