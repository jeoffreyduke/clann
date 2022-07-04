import { getDatabase, ref, set, onValue, update } from "firebase/database";

export function createUser(
  userId,
  name,
  username,
  email,
  password,
  date,
  imageUrl,
  coverUrl,
  bio,
  favorites,
  joined
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
    cover_photo: coverUrl,
    bio,
    favorites,
    joined,
  });
}

export function createRoom(
  roomId,
  name,
  subject,
  inviteOnly,
  adultsOnly,
  anonymous,
  createdBy,
  createdOn,
  about
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
    createdOn,
    about,
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
  joined,
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
    joined,
  });
}

// destination specific functions (update)
export function updateUser(userId, name, bio) {
  const db = getDatabase();
  const userRef = ref(db, "users/" + `${userId}`);

  if (name.length > 0) {
    update(userRef, {
      name,
    });
  }

  if (bio.length > 0) {
    update(userRef, {
      bio,
    });
  }
}

export function changeBio(userId, bio) {
  const db = getDatabase();
  const userRef = ref(db, "users/" + `${userId}/`);

  if (bio !== "") {
    update(userRef, {
      bio,
    });
  }
}

export function changeDP(userId, imageUrl) {
  const db = getDatabase();
  const userRef = ref(db, "users/" + `${userId}/`);

  if (imageUrl !== "") {
    update(userRef, {
      profile_pic: imageUrl,
    });
  }
}

export function changeCover(userId, coverUrl) {
  const db = getDatabase();
  const userRef = ref(db, "users/" + `${userId}/`);

  if (coverUrl !== "") {
    update(userRef, {
      cover_photo: coverUrl,
    });
  }
}

async function updateProfilePic(file, user, setLoading) {
  const fileRef = store.ref(`profilePics/${user.uid}`);

  const snapshot = await uploadBytes(file, fileRef);
}
