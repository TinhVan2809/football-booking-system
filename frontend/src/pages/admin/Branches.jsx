import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Branches() {
  const API_BASE =
    "http://localhost/football-booking-system/backend-php/branches/api.php";
  const LIMIT = 20;
  const [branches, setBranches] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});

  const navigate = useNavigate()

   const [formData, setFormData] = useState({ branch_name: '', address: '', phone: '', open_time: '', close_time: '' });


  useEffect(() => {
    const fetchBranches = async (page = 1) => {
      try {
        const res = await fetch(
          `${API_BASE}?action=get&limit=${LIMIT}&page=${page}`,
        );

        if (!res.ok) {
          throw new Error("ERROR HTTP: ", res.status);
        }

        const data = await res.json();
        if (data.success) {
          setBranches(data.data);
          setTotalPages(data.total_pages || 1);
          setLoading(false);
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fething branches ", err);
      }
    }
    fetchBranches(currentPage);
  }, [currentPage, refreshKey]);

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

  const handleDelete = (id) => {
    if(window.confirm("Bạn có chắc chắn muốn xóa chi nhánh này?")) {
      console.log("Delete branch", id);
      // Gọi API xóa ở đây
    }
  };

  const handleEdit = (branch) => {
    // Fill data vào form để sửa
    setFormData(branch);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
 

  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData(prevData => ({...prevData, [name]: value}));
  }

  const handleCancelEdit = () => {
    setFormData({ branch_name: '', address: '', phone: '', open_time: '', close_time: '' });
    setValidationErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationErrors({}); // Reset lỗi cũ trước khi submit

    const formBody = new FormData();
    formBody.append("branch_name", formData.branch_name);
    formBody.append("address", formData.address);
    formBody.append("phone", formData.phone);
    formBody.append("open_time", formData.open_time);
    formBody.append("close_time", formData.close_time);
    
    const isEdit = !!formData.branch_id;
    if (isEdit) {
      formBody.append("branch_id", formData.branch_id);
    }
    const action = isEdit ? 'update' : 'add';

    try{
      const res = await fetch(`${API_BASE}?action=${action}` , {
      method: "POST",
      body: formBody,
    });

    const data = await res.json();
    if(data.success) {
      alert(isEdit ? "Cập nhật thành công!" : "Thêm chi nhánh thành công!");
      setFormData({branch_name: '', address: '', phone: '', open_time: '', close_time: ''});
      setRefreshKey(prev => prev + 1); // Trigger reload danh sách
    } else if (res.status === 422 && data.errors) {
      setValidationErrors(data.errors); // Hiển thị lỗi validation từ backend
    } else {
      alert(data.message || "Có lỗi xảy ra khi thêm chi nhánh.");
    }
    } catch(err) {
      console.error("Lỗi khi gửi form", err)
    }
  }


  return (
    <>
      <div className="">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md mt-6 mb-10">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">{formData.branch_id ? "Cập Nhật Chi Nhánh" : "Thêm Chi Nhánh Mới"}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="col-span-2 md:col-span-1">
              <label className="block text-gray-700 font-medium mb-2">Tên chi nhánh</label>
              <input 
                type="text" 
                value={formData.branch_name} 
                name="branch_name" 
                onChange={handleChange} 
                placeholder="Ví dụ: Sân bóng A"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${validationErrors.branch_name ? 'border-red-500' : 'border-gray-300'}`}
              />
              {validationErrors.branch_name && <p className="text-red-500 text-sm mt-1">{validationErrors.branch_name}</p>}
            </div>

            <div className="col-span-2 md:col-span-1">
              <label className="block text-gray-700 font-medium mb-2">Số điện thoại</label>
              <input 
                type="text" 
                value={formData.phone} 
                onChange={handleChange} 
                name="phone" 
                placeholder="Ví dụ: 0901234567"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${validationErrors.phone ? 'border-red-500' : 'border-gray-300'}`}
              />
              {validationErrors.phone && <p className="text-red-500 text-sm mt-1">{validationErrors.phone}</p>}
            </div>

            <div className="col-span-2">
              <label className="block text-gray-700 font-medium mb-2">Địa chỉ</label>
              <input 
                type="text" 
                value={formData.address} 
                onChange={handleChange} 
                name="address"  
                placeholder="Ví dụ: 123 Đường ABC, Quận X"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${validationErrors.address ? 'border-red-500' : 'border-gray-300'}`}
              />
              {validationErrors.address && <p className="text-red-500 text-sm mt-1">{validationErrors.address}</p>}
            </div>

            <div className="col-span-2 md:col-span-1">
              <label className="block text-gray-700 font-medium mb-2">Giờ mở cửa</label>
              <input type="time" value={formData.open_time} onChange={handleChange} name="open_time" className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${validationErrors.open_time ? 'border-red-500' : 'border-gray-300'}`}/>
              {validationErrors.open_time && <p className="text-red-500 text-sm mt-1">{validationErrors.open_time}</p>}
            </div>
            <div className="col-span-2 md:col-span-1">
              <label className="block text-gray-700 font-medium mb-2">Giờ đóng cửa</label>
              <input type="time" value={formData.close_time} onChange={handleChange} name="close_time" className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${validationErrors.close_time ? 'border-red-500' : 'border-gray-300'}`}/>
              {validationErrors.close_time && <p className="text-red-500 text-sm mt-1">{validationErrors.close_time}</p>}
            </div>
            
            <div className="col-span-2 mt-2 flex gap-4">
              <button type="submit" className="flex-1 bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300 shadow-md">
                {formData.branch_id ? "Lưu Thay Đổi" : "Thêm Chi Nhánh"}
              </button>
              {formData.branch_id && (
                <button 
                  type="button" 
                  onClick={handleCancelEdit}
                  className="bg-gray-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-600 transition duration-300 shadow-md"
                >
                  Hủy
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-md mb-10">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Danh sách Chi Nhánh</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tên chi nhánh</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Địa chỉ</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">SĐT</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Giờ hoạt động</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {branches.length > 0 ? (
                  branches.map((branch) => (
                    <tr key={branch.branch_id}>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{branch.branch_name}</td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{branch.address}</td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{branch.phone}</td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{branch.open_time} - {branch.close_time}</td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <div className="flex gap-3">
                          <button onClick={() => handleEdit(branch)} className="text-blue-600 hover:text-blue-900 font-medium">Sửa</button>
                          <button onClick={() => handleDelete(branch.branch_id)} className="text-red-600 hover:text-red-900 font-medium">Xóa</button>
                          <button className="text-green-400 cursor-pointer hover:text-green-900" onClick={() => navigate(`/admin/services/${branch.branch_id}`)}>Dịch vụ</button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">Chưa có dữ liệu</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition"
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Branches;
