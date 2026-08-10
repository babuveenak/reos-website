"use client";
import { useEffect, useState } from "react";
type Theme="dark"|"light"; type Scale="normal"|"large"|"xlarge"; type Language="en"|"ar";
export function PreferencesControls(){
 const [theme,setTheme]=useState<Theme>("dark"),[scale,setScale]=useState<Scale>("normal"),[language,setLanguage]=useState<Language>("en");
 function apply(t:Theme,s:Scale,l:Language){const root=document.documentElement;root.dataset.theme=t;root.dataset.fontScale=s;root.lang=l;root.dir=l==="ar"?"rtl":"ltr"}
 useEffect(()=>{const t=(localStorage.getItem("reos-theme") as Theme)||"dark",s=(localStorage.getItem("reos-scale") as Scale)||"normal",l=(localStorage.getItem("reos-language") as Language)||"en";
  // Restore client-only preferences after hydration.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  setTheme(t);setScale(s);setLanguage(l);apply(t,s,l)},[]);
 function themeChange(v:Theme){setTheme(v);localStorage.setItem("reos-theme",v);apply(v,scale,language)}
 function scaleChange(v:Scale){setScale(v);localStorage.setItem("reos-scale",v);apply(theme,v,language)}
 function languageChange(v:Language){setLanguage(v);localStorage.setItem("reos-language",v);apply(theme,scale,v)}
 return <div className="preference-controls" aria-label="Display and language preferences">
  <label><span>{language==="ar"?"اللغة":"Language"}</span><select aria-label="Language" value={language} onChange={e=>languageChange(e.target.value as Language)}><option value="en">English</option><option value="ar">العربية</option></select></label>
  <label><span>{language==="ar"?"المظهر":"Theme"}</span><select aria-label="Colour theme" value={theme} onChange={e=>themeChange(e.target.value as Theme)}><option value="dark">{language==="ar"?"داكن":"Dark"}</option><option value="light">{language==="ar"?"فاتح":"Light"}</option></select></label>
  <label><span>{language==="ar"?"حجم النص":"Text size"}</span><select aria-label="Text size" value={scale} onChange={e=>scaleChange(e.target.value as Scale)}><option value="normal">A</option><option value="large">A+</option><option value="xlarge">A++</option></select></label>
 </div>
}
