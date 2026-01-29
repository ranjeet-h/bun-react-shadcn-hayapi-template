import { useQuery } from "@tanstack/react-query";
import { getHealthOptions } from "../api/generated/@tanstack/react-query.gen";

export default function HomePage() {
  const { data, isLoading, isError } = useQuery(getHealthOptions());

  if (isLoading) return <div>Health: loading...</div>;
  if (isError) return <div>Health: failed</div>;

  return <div>Health: {data?.ok ? "success" : "unknown"}</div>;
}
