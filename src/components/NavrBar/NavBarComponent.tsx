"use client";

import React from "react";
import styles from "./nav.module.css";
import Image from "next/image";
import logoNav from "@/assets/logo-tripcode.png";

import { TbUserCircle } from "react-icons/tb";
import { useGlobalContext } from "@/context/Auth";
import Avatar from "react-avatar";
import { useRouter } from "next/navigation";

function NavBar() {
  const { user } = useGlobalContext();
  const router = useRouter();
  // console.log(user)
  return (
    <>
      <nav className={styles.containerNav}>
        <div className={styles.NavBoxLogo}>
          <Image
            className={styles.logoNav}
            src={logoNav}
            alt="logoNav"
            onClick={() => router.push("/")}
          />
        </div>
        <div className={styles.optsBox}>
          <div className={styles.centerOptsBox}>
            {user && <p className={styles.btnOpt} onClick={() => router.push("/dashboard")}>Dashboard</p>}
            <p className={styles.btnOpt}>Nosotros</p>
            <div
              className={styles.btnOptLogin}
              onClick={() => router.push("/auth")}
            >
              <div className={styles.centerIconBtn}>
                {user ? (
                  <Avatar src={user.avatar} round={true} size="25" />
                ) : (
                  <TbUserCircle className={styles.iconBtn} size={25} />
                )}
              </div>
              {user ? <p>{user.name}</p> : <p>Cuenta</p>}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default NavBar;
