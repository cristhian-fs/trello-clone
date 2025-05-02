import { Plus } from "lucide-react"

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { OrganizationSwitcher } from "@/features/organizations/components/organization-switcher";
import { UserButton } from "@/components/auth/user-button";
import { MobileSidebar } from "./mobile-sidebar";
import { FormPopover } from "@/components/form-popover";

export const Navbar = () => {
  return (
    <nav className="fixed z-50 top-0 px-4 w-full h-14 border shadow-sm bg-white flex items-center">
      <MobileSidebar />
      <div className="md:max-w-screen-2xl mx-auto flex items-center justify-between w-full ">
        <div className="flex items-center gap-x-4">
          <div className="hidden md:flex">
            <Logo />
          </div>
          <FormPopover side="bottom" align="start" sideOffset={8}>
            <Button 
              size="sm"
              variant="primary"
              className="rounded-sm hidden md:block h-auto py-1.5 px-2"
            >
              Create
            </Button>
          </FormPopover>
          <Button className="rounded-sm block md:hidden" variant="primary" size="sm">
            <Plus className="size-4"/>
          </Button>
        </div>
        <div className="flex items-center gap-x-2">
          <OrganizationSwitcher />
          <UserButton />
        </div>
      </div>
    </nav>
  );
};