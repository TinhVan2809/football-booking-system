import { useParams } from "react-router-dom";
import ServiceContext from "../../context/ServiceContext";
import { useContext, useEffect, useState } from "react";

function Services() {
  const { branch_id } = useParams();
  const { services, fetchServicesByBranch, pagination } =
    useContext(ServiceContext);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // State cho Form
  const [formData, setFormData] = useState({ service_name: '', price: '', description: '' });
  const [validationErrors, setValidationErrors] = useState({});
  
  // API Base cho các thao tác Thêm/Sửa/Xóa (CUD)
  const API_BASE = "http://localhost/football-booking-system/backend-php/services/api.php";

  useEffect(() => {
    fetchServicesByBranch({
      page,
      limit: 10,
      branch_id: branch_id,
    });
  }, [branch_id, page]);

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination && page < pagination.total_pages) {
      setPage(page + 1);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCancelEdit = () => {
    setFormData({ service_name: '', price: '', description: '' });
    setValidationErrors({});
  };

  const handleEdit = (service) => {
    setFormData(service);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if(window.confirm("Bạn có chắc chắn muốn xóa dịch vụ này?")) {
        try {
            const formBody = new FormData();
            formBody.append('service_id', id);
            
            const res = await fetch(`${API_BASE}?action=delete`, {
                method: 'POST',
                body: formBody
            });
            const data = await res.json();
            if(data.success) {
                alert("Xóa thành công!");
                fetchServicesByBranch({ page, limit: 10, branch_id }); // Refresh list
            } else {
                alert(data.message || "Lỗi khi xóa");
            }
        } catch (err) {
            console.error("Delete error", err);
        }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationErrors({});

    const formBody = new FormData();
    formBody.append("service_name", formData.service_name);
    formBody.append("price", formData.price);
    formBody.append("description", formData.description);
    formBody.append("branch_id", branch_id);

    const isEdit = !!formData.service_id;
    if (isEdit) {
        formBody.append("service_id", formData.service_id);
    }
    const action = isEdit ? 'update' : 'add';

    try {
        const res = await fetch(`${API_BASE}?action=${action}`, {
            method: "POST",
            body: formBody,
        });
        const data = await res.json();
        if (data.success) {
            alert(isEdit ? "Cập nhật thành công!" : "Thêm dịch vụ thành công!");
            setFormData({ service_name: '', price: '', description: '' });
            fetchServicesByBranch({ page, limit: 10, branch_id }); // Refresh list
        } else if (res.status === 422 && data.errors) {
            setValidationErrors(data.errors);
        } else {
            alert(data.message || "Có lỗi xảy ra.");
        }
    } catch (err) {
        console.error("Submit error", err);
    }
  };

  return (
    <div className="">
        {/* Form Section */}
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md mt-6 mb-10">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
                {formData.service_id ? "Cập Nhật Dịch Vụ" : "Thêm Dịch Vụ Mới"}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Tên dịch vụ</label>
                    <input
                        type="text"
                        name="service_name"
                        value={formData.service_name}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${validationErrors.service_name ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Ví dụ: Thuê giày, Nước uống..."
                    />
                    {validationErrors.service_name && <p className="text-red-500 text-sm mt-1">{validationErrors.service_name}</p>}
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Giá (VND)</label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${validationErrors.price ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Ví dụ: 10000"
                    />
                    {validationErrors.price && <p className="text-red-500 text-sm mt-1">{validationErrors.price}</p>}
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Mô tả</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Mô tả chi tiết..."
                    ></textarea>
                </div>
                <div className="flex gap-4">
                    <button type="submit" className="flex-1 bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300 shadow-md">
                        {formData.service_id ? "Lưu Thay Đổi" : "Thêm Dịch Vụ"}
                    </button>
                    {formData.service_id && (
                        <button type="button" onClick={handleCancelEdit} className="bg-gray-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-600 transition duration-300 shadow-md">
                            Hủy
                        </button>
                    )}
                </div>
            </form>
        </div>

        {/* List Section */}
        <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-md mb-10">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Danh sách Dịch Vụ</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tên dịch vụ</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Giá</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Mô tả</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {services.length > 0 ? (
                            services.map((s, index) => (
                                <tr key={s.service_id || index}>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{s.service_name}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(s.price || 0)}
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{s.description}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <div className="flex gap-3">
                                            <button onClick={() => handleEdit(s)} className="text-blue-600 hover:text-blue-900 font-medium">Sửa</button>
                                            <button onClick={() => handleDelete(s.service_id)} className="text-red-600 hover:text-red-900 font-medium">Xóa</button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="4" className="text-center py-5">Chưa có dữ liệu</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            {/* Pagination */}
            <div className="flex justify-center items-center gap-4 mt-6">
                <button
                    onClick={handlePrevPage}
                    disabled={page === 1}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition"
                >
                    Previous
                </button>
                <span>
                    Page {page} of {pagination?.total_pages || 1}
                </span>
                <button
                    onClick={handleNextPage}
                    disabled={page === (pagination?.total_pages || 1)}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition"
                >
                    Next
                </button>
            </div>
        </div>
    </div>
  );
}

export default Services;
