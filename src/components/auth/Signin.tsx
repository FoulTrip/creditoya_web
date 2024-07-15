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
      console.log(response)
      const data: AuthUser = response.data.data;

      if (response.data.success) {
        setUserData(data);
        toast.success(`Bienvenido de nuevo ${data.names}`);
        setTimeout(() => {
          route.push("/");
        }, 3000);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
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
