import { useState, useEffect } from "react";

const FooterComponent = () => {
    const [currentYear, setCurrentYearValues] = useState(0);
    useEffect(() => {
      // Initial render has been completed
      setCurrentYearValues(new Date().getFullYear());
    }, []);
    return (
      <div className="fixed bottom-0 w-full bg-blue-500 text-white h-6 text-center">
        <span>
          &copy; {currentYear} Taller Creativo Mi Gran Mundo [Versi&oacute;n: 1.0.0]
        </span>
      </div>
    );
}

export default FooterComponent;
