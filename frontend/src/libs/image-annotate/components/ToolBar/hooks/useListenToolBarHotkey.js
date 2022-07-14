import React,{useRef,useEffect} from "react";



export const useListenToolBarHotkey=({callback})=>{
const previousValue=useRef(null)

useEffect(()=>{
    window.addEventListener("keydown",event=>{
        if(event.key>=1&&event.key<=7){
            callback(100+parseInt(event.key)-1);
            previousValue.current=100+parseInt(event.key)-1;
             }

             if(previousValue.current!==null){
                if(event.key==="n"||event.key==="N")
                callback(previousValue.current)
             }

             if(event.key==="c"||event.key==="C")
             callback(-1);
             

       })
    
return ()=>{
    window.removeEventListener("keydown",()=>{})
}

},[])


}