"use client";

import { useGlobalContext } from "@/context/Auth";
import axios from "axios";
import React, { useEffect, useState } from "react";
import styles from "./page.module.css";

import { TbFingerprint } from "react-icons/tb";
import { useRouter } from "next/navigation";

function Dashboard() {
  const router = useRouter();
  const { user } = useGlobalContext();
  const [loading, setLoading] = useState(true);
  const [completeDocs, setCompleteDocs] = useState<boolean | null>(null);

  useEffect(() => {
    const documentsVerify = async () => {
      const response = await axios.post(
        "http://localhost:3000/api/user/docs_exist",
        { userId: user?.id },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      console.log(response.data.success);
      setCompleteDocs(response.data.success);
      setLoading(false);
    };

    if (user) {
      documentsVerify();
    } else {
      setLoading(false);
    }
  }, [user?.id]);

  if (loading) {
    return <div>Cargando...</div>; // Aquí puedes reemplazar con tu componente de carga
  }

  if (user) {
    if (completeDocs) {
      return (
        <>
          <div>Dashboard</div>
        </>
      );
    }

    if (!completeDocs) {
      return (
        <>
          <div className={styles.mainVoidDocuments}>
            <div className={styles.centerMainVoid}>
              <div className={styles.boxIconVoid}>
                <TbFingerprint className={styles.fingerIcon} size={300} />
              </div>
              <p>Completa tus datos antes de requerir un prestamo</p>
              <div className={styles.boxBtnComplete}>
                <button onClick={() => router.push(`/profile/${user.id}`)}>
                  Completar
                </button>
              </div>
            </div>
          </div>
        </>
      );
    }
  } else {
    router.push("/auth");
  }
}

export default Dashboard;
