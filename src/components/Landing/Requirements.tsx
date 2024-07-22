import React, { useState } from "react";
import styles from "./styles/Requrements.module.css";
import { Slider, SliderChangeEvent } from "primereact/slider";

import { TbDiscountCheckFilled } from "react-icons/tb";
import { useRouter } from "next/navigation";

function RequirementsComponents() {
  const [value, setValue] = useState<number | null>(0);
  const router = useRouter();
  return (
    <>
      <div className={styles.supraMain}>
        <div className={styles.MainRequisites}>
          <div className={styles.boxRequire}>
            <h3 className={styles.titleRequire}>Ventajas para el empleado</h3>

            <div className={styles.infoBox}>
              <p>Super facil</p>
              <div className={styles.boxCheckIcon}>
                <TbDiscountCheckFilled size={20} className={styles.iconCheck} />
              </div>
            </div>

            <div className={styles.infoBox}>
              <p>Super rapido</p>
              <div className={styles.boxCheckIcon}>
                <TbDiscountCheckFilled size={20} className={styles.iconCheck} />
              </div>
            </div>

            <div className={styles.infoBox}>
              <p>sin moverse del sitio de trabajo</p>
              <div className={styles.boxCheckIcon}>
                <TbDiscountCheckFilled size={20} className={styles.iconCheck} />
              </div>
            </div>

            <div className={styles.infoBox}>
              <p>Aprobacion y desembolso por nomina</p>
              <div className={styles.boxCheckIcon}>
                <TbDiscountCheckFilled size={20} className={styles.iconCheck} />
              </div>
            </div>

            <div className={styles.infoBox}>
              <p>Descuento de cuotas por nomina</p>
              <div className={styles.boxCheckIcon}>
                <TbDiscountCheckFilled size={20} className={styles.iconCheck} />
              </div>
            </div>

            <div className={styles.infoBox}>
              <p>
                Cuotas fijas de acuerdo a su capacidad de endeudamiento y
                salario
              </p>
              <div className={styles.boxCheckIcon}>
                <TbDiscountCheckFilled size={20} className={styles.iconCheck} />
              </div>
            </div>

            <div className={styles.infoBox}>
              <p>Desembolsos por transferencia a la cuenta personal</p>
              <div className={styles.boxCheckIcon}>
                <TbDiscountCheckFilled size={20} className={styles.iconCheck} />
              </div>
            </div>

            <div className={styles.infoBox}>
              <p>No requieres experiencia crediticia</p>
              <div className={styles.boxCheckIcon}>
                <TbDiscountCheckFilled size={20} className={styles.iconCheck} />
              </div>
            </div>

            <div className={styles.infoBox}>
              <p>Tasas competitivas con el sector financiero</p>{" "}
              <div className={styles.boxCheckIcon}>
                <TbDiscountCheckFilled size={20} className={styles.iconCheck} />
              </div>
            </div>
          </div>

          <div className={styles.boxRequire}>
            <h3 className={styles.titleRequire}>Ventajas para su empresa</h3>

            <div className={styles.infoBox}>
              <p>
                La empresa no es codeudor solidario y no compromete el capital
                de trabajo de la empresa
              </p>
              <div className={styles.boxCheckIcon}>
                <TbDiscountCheckFilled size={20} className={styles.iconCheck} />
              </div>
            </div>

            <div className={styles.infoBox}>
              <p>No tiene ningún costo ni riesgo</p>
              <div className={styles.boxCheckIcon}>
                <TbDiscountCheckFilled size={20} className={styles.iconCheck} />
              </div>
            </div>

            <div className={styles.infoBox}>
              <p>
                Representa un valor agregado de su compañía frente a sus
                empleados
              </p>
              <div className={styles.boxCheckIcon}>
                <TbDiscountCheckFilled size={20} className={styles.iconCheck} />
              </div>
            </div>

            <div className={styles.infoBox}>
              <p>
                Mejora el bienestar y la relación de sus empleados frente a su
                empresa (mayor productividad)
              </p>
              <div className={styles.boxCheckIcon}>
                <TbDiscountCheckFilled size={20} className={styles.iconCheck} />
              </div>
            </div>

            <div className={styles.infoBox}>
              <p>Cobertura nacional</p>
              <div className={styles.boxCheckIcon}>
                <TbDiscountCheckFilled size={20} className={styles.iconCheck} />
              </div>
            </div>

            <div className={styles.infoBox}>
              <p>Control de endeudamiento</p>
              <div className={styles.boxCheckIcon}>
                <TbDiscountCheckFilled size={20} className={styles.iconCheck} />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.barPriceLoan}>
          <h1 className={styles.titleHow}>
            Comienza digitando cuanto dinero necesitas
          </h1>

          <div className={styles.priceLoan}>
            <div className={styles.boxSlider}>
              <input
                type="range"
                min={0}
                max={3000000}
                step={100000}
                value={value as number}
                onChange={(e) => setValue(Number(e.target.value))}
                className={styles.valueLoan}
              />
            </div>

            <div className={styles.textPrice}>
              <h2>Valor del prestamo</h2>
              <h3>
                $ {value?.toLocaleString("en-US", { minimumFractionDigits: 0 })}{" "}
                COP
              </h3>
            </div>

            <div className={styles.boxBtnPrevLoan}>
              <button onClick={() => router.push("/auth")}>
                Crear prestamo
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RequirementsComponents;
