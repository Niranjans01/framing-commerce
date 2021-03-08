import AdminPage from "../../components/Admin/AdminPage";
import Link from "next/link";
import {useEffect, useState} from "react";
import { useUser } from '../../contexts/AccountContext'
import { useRouter } from 'next/router'

import orderService from "../../services/OrderService";

export default function(props) {
  const [orderCount, setOrderCount] = useState(0);
  const { user} = useUser()
  const router = useRouter()

  useEffect(() => {
    orderService.count({shipped: false, paid: true}).then(setOrderCount);
  }, []);
  return (
    <>
    {user && user.isAdmin ? (
      <AdminPage title="Dashboard">
      <div className="form-row">
        <div className="col-md-12">
          <div className="alert alert-info">You have <a className="text text-info font-weight-bold" href="/admin/order">{ orderCount }</a> new order(s).</div>
        </div>
      </div>
    </AdminPage>
    ): user&& !user.isAdmin ? (
      <h5 className="text-center mt-3 mb-3"> You are not an admin</h5>
    ):(
      <h5 className="text-center mt-3 mb-3"> Please wait, System is Validating user... If you have not logged in, Please <Link href="/other/login-register" as={process.env.PUBLIC_URL + "/other/login-register"}><a style={{color:"blue"}}>Login</a></Link> to Continue</h5>
    )}
    </>
  );
}
