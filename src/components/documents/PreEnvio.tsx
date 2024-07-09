import React, { useEffect, useRef, useState } from "react";
import styles from "./preEnvio.module.css";

import { MdMailLock } from "react-icons/md";
import { MaskedMail } from "@/handlers/MaskedEmails";
import axios from "axios";
import { toast } from "sonner";
import { ScalarLoanApplication } from "@/types/User";

interface PreEnvioProps {
  data: ScalarLoanApplication;
  Success: () => void;
  token: string;
  completeName: string;
  mail: string;
}

function PreEnvio({ data, Success, token, completeName, mail }: PreEnvioProps) {
  const [verifyNumber, setVerifyNumber] = useState<Array<string>>(
    Array(5).fill("")
  );
  const [userInput, setUserInput] = useState<Array<string>>(Array(5).fill(""));
  const [codeSent, setCodeSent] = useState(false);
  const inputsRef = useRef<HTMLInputElement[]>([]);
  const effectRan = useRef(false);

  useEffect(() => {
    // Only in Develop
    // if (effectRan.current) return;

    const sendCodeMail = async ({ code }: { code: string }) => {
      const numberCode: number = Number(code);
      const name: string = completeName;
      try {
        const response = await axios.post(
          "/api/mail/2f",
          {
            addressee: mail,
            name,
            code: numberCode,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log(response.data);
        setCodeSent(true);
      } catch (error) {
        console.error("Error sending code:", error);
        toast.error("Error al enviar el código, intenta nuevamente.");
      }
    };

    if (!codeSent) {
      const newKey = (Math.floor(Math.random() * 90000) + 10000)
        .toString()
        .padStart(5, "0");
      setVerifyNumber(Array.from(String(newKey)));
      sendCodeMail({ code: newKey });
    }

    // Only in Develop
    // effectRan.current = true;
  }, [codeSent, completeName, mail, token]);

  const handleChange =
    (position: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.value === "") return;
      userInput[position] = e.target.value;
      setUserInput([...userInput]);
      if (position === verifyNumber.length - 1) {
        handleSubmit();
      }
      if (position < verifyNumber.length - 1) {
        inputsRef.current[position + 1]?.focus();
      }
    };

  const handleSubmit = () => {
    if (userInput.join("") === verifyNumber.join("")) {
      Success();
      toast.success("Código correcto");
    } else {
      toast.error("Código incorrecto");
    }
  };

  const maskedEmail = MaskedMail(mail);

  return (
    <>
      <main style={{ display: "grid", placeContent: "center", height: "100%" }}>
        <div style={{}}>
          <div className={styles.headerSignature}>
            <h1>Verificación de seguridad</h1>
          </div>

          <div className={styles.containerSendCode}>
            <div className={styles.iconSendCode}>
              <MdMailLock size={80} />
            </div>
            <h3 className={styles.textWarnin}>
              Ingresa el código enviado a tu correo electrónico
            </h3>
            <p className={styles.previewCorreo}>{maskedEmail}</p>
            <div className={styles.inputContainer}>
              <div className={styles.centerInputNumbers}>
                {verifyNumber.map((_, i) => (
                  <input
                    key={i}
                    type="text"
                    maxLength={1}
                    onChange={handleChange(i)}
                    ref={(ref) => {
                      if (ref) {
                        inputsRef.current[i] = ref;
                      }
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default PreEnvio;
