import React, { useEffect, useRef, useState } from "react";
import styles from "./preEnvio.module.css";

import { MdMailLock } from "react-icons/md";
import { MaskedMail } from "@/handlers/MaskedEmails";
import axios from "axios";
import { toast } from "sonner";
import Signature from "./signature";
import { ScalarLoanApplication } from "@/types/User";

interface PreEnvioProps {
  data: ScalarLoanApplication;
  Success: () => void;
  token: string;
  signature: (url: string) => void;
}

function PreEnvio({ data, Success, token, signature }: PreEnvioProps) {
  console.log(data.email);
  const [verifyNumber, setVerifyNumber] = useState<Array<string>>(
    Array(5).fill("")
  );
  const [userInput, setUserInput] = useState<Array<string>>(Array(5).fill(""));
  const [codeSent, setCodeSent] = useState(false);
  const [successSignature, setSuccessSignature] = useState<boolean>(false);
  const [signatureUrl, setSignatureUrl] = useState<string | null>(null);
  const inputsRef = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    const sendCodeMail = async ({ code }: { code: string }) => {
      const numberCode: number = Number(code);
      const name: string = `${data.names} ${data.firtLastName} ${data.secondLastName}`;
      const response = await axios.post(
        "/api/mail/2f",
        {
          addressee: data.email,
          name,
          code: numberCode,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(response.data);
      setCodeSent(true);
    };

    if (!codeSent) {
      const newKey = (Math.floor(Math.random() * 90000) + 10000)
        .toString()
        .padStart(5, "0");
      setVerifyNumber(Array.from(String(newKey)));
      sendCodeMail({ code: newKey });
    }
  }, [data, token]);

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

  const maskedEmail = MaskedMail(data.email);

  const handleSuccessSignature = () => {
    setSuccessSignature(true);
  };

  const handleSaveSignature = (signatureUrl: string) => {
    signature(signatureUrl);
    setSignatureUrl(signatureUrl);
  };

  return (
    <>
      <div className={styles.headerSignature}>
        <h1>Verificacion de seguridad</h1>
        <p>
          Haz tu firma y luego verifica el codigo enviado a tu correo
          electronico o whatssapp
        </p>
      </div>
      <Signature
        success={handleSuccessSignature}
        src={handleSaveSignature}
        userId={data.userId}
      />

      {successSignature && (
        <div className={styles.containerSendCode}>
          <div className={styles.iconSendCode}>
            <MdMailLock size={80} />
          </div>
          <h3 className={styles.textWarnin}>
            Ingresa el codigo enviado a tu correo electronico
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
      )}
    </>
  );
}

export default PreEnvio;
