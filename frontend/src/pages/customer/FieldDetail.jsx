import { useState, useEffect , Suspense} from "react";
import { useParams, useNavigate } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import {
  RiMapPinFill,
  RiMore2Fill,
  RiArrowLeftSLine,
  RiArrowRightSLine,
} from "@remixicon/react";

import CardSkeleton from "../../components/customer/CardSkeleton";

function FieldDetail() {
  const { field_id } = useParams();

  // API detail.php
  const API_BASE =
    "http://localhost/football-booking-system/backend-php/details/api.php";

  //API service.php
  const API_SERVICE =
    "http://localhost/football-booking-system/backend-php/services/api.php";

  const LIMIT = 6;
  const LIMIT_SERVICES = 10;

  const [detail, setDetail] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setloading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  //* Services dịch vụ
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);

  //* Navigate chuyển trang
  const navigate = useNavigate();

  // Lấy thông tin chung từ phần tử đầu tiên (nếu có) để dùng cho useEffect phía dưới
  const commonInfo = detail && detail.length > 0 ? detail[0] : null;

  //TODO: FETCH chi tiết sân bóng (các field_types)
  // Một field bị bảo trì thì các field_type của field đó cũng sẽ đóng theo
  //? Api vẫn được chạy, commonInfo.field_status sẽ quyết định có render không không.
  useEffect(() => {
    const fetchFieldDetail = async (page = 1) => {
      setloading(true);

      //? Lệng ngăn thực thi api nhưng commonInfo sẽ không thể render => commonInfo => undefine

      //  if(!commonInfo) return;
      // if(commonInfo?.field_status === "maintenance") {
      //   return;
      // }
      // console.log(commonInfo?.field_status);

      try {
        const res = await fetch(
          `${API_BASE}?action=get&field_id=${field_id}&limit=${LIMIT}&page=${page}`,
        );
        if (!res.ok) {
          throw new Error("ERROR HTTP ", res.status);
        }

        const data = await res.json();

        if (data.success) {
          setDetail(data.data);
          setTotalPages(data.total_pages || 1);
          setloading(false);
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching field error ", err);
      }
    };
    fetchFieldDetail(currentPage);
  }, [field_id, currentPage]);

  //TODO: FETCH danh sách các dịch vụ có trong chi nhánh (branch_id) này.
  useEffect(() => {
    const fetchServicesBybranch = async (page = 1) => {

      // khi useEffect(() => fetchFieldDetail) mounted => commonInfo?.status đã được xác định

      // Ngưng thực thi api khi field_status === "maintenace"
      // ?Không dùng điều kiện {commonInfo?.field_status..&&..} để tránh tốn hiệu năng vì api sẽ vẫn thực thi nhưng lại không cần render

      if(!commonInfo) return;
      if(commonInfo?.field_status === "maintenance") {
        setServices([]);
        return;
      }
    
      setLoadingServices(true);
      try {
        const res = await fetch(
          `${API_SERVICE}?action=get&branch_id=${commonInfo?.branch_id}&limit=${LIMIT_SERVICES}&page=${page}`,
        );
        if (!res.ok) {
          throw new Error("ERROR HTTP: ", res.status);
        }

        const data = await res.json();

        if (data.success) {
          setServices(data.data);
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching services by branch ", err);
      } finally {
        setLoadingServices(false);
      }
    };
    fetchServicesBybranch();
  }, [commonInfo?.branch_id, commonInfo]);

  if (error)
    return <div className="text-center mt-10 text-red-500">Lỗi: {error}</div>;

  if (loading) {
    return <div>Loading.....</div>; // thêm ui loading ở đây
  }

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

  // Xử lý chuyển trang
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

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
              lazy="true"
              preloadimages="false"
            >
              <SwiperSlide>
                <img
                  rel="preload"
                  as="image"
                  src="../../../assets/pexels-2morrowdrm-12460951.jpg"
                  alt=""
                  className="w-full h-full object-cover will-change-transform"
                />
              </SwiperSlide>
              <SwiperSlide>
                <img
                  rel="preload"
                  as="image"
                  src="../../../assets/pexels-andreb1612-1615842.jpg"
                  alt=""
                  className="w-full h-full object-cover will-change-transform"
                />
              </SwiperSlide>
              <SwiperSlide>
                <img
                  rel="preload"
                  as="image"
                  src="../../../assets/pexels-julien-goettelmann-44396125-30326893.jpg"
                  alt=""
                  className="w-full h-full object-cover will-change-transform"
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
        {/* Kiểm tra sân (field_id) có available không */}

        {commonInfo?.field_status === "available" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 justify-center items-center">
            {detail.map((item) => (
              <div
                key={item.field_type_id }
                className="relative rounded-3xl shadow-2xl h-fit"
              >
                <div className="absolute z-100 top-0 right-0 bg-white/85 p-2 rounded-[50%] mt-4 mr-4 cursor-pointer hover:opacity-70">
                  <RiMore2Fill />
                </div>
                <img
                  rel="preload"
                  as="image"
                  src={
                    item.thumbnail
                      ? `../../../assets/${item.thumbnail}`
                      : "../../../assets/pexels-rick98-10751047.jpg"
                  }
                  className="w-full h-full object-cover rounded-3xl will-change-transform"
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
                    <button className="w-full bg-white text-shadow-neutral-950 rounded-[20px] py-2 font-medium cursor-pointer hover:bg-gray-200 duration-100" onClick={() => navigate(`/booking/${item.field_field_type_id}`)}>
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
        )}

        {/* Phân trang */}
        <div className="w-full flex justify-center items-center gap-4 mt-6">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded cursor-pointer disabled:opacity-50"
          >
            <RiArrowLeftSLine />
          </button>
          <span>
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded cursor-pointer disabled:opacity-50"
          >
            <RiArrowRightSLine />
          </button>
        </div>
      </section>

      {/* Danh sách các dịch vụ của chi nhánh này */}
      <div className="mt-10 mb-10">
        <h3 className="text-2xl font-bold mb-5 text-stone-800">Dịch vụ tại chi nhánh</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {loadingServices ? (
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="p-4 border rounded-xl shadow-sm bg-gray-50 animate-pulse h-24 flex items-center justify-center">
                <CardSkeleton />
              </div>
            ))
          ) : services.length > 0 ? (
            services.map((s) => (
              <div key={s.service_id} className="p-4 border border-gray-200 rounded-xl shadow-sm bg-white hover:shadow-md transition-shadow">
                <p className="font-semibold text-stone-800">{s.service_name}</p>
                <p className="text-green-600 font-medium">
                  {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(s.price))}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-full">Không có dịch vụ đi kèm.</p>
          )}
        </div>
      </div>
    </>
  );
}

export default FieldDetail;
