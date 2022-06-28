import React, { useState, useEffect, useRef, useContext } from "react";
import styles from "../../styles/Room.module.css";
import { handleAllRooms } from "../../provider/allRoomsSlice";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { signOut, useSession } from "next-auth/react";
import io from "socket.io-client";
import Peer from "simple-peer";
import Header from "../../components/Header";
import Body from "../../components/Body";
import { Avatar, AvatarGroup } from "@mui/material";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import MoreHorizOutlined from "@mui/icons-material/MoreHorizOutlined";
import AddReactionOutlinedIcon from "@mui/icons-material/AddReactionOutlined";

function RoomComp() {
  const selector = useSelector(handleAllRooms);
  const rooms = selector.payload.allRoomsSlice.value;
  const user = selector.payload.userSlice.value;
  const users = selector.payload.allUsersSlice.value;
  const router = useRouter();
  const { roomId } = router.query;
  const [idActive, setIdActive] = useState(false);
  const [roomActive, setRoomActive] = useState(false);
  const [peers, setPeers] = useState([]);
  const socketRef = useRef();
  const userAudio = useRef();
  const peersRef = useRef([]);

  useEffect(() => {
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
    <>
      <div className={styles.header}>
        <div className={styles.title}>{rooms[roomId]?.name}</div>
        <div className={styles.headerCon}>
          <div className={styles.roomUsers}>
            <AvatarGroup
              max={3}
              total={idActive ? Object.keys(rooms[roomId]?.users).length : ""}
            >
              {idActive
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
            <div className={styles.more}>
              <MoreHorizOutlined />
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
        {idActive
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
    </>
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
