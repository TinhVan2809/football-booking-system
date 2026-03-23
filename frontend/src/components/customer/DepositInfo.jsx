function DepositInfo({ booking_id, phone, final_price, close }) {
  return (
    <>
      <div className="w-full h-full fixed z-5000 top-0 flex justify-center items-center p-5 md:p-20 bg-black/10 backdrop-blur-sm transition-opacity">
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-10 bg-white rounded-3xl p-10 w-200 overflow-x-auto max-h-150">
          <div className="absolute top-5 right-5 text-2xl cursor-pointer" onClick={close}>&times;</div>
          <div className="flex flex-col gap-3">
            <img
              src="../../../assets/Screenshot 2026-03-23 124533.png"
              alt=""
            />
            <p>1027927615 VCB Ngân hàng công thương Việt Nam</p>
            <p>Nội dung chuyển khoản:</p>
            <p className="text-xl font-bold">
              [Tên_của_bạn]_{booking_id}_{final_price * (50 / 100)}
            </p>
          </div>
          <div className="">
            <p>
              Số tiền cọc là 50% so với tổng tiền. Sau khi chuyển tiền, nhân
              viên sẽ tiếp nhận số tiền đặt cọc của bạn và thông báo kết quả cho
              bạn sớm nhất
            </p>
            <p>
              Mọi chi tiết vui lòng liên hệ qua {phone} để được hổ trợ tốt nhất
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default DepositInfo;
