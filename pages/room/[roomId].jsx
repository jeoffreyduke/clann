import React from "react";
import styles from "../../styles/Room.module.css";
import { handleAllRooms } from "../../provider/allRoomsSlice";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { signOut, useSession } from "next-auth/react";
import Header from "../../components/Header";
import Body from "../../components/Body";
import { Avatar, AvatarGroup } from "@mui/material";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import MoreHorizOutlined from "@mui/icons-material/MoreHorizOutlined";
import AddReactionOutlinedIcon from "@mui/icons-material/AddReactionOutlined";

function RoomComp() {
  const selector = useSelector(handleAllRooms);
  const rooms = selector.payload.allRoomsSlice.value;
  const users = selector.payload.allUsersSlice.value;
  const router = useRouter();
  const { roomId } = router.query;

  return (
    <>
      <div className={styles.header}>
        <div className={styles.title}>{rooms[roomId].name}</div>
        <div className={styles.headerCon}>
          <div className={styles.roomUsers}>
            <AvatarGroup
              max={3}
              total={Object.keys(rooms[roomId].users).length}
            >
              {Object.keys(rooms[roomId].users).map((user) => (
                <Avatar
                  key={user + Math.random()}
                  alt={users[user].name}
                  src={users[user].profile_pic}
                />
              ))}
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
        {!users ? (
          <div className={styles.noUsers}>No users</div>
        ) : (
          Object.keys(rooms[roomId].users).map((user) => (
            <div className={styles.pAvatars} key={Math.random() + user}>
              <Avatar alt={users[user].name} src={users[user].profile_pic} />
              <div className={styles.userName}>{users[user].name}</div>
              <div className={styles.userRole}>Admin</div>
            </div>
          ))
        )}
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
