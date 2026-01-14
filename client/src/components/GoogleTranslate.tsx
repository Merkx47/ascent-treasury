import { useEffect } from "react";
import { Globe } from "lucide-react";

export function GoogleTranslate() {
  useEffect(() => {
    const checkElement = () => {
      const element = document.getElementById("google_translate_element");
      if (element && !element.hasChildNodes()) {
        if (typeof (window as any).googleTranslateElementInit === "function") {
          (window as any).googleTranslateElementInit();
        }
      }
    };
    
    const timer = setTimeout(checkElement, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border-2 border-border bg-background hover:bg-accent transition-colors">
      <Globe className="w-4 h-4 text-muted-foreground" />
      <div id="google_translate_element" className="text-sm" />
    </div>
  );
}
