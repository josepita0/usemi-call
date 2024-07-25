import qs from "query-string";
import { useQuery } from "@tanstack/react-query";

import { useSocket } from "@/components/providers/socket-provider";

interface ChatQueryProps {
    queryKey: string;
    apiUrl: string;
    paramValue: string;
  };



export const useCalendar = ({
    queryKey,
    apiUrl,
    paramValue
  }: ChatQueryProps) => {
    const { isConnected } = useSocket();
      
  
    const fetchCalendar = async () => {
      
      const url = qs.stringifyUrl({
        url: apiUrl,
        query: {
            serverId: paramValue
        }
      }, { skipNull: true });
  
      const res = await fetch(url);      
      return res.json();
    };
  
    const {
        data, isLoading, error, refetch
    } = useQuery({
      queryKey: [queryKey],
      queryFn: fetchCalendar,
      refetchInterval: isConnected ? false : 2000,
    });
  
    return {
      data,
      isLoading, 
      error, 
      refetch,
    };
  }

  