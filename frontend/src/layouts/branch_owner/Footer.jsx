import {
  RiTwitterFill,
  RiGithubFill,
  RiFacebookFill,
  RiInstagramLine,
} from "@remixicon/react";
function FooterBranches() {
  return (
    <>
      <footer className="flex flex-col p-5 sm:p-8 md:px-20 md:py-15 border-t-4 border-black w-full">
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 md:gap-0 justify-center items-start">
          <div className="col-span-1 sm:col-span-2 md:col-span-2 flex items-center mb-6 md:mb-0 justify-center md:justify-start">
            <img
              src="../../../assets/HASEBOOKING-Photoroom.png"
              className="w-20 md:w-10 lg:w-15"
              alt="Hasebooking logo"
            />
            <span className="ml-3 text-lg md:text-xl font-semibold">Hasebooking</span>
          </div>
          <div className="mb-6 md:mb-0 flex justify-center md:justify-start">
            <ul className="flex flex-col gap-2 items-center md:items-start">
              <li className="text-base md:text-sm font-semibold mb-4">COMMUNITY</li>
              <li className="text-base md:text-sm text-stone-800 cursor-pointer duration-200 hover:underline underline-offset-1">About</li>
              <li className="text-base md:text-sm text-stone-800 cursor-pointer duration-200 hover:underline underline-offset-1">Submit on issue</li>
              <li className="text-base md:text-sm text-stone-800 cursor-pointer duration-200 hover:underline underline-offset-1">Github Repo</li>
              <li className="text-base md:text-sm text-stone-800 cursor-pointer duration-200 hover:underline underline-offset-1">Slack</li>
            </ul>
          </div>
          <div className="mb-6 md:mb-0 flex justify-center md:justify-start">
            <ul className="flex flex-col gap-2 items-center md:items-start">
              <li className="text-base md:text-sm font-semibold mb-4">GETTING STARTED</li>
              <li className="text-base md:text-sm text-stone-800 cursor-pointer duration-200 hover:underline underline-offset-1">Introduction</li>
              <li className="text-base md:text-sm text-stone-800 cursor-pointer duration-200 hover:underline underline-offset-1">Documentation</li>
              <li className="text-base md:text-sm text-stone-800 cursor-pointer duration-200 hover:underline underline-offset-1">Usage</li>
              <li className="text-base md:text-sm text-stone-800 cursor-pointer duration-200 hover:underline underline-offset-1">Blobals</li>
              <li className="text-base md:text-sm text-stone-800 cursor-pointer duration-200 hover:underline underline-offset-1">Elements</li>
              <li className="text-base md:text-sm text-stone-800 cursor-pointer duration-200 hover:underline underline-offset-1">Collections</li>
              <li className="text-base md:text-sm text-stone-800 cursor-pointer duration-200 hover:underline underline-offset-1">Themes</li>
            </ul>
          </div>
          <div className="mb-6 md:mb-0 flex justify-center md:justify-start">
            <ul className="flex flex-col gap-2 items-center md:items-start">
              <li className="text-base md:text-sm font-semibold mb-4">RESOURCES</li>
              <li className="text-base md:text-sm text-stone-800 cursor-pointer duration-200 hover:underline underline-offset-1">API</li>
              <li className="text-base md:text-sm text-stone-800 cursor-pointer duration-200 hover:underline underline-offset-1">Form ValidationsProduct</li>
              <li className="text-base md:text-sm text-stone-800 cursor-pointer duration-200 hover:underline underline-offset-1">Visibility</li>
              <li className="text-base md:text-sm text-stone-800 cursor-pointer duration-200 hover:underline underline-offset-1">Accessiblility</li>
              <li className="text-base md:text-sm text-stone-800 cursor-pointer duration-200 hover:underline underline-offset-1">Community</li>
              <li className="text-base md:text-sm text-stone-800 cursor-pointer duration-200 hover:underline underline-offset-1">Design Defined</li>
              <li className="text-base md:text-sm text-stone-800 cursor-pointer duration-200 hover:underline underline-offset-1">Marketplace</li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col md:flex-row w-full justify-between items-center mt-10 md:mt-20 gap-6 md:gap-0">
          <div className="flex justify-center md:justify-start w-full md:w-auto">
            <p className="text-[10px] md:text-sm text-stone-800/80 text-center md:text-left">
              <span>&copy;</span> fow-ui. All rights reserved
            </p>
          </div>
          <div className="flex gap-3 md:gap-5 flex-wrap justify-center md:justify-start w-full md:w-auto">
            <p className="text-[10px] md:text-sm text-stone-800/80 hover:underline underline-offset-1 duration-200 cursor-pointer">Temrs of Service</p>
            <p className="text-[10px] md:text-sm text-stone-800/80 hover:underline underline-offset-1 duration-200 cursor-pointer">Privacy Policy</p>
            <p className="text-[10px] md:text-sm text-stone-800/80 hover:underline underline-offset-1 duration-200 cursor-pointer">Security</p>
            <p className="text-[10px] md:text-sm text-stone-800/80 hover:underline underline-offset-1 duration-200 cursor-pointer">Sitemap</p>
          </div>
          <div className="flex gap-3 md:gap-7 justify-center md:justify-end w-full md:w-auto">
            <RiTwitterFill size={22} className="text-stone-800/70"/>
            <RiGithubFill size={22} className="text-stone-800/70"/>
            <RiFacebookFill size={22} className="text-stone-800/70"/>
            <RiInstagramLine size={22} className="text-stone-800/70"/>
          </div>
        </div>
      </footer>
    </>
  );
}

export default FooterBranches;
