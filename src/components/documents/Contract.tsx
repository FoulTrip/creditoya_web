import React from "react";
import styles from "./Contract.module.css";

function Contract({ toggleContract }: { toggleContract: () => void }) {
  return (
    <>
      <div className={styles.card}>
        <div className={styles.headerCard}>
          <h2 className={styles.firstTitle}>
            AUTORIZACIÓN, DECLARACIÓN Y CARTA DE INSTRUCCIONES DE PAGARÉ EN
            BLANCO
          </h2>
          <h4 onClick={toggleContract}>Cancelar</h4>
        </div>
        <p className={styles.groupText}>
          Como la información suministrada aquí es confidencial y básica para la
          tramitación de esta solicitud, CREDITOYA SAS, exige que todos los
          datos suministrados sean exactos y se puedan verificar. Declaro que la
          información suministrada en esta solicitud concuerda con la realidad y
          asumo plena responsabilidad alguna por parte de la compañía frente a
          terceros o al (los) solicitante(s). Así mismo, declaro expresa y
          voluntariamente que he sido debidamente informado por parte de
          CREDITOYA SAS, previamente al diligenciamiento de la presente
          solicitud de crédito, sobre las condiciones que regirán la respectiva
          operación, en el evento de aprobarse la misma, tales como plazo, tasa
          de interés remuneratorio, tasa de interés moratorio, costos por
          gestión de cobranza, costos y cargos fijos asociados a los seguros de
          vida y de los bienes que lleguen a respaldar la obligación, costos
          asociados a avales o garantías que otorguen terceros (si procede), así
          como los derechos que me asisten en mi condición de cliente y deudor.
          Por medio del presente documento y en cumplimiento a lo dispuesto por
          la Ley Estatutaria 1581 del 17 de octubre de 2012 y en concordancia
          con el Artículo 10° del decreto 1377 de 2013 con el fin de continuar
          tratando mis datos personales; AUTORIZO expresa, voluntaria,
          debidamente informado e irrevocablemente a CREDITOYA SAS y/o otra
          Entidad que represente sus derechos, a compartir, actualizar,
          transmitir y/o transferir mi información personal, financiera y
          comercial como cliente de CREDITOYA SAS, con cualquier otra persona o
          Entidad vinculada al Grupo Económico al que pertenece o llegare a
          pertenecer dicha compañía, así como los terceros a través de los que
          se realice gestión de cobranza, se adelanten labores de venta y/o
          comercialización de productos, y/o a través de los que se originó la
          presente solicitud de crédito (tales como, Compañías Aseguradoras,
          Intermediarios de Seguros, Universidades, Concesionarios y Entidades
          Públicas y/o privadas con las que tenga convenio de libranza
          (vigente), única y exclusivamente para fines comerciales y para la
          prestación de servicios y/o realización de gestiones de apoyo en las
          labores propias de CREDITOYA SAS. Adicionalmente, Yo el firmante
          identificado(a) con la cédula de ciudadanía indicada en el cuerpo de
          esta solicitud expresamente autorizo a CREDITOYA SAS para que: 1.
          Obtenga toda la información y las referencias relativas a mi persona,
          a mi comportamiento y crédito comercial, mis hábitos de pago, el
          manejo de la(s) cuenta(s) corriente(s) y de ahorros, de la(s)
          cuenta(s) en Bancos, tarjetas de crédito y en general del cumplimiento
          de mis obligaciones. Autorizo con carácter permanente a CREDITOYA SAS
          para consultar ante la Asociación Bancaria, Datacrédito, Covinoc o
          cualquier otra entidad que en el futuro se establezcan mi
          endeudamiento con el Sector Financiero, así como la información
          comercial sobre el cumplimiento dado a los compromisos adquiridos con
          dicho sector. 2. Para que en el evento que se embargue(n) cuenta(s)
          y/o se incumpla con cualquiera de las obligaciones contraídas, se
          incluyan mi nombre, apellidos, cédula de ciudadanía o documento de
          identificación en los archivos de deudor morosos o con referencias
          negativas que lleva la Asociación Bancaria de Colombia, Convinoc,
          Datacrédito o cualquiera otra entidad que en el futuro se establezca
          con ese propósito. Igualmente autorizo irrevocablemente para que se
          produzca el correspondiente reporte positivo negativo. La autorización
          de reporte aquí establecida se hace extensiva a cualquier persona
          natural o jurídica que en el futuro llegue a ostentar la calidad de
          acreedor en relación con la(s) obligación(es) contraída(s) con
          CREDITOYA SAS. 3. Autorizo se me descuente y se pague del producto del
          crédito otorgado la suma equivalente a los intereses causados entre la
          fecha del desembolso y el día del primer corte del crédito antes de la
          primer cuota. 4. Autorizo me remita vía correo electrónico a la
          dirección que reposa en el cuerpo de esta solicitud de crédito y/o en
          los registros de esta Entidad Financiera, cualquier tipo de
          información y en especial la notificación previa de que trata el
          artículo 21 de la ley 1266 de 2008 y/o cualquier otra norma que lo
          modifique o adicione. 5. Autorizo desde ahora de forma expresa e
          irrevocable a CREDITOYA SAS a conectarme y/o enviarme, cuando así lo
          considere, a través de mensajes de texto a mi teléfono celular y/o
          cualquier otro medio electrónico la información que considere
          pertinente en la relación con la(s) operación(es) de crédito a mi
          cargo o información acerca de sus productos 6. Autorizo que el dinero
          producto del préstamo solicitado, si es aprobado sea consignado en la
          siguiente cuenta:
        </p>
        <h3 className={styles.secondTitle}>
          FAVOR COLOCAR EL NÚMERO EXACTO DE SU CUENTA PERSONAL. NO SE HACE
          TRANSFERENCIA A LA CUENTA DE UN TERCERO.
        </h3>
        <div className={styles.barDates}>
          <div className={styles.boxTypeAccount}>
            <div className={styles.centerBoxTypeAccount}>
              <div className={styles.supraCenterTA}>
                <p>cuenta Corriente</p>
                <input type="checkbox" />
              </div>
              <div className={styles.supraCenterTA}>
                <p>cuenta ahorros</p>
                <input type="checkbox" />
              </div>
            </div>
          </div>

          <div className={styles.boxDate}>
            <p>Nro. Cuenta</p>
            <input type="text" />
          </div>

          <div className={styles.boxDate}>
            <p>Entidad</p>
            <input type="text" />
          </div>
        </div>
        <h3 className={styles.threeTitle}>10. DECLARACIÓN ORIGEN DE FONDOS:</h3>
        <p className={styles.justification}>
          Realizo la declaración de fuentes de fondos a CREDITOYA SAS. Declaro
          que mis recursos no provienen de ninguna actividad ilícita de las
          contempladas en el Código Penal Colombiano o en cualquier otra norma
          concordante, o que lo modifique o adicione. Declaro que mis fondos
          provienen de
        </p>
        <input className={styles.textJustification} />
        <p className={styles.threBoxTexts}>
          <span className={styles.threBoxTextsNumber}>11.</span> Declaro que he
          sido informado de que con el fin de mantener la cuota fija de mi
          obligación de crédito, el plazo acordado podrá variar según aumente o
          disminuya la tasa de interés estipulada: en caso de aumento de la tasa
          se adicionará el plazo en la(s) cuota(s) que sea(n) necesarios(s) para
          cancelar los valores de capital y intereses de pago, sin que ello
          implique capitalización alguno de interese. En caso de disminución de
          la misma el plazo podrá disminuir en el número de cuotas necesarias o
          el valor de la última cuota podrá ser inferior al establecido.{" "}
        </p>
        <h3 className={styles.fourTitle}>
          12. POR CONCEPTO DE COBREO DE LA GESTIÓN DE COBRANZA:
        </h3>
        <p className={styles.finalText}>
          Por medio del presente documento declaro que he sido debidamente
          informado por parte de CREDITOYA SAS y que conozco, entiendo y acepto,
          que en el evento de incurrir en mora en el pago de mis obligaciones
          para con ese establecimiento de crédito, se dará aviso inmediato de
          tal circunstancia a las personas naturales y/o jurídicas encargadas de
          efectuar la cobranza de la cartera de la compañía; con el propósito de
          que inicien gestiones de cobro y recuperación pertinentes, a través,
          entre otros, de los siguientes mecanismos: llamadas telefónicas,
          comunicaciones escritas y vía correo electrónico, y visitas. En ese
          sentido, por virtud de la gestión de cobranza prejudicial que se deba
          adelantar, se cobrará las siguientes sumas de dinero a cargo del
          Cliente y a favor de las personas naturales y/o jurídicas que realicen
          la gestión respectiva: i) Sobre las cuotas de la operación de crédito
          que alcancen dieciséis (16) días de mora, una suma equivalente al 3%
          del valor total en mora; ii) Sobre las cuotas de la operación de
          crédito que alcancen los treinta y un (31) días de mora, una suma
          equivalente al 4% del valor total en mora; iii) Sobre las cuotas de la
          operación de crédito que alcancen los cuarenta y seis (46) días de
          mora, una suma equivalente al 5% del valor total en mora; y iv) Sobre
          las cuotas de la operación de crédito que alcancen y superen los
          sesenta y un (61) días demora, una suma equivalente al 10% del valor
          total en mora. Los anteriores valores se incrementarán de acuerdo con
          el IVA aplicable. A partir del día ciento veinte (120) de mora, la
          respectiva obligación de crédito se remitirá para cobranza judicial,
          siendo así mismo de cargo del cliente los honorarios que se causen a
          favor del abogado encargado de la recuperación de la cartera, cuyo
          monto se regirá por las políticas que al efectos establecidas para ese
          momento CREDITOYA SAS.
        </p>
        <p className={styles.finalText}>
          En todo casa CREDITOYA SAS se reserva el derecho de remitir
          anticipadamente la obligación para su cobro por la vía judicial,
          cuando en su crédito existan circunstancias que lo ameriten, en cuyo
          caso el Cliente deberá pagar desde ese momento los honorarios que
          genere dicha gestión.
        </p>
      </div>
    </>
  );
}

export default Contract;
