import { Loader2 } from "lucide-react";

import React from "react";

const Loadingspinner = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <Loader2 className="animate-spin text-white-500" size={40} />
    </div>
  );
};

export default Loadingspinner;
