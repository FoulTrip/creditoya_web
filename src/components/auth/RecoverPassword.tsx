import React, { useState } from "react";
import styles from "./auth.module.css";
import { TbLoader, TbMail } from "react-icons/tb";
import { toast } from "sonner";
import axios from "axios";
import { ScalarUser } from "@/types/User";

function RecoverPassword({ onCancel }: { onCancel: () => void }) {
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [emailRecover, setEmailRecover] = useState<string | null>(null);

  const [generateKey, setGenerateKey] = useState<string | null>(null);
  const [coverNumberMail, setCoverNumberMail] = useState<string | null>(null);

  const [codeSent, setCodeSent] = useState(false);

  const [isTimeNewPass, setIsTimeNewPass] = useState(false);
  const [userData, setUserData] = useState<ScalarUser | null>(null);
  const [newPassword, setNewPassword] = useState<string | null>(null);

  const handleChangelPass = async () => {
    try {
      setLoadingVerify(true);

      const searchUser = await axios.post("/api/user/getbymail", {
        email: emailRecover,
      });

      // console.log(searchUser);

      if (searchUser.data.success == true) {
        const data: ScalarUser = searchUser.data.data;
        setUserData(data);
        // console.log(data);
        const completeName = `${data.names} ${data.firstLastName} ${data.secondLastName}`;

        const newKey = (Math.floor(Math.random() * 90000) + 10000)
          .toString()
          .padStart(5, "0");

        setGenerateKey(newKey);

        const numberCode: number = Number(newKey);

        // console.log(data);

        // const token = TokenService.createToken(
        //   data,
        //   process.env.JWT_SECRET as string
        // );

        // console.log(token);

        // setToken(token);

        const response = await axios.post(
          "/api/mail/recover",
          {
            addressee: emailRecover,
            name: completeName,
            code: numberCode,
          }
          // { headers: { Authorization: `Bearer ${token}` } }
        );

        // console.log(response);

        if (response.data.success == true) {
          // console.log(response.data);
          setCodeSent(true);
          setLoadingVerify(false);
        }
      }
    } catch (error) {
      console.error("Error sending code:", error);
      toast.error("Error al enviar el código, intenta nuevamente.");
    }
  };

  const verifyCodes = async () => {
    try {
      if (!coverNumberMail)
        throw new Error("Ingrese el numero de verificacion");

      // Verificar si el número de verificación ingresado coincide con el generado
      if (coverNumberMail === generateKey) {
        setIsTimeNewPass(true);
        toast.success("Código verificado correctamente.");
      } else {
        throw new Error(
          "Código de verificación incorrecto. Intenta nuevamente."
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  const updatePassword = async () => {
    try {
      if (!newPassword) throw new Error("Ingresa tu nueva contraseña");
      // if (!token) throw new Error("Falta el token");

      const newPass = await axios.post(
        "/api/user/update_password",
        {
          userId: userData?.id,
          newPassword,
        }
        // { headers: { Authorization: `Bearer ${token}` } }
      );

      if (newPass.data.success == true) {
        toast.success("Contraseña actualizada");
        setTimeout(() => {
          setUserData(null);
          onCancel();
        }, 2000);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <>
      <div className={styles.cancelBtn} onClick={onCancel}>
        <p>Cancelar</p>
      </div>
      <h5 className={styles.warnText}>
        {codeSent == false
          ? "Ingresa tu correo electronico con el que te registraste"
          : "Ingresa el codigo enviado a tu correo electronico"}
      </h5>

      {codeSent && !isTimeNewPass && (
        <div className={styles.boxInput}>
          <div className={styles.subBoxIconInput}>
            <TbMail className={styles.iconInput} size={20} />
          </div>
          <input
            className={styles.input}
            type="text"
            name="email"
            placeholder="Codigo de seguridad"
            onChange={(e) => setCoverNumberMail(e.target.value as string)}
            //   value={formData.email}
          />
        </div>
      )}

      {!codeSent && !isTimeNewPass && (
        <div className={styles.boxInput}>
          <div className={styles.subBoxIconInput}>
            <TbMail className={styles.iconInput} size={20} />
          </div>
          <input
            className={styles.input}
            type="text"
            name="email"
            placeholder="Correo Electronico"
            onChange={(e) => setEmailRecover(e.target.value)}
            //   value={formData.email}
          />
        </div>
      )}

      {isTimeNewPass && (
        <div className={styles.boxInput}>
          <div className={styles.subBoxIconInput}>
            <TbMail className={styles.iconInput} size={20} />
          </div>
          <input
            className={styles.input}
            type="password"
            name="email"
            placeholder="Nueva contraseña"
            onChange={(e) => setNewPassword(e.target.value)}
            //   value={formData.email}
          />
        </div>
      )}

      <div className={styles.bntSubPass}>
        {!codeSent && !loadingVerify && (
          <button className={styles.BtnReq} onClick={handleChangelPass}>
            Solicitar
          </button>
        )}

        {codeSent && !isTimeNewPass && (
          <button className={styles.BtnReq} onClick={verifyCodes}>
            Comprobar
          </button>
        )}

        {isTimeNewPass && codeSent && (
          <button className={styles.BtnReq} onClick={updatePassword}>
            Actualizar contraseña
          </button>
        )}

        {loadingVerify && (
          <>
            <div className={styles.containerLoader}>
              <div className={styles.bocCenterLoader}>
                <div className={styles.boxIconLoader}>
                  <TbLoader className={styles.iconLoader} />
                </div>
                <p className={styles.textLoader}>Comprobando Identidad</p>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default RecoverPassword;
