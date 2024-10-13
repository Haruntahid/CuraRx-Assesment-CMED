import { useLoaderData } from "react-router-dom";

function PrescriptionDetails() {
  const data = useLoaderData();
  console.log(data);
  return <div>PrescriptionDetails</div>;
}

export default PrescriptionDetails;
