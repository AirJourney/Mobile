import { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "@pages/Home";
import ListPage from "@pages/ListPage";
import BookPage from "@pages/BookPage";
import FillPage from "@pages/FillPage";
import Region from "@pages/Region";
import PassengerList from "@pages/PassengerList";
import PassengerEdit from "@pages/PassengerEdit";
import DetailPage from "@pages/DetailPage";
import DetailList from "@pages/DetailList";
import PaymentSuccess from "@pages/PaymentResult";
import Payment from "@pages/Payment";
import UpdatePwd from "@pages/UpdatePwd";

const Router = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/flightlist" element={<ListPage />} />
        <Route path="/bookPage" element={<BookPage />} />
        <Route path="/book" element={<FillPage />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="payment/success" element={<PaymentSuccess />} />
        <Route path="payment/fail" element={<PaymentSuccess />} />
        <Route path="/detaillist" element={<DetailList />} />
        <Route path="/detailpage" element={<DetailPage />} />
        <Route path="/passengerEdit" element={<PassengerEdit />} />
        <Route path="/passengerList" element={<PassengerList />} />
        <Route path="/region" element={<Region />} />
        <Route path="/updatepwd" element={<UpdatePwd />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Suspense>
  );
};

export default Router;
