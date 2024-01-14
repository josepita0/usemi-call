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
    <Card className={cn('p-7 border-2 shadow-md', className)}>
      <div className='container mb-5'>
        <Image src={Logo} alt='controls-group' />
      </div>

      <h5 className='font-bold text-2xl'>{title}</h5>
      {description && <p className='text-sm text-primary-gray'>{description}</p>}

      {children}
    </Card>
  );

};

export default AuthCard;
