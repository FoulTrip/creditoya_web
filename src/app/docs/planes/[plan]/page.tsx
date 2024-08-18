"use client";

import { DocsPlanType } from "@/types/Landing";
import styles from "./page.module.css";
import plansJson from "@/components/Jsons/planes.json";
import { useEffect, useState } from "react";
import Image from "next/image";
import { MdOutlineQueryStats } from "react-icons/md";
import { TbArrowLeft, TbDiscountCheckFilled } from "react-icons/tb";
import { useRouter } from "next/navigation";

function PlanesSection({ params }: { params: { plan: string } }) {
  const plans = plansJson as DocsPlanType[];
  const [selectTopic, setSelectTopic] = useState<DocsPlanType[] | null>(null);

  useEffect(() => {
    const filterPlan = plans.filter(
      (plan: DocsPlanType) => plan.id === params.plan
    );
    setSelectTopic(filterPlan);
  }, [params.plan, plans]);

  const router = useRouter();

  return (
    <>
      <main className={styles.mainComponent}>
        <div className={styles.centerMainComp}>
          <div className={styles.barBack}>
            <div
              className={styles.centerBarBack}
              onClick={() => router.push("/")}
            >
              <div className={styles.boxIcon}>
                <TbArrowLeft size={20} className={styles.iconArrow} />
              </div>
              <p className={styles.labelBtn}>Volver</p>
            </div>
          </div>
          {selectTopic?.map((topic) => (
            <div className={styles.preCenter} key={topic.id}>
              <div className={styles.boxImgTopic}>
                <Image
                  width={"300"}
                  height={"400"}
                  className={styles.imgTopic}
                  src={topic.imagen}
                  alt="image"
                />
              </div>

              <div className={styles.boxTextInfo}>
                <div>
                  <h1 className={styles.textName}>{topic.nombre}</h1>
                  <p className={styles.textDescription}>{topic.descripcion}</p>
                  <h3 className={styles.titleTips}>Beneficios</h3>
                  <div className={styles.PreBoxTips}>
                    {topic.beneficios.map((tip, index) => (
                      <div className={styles.boxTips} key={index}>
                        <div className={styles.boxIconTips}>
                          <TbDiscountCheckFilled className={styles.iconTip} />
                        </div>
                        <p className={styles.textTip}>{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}

export default PlanesSection;
