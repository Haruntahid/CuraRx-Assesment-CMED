import { useContext } from "react";
import { AuthContext } from "../provider/AuthProvider";

function Overview() {
  const { user } = useContext(AuthContext);
  console.log(user);

  return <div>Overview</div>;
}

export default Overview;
