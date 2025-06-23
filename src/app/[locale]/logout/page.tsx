"use client";
import { useRouter } from "next/navigation";
import {  useState } from "react";
import { LogOut } from "lucide-react";

const Logout = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchLogout = async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/logout' ,
        {
          method: "POST",
          body: JSON.stringify({})
        }); 
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const res = await response.json();
      setIsLoading(false);
      setError("สำเร็จ");
      router.push("/");
      router.refresh();
    
      //users.push(newUser);
      return true;
    } catch (error) {
      setIsLoading(false);
      console.error('Error fetching users:', error);
      return false; 
    }
  };


  

  return (
    <button 
      onClick={fetchLogout}
      className="flex items-center space-x-3 p-2 text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
    >
      <LogOut size={20} />
      <span className="text-sm">Logout</span>
    </button>
  );
};

export default Logout;
