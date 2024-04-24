"use client";

import { useGlobalContext } from "@/context/Auth";
import axios from "axios";
import React, { useEffect, useState } from "react";
import styles from "./page.module.css";

import { TbFingerprint } from "react-icons/tb";
import { useRouter } from "next/navigation";
import Contract from "@/components/documents/Contract";

function Dashboard() {
  const router = useRouter();
  const { user } = useGlobalContext();
  const [loading, setLoading] = useState(true);
  const [completeDocs, setCompleteDocs] = useState<boolean | null>(null);
  const [openContract, setOpenContract] = useState<boolean>(false);

  useEffect(() => {
    const documentsVerify = async () => {
      const response = await axios.post(
        "http://localhost:3000/api/user/docs_exist",
        { userId: user?.id },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      console.log(response.data);
      setCompleteDocs(response.data.data);
      setLoading(false);
    };

    if (user) {
      documentsVerify();
    } else {
      setLoading(false);
    }
  }, [user?.id]);

  const handleOpenContract = () => {
    setOpenContract(!openContract);
  };

  const toggleContract = () => {
    setOpenContract(!openContract); // Cambia el estado de openContract al valor opuesto
  };

  if (loading) {
    return <div>Cargando...</div>; // Aquí puedes reemplazar con tu componente de carga
  }

  if (user) {
    if (completeDocs) {
      return (
        <>
          <main className={styles.containerDashboard}>
            {!openContract && (
              <div className={styles.btnNew} onClick={handleOpenContract}>
                <p>Crear nuevo prestamo</p>
              </div>
            )}
            {openContract && <Contract toggleContract={toggleContract} />}
          </main>
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
