import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();

queryClient.setDefaultOptions({
  queries: {
    networkMode: "always",
  },
});

export const invalidateReactQuery = async (
  queryKeys: readonly unknown[],
  refetchType: "all" | "active" | "inactive" | "none" = "all",
) => {
  await Promise.all(
    queryKeys.map((queryKey) =>
      queryClient.invalidateQueries({
        queryKey: [queryKey],
        refetchType,
      }),
    ),
  );
};
