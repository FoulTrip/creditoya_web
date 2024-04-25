import * as React from "react";

interface EmailTemplateProps {
  firstName: string;
  code: number;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
  code,
}) => (
  <div>
    <h1>Hola {firstName} mira tu codigo de seguridad</h1>
    <h3>{code}</h3>
  </div>
);
