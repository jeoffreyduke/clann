import React, { useState, useEffect, useRef, useContext } from "react";
import styles from "../../styles/Room.module.css";
import { firebaseConfig } from "../index";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { handleAllRooms } from "../../provider/allRoomsSlice";
import { updateFavorites, refreshFavorite } from "../../provider/userSlice";
import { updateAbout } from "../../provider/roomSlice";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import Peer from "simple-peer";
import Header from "../../components/Header";
import Body from "../../components/Body";
import {
  addRoomToFavorite,
  removeRoomFromFavorite,
  updateRoomAbout,
  removeUserFromRoom,
  deleteRoom,
} from "../api/database";
import { getDatabase, onValue, ref } from "firebase/database";
import toggleHelper from "../../customHooks/toggleHelper";
import { Avatar, AvatarGroup } from "@mui/material";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import MoreHorizOutlined from "@mui/icons-material/MoreHorizOutlined";
import AddReactionOutlinedIcon from "@mui/icons-material/AddReactionOutlined";
import Image from "next/image";

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
  const [peers, setPeers] = useState([]);
  const [drop, setDrop] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [about, setAbout] = useState("");

  const socketRef = useRef();
  const userAudio = useRef();
  const peersRef = useRef([]);

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

  const handleLeaveRoom = () => {
    handleRemoveFromFavorite();

    removeUserFromRoom(userr.uid, roomId);
    router.push("/");
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

  const dropRef = useRef(null);
  const [listening, setListening] = useState(false);
  /* eslint-disable */
  useEffect(toggleHelper(listening, setListening, dropRef, setDrop));

  useEffect(() => {
    //dispatch(refreshFavorite());
    if (router.isReady) {
      setIdActive(true);
    }
  }, [router.isReady]);

  useEffect(() => {
    if (roomActive === false) return;
    socketRef.current = io.connect("/");
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      userAudio.current.srcObject = stream;
      socketRef.current.emit("join room", roomId);
      socketRef.current.on("all users", (users) => {
        const peers = [];
        users.forEach((userID) => {
          const peer = createPeer(userID, socketRef.current.id, stream);
          peersRef.current.push({
            peerID: userID,
            peer,
          });
          peers.push(peer);
        });
        setPeers(peers);
      });

      socketRef.current.on("user joined", (payload) => {
        const peer = addPeer(payload.signal, payload.callerID, stream);
        peersRef.current.push({
          peerID: payload.callerID,
          peer,
        });

        setPeers((users) => [...users, peer]);
      });

      socketRef.current.on("receiving returned signal", (payload) => {
        const item = peersRef.current.find((p) => p.peerID === payload.id);
        item.peer.signal(payload.signal);
      });
    });
  }, [roomId, roomActive]);

  const handleEndSession = () => {
    setRoomActive(false);
    socketRef.current.close();
    router.push("/");
  };

  function createPeer(userToSignal, callerID, stream) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("sending signal", {
        userToSignal,
        callerID,
        signal,
      });
    });

    return peer;
  }

  function addPeer(incomingSignal, callerID, stream) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("returning signal", { signal, callerID });
    });

    peer.signal(incomingSignal);

    return peer;
  }

  return (
    <div>
      <div className={styles.header} ref={dropRef}>
        <div className={styles.title}>{rooms[roomId]?.name}</div>
        <div className={styles.headerCon}>
          <div className={styles.roomUsers}>
            <AvatarGroup
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
                    />
                  ))
                : ""}
            </AvatarGroup>
          </div>

          <div className={styles.headerIcons}>
            <div className={styles.react}>
              <AddReactionOutlinedIcon />
            </div>
            <div className={styles.notif}>
              <NotificationsNoneOutlinedIcon />
            </div>
            <div className={styles.more} onClick={handleDrop}>
              <MoreHorizOutlined />
            </div>
          </div>

          <div className={styles.reactions}>
            <Image
              src="/../../public/assets/heart.png"
              alt="logo"
              height={200}
              width={200}
            />
            <Image
              src="/../../public/assets/laugh.png"
              alt="logo"
              height={200}
              width={200}
            />
            <Image
              src="/../../public/assets/congrats.png"
              alt="logo"
              height={200}
              width={200}
            />
            <Image
              src="/../../public/assets/support.png"
              alt="logo"
              height={200}
              width={200}
            />
            <Image
              src="/../../public/assets/bye.png"
              alt="logo"
              height={200}
              width={200}
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
            <button onClick={() => setRoomActive(true)}>Start</button>
          ) : (
            <button onClick={handleEndSession}>End</button>
          )}
        </div>
      ) : (
        ""
      )}
      <div className={styles.participators}>
        <div className={styles.pAvatars}>
          <Avatar
            alt={rooms[roomId]?.createdBy.name}
            src={rooms[roomId]?.createdBy.profile_pic}
          />
          <div className={styles.userName}>{rooms[roomId]?.createdBy.name}</div>
          <div className={styles.userRole}>Admin</div>
          <div>
            <audio autoPlay ref={userAudio} />
            {peers.map((peer, index) => {
              return <Audio key={index} peer={peer} />;
            })}
          </div>
        </div>
        {idActive && rooms[roomId]
          ? Object.keys(rooms[roomId]?.users)
              .filter(
                (user) => users[user].name !== rooms[roomId]?.createdBy.name
              )
              .map((user) => (
                <div className={styles.pAvatars} key={Math.random() + user}>
                  <Avatar
                    alt={users[user].name}
                    src={users[user].profile_pic}
                  />
                  <div className={styles.userName}>{users[user].name}</div>
                  <div className={styles.userRole}>Admin</div>
                </div>
              ))
          : ""}
      </div>
    </div>
  );
}

// Audio Component
const Audio = (props) => {
  const ref = useRef();

  useEffect(() => {
    props.peer.on("stream", (stream) => {
      ref.current.srcObject = stream;
    });
    /* eslint-disable */
  }, []);

  return <audio autoPlay ref={ref} />;
};

function room() {
  return (
    <>
      <Header />
      <Body midComp={<RoomComp />} />
    </>
  );
}

export default room;
