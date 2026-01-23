import { RiGooglePlayFill, RiAppStoreFill } from '@remixicon/react';
export default function Footer() {
  return (
    <>
      <footer className="w-full flex flex-col p-5 lg:p-20 relative">
        <div className="w-full flex justify-between items-start mb-20 flex-wrap gap-10 lg:gap-0">
          <div className="flex flex-col gap-2">
            <img src="../../../assets/HASEBOOKING-Photoroom.png" className="w-17" />
            <span className="text-xl font-semibold">
              Hệ thống quản lí & đặt lịch lịch dịch vụ toàn chi nhánh.
            </span>
            <span className="text-sm text-gray-500">HaseBooking 2026</span>
          </div>
          <nav className="flex items-start gap-7 lg:gap-20 justify-center">
            <ul className="flex flex-col gap-2 justify-center">
              <li className="text-sm lg:text-[16px] text-stone-800 duration-100 hover:underline cursor-pointer underline-offset-1">Home</li>
              <li className="text-sm lg:text-[16px] text-stone-800 duration-100 hover:underline cursor-pointer underline-offset-1">Sân bóng</li>
              <li className="text-sm lg:text-[16px] text-stone-800 duration-100 hover:underline cursor-pointer underline-offset-1">Tìm kiếm</li>
              <li className="text-sm lg:text-[16px] text-stone-800 duration-100 hover:underline cursor-pointer underline-offset-1">Dịch vụ</li>
            </ul>
            <ul className="flex flex-col gap-2 justify-center">
              <li className="text-sm lg:text-[16px] text-stone-800 duration-100 hover:underline cursor-pointer underline-offset-1">Company</li>
              <li className="text-sm lg:text-[16px] text-stone-800 duration-100 hover:underline cursor-pointer underline-offset-1">Blog</li>
              <li className="text-sm lg:text-[16px] text-stone-800 duration-100 hover:underline cursor-pointer underline-offset-1">Contact</li>
              <li className="text-sm lg:text-[16px] text-stone-800 duration-100 hover:underline cursor-pointer underline-offset-1">News</li>
            </ul>
            <ul className="flex flex-col gap-2 justify-center">
              <li className="text-sm lg:text-[16px] text-stone-800 duration-100 hover:underline cursor-pointer underline-offset-1">Facebook</li>
              <li className="text-sm lg:text-[16px] text-stone-800 duration-100 hover:underline cursor-pointer underline-offset-1">Instagram</li>
              <li className="text-sm lg:text-[16px] text-stone-800 duration-100 hover:underline cursor-pointer underline-offset-1">Telegram</li>
              <li className="text-sm lg:text-[16px] text-stone-800 duration-100 hover:underline cursor-pointer underline-offset-1">Twitter</li>
            </ul>
            <ul className="flex flex-col gap-2 justify-center">
              <li className="text-sm lg:text-[16px] text-stone-800 duration-100 hover:underline cursor-pointer underline-offset-1">Get the app</li>
              <li className="text-sm lg:text-[16px] text-stone-800 duration-100 hover:opacity-80 cursor-pointer flex items-center gap-1 border-2 rounded-2xl px-2 py-1 border-gray-300 w-fit"><RiGooglePlayFill /> CH Plays</li>
              <li className="text-sm lg:text-[16px] text-stone-800 duration-100 hover:opacity-80 cursor-pointer flex items-center gap-1 border-2 rounded-2xl px-2 py-1 border-gray-300 w-fit"><RiAppStoreFill /> App store</li>
            </ul>
          </nav>
        </div>
        <div className="flex bg-[#88db1b] justify-center lg:justify-between absolute bottom-0 w-full right-0 px-5 py-3 lg:py-6 lg:px-20 items-center flex-wrap">
            <p className='text-gray-800 text-sm lg:text-[16px]'>&copy; 2026 Haskbooking. All right reserved.</p>
          <ul className='flex gap-10 mt-5 lg:mt-0'>
            <li className='text-gray-800 cursor-pointer text-[12px] lg:text-sm duration-200 hover:text-gray-500'>Terms of service</li>
            <li className='text-gray-800 cursor-pointer text-[12px] lg:text-sm duration-200 hover:text-gray-500'>Privaty Policy</li>
            <li className='text-gray-800 cursor-pointer text-[12px] lg:text-sm duration-200 hover:text-gray-500'>Cookies</li>
          </ul>
        </div>
      </footer>
    </>
  );
}
