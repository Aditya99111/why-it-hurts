import React from 'react'
import Healpdf from "./heal.pdf"
const Heal = () => {
  return (
    <div>
        <iframe src={Healpdf}
   width="100%" height="800px"></iframe>
    </div>
  )
}

export default Heal
