//component footer cho trang admin
import {
  RiInstagramLine,
  RiLinkedinBoxLine,
  RiCheckboxBlankCircleFill,
  RiColorFilterAiLine,
} from "@remixicon/react";

function FooterAdmin() {
  return (
    <>
      <footer className="p-5 md:p-20 lg:ml-60 pb-8 bg-[#151b72] flex flex-col">
        <div className="flex justify-center w-full gap-5 md:gap-40 mb-10 flex-wrap">
          <div className="flex flex-col gap-4">
            <p className="text-2xl font-bold text-white flex items-center gap-1">
              <RiColorFilterAiLine /> HASEBOOKING
            </p>
            <p className="text-white text-sm md:text-[16px]">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eaque
              suscipit sunt omnis veniam
            </p>
            <div className="flex text-white">
              <RiLinkedinBoxLine size={30} />
              <RiInstagramLine size={30} />
            </div>
          </div>

          <ul className="flex md:flex-col gap-2 md:gap-2.5 text-white">
            <li className="cursor-pointer hover:underline underline-offset-1">Home</li>
            <li className="cursor-pointer hover:underline underline-offset-1">Fields</li>
            <li className="cursor-pointer hover:underline underline-offset-1">Services</li>
            <li className="cursor-pointer hover:underline underline-offset-1">Branches</li>
            <li className="cursor-pointer hover:underline underline-offset-1">Company</li>
          </ul>
        </div>
        <div className="flex w-full justify-between py-5 md:pt-10 border-t border-white/50">
          <p className="text-white text-[8px] md:text-sm">Copyright 2026&compy; hasebooking.AllRightsReserved</p>
          <p className="flex gap-2 text-white items-center text-[8px] md:text-sm">
            <span>PrivacyPolicy</span>
            <span className="">
              <RiCheckboxBlankCircleFill size={8}/>
            </span>
            <span>Terms&Conditions</span>
          </p>
        </div>
      </footer>
    </>
  );
}

export default FooterAdmin;
