import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

//--------------------------Swiper------------------------------------

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

//--------------------------Swiper-------------------------------------

import { RiMapPinFill, RiMore2Fill } from "@remixicon/react";

function FieldDetail() {
  const { field_id } = useParams();

  // API detail.php
  const API_BASE =
    "http://localhost/football-booking-system/backend-php/details/api.php";

  //API service.php
  const API_SERVICE = "http://localhost/football-booking-system/backend-php/services/api.php";

  const LIMIT = 3;
  
  const [detail, setDetail] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setloading] = useState(false);

  //* Services dịch vụ
  const [services, setServices] = useState([]);

  //* Navigate chuyển trang
  const navigate = useNavigate();

  // Lấy thông tin chung từ phần tử đầu tiên (nếu có) để dùng cho useEffect phía dưới
  const commonInfo = detail && detail.length > 0 ? detail[0] : null;

//TODO: FETCH chi tiết sân bóng 
  useEffect(() => {
    const fetchFieldDetail = async () => {
      setloading(true);

      try {
        const res = await fetch(`${API_BASE}?action=get&field_id=${field_id}`);
        if (!res.ok) {
          throw new Error("ERROR HTTP ", res.status);
        }

        const data = await res.json();

        if (data.success) {
          setDetail(data.data);
          setloading(false);
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching field error ", err);
      }
    };
    fetchFieldDetail();
  }, [field_id]);

  //TODO: FETCH danh sách các dịch vụ có trong chi nhánh (branch_id) này.
  useEffect(() => {
    const fetchServicesBybranch = async(page = 1) => {
      try{
        const res = await fetch(`${API_SERVICE}?action=get&branch_id=${commonInfo?.branch_id}&limit=${LIMIT}&page=${page}`);
        if(!res.ok) {
          throw new Error("ERROR HTTP: ", res.status);
        }

        const data = await res.json();
        
        if(data.success) {
          setServices(data.data);
        }

      } catch(err) {
        setError(err.message);
        console.error("Error fetching services by branch ", err);
      }
    }
    fetchServicesBybranch();
  },[commonInfo?.branch_id]);

  if (loading)
    return <div className="text-center mt-10">Đang tải dữ liệu...</div>;
  if (error)
    return <div className="text-center mt-10 text-red-500">Lỗi: {error}</div>;

  // Kiểm tra nếu không có dữ liệu
  if (!commonInfo) {
    return (
      <>
        <div className="text-center mt-10">
          Không tìm thấy thông tin sân bóng.
        </div>
      </>
    );
  }

  return (
    <>
      <section className="container mx-auto px-4 w-full h-full">
        <div className="relative w-full h-full">
          <div className="w-full h-full">
            <Swiper
              className="w-full h-156"
              modules={[Navigation, Pagination, Autoplay]}
              slidesPerView={1}
              loop={true}
              autoplay={{ delay: 4500 }}
            >
              <SwiperSlide>
                <img
                  src="../../../assets/pexels-2morrowdrm-12460951.jpg"
                  alt=""
                  className="w-full h-full object-cover"
                />
              </SwiperSlide>
              <SwiperSlide>
                <img
                  src="../../../assets/pexels-andreb1612-1615842.jpg"
                  alt=""
                  className="w-full h-full object-cover"
                />
              </SwiperSlide>
              <SwiperSlide>
                <img
                  src="../../../assets/pexels-julien-goettelmann-44396125-30326893.jpg"
                  alt=""
                  className="w-full h-full object-cover"
                />
              </SwiperSlide>
            </Swiper>
          </div>

          {/* Phần hiển thị thông tin chung của Sân */}
          <div className="fielddetail__content--info absolute z-100 top-0 w-full h-full p-5 flex items-end">
            <div className="fielddetail__content--card flex flex-col p-4 w-fit rounded-md gap-3">
              <div className="flex gap-3 items-center flex-wrap">
                <h1 className="text-3xl font-bold text-white">
                  {commonInfo.field_name}
                </h1>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold w-fit ${commonInfo.field_status === "available" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                >
                  {commonInfo.field_status === "available"
                    ? "Đang hoạt động/có sẵn"
                    : "Tạm ngưng"}
                </span>
              </div>
              <p className="text-xl text-white">{commonInfo.branch_name}</p>

              <p className="text-white">{commonInfo.address}</p>

              <div className="flex items-center gap-4 flex-wrap">
                <p
                  className="bg-green-600 text-white w-fit rounded-sm px-4 py-1 cursor-pointer hover:bg-green-900"
                  onClick={() =>
                    navigate(`/branchDetail/${commonInfo.branch_id}`)
                  }
                >
                  Xem chi nhánh
                </p>
                <p
                  className="bg-red-600 text-white w-fit rounded-sm px-4 py-1 cursor-pointer flex gap-1 items-center hover:bg-red-900"
                  onClick={() =>
                    navigate(`/branchDetail/${commonInfo.branch_id}`)
                  }
                >
                  <RiMapPinFill /> xem vị trí
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Phần hiển thị danh sách các loại sân & Bảng giá */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 justify-center items-center">
          {detail.map((item, index) => (
            <div key={index} className="relative rounded-3xl shadow-2xl h-fit">
              <div className="absolute top-0 right-0 bg-white/85 p-2 rounded-[50%] mt-4 mr-4 cursor-pointer hover:opacity-70">
                <RiMore2Fill />
              </div>
              <img
                src={
                  item.thumbnail
                    ? `../../../assets/${item.thumbnail}`
                    : "../../../assets/pexels-rick98-10751047.jpg"
                }
                className="w-full h-full object-cover rounded-3xl"
              />
              <div className="field__card--content absolute bottom-0 p-5 z-10 w-full">
                <span className="text-white text-2xl font-[550]">
                  {item.type_name}
                </span>
                <p className="text-2xl font-bold text-red-600">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(Number(item.price_per_hour))}
                  <span className="text-sm font-normal text-gray-200">
                    / giờ
                  </span>
                </p>
                <span className="text-gray-300 text-sm">
                  {item.description}
                </span>
                <div className="field__card--players flex gap-3 mt-5 mb-5 items-center">
                  <p className="text-white px-2 py-0.5">
                    Players{" "}
                    <span>
                      {item.players} / {item.players}
                    </span>
                  </p>
                  <p className="text-white px-2 py-0.5">
                    Max players: {item.max_players}
                  </p>
                  {item.status === "available" ? (
                    <p className="text-white px-2 py-0.5 bg-[rgba(17,233,68,0.77)]">
                      Có sẳn
                    </p>
                  ) : item.status === "maintenance" ? (
                    <p className="text-white px-2 py-0.5 bg-stone-600">
                      Bảo trì
                    </p>
                  ) : (
                    <p className="text-white px-2 py-0.5 bg-red-500">
                      Đã được thuê
                    </p>
                  )}
                </div>
                {item.status === "available" ? (
                  <button className="w-full bg-white text-shadow-neutral-950 rounded-[20px] py-2 font-medium cursor-pointer hover:bg-gray-200 duration-100">
                    Đặt sân ngay
                  </button>
                ) : item.status === "maintenance" ? (
                  <button className="w-full text-gray-300 rounded-[20px] py-2 font-medium bg-stone-200/40">
                    Nhận thông báo khi sân hoàn tất bảo trì
                  </button>
                ) : (
                  <button className="w-full text-gray-300 rounded-[20px] py-2 font-medium bg-stone-200/40 ">
                    Nhận thông báo khi sân trống
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Danh sách các dịch vụ của chi nhánh này */}
      <div className="flex mt-10">
        <div className="">
          <p>Các dịch vụ đi kèm của chúng tôi.</p>
        </div>
      </div>
    </>
  );
}

export default FieldDetail;
