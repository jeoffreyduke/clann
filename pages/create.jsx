import React, { useState } from "react";
import styles from "../styles/Create.module.css";
import { signOut, useSession } from "next-auth/react";
import Body from "../components/Body";
import Switch from "@mui/material/Switch";
import { styled } from "@mui/material/styles";
import Header from "../components/Header";

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
  const [userdata, setUserdata] = useState({
    roomName: "",
    subject: "",
  });

  return (
    <>
      <div className={styles.heading}>Create your room</div>
      <div className={styles.title}>
        <div className={styles.inputLabel}>
          <label htmlFor="roomName">What will you call your room?</label>
        </div>
        <input
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
          <option value="Alcoholism">Alcoholism</option>
          <option value="Drug Abuse">Drug Abuse</option>
          <option value="Gambling">Gambling</option>
        </select>
      </div>

      <div className={styles.swCon}>
        <div className={styles.switch}>
          <div className={styles.switchLabel}>Invite Only</div>
          <IOSSwitch {...label} defaultChecked={false} />
        </div>
      </div>

      <div className={styles.swCon}>
        <div className={styles.switch}>
          <div className={styles.switchLabel}>Adults Only</div>
          <IOSSwitch {...label} defaultChecked={false} />
        </div>
      </div>

      <div className={styles.swCon}>
        <div className={styles.switch}>
          <div className={styles.switchLabel}>Anonymous</div>
          <IOSSwitch {...label} defaultChecked={false} />
        </div>
      </div>
      <div className={styles.btn}>
        <button>Start it up</button>
      </div>
    </>
  );
}

function Create() {
  const { data: session, status } = useSession();

  return (
    <>
      <Header />
      <Body midComp={CreateComp()} />
    </>
  );
}

export default Create;
