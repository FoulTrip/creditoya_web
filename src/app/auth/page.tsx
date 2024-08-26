"use client";

import React, { useState } from "react";
import styles from "./page.module.css";
import Image from "next/image";

import logoTripCode from "@/assets/only_object_logo.png";
import Signin from "@/components/auth/Signin";
import Signup from "@/components/auth/Signup";
import RecoverPassword from "@/components/auth/RecoverPassword";

function OneContent() {
  const [selectLogin, setSelectLogin] = useState("signin");
  const [recoverPass, setRecoverPass] = useState(false);

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
          {selectLogin == "signin" && recoverPass == false ? <Signin /> : null}
          {selectLogin == "signup" && recoverPass == false ? <Signup /> : null}
          {recoverPass == true && (
            <RecoverPassword onCancel={() => setRecoverPass(false)} />
          )}
          {selectLogin == "signin" && recoverPass == false && (
            <>
              <div>
                <p className={styles.warnAccount}>
                  No tienes cuenta?{" "}
                  <span
                    className={styles.bntWarn}
                    onClick={() => setSelectLogin("signup")}
                  >
                    Crea tu cuenta
                  </span>
                </p>
              </div>

              <div className={styles.boxRecoverPass}>
                <h5 className={styles.textPass}>Olvidaste tu contraseña?</h5>
                <p onClick={() => setRecoverPass(true)}>
                  Recupera tu contraseña
                </p>
              </div>
            </>
          )}

          {selectLogin == "signup" && recoverPass == false && (
            <p className={styles.warnAccount}>
              Ya tienes cuenta?{" "}
              <span
                className={styles.bntWarn}
                onClick={() => setSelectLogin("signin")}
              >
                Ingresa
              </span>
            </p>
          )}
        </div>
      </main>
    </>
  );
}

export default OneContent;
