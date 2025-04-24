"use client";

import { useLogout } from "@/features/auth/api/use-logout";

// import { logout } from "@/actions/logout";

interface LogoutButtonProps {
  children?: React.ReactNode
}

export const LogoutButton = ({ 
  children 
}: LogoutButtonProps) => {
  const { mutate } = useLogout();
  const onClick = () => mutate();

  return (
    <span onClick={onClick} className="cursor-pointer">{children}</span>
  )
}