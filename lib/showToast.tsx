import { toast } from "sonner";

type IResponse = "success" | "error" | "warning" | "loading"

interface IInfo {
    type: IResponse
    message: string
}

export const showToast = (info: IInfo) => {

  
    if (info.type === "success")
      toast.success(info.message);
    if (info.type === "error")
      toast.error(info.message);
    if (info.type === "warning")
      toast.message(info.message);
    if (info.type === "loading")
      toast.loading(info.message);



};


export const dismissToast = () => {
    toast.dismiss()
}