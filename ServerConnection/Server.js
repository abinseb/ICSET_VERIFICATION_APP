import axios from "axios";

export const checkConnection =(ipAddress)=>{
  axios.get(`http://${ipAddress}`)
  .then(()=>{
    return (true);
  })
  .catch((err)=>{
    return(false);
  })
}

