import { useState } from "react"
import { registerExpert } from "../controller/auth_controller/auth_controller"
import {Expert} from "../controller/experts_controller/models/expert"

export const TestingRegisterExpert = () => {
    const [certificates, updateCertificates] = useState(null)
    const [profilePicture, updateProfilePicture] = useState(null)
    const [ktp, updateKtp] = useState(null)
    const [tanggalLahir, updateTanggalLahir] = useState(null)

    const certificatesInputHandler = (event) => {
        updateCertificates(event.target.files);
        console.log(event.target.files);
    }

    const profilePictureInputHandler = (event) => {
        updateProfilePicture(event.target.files);
        console.log(event.target.files);
    }

    const ktpInputHandler = (event) => {
        updateKtp(event.target.files);
        console.log(event.target.files);
    }

    const tanggalLahirInputHandler = (event) => {
        console.log(event.value)
        updateTanggalLahir(event.target.value);
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault()
        const data = new Expert("Micheila", "1231212131","cdaddddd@gmail.com", "GGWP123awda", tanggalLahir, "male", "SMA", "02uTj3FZzbhDVd7dOiH1", "2132132131", "Mandiri", ktp, certificates, profilePicture)
        const result = await registerExpert(data)
        console.log(result);
    }



    return (
        <form>
            <input type="file" name="certificates" multiple="multiple" onChange={certificatesInputHandler} accept=".png,.jpg,.jpeg" />
            
            <input onChange={tanggalLahirInputHandler} type="date" id="start" name="trip-start" value="2018-07-22" min="2018-01-01" max="2018-12-31" />

            <input type="file" name="ktp" onChange={ktpInputHandler} accept=".png,.jpg,.jpeg" />
            <input type="file" name="profilePicture" onChange={profilePictureInputHandler} accept=".png,.jpg,.jpeg" />
            <button onClick={onSubmitHandler}>Submit</button>
        </form>)
}