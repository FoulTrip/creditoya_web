"use client";

import { useGlobalContext } from "@/context/Auth";
import {
  ScalarDocument,
  ScalarEmployee,
  ScalarLoanApplication,
} from "@/types/User";
import axios from "axios";
import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import { TbArrowLeft } from "react-icons/tb";
import { HiOutlineDocumentChartBar } from "react-icons/hi2";
import { useRouter } from "next/navigation";
import Avatar from "react-avatar";
import Image from "next/image";
import DateToPretty from "@/handlers/DateToPretty";
import { stringToPriceCOP } from "@/handlers/StringToCop";
import LoadingPage from "@/components/Loaders/LoadingPage";

function RequestInfo({ params }: { params: { loanId: string } }) {
  const { user } = useGlobalContext();

  const [infoLoan, setInfoLoan] = useState<ScalarLoanApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [infoEmployee, setInfoEmployee] = useState<ScalarEmployee | null>(null);
  const [documentsInfo, setDocumentsInfo] = useState<ScalarDocument | null>(
    null
  );

  const router = useRouter();

  useEffect(() => {
    const loanInfo = async () => {
      const loanId: string = params.loanId;
      const response = await axios
        .post(
          "/api/loan/id",
          {
            loanId,
          },
          { headers: { Authorization: `Bearer ${user?.token as string}` } }
        )
        .catch((error) => console.log(error));

      if (response?.data.success) {
        // console.log(response);

        const loan: ScalarLoanApplication = response.data.data;
        setInfoLoan(loan);
        // console.log(loan);

        const responseDoc = await axios
          .post(
            "/api/user/doc_id",
            {
              userId: loan.userId,
            },
            { headers: { Authorization: `Bearer ${user?.token}` } }
          )
          .catch((error) => console.log(error));

        if (responseDoc && responseDoc.data.success == true) {
          setDocumentsInfo(responseDoc.data.data);
          // console.log(responseDoc.data.data);
        }

        if (loan.employeeId == "Standby") console.log("Sin asesor");

        if (loan.employeeId !== "Standby") {
          const infoEmployee = await axios
            .post(
              "/employee/id",
              {
                employeeId: loan.employeeId,
              },
              { headers: { Authorization: `Bearer ${user?.token}` } }
            )
            .catch((error) => console.log(error));

          if (infoEmployee && infoEmployee.data.data == "Standby")
            setInfoEmployee(null);

          const employee: ScalarEmployee =
            infoEmployee && infoEmployee.data.data;
          console.log(employee);
          setInfoEmployee(employee);

          response.data.success === true && setInfoLoan(response.data.data);
        }

        setLoading(false);
      }
    };

    loanInfo();
  }, [params.loanId, user?.token]);

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <>
      <main className={styles.mainLoan}>
        <div className={styles.barBack}>
          <div
            className={styles.centerBarBack}
            onClick={() => router.push("/dashboard")}
          >
            <div className={styles.boxIcon}>
              <TbArrowLeft size={20} className={styles.iconArrow} />
            </div>
            <p className={styles.labelBtn}>Volver</p>
          </div>
        </div>
        <h1>Tu Prestamo</h1>
        <p>Solicitud: {infoLoan?.id}</p>

        <h3 className={styles.banckTitle}>Informacion financiera</h3>
        <div className={styles.boxCards}>
          <div className={styles.cardInfoBank}>
            <h5>Numero de cuenta</h5>
            <p>{infoLoan?.bankNumberAccount}</p>
          </div>

          <div className={styles.cardInfoBank}>
            <h5>Tipo de cuenta</h5>
            <p>{infoLoan?.bankSavingAccount && "Cuenta Ahorros"}</p>
          </div>

          <div className={styles.cardInfoBank}>
            <h5>Entidad bancaria</h5>
            <p>{infoLoan?.entity}</p>
          </div>
        </div>

        <div className={styles.barPrevInfo}>
          <div className={styles.containerInfo}>
            <h5 className={styles.headerTitle}>Estatus de solicitud</h5>
            <h2>{infoLoan?.status}</h2>
          </div>

          <div className={styles.containerInfo}>
            <h5 className={styles.headerTitle}>Fecha de solicitud</h5>
            <h2>
              {DateToPretty(infoLoan?.created_at.toString() as string, false)}
            </h2>
          </div>

          <div className={styles.containerInfo}>
            <h5 className={styles.headerTitle}>Solicitud requerida</h5>
            <h2>{stringToPriceCOP(infoLoan?.cantity as string)}</h2>
          </div>

          <div className={styles.containerInfo}>
            <h5 className={styles.headerTitle}>Asesor Encargado</h5>
            <div className={styles.boxTextEmployee}>
              <div className={styles.centerTextEmployee}>
                <div className={styles.boxAvatarEmployee}>
                  <Avatar src={infoEmployee?.avatar} round={true} size={"30"} />
                </div>

                <div className={styles.contactInfo}>
                  <p className={styles.nameEmployee}>
                    {infoEmployee == null
                      ? "Sin Asesor"
                      : `${infoEmployee.name} ${infoEmployee.lastNames}`}
                  </p>
                </div>

                {infoEmployee && (
                  <div className={styles.contactInfo}>
                    <h5>Numero Celular</h5>
                    <p>{infoEmployee?.phone}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.containerPayments}>
          <div>
            <div className={styles.titleSection}>
              <h3>Carta Laboral</h3>
            </div>
            <div className={styles.boxLaborCard}>
              <div className={styles.cardLabor}>
                <div className={styles.headerCardFlyer}>
                  <div className={styles.centerHeaderFlyer}>
                    <div className={styles.boxDocument}>
                      <HiOutlineDocumentChartBar
                        size={20}
                        className={styles.iconDocument}
                      />
                    </div>
                    <h4 className={styles.textHeader}>Documento PDF</h4>
                  </div>
                </div>
                <div className={styles.infoBox}>
                  <p>Carta Laboral</p>
                  <div className={styles.barBtns}>
                    <button
                      onClick={() => router.push(`${infoLoan?.fisrt_flyer}`)}
                    >
                      Ver
                    </button>

                    <button
                      onClick={() => router.push(`${infoLoan?.fisrt_flyer}`)}
                    >
                      Descargar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.backgroundCarts}>
            <div className={styles.titleSection}>
              <h3>Ultimos volantes de pago</h3>
            </div>
            <div className={styles.barCards}>
              <div className={styles.cardFlyer}>
                <div className={styles.headerCardFlyer}>
                  <div className={styles.centerHeaderFlyer}>
                    <div className={styles.boxDocument}>
                      <HiOutlineDocumentChartBar
                        size={20}
                        className={styles.iconDocument}
                      />
                    </div>
                    <h4 className={styles.textHeader}>Documento PDF</h4>
                  </div>
                </div>
                <div className={styles.infoBox}>
                  <p>Primer Volante de pago</p>
                  <div className={styles.barBtns}>
                    <button
                      onClick={() => router.push(`${infoLoan?.fisrt_flyer}`)}
                    >
                      Ver
                    </button>

                    <button
                      onClick={() => router.push(`${infoLoan?.fisrt_flyer}`)}
                    >
                      Descargar
                    </button>
                  </div>
                </div>
              </div>

              <div className={styles.cardFlyer}>
                <div className={styles.headerCardFlyer}>
                  <div className={styles.centerHeaderFlyer}>
                    <div className={styles.boxDocument}>
                      <HiOutlineDocumentChartBar
                        className={styles.iconDocument}
                      />
                    </div>
                    <p className={styles.textHeader}>Documento PDF</p>
                  </div>
                </div>
                <div className={styles.infoBox}>
                  <p>Segundo Volante de pago</p>
                  <div className={styles.barBtns}>
                    <button
                      onClick={() => router.push(`${infoLoan?.fisrt_flyer}`)}
                    >
                      Ver
                    </button>

                    <button
                      onClick={() => router.push(`${infoLoan?.fisrt_flyer}`)}
                    >
                      Descargar
                    </button>
                  </div>
                </div>
              </div>

              <div className={styles.cardFlyer}>
                <div className={styles.headerCardFlyer}>
                  <div className={styles.centerHeaderFlyer}>
                    <div className={styles.boxDocument}>
                      <HiOutlineDocumentChartBar
                        className={styles.iconDocument}
                      />
                    </div>
                    <p className={styles.textHeader}>Documento PDF</p>
                  </div>
                </div>

                <div className={styles.infoBox}>
                  <p>Tercer Volante de pago</p>
                  <div className={styles.barBtns}>
                    <button
                      onClick={() => router.push(`${infoLoan?.fisrt_flyer}`)}
                    >
                      Ver
                    </button>

                    <button
                      onClick={() => router.push(`${infoLoan?.fisrt_flyer}`)}
                    >
                      Descargar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.backgroundDocs}>
            <div className={styles.titleSection}>
              <h3>Documentos de identidad</h3>
            </div>
            <div className={styles.barDocuments}>
              <div className={styles.cardDocs}>
                <h5 className={styles.titleCardDocs}>
                  Documento Identidad (Parte frontal)
                </h5>
                <div className={styles.boxImgDoc}>
                  <Image
                    className={styles.imgDoc}
                    src={documentsInfo?.documentFront as string}
                    alt="document"
                    width={300}
                    height={400}
                  />
                </div>
              </div>

              <div className={styles.cardDocs}>
                <h5 className={styles.titleCardDocs}>
                  Documento Identidad (Parte Trasera)
                </h5>
                <div className={styles.boxImgDoc}>
                  <Image
                    className={styles.imgDoc}
                    src={documentsInfo?.documentBack as string}
                    alt="document"
                    width={300}
                    height={400}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={styles.backgroundOtherFiles}>
            <div className={styles.titleSection}>
              <h3>Otros documentos</h3>
            </div>
            <div className={styles.barCards}>
              <div className={styles.cardFlyer}>
                <div className={styles.headerCardFlyer}>
                  <div className={styles.centerHeaderFlyer}>
                    <div className={styles.boxDocument}>
                      <HiOutlineDocumentChartBar
                        size={20}
                        className={styles.iconDocument}
                      />
                    </div>
                    <h4 className={styles.textHeader}>Volante de Pago</h4>
                  </div>
                </div>
                <div className={styles.infoBox}>
                  <p>Primer Volante de pago</p>
                  <div className={styles.barBtns}>
                    <button
                      onClick={() => router.push(`${infoLoan?.fisrt_flyer}`)}
                    >
                      Ver
                    </button>

                    <button
                      onClick={() => router.push(`${infoLoan?.fisrt_flyer}`)}
                    >
                      Descargar
                    </button>
                  </div>
                </div>
              </div>

              <div className={styles.cardFlyer}>
                <div className={styles.headerCardFlyer}>
                  <div className={styles.centerHeaderFlyer}>
                    <div className={styles.boxDocument}>
                      <HiOutlineDocumentChartBar
                        className={styles.iconDocument}
                      />
                    </div>
                    <p className={styles.textHeader}>Documento PDF</p>
                  </div>
                </div>
                <div className={styles.infoBox}>
                  <p>Segundo Volante de pago</p>
                  <div className={styles.barBtns}>
                    <button
                      onClick={() => router.push(`${infoLoan?.fisrt_flyer}`)}
                    >
                      Ver
                    </button>

                    <button
                      onClick={() => router.push(`${infoLoan?.fisrt_flyer}`)}
                    >
                      Descargar
                    </button>
                  </div>
                </div>
              </div>

              <div className={styles.cardFlyer}>
                <div className={styles.headerCardFlyer}>
                  <div className={styles.centerHeaderFlyer}>
                    <div className={styles.boxDocument}>
                      <HiOutlineDocumentChartBar
                        className={styles.iconDocument}
                      />
                    </div>
                    <p className={styles.textHeader}>Documento PDF</p>
                  </div>
                </div>
                <div className={styles.infoBox}>
                  <p>Tercer Volante de pago</p>
                  <div className={styles.barBtns}>
                    <button
                      onClick={() => router.push(`${infoLoan?.fisrt_flyer}`)}
                    >
                      Ver
                    </button>

                    <button
                      onClick={() => router.push(`${infoLoan?.fisrt_flyer}`)}
                    >
                      Descargar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default RequestInfo;
