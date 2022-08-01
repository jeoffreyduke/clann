import React, { useState, useEffect, useRef } from "react";
import styles from "../styles/Room.module.css";
import { firebaseConfig } from "../pages/index";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { handleAllRooms } from "../provider/allRoomsSlice";
import {
  updateUserReaction,
  updateUserNotifications,
} from "../provider/allUsersSlice";
import {
  updateFavorites,
  refreshFavorite,
  updateReaction,
  updateNotifications,
} from "../provider/userSlice";
import { updateAbout } from "../provider/roomSlice";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import {
  addReactionToUser,
  getUserReaction,
  updateInSession,
  addRoomToFavorite,
  removeRoomFromFavorite,
  updateRoomAbout,
  removeUserFromRoom,
  deleteRoom,
  createNotification,
} from "../pages/api/database";
import { getDatabase, onValue, ref } from "firebase/database";
import {
  config,
  useClient,
  useMicrophoneAudioTrack,
} from "../pages/api/streaming/settings";
import dynamic from "next/dynamic";
import toggleHelper from "../customHooks/toggleHelper";
import { trimName } from "../customHooks/trimName";
import { Avatar, AvatarGroup } from "@mui/material";
import MoreHorizOutlined from "@mui/icons-material/MoreHorizOutlined";
import AddReactionOutlinedIcon from "@mui/icons-material/AddReactionOutlined";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";

