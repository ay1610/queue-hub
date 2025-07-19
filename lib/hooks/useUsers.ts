import { useQuery, type UseQueryOptions, type UseQueryResult } from "@tanstack/react-query";
import { fetchUsers } from "@/lib/api/fetchUsers";
import { USER_DATA_CACHE } from "@/lib/cache-config";

export type User = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
};

export type UsersResponse = {
  users: User[];
};

export function usersQueryOptions(
  options?: Partial<UseQueryOptions<UsersResponse, Error, UsersResponse>>
) {
  return {
    queryKey: ["users"],
    queryFn: fetchUsers,
    ...USER_DATA_CACHE,
    ...options,
  } satisfies UseQueryOptions<UsersResponse, Error, UsersResponse>;
}

export function useUsers(
  options?: Partial<UseQueryOptions<UsersResponse, Error, UsersResponse>>
): UseQueryResult<UsersResponse, Error> {
  return useQuery<UsersResponse, Error>(usersQueryOptions(options));
}
