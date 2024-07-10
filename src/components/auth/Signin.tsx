"use client";

import React, { FormEvent, useState } from "react";
import { Toaster, toast } from "sonner";
import { useRouter } from "next/navigation";
import styles from "./auth.module.css";
import axios from "axios";

import { TbLock, TbMail } from "react-icons/tb";
import { useGlobalContext } from "@/context/Auth";
import { AuthUser } from "@/types/User";

function Signin() {
  const { user, setUserData } = useGlobalContext();
  const route = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/user/signin", formData);
      const data: AuthUser = response.data.data;

      if (data.token) {
        setUserData(data);
        toast.success(`Bienvenido de nuevo ${data.names}`);
        setTimeout(() => {
          route.push("/dashboard");
        }, 3000);
      } else {
        toast.error("Credenciales invalidas");
      }
    } catch (error) {
      toast.error("Failed signin");
    }
  };

  if (user) {
    route.push("/");
  } else {
    return (
      <>
        <Toaster richColors />
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.boxInput}>
            <div className={styles.subBoxIconInput}>
              <TbMail className={styles.iconInput} size={20} />
            </div>
            <input
              className={styles.input}
              type="text"
              name="email"
              placeholder="Correo Electronico"
              onChange={handleChange}
              value={formData.email}
            />
          </div>

          <div className={styles.boxInput}>
            <div className={styles.subBoxIconInput}>
              <TbLock className={styles.iconInput} size={20} />
            </div>
            <input
              className={styles.input}
              type="password"
              name="password"
              placeholder="Contraseña"
              onChange={handleChange}
              value={formData.password}
            />
          </div>

          <div className={styles.btnSubmit}>
            <button type="submit">Ingresar</button>
          </div>
        </form>
      </>
    );
  }
}

export default Signin;
