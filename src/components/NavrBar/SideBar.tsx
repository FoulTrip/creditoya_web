import React, { useState } from "react";
import styles from "./nav.module.css";
import { TbMenuDeep, TbUserCircle } from "react-icons/tb";
import { useGlobalContext } from "@/context/Auth";
import { useRouter } from "next/navigation";
import Avatar from "react-avatar";
import { Sidebar } from "primereact/sidebar";

function SideBar() {
  const [open, setOpen] = useState<boolean>(false);
  const { user } = useGlobalContext();
  const router = useRouter();

  const [visibleRight, setVisibleRight] = useState<boolean>(false);

  const handleOpenSide = () => {
    setOpen(!open);
  };

  return (
    <>
      {!visibleRight && (
        <>
          <div
            className={styles.btnOptLogin}
            onClick={
              user
                ? () => router.push(`/profile/${user?.id}`)
                : () => router.push(`/auth`)
            }
          >
            <div className={styles.centerIconBtn}>
              {user ? (
                <Avatar
                  src={user.avatar}
                  className={styles.avatar}
                  round={true}
                  size="25"
                />
              ) : (
                <TbUserCircle className={styles.iconBtn} size={25} />
              )}
            </div>
            {user ? <p>{user.name.split(" ")[0]}</p> : <p>Cuenta</p>}
          </div>
          <div className={styles.boxIconMenu}>
            <TbMenuDeep
              className={styles.iconMenu}
              onClick={() => setVisibleRight(true)}
              size={25}
            />
          </div>
        </>
      )}

      <Sidebar
        className={styles.slidebar}
        style={{ padding: "10px", background: "#ffffff" }}
        visible={visibleRight}
        position="right"
        onHide={() => setVisibleRight(false)}
      >
        <h2>Left Sidebar</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </p>
      </Sidebar>
    </>
  );
}

export default SideBar;
