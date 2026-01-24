import { RiMapPinRangeFill } from "@remixicon/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import "../../styles/Banners.css";

function Banners() {
  return (
    <>
      <div className="relative">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 3500 }}
          lazy="true"
          preloadimages="true"
        >
          <SwiperSlide>
            <img
              rel="preload"
              as="image"
              src="../../../assets/pexels-broodingasf-7545413.jpg"
              className="object-cover w-full h-150 will-change-transform"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              rel="preload"
              as="image"
              src="../../../assets/pexels-timmy-siik-65954192-8347889.jpg"
              className="object-cover w-full h-150 will-change-transform"
            />
          </SwiperSlide>
        </Swiper>
        <div className="banner--content__main">
          <div className="text-white w-full flex justify-center items-center flex-col">
            <h1 className="flex justify-center items-center">
              FOOTBALL BOOK{" "}
              <img
                src="../../../assets/pngtree-gold-soccer-cup-with-ball-and-flames-png-image_14315011.png"
                className="w-10"
              />{" "}
              NG SYSTEM
            </h1>
            <div className="flex justify-center items-center">
              <span className="text-sm">Hệ thống quản lý</span>
              <img
                src="../../../assets/HASEBOOKING-Photoroom.png"
                className="w-6.5"
              />
              <span className="text-sm">
                Đặt lịch dịch vụ sân bóng đa chi nhánh
              </span>
            </div>
          </div>
          <div className="banner--content__input flex mt-40 rounded-2xl justify-center items-center">
            <div className="flex items-center gap-4 bg-stone-100 p-2 rounded-xl ">
              <div className="">
                <RiMapPinRangeFill className="text-green-900 cursor-pointer" />
              </div>
              <label htmlFor="">
                <input
                  type="text"
                  placeholder="Nhập tên sân hoặc địa chỉ sân muốn tìm kiếm"
                  className="w-90 h-11 px-3 outline-0 border border-gray-300 rounded-xl"
                />
              </label>
              <label htmlFor="">
                <input
                  type="text"
                  placeholder="Nhập chi nhánh/khu vực của bạn"
                  className="w-90 h-11 px-3 outline-0 border border-gray-300 rounded-2xl"
                />
              </label>
              <button className="px-4 py-2 bg-[#221f23] text-white rounded-2xl cursor-pointer duration-100 hover:bg-green-800">
                Tìm ngay
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Banners;
