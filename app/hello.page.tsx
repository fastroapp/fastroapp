import { PageProps } from "../src/server/types.ts";

export default function Hello(
  { data }: PageProps<{ data: string; user: string; title: string }>,
) {
  return <p>FN {data.data}</p>;
}
