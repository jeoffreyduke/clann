import React, { useState } from "react";
import { firebaseConfig } from ".";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { createRoom, addUserToRoom } from "./api/database";
import { useSelector, useDispatch } from "react-redux";
import { handleAllUsers } from "../provider/allUsersSlice";
import styles from "../styles/Create.module.css";
import { signOut, useSession } from "next-auth/react";
import Body from "../components/Body";
import Switch from "@mui/material/Switch";
import { styled } from "@mui/material/styles";
import Header from "../components/Header";
import { useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { uuid } from "uuidv4";
import date from "date-and-time";

const label = { inputProps: { "aria-label": "Record Switch" } };

const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.mode === "dark" ? "#808080" : "#8c52ff",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color:
        theme.palette.mode === "light"
          ? theme.palette.grey[300]
          : theme.palette.grey[600],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === "light" ? "#808080" : "#39393D",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

function CreateComp() {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const [userData, loading, error] = useAuthState(auth);
  const selector = useSelector(handleAllUsers);
  const users = selector.payload.allUsersSlice.value;
  const user = selector.payload.userSlice.value;
  const roomId = uuid();
  const router = useRouter();

  const [roomData, setRoomData] = useState({
    roomName: "",
  });

  const [selectData, setSelectData] = useState("Alcoholism");
  const [inviteChecked, setInviteChecked] = useState(false);
  const [adulthecked, setAdultChecked] = useState(false);
  const [anonymousChecked, setAnonymousChecked] = useState(false);

  const now = new Date();
  const pattern = date.compile("MMM, DD YYYY");

  const handleInviteChecked = (e) => {
    setInviteChecked(e.target.checked);
  };

  const handleAdultChecked = (e) => {
    setAdultChecked(e.target.checked);
  };

  const handleAnonymousChecked = (e) => {
    setAnonymousChecked(e.target.checked);
  };

  const handleRoomData = (e) => {
    setRoomData({
      ...roomData,
      [e.target.name]: e.target.value,
    });
    console.log(roomData);
  };

  const handleSelectData = (e) => {
    setSelectData(e.target.value);
  };

  const handleCreateRoom = (e) => {
    e.preventDefault();

    createRoom(
      roomId,
      roomData.roomName,
      selectData,
      inviteChecked,
      adulthecked,
      anonymousChecked,
      user,
      date.format(now, pattern),
      "",
      false
    );

    addUserToRoom(
      userData.uid,
      user.name,
      user.username,
      user.email,
      user.password,
      user.date,
      user.profile_pic,
      date.format(now, pattern),
      roomId
    );

    router.push(`/room/${roomId}`);
  };

  return (
    <div className={styles.Create}>
      <div className={styles.heading}>Create your room</div>
      <div className={styles.title}>
        <div className={styles.inputLabel}>
          <label htmlFor="roomName">What will you call your room?</label>
        </div>
        <input
          onChange={handleRoomData}
          value={roomData.roomName}
          type="text"
          name="roomName"
          placeholder="Please pick a name that is relevant to the subject"
        />
      </div>
      <div className={styles.select}>
        <div className={styles.selectLabel}>
          <label htmlFor="subject">Subject</label>
        </div>
        <select name="subject" className={styles.subject}>
          <option onClick={handleSelectData} value="Alcoholism">
            Alcoholism
          </option>
          <option onClick={handleSelectData} value="Drug Abuse">
            Drug Abuse
          </option>
          <option onClick={handleSelectData} value="Gambling">
            Gambling
          </option>
        </select>
      </div>

      <div className={styles.swCon}>
        <div className={styles.switch}>
          <div className={styles.switchLabel}>Invite Only</div>
          <IOSSwitch
            {...label}
            checked={inviteChecked}
            onChange={handleInviteChecked}
          />
        </div>
      </div>

      <div className={styles.swCon}>
        <div className={styles.switch}>
          <div className={styles.switchLabel}>Adults Only</div>
          <IOSSwitch
            {...label}
            checked={adulthecked}
            onChange={handleAdultChecked}
          />
        </div>
      </div>

      <div className={styles.swCon}>
        <div className={styles.switch}>
          <div className={styles.switchLabel}>Anonymous</div>
          <IOSSwitch
            {...label}
            checked={anonymousChecked}
            onChange={handleAnonymousChecked}
          />
        </div>
      </div>
      <div className={styles.btn}>
        <button onClick={handleCreateRoom}>Start it up</button>
      </div>
    </div>
  );
}

function Create() {
  const { data: session, status } = useSession();

  return (
    <>
      <Header />
      <Body midComp={<CreateComp />} />
    </>
  );
}

export default Create;
