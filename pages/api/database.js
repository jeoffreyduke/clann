import {
  getDatabase,
  ref,
  set,
  onValue,
  update,
  remove,
  push,
} from "firebase/database";

export function clearAllUsers() {
  const db = getDatabase();
  const userRef = ref(db, "users/");

  remove(userRef);
}

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
  joined,
  reaction,
  background
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
    reaction,
    background,
  });
}

// add notification into the notification array
export function createNotification(userId, notification, data, seen, roomId) {
  const db = getDatabase();
  const notifsRef = ref(db, "users/" + `${userId}/notifications`);

  // push the notification and data into the array
  if (!roomId) {
    push(notifsRef, { notification, data, seen });
  } else {
    push(notifsRef, { notification, data, seen, roomId });
  }
}

export function updateSeen(userId, notifId) {
  const db = getDatabase();
  const notifRef = ref(db, "users/" + `${userId}/notifications/${notifId}`);
  update(notifRef, { seen: true });
}

export function addReactionToUser(userId, reaction) {
  const db = getDatabase();
  const userRef = ref(db, "users/" + userId);

  update(userRef, {
    reaction,
  });
}

export function getUserReaction(userId) {
  const db = getDatabase();
  const reactionRef = ref(db, "users/" + `${userId}/` + "reaction/");

  return onValue(reactionRef, (snapshot) => {
    return snapshot.val();
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
  about,
  inSession
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
    inSession,
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

export const addRoomToFavorite = (
  userId,
  roomId,
  name,
  subject,
  inviteOnly,
  adultsOnly,
  anonymous,
  createdBy,
  createdOn,
  about
) => {
  const db = getDatabase();
  const userRef = ref(db, "users/" + `${userId}/` + "favorites/" + roomId);

  set(userRef, {
    name,
    subject,
    inviteOnly,
    adultsOnly,
    anonymous,
    createdBy,
    createdOn,
    about,
  });
};

export const removeRoomFromFavorite = (userId, roomId) => {
  const db = getDatabase();
  const userRef = ref(db, "users/" + `${userId}/` + "favorites/" + roomId);

  remove(userRef);
};

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

export function updateRoomAbout(roomId, about) {
  const db = getDatabase();
  const roomRef = ref(db, "rooms/" + `${roomId}`);

  update(roomRef, {
    about,
  });
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

export function updateInSession(roomId, inSession) {
  const db = getDatabase();
  const roomRef = ref(db, "rooms/" + `${roomId}`);

  update(roomRef, {
    inSession,
  });
}

export function refreshCount(userId) {
  const db = getDatabase();
  const userRef = ref(db, "users/" + `${userId}/`);

  update(userRef, {
    notifCount: 0,
  });
}

export function switchBg(userId, background) {
  const db = getDatabase();
  const userRef = ref(db, "users/" + `${userId}/`);

  update(userRef, {
    background,
  });
}

export function removeUserFromRoom(userId, roomId) {
  const db = getDatabase();
  const roomUserRef = ref(db, "rooms/" + `${roomId}/` + "users/" + userId);

  remove(roomUserRef);
}

export function deleteRoom(roomId) {
  const db = getDatabase();
  const roomRef = ref(db, "rooms/" + `${roomId}`);

  remove(roomRef);
}
