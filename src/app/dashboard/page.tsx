"use client";

import { useGlobalContext } from "@/context/Auth";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import styles from "./page.module.css";

import { useRouter } from "next/navigation";
import Contract from "@/components/documents/Contract";
import { ScalarLoanApplication, ScalarUser } from "@/types/User";

import CardLoan from "@/components/accesories/CardLoan";
import LoadingPage from "@/components/Loaders/LoadingPage";
import { useWebSocket } from "next-ws/client";
import { TbExclamationCircle, TbFingerprint } from "react-icons/tb";
import { handleKeyToString } from "@/handlers/typeToString";
import ChangeDatesPerfil from "@/components/banner/ChangeDatesPerfil";
import Instructions from "@/components/accesories/Instructions";
import Image from "next/image";
import seacrhIlus from "@/assets/Search-bro.svg";

function Dashboard() {
  const router = useRouter();
  const { user } = useGlobalContext();
  const [loading, setLoading] = useState(true);
  const [checkingUser, setCheckingUser] = useState(true);
  const [completeDocs, setCompleteDocs] = useState<boolean | null>(null);
  const [openContract, setOpenContract] = useState<boolean>(false);
  const [Loans, setLoans] = useState<ScalarLoanApplication[] | null>(null);
  const [openInstructions, setOpenInstructions] = useState<boolean>(false);

  const [datesMissing, setDatesMissing] = useState<string[] | null>(null);

  const [openBanner, setOpenBanner] = useState<boolean>(true);

  const ws = useWebSocket();

  const updateLoans = (data: ScalarLoanApplication[]) => {
    setLoans(data);
  };

  useEffect(() => {
    if (user == null && !checkingUser) {
      router.push("/auth");
    }
  }, [user, checkingUser, router]);

  useEffect(() => {
    if (user !== null) {
      setCheckingUser(false);
      const documentsVerify = async () => {
        try {
          const response = await axios.post(
            "/api/user/docs_exist",
            { userId: user.id },
            { headers: { Authorization: `Bearer ${user.token}` } }
          );

          // console.log(response);

          if (response.data.success) {
            const docsMissingsBool = response.data.data.complete;
            const nameMissings = response.data.data.missing;
            setDatesMissing(nameMissings);
            setCompleteDocs(docsMissingsBool);
          } else {
            setCompleteDocs(false);
          }
        } catch (error) {
          console.error("Error verifying documents:", error);
          setCompleteDocs(false);
        } finally {
          setLoading(false);
        }
      };

      documentsVerify();
    } else {
      setLoading(false);
      setCheckingUser(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const getAllLoans = async () => {
        try {
          const response = await axios.post(
            "/api/user/loans",
            { userId: user.id },
            { headers: { Authorization: `Bearer ${user.token}` } }
          );

          setLoans(response.data.data);
        } catch (error) {
          console.error("Error fetching loans:", error);
        }
      };

      getAllLoans();
    }
  }, [user]);

  const newLoan = useCallback(
    async (event: MessageEvent<Blob>) => {
      console.log(event);
      const JsonEvent = JSON.parse(String(event.data));

      console.log(JsonEvent);

      if (JsonEvent.type === "onNewState") {
        const response = await axios.post(
          "/api/user/loans",
          { userId: user?.id },
          { headers: { Authorization: `Bearer ${user?.token}` } }
        );

        setLoans(response.data.data);
      }
    },
    [user?.id, user?.token]
  );

  useEffect(() => {
    ws?.addEventListener("message", newLoan);
    return () => ws?.removeEventListener("message", newLoan);
  }, [newLoan, ws]);

  const handleOpenContract = () => {
    setOpenContract(!openContract);
  };

  const toggleContract = () => {
    setOpenContract(!openContract);
  };

  const handleCloseBanner = () => {
    setOpenBanner(false);
  };

  if (loading || checkingUser) {
    return <LoadingPage />;
  }

  if (completeDocs === true) {
    return (
      <main className={styles.containerDashboard}>
        {!openContract && Loans && (
          <>
            {openBanner && Loans.length > 0 && (
              <ChangeDatesPerfil
                userId={user?.id as string}
                onClose={handleCloseBanner}
              />
            )}

            {!openInstructions && (
              <>
                <div className={styles.btnNew}>
                  <h5 onClick={handleOpenContract}>Solicitar Prestamo</h5>
                  <h5
                    className={styles.inputSearch}
                    onClick={() => setOpenInstructions(true)}
                  >
                    Instrucciones
                  </h5>
                </div>

                <div className={styles.listLoans}>
                  {Loans?.filter((loan) => loan.userId === user?.id).map(
                    (loan) => (
                      <CardLoan key={loan.id} loan={loan} />
                    )
                  )}
                  {Loans.length === 0 && (
                    <div className={styles.containerWait}>
                      <div className={styles.boxWaiting}>
                        <Image
                          src={seacrhIlus}
                          className={styles.iconWait}
                          alt="waiting"
                        />
                      </div>
                      <h1>Sin Solicitudes activas</h1>
                    </div>
                  )}
                </div>
              </>
            )}

            {openInstructions && (
              <Instructions onClose={() => setOpenInstructions(false)} />
            )}
          </>
        )}

        {openContract && (
          <Contract
            toggleContract={toggleContract}
            userId={user?.id as string}
            success={updateLoans}
          />
        )}
      </main>
    );
  }

  if (completeDocs === false) {
    return (
      <div className={styles.mainVoidDocuments}>
        <div className={styles.centerMainVoid}>
          <div className={styles.boxIconVoid}>
            <TbFingerprint className={styles.fingerIcon} size={100} />
          </div>
          <p>Completa tus datos antes de solicitar un prestamo</p>
          <div className={styles.diccMissings}>
            {datesMissing?.map((missing) => (
              <div className={styles.boxCenter} key={missing}>
                <div className={styles.boxIconCircle}>
                  <TbExclamationCircle
                    className={styles.iconWarnCircle}
                    size={20}
                  />
                </div>
                <p>{handleKeyToString(missing)}</p>
              </div>
            ))}
          </div>
          <div className={styles.boxBtnComplete}>
            <button onClick={() => router.push(`/profile/${user?.id}`)}>
              Completar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default Dashboard;
