import { getApiDocs } from "@/lib/swagger";
import ReactSwagger from "./react-swagger";

export default async function IndexPage() {
  const spec = await getApiDocs();
  return (
    <section style={{ marginTop: "7em" }}>
      <ReactSwagger spec={spec} />
    </section>
  );
}
