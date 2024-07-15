"use client"

import React, { useState } from "react";
import styles from "./Sidebar.module.css";
import {
  TbArrowUpRight,
  TbLogout,
  TbMenuDeep,
  TbSettings,
  TbUserCircle,
} from "react-icons/tb";
import { useGlobalContext } from "@/context/Auth";
import { useRouter } from "next/navigation";
import Avatar from "react-avatar";
import { Sidebar } from "primereact/sidebar";

function SideBar() {
  const { user, handleLogout } = useGlobalContext();
  const router = useRouter();

  const [visibleRight, setVisibleRight] = useState<boolean>(false);

  return (
    <>
      {!visibleRight && (
        <>
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
        position="bottom"
        onHide={() => setVisibleRight(false)}
      >
        <div>
          {!user && (
            <>
              <p className={styles.warnBtn}>Ingresar / Crear cuenta</p>
              <div
                className={styles.bntAccounSwift}
                onClick={() => {
                  router.push("/auth");
                  setVisibleRight(false);
                }}
              >
                <div className={styles.boxIconAcount}>
                  <TbUserCircle size={25} />
                </div>
                <p className={styles.centerSwiftBtn}>Cuenta</p>
              </div>
            </>
          )}
          {user && (
            <>
              <div className={styles.bntAccount}>
                <div className={styles.infoUser}>
                  <div className={styles.boxIconAcount}>
                    <Avatar
                      className={styles.avatar}
                      src={user.avatar}
                      alt={"Avatar"}
                      size={"25"}
                      round={true}
                    />
                  </div>
                  <div className={styles.centerSwiftBtn}>
                    <p>{user.names}</p>
                  </div>
                </div>
                <div className={styles.boxOption}>
                  <TbSettings
                    className={styles.iconOption}
                    size={20}
                    onClick={() => {
                      router.push(`/profile/${user.id}`);
                      setVisibleRight(false);
                    }}
                  />
                </div>
                <div className={styles.boxOption}>
                  <TbLogout
                    className={styles.iconOption}
                    size={20}
                    onClick={handleLogout}
                  />
                </div>
              </div>
            </>
          )}
          {user && (
            <div
              className={styles.bntAccounSwift}
              onClick={() => {
                router.push("/dashboard");
                setVisibleRight(false);
              }}
            >
              <p className={styles.centerSwiftBtn}>Solicitar Prestamo</p>
              <div className={styles.boxIconBtn}>
                <TbArrowUpRight className={styles.iconArrow} size={20} />
              </div>
            </div>
          )}
        </div>
      </Sidebar>
    </>
  );
}

export default SideBar;
