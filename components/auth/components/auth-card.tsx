import { Card } from "@/components/ui/card";
import Image from "next/image";
import Logo from "@/public/Logo_Full.png";
import {PropsWithChildren} from "react";
import { cn } from "d4t-ui-demo";

interface Props extends PropsWithChildren {
    title: string
    description?: string
    className: string
}

export const AuthCard = ({children, title, description,className}: Props) => {

  return (
    <Card className={cn('border-2 rounded-3xl shadow-md', className)}>
      {children}
    </Card>
  );

};

export default AuthCard;
