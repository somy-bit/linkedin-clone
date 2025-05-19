import { useEffect, useState } from "react"
import ReactTimeago from "react-timeago";

export default function TimeAgo({date}:{date:string}){


    const [mount,setMount] = useState(false)
    useEffect(() => {
        setMount(true)
    }
    ,[])  

    if(!mount) return null; 
    return <ReactTimeago date={date}/>
}