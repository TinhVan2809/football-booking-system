import { useState, useEffect } from "react";
import { RiPhoneLine, RiTimer2Line, RiArrowRightSLine, RiArrowLeftSLine } from "@remixicon/react";

import "../../styles/Fields.css";

function FieldList() {
  const img =
    "http://localhost/football-booking-system/backend-php/uploads/fields_img";
  const API_BASE =
    "http://localhost/football-booking-system/backend-php/fields/api.php";
  const LIMIT = 24;
  const [fields, setFields] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setloading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    setloading(true);
    setError(null);
    const fetchFildes = async (page = 1) => {
      try {
        const res = await fetch(
          `${API_BASE}?action=get&limit=${LIMIT}&page=${page}`,
        );

        if (!res.ok) {
          throw new Error("ERROR HTTP ", res.status);
        }

        const data = await res.json();
        if (data.success) {
          setFields(data.data);
          setloading(false);
          setTotalPages(data.total_pages || 1);
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching fildes ", err);
      }
    };
    fetchFildes(currentPage);
  }, [currentPage]);

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

  if (loading) {
    return <div>Loaing ...</div>;
  }

  return (
    <>
      <section className="w-full mt-20">
        <div className="w-full flex justify-center items-center">
          <h1 className="text-stone-900 font-bold text-3xl">DÀNH CHO BẠN</h1>
        </div>
        <main className="w-full mt-10">
          <div className="grid grid-cols-3 gap-y-3 gap-x-2 w-full px-12 justify-center items-center">
            {fields.map((f) => (
              <div className="field--cart__container h-80 w-full relative rounded-2xl overflow-hidden group cursor-pointer" key={f.field_id}>
                <img
                  src={
                    f.thumbnail
                      ? `${img}/${f.thumbnail}`
                      : "pexels-pixabay-47730.jpg"
                  }
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent"></div>
                <div className="absolute z-10 bottom-0 w-full p-5 text-white">
                  <div className="flex gap-1 items-center">
                    <RiTimer2Line size={14} />
                    <span className="text-[14px]">
                      {f.open_time?.slice(0, 5)}
                    </span>
                    <span>-</span>
                    <span className="text-[14px]">
                      {f.close_time?.slice(0, 5)}
                    </span>
                  </div>
                  <div className="">
                    <p className="line-clamp-1 font-[550]">{f.branch_name}</p>
                    <p className="line-clamp-3 text-sm">{f.address}</p>
                  </div>
                  <div className="flex justify-end items-center gap-3 mt-3">
                    <button className="px-3 py-1 rounded-3xl flex gap-1 border border-orange-400 justify-center items-center text-orange-400 cursor-pointer duration-100 hover:bg-white hover:border-white">
                      <RiPhoneLine size={19} /> Liên hệ
                    </button>
                    <button className="px-3 py-1 rounded-3xl bg-orange-600 cursor-pointer duration-100 hover:bg-orange-700">
                      Đặt lịch
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
        </main>
      </section>
    </>
  );
}

export default FieldList;
