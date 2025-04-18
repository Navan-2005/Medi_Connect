import React,{useState ,CSSProperties} from 'react'
import ClipLoader from "react-spinners/ClipLoader";

const Spinner = () => {
  return (
   
        <div className="d-flex justify-content-center spinner">
            <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
            </div>
        </div>
    

  )
}

export default Spinner
