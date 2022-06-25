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
    name,
    username,
    email,
    password,
    date,
    profile_pic: imageUrl,
  });
}

export function createRoom(
  roomId,
  name,
  subject,
  inviteOnly,
  adultsOnly,
  anonymous,
  createdBy
) {
  const db = getDatabase();
  const roomRef = ref(db, "rooms/" + roomId);

  set(roomRef, {
    name,
    subject,
    inviteOnly,
    adultsOnly,
    anonymous,
    createdBy,
  });
}

export function addUserToRoom(
  userId,
  name,
  username,
  email,
  password,
  date,
  imageUrl,
  roomId
) {
  const db = getDatabase();
  const roomUserRef = ref(db, "rooms/" + `${roomId}/` + "users/" + userId);

  set(roomUserRef, {
    name,
    username,
    email,
    password,
    date,
    profile_pic: imageUrl,
  });
}
