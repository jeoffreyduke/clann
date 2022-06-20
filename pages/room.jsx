import React from "react";
import styles from "../styles/Room.module.css";
import { signOut, useSession } from "next-auth/react";
import Header from "../components/Header";
import Body from "../components/Body";
import { Avatar, AvatarGroup } from "@mui/material";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import MoreHorizOutlined from "@mui/icons-material/MoreHorizOutlined";
import AddReactionOutlinedIcon from "@mui/icons-material/AddReactionOutlined";

function RoomComp() {
  return (
    <>
      <div className={styles.header}>
        <div className={styles.title}>Alcoholics Anonymous</div>
        <div className={styles.headerCon}>
          <div className={styles.roomUsers}>
            <AvatarGroup max={3} total={126}>
              <Avatar />
              <Avatar />
              <Avatar />
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
      <div className={styles.participators}>
        <div className={styles.pAvatars}>
          <Avatar />
          <div className={styles.userName}>Lorem Ipsum</div>
          <div className={styles.userRole}>Admin</div>
        </div>
        <div className={styles.pAvatars}>
          <Avatar />
          <div className={styles.userName}>Lorem Ipsum</div>
          <div className={styles.userRole}>Moderator</div>
        </div>
        <div className={styles.pAvatars}>
          <Avatar />
          <div className={styles.userName}>Lorem Ipsum</div>
          <div className={styles.userRole}>Member</div>
        </div>
        <div className={styles.pAvatars}>
          <Avatar />
          <div className={styles.userName}>Lorem Ipsum</div>
          <div className={styles.userRole}>Member</div>
        </div>
        <div className={styles.pAvatars}>
          <Avatar />
          <div className={styles.userName}>Lorem Ipsum</div>
          <div className={styles.userRole}>Member</div>
        </div>
        <div className={styles.pAvatars}>
          <Avatar />
          <div className={styles.userName}>Lorem Ipsum</div>
          <div className={styles.userRole}>Member</div>
        </div>
        <div className={styles.pAvatars}>
          <Avatar />
          <div className={styles.userName}>Lorem Ipsum</div>
          <div className={styles.userRole}>Member</div>
        </div>
        <div className={styles.pAvatars}>
          <Avatar />
          <div className={styles.userName}>Lorem Ipsum</div>
          <div className={styles.userRole}>Member</div>
        </div>
        <div className={styles.pAvatars}>
          <Avatar />
          <div className={styles.userName}>Lorem Ipsum</div>
          <div className={styles.userRole}>Member</div>
        </div>
        <div className={styles.pAvatars}>
          <Avatar />
          <div className={styles.userName}>Lorem Ipsum</div>
          <div className={styles.userRole}>Member</div>
        </div>
        <div className={styles.pAvatars}>
          <Avatar />
          <div className={styles.userName}>Lorem Ipsum</div>
          <div className={styles.userRole}>Member</div>
        </div>
        <div className={styles.pAvatars}>
          <Avatar />
          <div className={styles.userName}>Lorem Ipsum</div>
          <div className={styles.userRole}>Member</div>
        </div>
        <div className={styles.pAvatars}>
          <Avatar />
          <div className={styles.userName}>Lorem Ipsum</div>
          <div className={styles.userRole}>Member</div>
        </div>
        <div className={styles.pAvatars}>
          <Avatar />
          <div className={styles.userName}>Lorem Ipsum</div>
          <div className={styles.userRole}>Member</div>
        </div>
        <div className={styles.pAvatars}>
          <Avatar />
          <div className={styles.userName}>Lorem Ipsum</div>
          <div className={styles.userRole}>Member</div>
        </div>
        <div className={styles.pAvatars}>
          <Avatar />
          <div className={styles.userName}>Lorem Ipsum</div>
          <div className={styles.userRole}>Member</div>
        </div>
        <div className={styles.pAvatars}>
          <Avatar />
          <div className={styles.userName}>Lorem Ipsum</div>
          <div className={styles.userRole}>Member</div>
        </div>
        <div className={styles.pAvatars}>
          <Avatar />
          <div className={styles.userName}>Lorem Ipsum</div>
          <div className={styles.userRole}>Member</div>
        </div>
        <div className={styles.pAvatars}>
          <Avatar />
          <div className={styles.userName}>Lorem Ipsum</div>
          <div className={styles.userRole}>Member</div>
        </div>
        <div className={styles.pAvatars}>
          <Avatar />
          <div className={styles.userName}>Lorem Ipsum</div>
          <div className={styles.userRole}>Member</div>
        </div>
      </div>
    </>
  );
}

function room() {
  return (
    <>
      <Header />
      <Body midComp={RoomComp()} />
    </>
  );
}

export default room;
