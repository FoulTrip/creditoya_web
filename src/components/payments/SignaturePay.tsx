import Image from "next/image";
import React, { useRef, useState } from "react";
import SignatureCanvas, {
  ReactSignatureCanvasProps,
} from "react-signature-canvas";
import { useMediaQuery } from "react-responsive";

import styles from "./signature.module.css";
import { TbCircleCheck, TbCircleX } from "react-icons/tb";
import axios from "axios";
import { useGlobalContext } from "@/context/Auth";

function SignaturePay({
  success,
  src,
  payId,
}: {
  success: () => void;
  src: (data: any) => void;
  payId: string;
}) {
  const signatureCanvasRef = useRef<SignatureCanvas | null>(null);
  const [previewSignature, setPreviewSignature] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);

  // const { loan, setLoanInfo } = useContractContext();
  const { user } = useGlobalContext();

  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 800px)" });

  const clearSignature = () => {
    if (signatureCanvasRef.current) {
      signatureCanvasRef.current.clear();
    }
  };

  const saveSignature = async () => {
    if (signatureCanvasRef.current) {
      const signatureImage = signatureCanvasRef.current.toDataURL();
      setUploadSuccess(true);
      setPreviewSignature(signatureImage);
      const response = await axios.post(
        "/api/loan/payments/signature",
        {
          img: signatureImage,
          payId,
        },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );

      const link = response.data.data;

      if (link) {
        setUploadSuccess(false);
        src({
          signatureUrl: link,
          payId
        });
      }
      success();
    }
  };

  const canvasProps: ReactSignatureCanvasProps["canvasProps"] = {
    width: isTabletOrMobile ? 300 : 400,
    height: "auto",
    className: "signature-canvas",
  };

  return (
    <>
      <div className={styles.SignatureContainer}>
        {!previewSignature && (
          <div className={styles.signatureProcc}>
            <SignatureCanvas
              ref={signatureCanvasRef}
              penColor="purple"
              canvasProps={canvasProps}
            />
          </div>
        )}

        {previewSignature && (
          <div className={styles.signatureProcc}>
            <Image
              src={previewSignature}
              alt={"signature"}
              width={300}
              height={100}
              className={styles.imgPreview}
            />
          </div>
        )}

        <div className={styles.previewImg}>
          <div className={styles.centerPreviewImg}>
            {!previewSignature && (
              <div className={styles.clearSig} onClick={clearSignature}>
                <div className={styles.centerClearSig}>
                  <div className={styles.boxIconSaveSig}>
                    <TbCircleX size={20} className={styles.iconClear} />
                  </div>
                  <p>Limpiar Firma</p>
                </div>
              </div>
            )}

            <div className={styles.saveSig} onClick={saveSignature}>
              <div className={styles.centerSaveSig}>
                <div className={styles.boxIconSaveSig}>
                  <TbCircleCheck size={20} className={styles.iconSave} />
                </div>
                {previewSignature && (
                  <p onClick={() => setPreviewSignature(null)}>Editar firma</p>
                )}
                {!previewSignature && <p>Guardar firma</p>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {uploadSuccess && <p>Procesando firma ...</p>}
    </>
  );
}

export default SignaturePay;
