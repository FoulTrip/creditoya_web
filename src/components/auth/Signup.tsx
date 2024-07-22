"use client";

import React, { FormEvent, useState } from "react";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { useRouter } from "next/navigation";
import styles from "./auth.module.css";
import { AuthUser, ScalarUser } from "@/types/User";
import { useGlobalContext } from "@/context/Auth";
import { TbKey, TbMail, TbUserCog } from "react-icons/tb";
import { SendMailSignup } from "@/handlers/sendEmails/SendCreate";
// import AvatarUpload from "../AvatarChange";

interface UserTypes {
  names: string;
  firstLastName: string;
  secondLastName: string;
  avatar?: string;
  password: string;
  email: string;
}

function Signup() {
  const { user, setUserData } = useGlobalContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const route = useRouter();

  const [data, setData] = useState<UserTypes>({
    names: "",
    firstLastName: "",
    secondLastName: "",
    password: "",
    email: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post("/api/user/create", data);

      console.log(response);

      if (response.data.success == true) {
        console.log(response.data);

        const send = await axios.post(
          "/api/mail/welcome",
          {
            name: `${data.names} ${data.firstLastName} ${data.secondLastName}`,
            addressee: data.email,
          },
          { headers: { Authorization: `Bearer ${user?.token}` } }
        );

        console.log(send.data);

        if (send.data.success == true) {
          const bodySignin = {
            email: data.email,
            password: data.password,
          };

          const signinRes = await axios.post("/api/user/signin", bodySignin);
          console.log(signinRes);
          const authSession: AuthUser = signinRes.data.data;
          setUserData(authSession);

          if (authSession) {
            toast.success(`Bienvenido ${authSession.names}`);

            setTimeout(() => {
              route.push("/dashboard");
            }, 2000);
          }
        }
      } else if (response.data.success == false) {
        setIsLoading(false);
        throw new Error(response.data.error);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.boxInput}>
          <div className={styles.subBoxIconInput}>
            <TbUserCog className={styles.iconInput} size={20} />
          </div>
          <input
            className={styles.input}
            type="text"
            name="names"
            placeholder="Nombre(s)"
            onChange={handleChange}
            value={data.names}
          />
        </div>

        <div className={styles.boxInput}>
          <div className={styles.subBoxIconInput}>
            <TbUserCog className={styles.iconInput} size={20} />
          </div>
          <input
            className={styles.input}
            type="text"
            name="firstLastName"
            placeholder="Primer Apellido"
            onChange={handleChange}
            value={data.firstLastName}
          />
        </div>

        <div className={styles.boxInput}>
          <div className={styles.subBoxIconInput}>
            <TbUserCog className={styles.iconInput} size={20} />
          </div>
          <input
            className={styles.input}
            type="text"
            name="secondLastName"
            placeholder="Segundo Apellido"
            onChange={handleChange}
            value={data.secondLastName}
          />
        </div>

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
            value={data.email}
          />
        </div>

        <div className={styles.boxInput}>
          <div className={styles.subBoxIconInput}>
            <TbKey className={styles.iconInput} size={20} />
          </div>
          <input
            className={styles.input}
            type="password"
            name="password"
            placeholder="Contraseña"
            onChange={handleChange}
            value={data.password}
          />
        </div>

        <div className={styles.btnSubmit}>
          <button type="submit">{!isLoading ? "Registrarse" : "Creando..."}</button>
        </div>
      </form>
    </>
  );
}

export default Signup;