function RoomComp() {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const [userr] = useAuthState(auth);
  const dispatch = useDispatch();
  const selector = useSelector(handleAllRooms);
  const rooms = selector.payload.allRoomsSlice.value;
  const user = selector.payload.userSlice.value;
  const users = selector.payload.allUsersSlice.value;
  const router = useRouter();
  const { roomId } = router.query;
  const [idActive, setIdActive] = useState(false);
  const [roomActive, setRoomActive] = useState(false);
  const [drop, setDrop] = useState(false);
  const [reaction, setReaction] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [about, setAbout] = useState("");

  const client = useClient();
  const { ready, track } = useMicrophoneAudioTrack();
  const [roomUsers, setRoomUsers] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  //const AgoraRTC = (await import("agora-rtc-sdk-ng")).default;
  // const client = AgoraRTC.createClient(config);
  //const { ready, track } = AgoraRTC.createMicrophoneAudioTrack();

  useEffect(() => {
    if (typeof window === "undefined") {
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    const db = getDatabase();
    const sessionRef = ref(db, `rooms/${roomId}/inSession`);

    onValue(sessionRef, (snapshot) => {
      const inSession = snapshot.val();
      setRoomActive(inSession);
    });

    if (roomActive === false) return;

    let init = async (name) => {
      client.on("user-published", async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        console.log("subscribe success");

        if (mediaType === "audio") {
          console.log("user added" + user);
          user.audioTrack.play();
          setRoomUsers((prev) => [...prev, user]);
          console.log("user added" + user);
        }
      });

      client.on("user-unpublished", async (user) => {
        if (user.audioTrack) {
          user.audioTrack.stop();
        }
        // Unsubscribe from the track of the remote user.
        setRoomUsers((prev) => prev.filter((u) => u.id !== user.id));
        await client.unsubscribe(user);
      });

      client.on("user-left", async (user) => {
        setRoomUsers((prev) => prev.filter((u) => u.id !== user.id));
      });

      try {
        await client.join(config.appId, name, config.token, userr.uid);
      } catch (error) {
        console.log(error);
      }

      if (track) await client.publish(track);
    };

    if (ready && track) {
      try {
        init(roomId);
      } catch (error) {
        console.log(error);
      }
    }

    /* eslint-disable */
  }, [client, track, ready, roomId, roomActive]);

  // kick a specific user from the channel
  const kickUser = async (userId) => {
    await removeUserFromRoom(userId, roomId);
    // check if channel is active

    // find user in roomUsers array
    const user = roomUsers.find((u) => u.id === userId);

    if (roomActive) {
      await client.unsubscribe(user);
    }
    setRoomUsers((prev) => prev.filter((u) => u.id !== userId));
  };
  console.log([roomUsers]);

  const handleEditAbout = (e) => {
    setAbout(e.target.value);
    console.log(about);
  };

  const handleSave = () => {
    if (about.length > 0) {
      updateRoomAbout(roomId, about);
      dispatch(updateAbout(about));
      setAbout("");
      setShowEdit(false);
    }
  };

  const handleStartSession = () => {
    updateInSession(roomId, true);

    const db = getDatabase();
    const sessionRef = ref(db, `rooms/${roomId}/inSession`);

    onValue(sessionRef, (snapshot) => {
      const inSession = snapshot.val();
      setRoomActive(inSession);
    });

    Object.keys(users).forEach((key) => {
      if (
        users[key].favorites &&
        Object.keys(users[key]?.favorites).includes(roomId)
      ) {
        createNotification(
          key,
          ` room in your favorites; is now in session.`,
          rooms[roomId],
          false,
          roomId
        );

        const db = getDatabase();
        const notifsRef = ref(db, "users/" + `${key}/notifications`);

        onValue(notifsRef, (snapshot) => {
          dispatch(
            updateUserNotifications({
              userId: key,
              notifications: snapshot.val(),
            })
          );
        });

        console.log("notification sent");
      }
    });
  };

  const handleEndSession = () => {
    updateInSession(roomId, false);

    const db = getDatabase();
    const sessionRef = ref(db, `rooms/${roomId}/inSession`);

    onValue(sessionRef, (snapshot) => {
      const inSession = snapshot.val();
      setRoomActive(inSession);
    });

    track.close();
    client.leave();
  };

  const handleLeaveRoom = () => {
    track.close();
    client.leave();

    handleRemoveFromFavorite();

    removeUserFromRoom(userr.uid, roomId);
    router.push("/");

    Object.keys(users).forEach((key) => {
      if (
        users[key].name === rooms[roomId]?.createdBy.name &&
        key !== userr.uid
      ) {
        createNotification(key, ` just left your room.`, user, false);
        console.log(users[key].notifications);

        const db = getDatabase();
        const notifsRef = ref(db, "users/" + `${key}/notifications`);

        onValue(notifsRef, (snapshot) => {
          dispatch(
            updateUserNotifications({
              userId: key,
              notifications: snapshot.val(),
            })
          );
        });
      }
    });
  };

  const handleDeleteRoom = () => {
    router.push("/");
    deleteRoom(roomId);

    handleRemoveFromFavorite();
  };

  const handleAddToFavorite = () => {
    addRoomToFavorite(
      userr.uid,
      roomId,
      rooms[roomId]?.name,
      rooms[roomId]?.subject,
      rooms[roomId]?.inviteOnly,
      rooms[roomId]?.adultsOnly,
      rooms[roomId]?.anonymous,
      rooms[roomId]?.createdBy,
      rooms[roomId]?.createdOn,
      rooms[roomId]?.about
    );

    const db = getDatabase();
    const favRef = ref(db, `users/${userr.uid}/favorites/`);

    onValue(favRef, (snapshot) => {
      const favorites = snapshot.val();
      console.log(favorites);
      dispatch(updateFavorites(favorites));
    });
  };

  const handleRemoveFromFavorite = () => {
    removeRoomFromFavorite(userr.uid, roomId);

    const db = getDatabase();
    const favRef = ref(db, `users/${userr.uid}/favorites/`);

    onValue(favRef, (snapshot) => {
      const favorites = snapshot.val();
      dispatch(updateFavorites(favorites));
    });
  };

  const handleDrop = () => {
    setDrop(!drop);
  };

  const handleShowReactions = () => {
    setShowReactions(!showReactions);
  };

  const handleSetReaction = (src) => {
    addReactionToUser(userr.uid, src);

    dispatch(updateReaction(src));
    dispatch(updateUserReaction({ userId: userr.uid, reaction: src }));

    setReaction(true);
    setTimeout(() => {
      addReactionToUser(userr.uid, "");

      dispatch(updateReaction(""));
      dispatch(updateUserReaction({ userId: userr.uid, reaction: "" }));

      setReaction(false);
    }, 1500);
  };

  const dropRef = useRef(null);
  const [listening, setListening] = useState(false);
  /* eslint-disable */
  useEffect(toggleHelper(listening, setListening, dropRef, setDrop));
  useEffect(toggleHelper(listening, setListening, dropRef, setShowReactions));

  useEffect(() => {
    //dispatch(refreshFavorite());
    if (router.isReady && userr) {
      setIdActive(true);

      addReactionToUser(userr.uid, "");
      dispatch(updateReaction(""));
      dispatch(updateUserReaction({ userId: userr.uid, reaction: "" }));
    }
  }, [router.isReady, userr]);

  useEffect(() => {
    if (window.innerWidth <= 900) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  }, [window.innerWidth]);

  return (
    <div>
      <Head>
        <title>{rooms[roomId]?.name} / Clann</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.header} ref={dropRef}>
        <div className={styles.title}>{rooms[roomId]?.name}</div>
        <div className={styles.headerCon}>
          <div className={styles.roomUsers}>
            <AvatarGroup
              className={styles.AvatarGroup}
              max={3}
              total={
                idActive && rooms[roomId]
                  ? Object.keys(rooms[roomId]?.users).length
                  : 0
              }
            >
              {idActive && rooms[roomId]
                ? Object.keys(rooms[roomId]?.users).map((user) => (
                    <Avatar
                      key={user + Math.random()}
                      alt={users[user].name}
                      src={users[user].profile_pic}
                      sx={{
                        height: isMobile ? "26px" : "50px",
                        width: isMobile ? "26px" : "50px",
                      }}
                    />
                  ))
                : ""}
            </AvatarGroup>
          </div>

          <div className={styles.headerIcons}>
            <div
              className={!showReactions ? styles.react : styles.reactActive}
              onClick={handleShowReactions}
            >
              <AddReactionOutlinedIcon
                sx={{
                  height: isMobile ? "20px" : null,
                  width: isMobile ? "20px" : null,
                }}
              />
            </div>

            <div
              className={!drop ? styles.more : styles.moreActive}
              onClick={handleDrop}
            >
              <MoreHorizOutlined
                sx={{
                  height: isMobile ? "20px" : null,
                  width: isMobile ? "20px" : null,
                }}
              />
            </div>
          </div>

          <div
            className={showReactions ? styles.reactions : styles.noReactions}
          >
            <Image
              onClick={() => handleSetReaction("/assets/heart.png")}
              className={styles.reactIcons}
              src="/assets/heart.png"
              alt="logo"
              height={isMobile ? 20 : 26}
              width={isMobile ? 20 : 26}
              id="heart"
            />
            <Image
              onClick={() => handleSetReaction("/assets/laugh.png")}
              className={styles.reactIcons}
              src="/assets/laugh.png"
              alt="logo"
              height={isMobile ? 20 : 26}
              width={isMobile ? 20 : 26}
            />
            <Image
              onClick={() => handleSetReaction("/assets/congrats.png")}
              className={styles.reactIcons}
              src="/assets/congrats.png"
              alt="logo"
              height={isMobile ? 20 : 26}
              width={isMobile ? 20 : 26}
              style={{ marginRight: "1rem" }}
            />
            <Image
              onClick={() => handleSetReaction("/assets/support.png")}
              className={styles.reactIcons}
              src="/assets/support.png"
              alt="logo"
              height={isMobile ? 20 : 26}
              width={isMobile ? 20 : 26}
            />
            <Image
              onClick={() => handleSetReaction("/assets/bye.png")}
              className={styles.reactIcons}
              src="/assets/bye.png"
              alt="logo"
              height={isMobile ? 20 : 26}
              width={isMobile ? 20 : 26}
            />
          </div>

          <div className={drop ? styles.dropDown : styles.noDrop}>
            <div className={styles.aboutName}>{rooms[roomId]?.name}</div>
            {user.name === rooms[roomId]?.createdBy.name ? (
              rooms[roomId]?.about ? (
                <div className={styles.aboutContent}>
                  {rooms[roomId]?.about}
                  <br />
                  {!showEdit ? (
                    <button
                      className={styles.leave}
                      onClick={() => setShowEdit(!showEdit)}
                    >
                      Edit about
                    </button>
                  ) : (
                    <button className={styles.leave} onClick={handleSave}>
                      Save Changes
                    </button>
                  )}

                  {showEdit ? (
                    <textarea
                      className={styles.editAbout}
                      onChange={handleEditAbout}
                      value={about}
                      type="text"
                      placeholder="Edit about"
                      rows={5}
                      maxLength={300}
                    />
                  ) : (
                    ""
                  )}
                </div>
              ) : (
                <div className={styles.aboutContent}>
                  {!showEdit ? (
                    <button
                      className={styles.leave}
                      onClick={() => setShowEdit(!showEdit)}
                    >
                      Add about
                    </button>
                  ) : (
                    <button className={styles.leave} onClick={handleSave}>
                      Save Changes
                    </button>
                  )}

                  {showEdit ? (
                    <textarea
                      className={styles.editAbout}
                      onChange={handleEditAbout}
                      value={about}
                      type="text"
                      placeholder="Edit about"
                      rows={5}
                      maxLength={300}
                    />
                  ) : (
                    ""
                  )}
                </div>
              )
            ) : (
              <div className={styles.aboutContent}>{rooms[roomId]?.about}</div>
            )}

            <div className={styles.aboutInfo}>
              <div className={styles.infoUsers}>
                {idActive && rooms[roomId] ? (
                  <p className={styles.userTotal}>
                    {Object.keys(rooms[roomId]?.users).length} Members
                  </p>
                ) : (
                  ""
                )}
              </div>
              <div className={styles.infoCreated}>
                <p>Created {rooms[roomId]?.createdOn}</p>
              </div>
            </div>
            <div className={styles.aboutBtns}>
              {user.favorites &&
              Object.keys(user?.favorites).includes(roomId) ? (
                <button
                  className={styles.favs}
                  onClick={handleRemoveFromFavorite}
                >
                  Remove room from favorites
                </button>
              ) : (
                <button className={styles.favs} onClick={handleAddToFavorite}>
                  Add room to favorites
                </button>
              )}

              <br />
              {user.name === rooms[roomId]?.createdBy.name ? (
                <button className={styles.leave} onClick={handleDeleteRoom}>
                  Delete Room
                </button>
              ) : (
                <button className={styles.leave} onClick={handleLeaveRoom}>
                  Leave Room
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {user.name === rooms[roomId]?.createdBy.name ? (
        <div className={styles.begin}>
          {!roomActive ? (
            <button onClick={handleStartSession}>Start</button>
          ) : (
            <button onClick={handleEndSession}>End</button>
          )}
        </div>
      ) : (
        ""
      )}

      <div className={styles.participators}>
        {user.name !== rooms[roomId]?.createdBy.name ? (
          <>
            {Object.keys(users)
              .filter(
                (User) => users[User].name === rooms[roomId]?.createdBy.name
              )
              .map((User) => (
                <div className={styles.pAvatars} key={Math.random() + User}>
                  {users[User].reaction ? (
                    <div className={styles.reaction}>
                      <Image
                        src={users[User].reaction}
                        alt="logo"
                        height={isMobile ? 20 : 30}
                        width={isMobile ? 20 : 30}
                      />
                    </div>
                  ) : (
                    ""
                  )}
                  <Link href={`/user/${users[User].username}`}>
                    <Avatar
                      alt={users[User].name}
                      src={users[User].profile_pic}
                      sx={{
                        height: isMobile ? "26px" : "50px",
                        width: isMobile ? "26px" : "50px",
                      }}
                    />
                  </Link>

                  <div className={styles.userName}>
                    {trimName(users[User].name, 11)}
                  </div>
                  <div className={styles.userRole}>Admin</div>
                </div>
              ))}

            <div className={styles.pAvatars}>
              {user.reaction ? (
                <div className={styles.reaction}>
                  <Image
                    src={user.reaction}
                    alt="logo"
                    height={isMobile ? 20 : 30}
                    width={isMobile ? 20 : 30}
                  />
                </div>
              ) : (
                ""
              )}
              <Link href={`/user/${user.username}`}>
                <Avatar
                  alt={user.name}
                  src={user.profile_pic}
                  sx={{
                    height: isMobile ? "26px" : "50px",
                    width: isMobile ? "26px" : "50px",
                  }}
                />
              </Link>
              <div className={styles.userName}>{trimName(user.name, 11)}</div>
              <div className={styles.userRole}>Member</div>
            </div>
          </>
        ) : (
          <div className={styles.pAvatars}>
            {user.reaction ? (
              <div className={styles.reaction}>
                <Image
                  src={user.reaction}
                  alt="logo"
                  height={isMobile ? 20 : 30}
                  width={isMobile ? 20 : 30}
                />
              </div>
            ) : (
              ""
            )}
            <Link href={`/user/${user.username}`}>
              <Avatar
                alt={user.name}
                src={user.profile_pic}
                sx={{
                  height: isMobile ? "26px" : "50px",
                  width: isMobile ? "26px" : "50px",
                }}
              />
            </Link>
            <div className={styles.userName}>{trimName(user.name, 11)}</div>
            <div className={styles.userRole}>Admin</div>
          </div>
        )}

        {idActive && rooms[roomId]
          ? Object.keys(rooms[roomId]?.users)
              .filter(
                (usertemp) =>
                  users[usertemp].name !== rooms[roomId]?.createdBy.name &&
                  users[usertemp].name !== user.name
              )
              .map((usertemp) => (
                <div className={styles.pAvatars} key={Math.random() + user}>
                  {users[usertemp].reaction ? (
                    <div className={styles.reaction}>
                      <Image
                        src={users[usertemp].reaction}
                        alt="logo"
                        height={isMobile ? 20 : 30}
                        width={isMobile ? 20 : 30}
                      />
                    </div>
                  ) : (
                    ""
                  )}

                  <Link href={`/user/${users[usertemp].username}`}>
                    <Avatar
                      alt={users[usertemp].name}
                      src={users[usertemp].profile_pic}
                      sx={{
                        height: isMobile ? "26px" : "50px",
                        width: isMobile ? "26px" : "50px",
                      }}
                    />
                  </Link>

                  <div className={styles.userName}>
                    {trimName(users[usertemp].name, 11)}
                  </div>
                  <div className={styles.userRole}>member</div>
                  <div className={styles.kickOut}></div>
                </div>
              ))
          : ""}
      </div>
    </div>
  );
}

export default RoomComp;
