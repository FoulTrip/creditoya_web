"use client";

import { useGlobalContext } from "@/context/Auth";
import axios from "axios";
import React, { useEffect, useState } from "react";
import styles from "./page.module.css";

import { TbAccessPoint, TbFingerprint } from "react-icons/tb";
import { useRouter } from "next/navigation";
import Contract from "@/components/documents/Contract";
import { ScalarLoanApplication } from "@/types/User";

import CardLoan from "@/components/accesories/CardLoan";
import LoadingPage from "@/components/Loaders/LoadingPage";
import socket from "@/Socket/Socket";
import { ContractProvider } from "@/context/Contract";
import { toast } from "sonner";

function Dashboard() {
  const router = useRouter();
  const { user } = useGlobalContext();
  const [loading, setLoading] = useState(true);
  const [completeDocs, setCompleteDocs] = useState<boolean | null>(null);
  const [openContract, setOpenContract] = useState<boolean>(false);
  const [Loans, setLoans] = useState<ScalarLoanApplication[] | null>(null);

  useEffect(() => {
    const documentsVerify = async () => {
      const response = await axios.post(
        "/api/user/docs_exist",
        { userId: user?.id },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      // console.log(response.data);
      setCompleteDocs(response.data.data);
      setLoading(false);
    };

    if (user) {
      documentsVerify();
    } else {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    const getAllLoans = async () => {
      const response = await axios.post(
        "/api/user/loans",
        {
          userId: user?.id,
        },
        {
          headers: { Authorization: `Bearer ${user?.token}` },
        }
      );

      setLoans(response.data.data);
    };

    getAllLoans();
  }, [user]);

  useEffect(() => {
    socket.on("updateLoan", (data: ScalarLoanApplication[]) => {
      console.log("from server: ", data);
      setLoans(data);
    });

    return () => {
      socket.off("updateLoanClient");
    };
  }, []);

  const handleOpenContract = () => {
    // if (Loans?.length == 1) toast.error("Ya tienes un prestamo activo");
    // if (Loans?.length == 0) setOpenContract(!openContract);

    setOpenContract(!openContract);
  };

  const toggleContract = () => {
    setOpenContract(!openContract); // Cambia el estado de openContract al valor opuesto
  };

  if (loading) {
    return <LoadingPage />; // Aquí puedes reemplazar con tu componente de carga
  }

  if (user) {
    if (completeDocs) {
      return (
        <>
          <ContractProvider>
            <main className={styles.containerDashboard}>
              {!openContract && (
                <div className={styles.btnNew} onClick={handleOpenContract}>
                  <p>Solicitar Prestamo</p>
                </div>
              )}
              {openContract && <Contract toggleContract={toggleContract} />}

              {!openContract && (
                <>
                  {/* <h1 className={styles.titleLoan}>Tus Prestamos</h1> */}
                  {Loans?.length == 0 && (
                    <div className={styles.warnNoLoan}>
                      <div className={styles.canterWarnLoan}>
                        <div className={styles.boxIconNoLoan}>
                          <TbAccessPoint
                            className={styles.iconNoLoan}
                            size={25}
                          />
                        </div>
                        <p>Sin Prestamos activos</p>
                      </div>
                    </div>
                  )}
                  <div className={styles.listLoans}>
                    {Loans?.filter((loan) => loan.userId === user.id).map(
                      (loan) => (
                        <CardLoan key={loan.id} loan={loan} />
                      )
                    )}
                  </div>
                </>
              )}
            </main>
          </ContractProvider>
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
