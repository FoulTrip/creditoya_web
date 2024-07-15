"use client";

import React, { useState } from "react";
import styles from "./page.module.css";
import Image from "next/image";

import logoTripCode from "@/assets/only_object_logo.png";
import Signin from "@/components/auth/Signin";
import Signup from "@/components/auth/Signup";

function OneContent() {
  const [selectLogin, setSelectLogin] = useState("signin");
  return (
    <>
      <main className={styles.main}>
        <div className={styles.centerDiv}>
          <div className={styles.boxImageLogo}>
            <Image
              className={styles.logoIcon}
              src={logoTripCode}
              alt="logo"
              priority={true}
            />
          </div>
          {/* <p>Accede a nuestros servicios</p> */}
          {selectLogin == "signin" ? <Signin /> : null}
          {selectLogin == "signup" ? <Signup /> : null}

          {selectLogin == "signin" && (
            <p className={styles.warnAccount}>
              No tienes cuenta?{" "}
              <span
                className={styles.bntWarn}
                onClick={() => setSelectLogin("signup")}
              >
                Ingresa aqui
              </span>
            </p>
          )}
          {selectLogin == "signup" && (
            <p className={styles.warnAccount}>
              Ya tienes cuenta?{" "}
              <span
                className={styles.bntWarn}
                onClick={() => setSelectLogin("signin")}
              >
                Ingresa aqui
              </span>
            </p>
          )}
        </div>
      </main>
    </>
  );
}

export default OneContent;
