"use client";

import React, { FormEvent, useState } from "react";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { useRouter } from "next/navigation";
import styles from "./auth.module.css";
import { AuthUser, ScalarUser } from "@/types/User";
import { useGlobalContext } from "@/context/Auth";
import { TbKey, TbMail, TbUserCog } from "react-icons/tb";
// import AvatarUpload from "../AvatarChange";

interface UserTypes {
  name: string;
  avatar?: string;
  password: string;
  email: string;
}

function Signup() {
  const { user, setUserData } = useGlobalContext();
  const route = useRouter();

  const [data, setData] = useState<UserTypes>({
    name: "",
    avatar: "", // Inicialmente, no hay avatar
    password: "",
    email: "",
  });

  // State para manejar el archivo de imagen
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Función para manejar la selección de la imagen
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageFile(file || null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Sube la imagen a /api/avatar y obtén el URL resultante
      let avatarUrl = "";
      if (imageFile) {
        const imageFormData = new FormData();
        imageFormData.append("file", imageFile);

        const imageResponse = await axios.post("/api/avatar", imageFormData);
        avatarUrl = imageResponse.data;
        console.log(imageResponse);
      }

      // Incluye el avatarUrl en el cuerpo de la solicitud para crear el usuario
      const response = await axios.post("/api/user/create", {
        ...data,
        avatar: avatarUrl,
      });

      if (response) {
        console.log(response.data);

        const bodySignin = {
          email: data.email,
          password: data.password,
        };

        const signinRes = await axios.post("/api/user/signin", bodySignin);
        console.log(signinRes)
        const authSession: AuthUser = signinRes.data.data;
        setUserData(authSession);

        if (authSession) {
          toast.success("Usuario creado");

          setTimeout(() => {
            route.push("/");
          }, 3000);
        }
      } else {
        toast.error("Error al crear usuario");
      }
    } catch (error) {
      toast.error("Error al crear usuario");
    }
  };

  return (
    <>
      <Toaster richColors />
      <form onSubmit={handleSubmit} className={styles.form}>

        <div className={styles.boxInput}>
          <div className={styles.subBoxIconInput}>
            <TbUserCog className={styles.iconInput} size={20} />
          </div>
          <input
            className={styles.input}
            type="text"
            name="name"
            placeholder="Nombre Completo"
            onChange={handleChange}
            value={data.name}
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
            placeholder="Email"
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
            placeholder="Password"
            onChange={handleChange}
            value={data.password}
          />
        </div>

        {/* <input
          className={styles.inputImg}
          type="file"
          accept="image/*"
          name="avatar"
          onChange={handleImageChange}
        /> */}

        {/* <AvatarUpload /> */}

        <div className={styles.btnSubmit}>
          <button type="submit">Registrarse</button>
        </div>
      </form>
    </>
  );
}

export default Signup;
