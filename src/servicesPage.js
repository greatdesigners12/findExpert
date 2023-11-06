import {getAllFieldsWithExperts} from './controller/fields_controller/fields_controller'
import { useEffect, useState } from 'react';
export const ServicesPages = () => {
    const [fieldData, setFieldData] = useState([])
    const [isLoading, setLoading] = useState(true);
    useEffect(() => {
        const getData = async () => {
          const data = await getAllFieldsWithExperts();
          setFieldData(data);
          console.log(data)
          setLoading(false);
        } 
        getData();
      }, []);

      return (
        <div>
          sasaas
          {isLoading ? "Loading..." : (
            fieldData.data.map((field) => (
              <div key={field.id}>
                <h2>Halo {field.name}</h2>
                <h1>{field.description}</h1>
              </div>
            ))
          )}
        </div>
      )
}