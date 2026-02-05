// [Trang quản trị sân bóng theo chi nhánh]

import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

function FieldsBranch() {
  const { branch_id } = useParams();

  const API_BRANCH =
    "http://localhost/football-booking-system/backend-php/branches/api.php";
  const API_FIELDS =
    "http://localhost/football-booking-system/backend-php/fields/api.php";
  const API_PRICING_RULES =
    "http://localhost/football-booking-system/backend-php/pricing_rules/api.php";

  const LIMIT = 10;

  const [fields, setFields] = useState([]);
  const [fieldTypes, setFieldTypes] = useState([]);

  const [loading, setLoading] = useState(false);
  const [loadingTypes, setLoadingTypes] = useState(false);
  const [error, setError] = useState(null);
  const [typesError, setTypesError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [refreshFieldsKey, setRefreshFieldsKey] = useState(0);
  const [refreshTypesKey, setRefreshTypesKey] = useState(0);

  const [fieldForm, setFieldForm] = useState({
    field_name: "",
    status: "available",
    thumbnail: "",
    description: "",
  });
  const [fieldFormErrors, setFieldFormErrors] = useState({});

  const [typeForm, setTypeForm] = useState({
    type_name: "",
    players: "",
    type_code: "",
    thumbnail: "",
    description: "",
  });
  const [typeFormErrors, setTypeFormErrors] = useState({});

  const defaultAssignForm = useMemo(
    () => ({
      field_type_id: "",
      price_per_hour: "",
      max_players: "",
      status: "available",
    }),
    [],
  );
  const [assignForms, setAssignForms] = useState({});
  const [assignErrorsByField, setAssignErrorsByField] = useState({});
  const [seedPricingLoadingByFftId, setSeedPricingLoadingByFftId] = useState({});

  const formatCurrency = (value) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(Number(value || 0));

  useEffect(() => {
    if (!branch_id) return;

    const fetchFieldsByBranch = async (page = 1) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${API_BRANCH}?action=getById&branch_id=${branch_id}&limit=${LIMIT}&page=${page}`,
        );
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.message || `HTTP ${res.status}`);
        }

        if (data.success) {
          setFields(data.data || []);
          setTotalPages(data.total_pages || 1);
        } else {
          setError(data.message || "Fetch failed");
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching fields by branch", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFieldsByBranch(currentPage);
  }, [API_BRANCH, LIMIT, branch_id, currentPage, refreshFieldsKey]);

  useEffect(() => {
    const fetchFieldTypes = async () => {
      setLoadingTypes(true);
      setTypesError(null);
      try {
        const res = await fetch(`${API_FIELDS}?action=get-field-types`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.message || `HTTP ${res.status}`);
        }

        if (data.success) {
          setFieldTypes(data.data || []);
        } else {
          setTypesError(data.message || "Fetch failed");
        }
      } catch (err) {
        setTypesError(err.message);
        console.error("Error fetching field types", err);
      } finally {
        setLoadingTypes(false);
      }
    };

    fetchFieldTypes();
  }, [API_FIELDS, refreshTypesKey]);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  const handleFieldFormChange = (e) => {
    const { name, value } = e.target;
    setFieldForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypeFormChange = (e) => {
    const { name, value } = e.target;
    setTypeForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddField = async (e) => {
    e.preventDefault();
    setFieldFormErrors({});

    const formBody = new FormData();
    formBody.append("branch_id", branch_id);
    formBody.append("field_name", fieldForm.field_name);
    formBody.append("status", fieldForm.status);
    formBody.append("thumbnail", fieldForm.thumbnail);
    formBody.append("description", fieldForm.description);

    try {
      const res = await fetch(`${API_FIELDS}?action=add-field`, {
        method: "POST",
        body: formBody,
      });
      const data = await res.json();

      if (data.success) {
        alert("Thêm sân bóng thành công!");
        setFieldForm({
          field_name: "",
          status: "available",
          thumbnail: "",
          description: "",
        });
        setRefreshFieldsKey((k) => k + 1);
      } else if (res.status === 422 && data.errors) {
        setFieldFormErrors(data.errors);
      } else {
        alert(data.message || "Có lỗi khi thêm sân bóng.");
      }
    } catch (err) {
      console.error("Add field error", err);
      alert("Không thể kết nối server.");
    }
  };

  const handleAddFieldType = async (e) => {
    e.preventDefault();
    setTypeFormErrors({});

    const formBody = new FormData();
    formBody.append("type_name", typeForm.type_name);
    formBody.append("players", typeForm.players);
    formBody.append("type_code", typeForm.type_code);
    formBody.append("thumbnail", typeForm.thumbnail);
    formBody.append("description", typeForm.description);

    try {
      const res = await fetch(`${API_FIELDS}?action=add-field-type`, {
        method: "POST",
        body: formBody,
      });
      const data = await res.json();

      if (data.success) {
        alert("Thêm loại sân thành công!");
        setTypeForm({
          type_name: "",
          players: "",
          type_code: "",
          thumbnail: "",
          description: "",
        });
        setRefreshTypesKey((k) => k + 1);
      } else if (res.status === 422 && data.errors) {
        setTypeFormErrors(data.errors);
      } else {
        alert(data.message || "Có lỗi khi thêm loại sân.");
      }
    } catch (err) {
      console.error("Add field type error", err);
      alert("Không thể kết nối server.");
    }
  };

  const updateAssignForm = (fieldId, partial) => {
    setAssignForms((prev) => ({
      ...prev,
      [fieldId]: {
        ...(prev[fieldId] || defaultAssignForm),
        ...partial,
      },
    }));
  };

  const handleSelectFieldType = (field, fieldTypeId) => {
    const existing = field?.field_types?.find(
      (t) => String(t.field_type_id) === String(fieldTypeId),
    );

    updateAssignForm(field.field_id, {
      field_type_id: fieldTypeId,
      price_per_hour: existing?.price_per_hour ?? "",
      max_players: existing?.max_players ?? existing?.players ?? "",
      status: existing?.status ?? "available",
    });
  };

  const handleAssignSubmit = async (fieldId) => {
    const assignForm = assignForms[fieldId] || defaultAssignForm;
    setAssignErrorsByField((prev) => ({ ...prev, [fieldId]: {} }));

    const formBody = new FormData();
    formBody.append("field_id", fieldId);
    formBody.append("field_type_id", assignForm.field_type_id);
    formBody.append("price_per_hour", assignForm.price_per_hour);
    formBody.append("max_players", assignForm.max_players);
    formBody.append("status", assignForm.status);

    try {
      const res = await fetch(`${API_FIELDS}?action=upsert-field-field-type`, {
        method: "POST",
        body: formBody,
      });

      const data = await res.json();
      if (data.success) {
        alert("Lưu loại sân cho sân bóng thành công!");
        setRefreshFieldsKey((k) => k + 1);
      } else if (res.status === 422 && data.errors) {
        setAssignErrorsByField((prev) => ({ ...prev, [fieldId]: data.errors }));
      } else {
        alert(data.message || "Có lỗi khi lưu loại sân.");
      }
    } catch (err) {
      console.error("Assign field type error", err);
      alert("Không thể kết nối server.");
    }
  };

  const handleSeedDefaultPricingRules = async (fieldFieldTypeId) => {
    if (!fieldFieldTypeId) {
      alert("Thiếu field_field_type_id.");
      return;
    }

    const ok = window.confirm(
      `Tạo/Cập nhật bảng giá mặc định cho field_field_type_id #${fieldFieldTypeId}?`,
    );
    if (!ok) return;

    setSeedPricingLoadingByFftId((prev) => ({
      ...prev,
      [fieldFieldTypeId]: true,
    }));

    const formBody = new FormData();
    formBody.append("field_field_type_id", fieldFieldTypeId);

    try {
      const res = await fetch(`${API_PRICING_RULES}?action=upsert-default`, {
        method: "POST",
        body: formBody,
      });
      const data = await res.json();

      if (data.success) {
        const inserted = data?.data?.inserted ?? 0;
        const updated = data?.data?.updated ?? 0;
        alert(`Đã lưu bảng giá. Inserted: ${inserted}, Updated: ${updated}`);
      } else {
        alert(data.message || "Có lỗi khi tạo bảng giá.");
      }
    } catch (err) {
      console.error("Seed pricing rules error", err);
      alert("Không thể kết nối server.");
    } finally {
      setSeedPricingLoadingByFftId((prev) => ({
        ...prev,
        [fieldFieldTypeId]: false,
      }));
    }
  };

  return (
    <div className="">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-md mt-6 mb-10">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
          Quản lý sân bóng - Chi nhánh #{branch_id}
        </h2>

        {/* Add Field */}
        <div className="mb-10">
          <h3 className="text-lg font-semibold mb-4">Thêm sân bóng mới</h3>
          <form
            onSubmit={handleAddField}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="col-span-2 md:col-span-1">
              <label className="block text-gray-700 font-medium mb-2">
                Tên sân
              </label>
              <input
                type="text"
                name="field_name"
                value={fieldForm.field_name}
                onChange={handleFieldFormChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${fieldFormErrors.field_name ? "border-red-500" : "border-gray-300"}`}
                placeholder="Ví dụ: Sân 1A"
              />
              {fieldFormErrors.field_name && (
                <p className="text-red-500 text-sm mt-1">
                  {fieldFormErrors.field_name}
                </p>
              )}
            </div>

            <div className="col-span-2 md:col-span-1">
              <label className="block text-gray-700 font-medium mb-2">
                Trạng thái
              </label>
              <select
                name="status"
                value={fieldForm.status}
                onChange={handleFieldFormChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="available">available</option>
                <option value="maintenance">maintenance</option>
              </select>
              {fieldFormErrors.status && (
                <p className="text-red-500 text-sm mt-1">
                  {fieldFormErrors.status}
                </p>
              )}
            </div>

            <div className="col-span-2">
              <label className="block text-gray-700 font-medium mb-2">
                Thumbnail (tên file)
              </label>
              <input
                type="text"
                name="thumbnail"
                value={fieldForm.thumbnail}
                onChange={handleFieldFormChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${fieldFormErrors.thumbnail ? "border-red-500" : "border-gray-300"}`}
                placeholder="Ví dụ: pexels-pixabay-47730.jpg"
              />
              {fieldFormErrors.thumbnail && (
                <p className="text-red-500 text-sm mt-1">
                  {fieldFormErrors.thumbnail}
                </p>
              )}
            </div>

            <div className="col-span-2">
              <label className="block text-gray-700 font-medium mb-2">
                Mô tả
              </label>
              <textarea
                name="description"
                value={fieldForm.description}
                onChange={handleFieldFormChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Mô tả sân..."
              ></textarea>
            </div>

            <div className="col-span-2 mt-2">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300 shadow-md"
              >
                Thêm sân bóng
              </button>
            </div>
          </form>
        </div>

        {/* Add Field Type */}
        <div className="mb-10">
          <h3 className="text-lg font-semibold mb-4">Thêm loại sân</h3>
          <form
            onSubmit={handleAddFieldType}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="col-span-2 md:col-span-1">
              <label className="block text-gray-700 font-medium mb-2">
                Tên loại sân
              </label>
              <input
                type="text"
                name="type_name"
                value={typeForm.type_name}
                onChange={handleTypeFormChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${typeFormErrors.type_name ? "border-red-500" : "border-gray-300"}`}
                placeholder="Ví dụ: Sân 9 người"
              />
              {typeFormErrors.type_name && (
                <p className="text-red-500 text-sm mt-1">
                  {typeFormErrors.type_name}
                </p>
              )}
            </div>

            <div className="col-span-2 md:col-span-1">
              <label className="block text-gray-700 font-medium mb-2">
                Số người (players)
              </label>
              <input
                type="number"
                name="players"
                value={typeForm.players}
                onChange={handleTypeFormChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${typeFormErrors.players ? "border-red-500" : "border-gray-300"}`}
                placeholder="Ví dụ: 9"
              />
              {typeFormErrors.players && (
                <p className="text-red-500 text-sm mt-1">
                  {typeFormErrors.players}
                </p>
              )}
            </div>

            <div className="col-span-2 md:col-span-1">
              <label className="block text-gray-700 font-medium mb-2">
                Mã loại sân (type_code - optional)
              </label>
              <input
                type="text"
                name="type_code"
                value={typeForm.type_code}
                onChange={handleTypeFormChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${typeFormErrors.type_code ? "border-red-500" : "border-gray-300"}`}
                placeholder="Ví dụ: f9"
              />
              {typeFormErrors.type_code && (
                <p className="text-red-500 text-sm mt-1">
                  {typeFormErrors.type_code}
                </p>
              )}
            </div>

            <div className="col-span-2 md:col-span-1">
              <label className="block text-gray-700 font-medium mb-2">
                Thumbnail (tên file - optional)
              </label>
              <input
                type="text"
                name="thumbnail"
                value={typeForm.thumbnail}
                onChange={handleTypeFormChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${typeFormErrors.thumbnail ? "border-red-500" : "border-gray-300"}`}
                placeholder="Ví dụ: pexels-xxx.jpg"
              />
              {typeFormErrors.thumbnail && (
                <p className="text-red-500 text-sm mt-1">
                  {typeFormErrors.thumbnail}
                </p>
              )}
            </div>

            <div className="col-span-2">
              <label className="block text-gray-700 font-medium mb-2">
                Mô tả (optional)
              </label>
              <textarea
                name="description"
                value={typeForm.description}
                onChange={handleTypeFormChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Mô tả loại sân..."
              ></textarea>
            </div>

            <div className="col-span-2 mt-2">
              <button
                type="submit"
                className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition duration-300 shadow-md"
              >
                Thêm loại sân
              </button>
            </div>
          </form>

          <div className="mt-6">
            <h4 className="font-semibold mb-2">Danh sách loại sân</h4>
            {loadingTypes ? (
              <p>Đang tải loại sân...</p>
            ) : typesError ? (
              <p className="text-red-500">{typesError}</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full leading-normal">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 border-b bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        type_name
                      </th>
                      <th className="px-4 py-2 border-b bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        players
                      </th>
                      <th className="px-4 py-2 border-b bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        type_code
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {fieldTypes.length > 0 ? (
                      fieldTypes.map((t) => (
                        <tr key={t.field_type_id}>
                          <td className="px-4 py-2 border-b bg-white text-sm">
                            {t.type_name}
                          </td>
                          <td className="px-4 py-2 border-b bg-white text-sm">
                            {t.players}
                          </td>
                          <td className="px-4 py-2 border-b bg-white text-sm">
                            {t.type_code}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="3"
                          className="px-4 py-4 border-b bg-white text-sm text-center"
                        >
                          Chưa có dữ liệu
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Fields List */}
        <div className="">
          <h3 className="text-lg font-semibold mb-4">Danh sách sân</h3>
          {loading ? (
            <p>Đang tải danh sách sân...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="space-y-4">
              {fields.length > 0 ? (
                fields.map((f) => {
                  const assignForm = assignForms[f.field_id] || defaultAssignForm;
                  const assignErrors = assignErrorsByField[f.field_id] || {};

                  return (
                    <div
                      key={f.field_id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold text-gray-800">
                            {f.field_name}{" "}
                            <span className="text-xs text-gray-500">
                              (#{f.field_id})
                            </span>
                          </p>
                          <p className="text-sm text-gray-600">
                            status: {f.status}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3">
                        <p className="font-medium text-gray-700 mb-2">
                          Loại sân đã gán
                        </p>
                        {f.field_types && f.field_types.length > 0 ? (
                          <div className="overflow-x-auto">
                            <table className="min-w-full leading-normal">
                              <thead>
                                <tr>
                                  <th className="px-4 py-2 border-b bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Loại
                                  </th>
                                  <th className="px-4 py-2 border-b bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Players
                                  </th>
                                  <th className="px-4 py-2 border-b bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Giá/giờ
                                  </th>
                                  <th className="px-4 py-2 border-b bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    max_players
                                  </th>
                                  <th className="px-4 py-2 border-b bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    fft.status
                                  </th>
                                  <th className="px-4 py-2 border-b bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    FFT ID
                                  </th>
                                  <th className="px-4 py-2 border-b bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Bảng giá
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {f.field_types.map((t) => (
                                  <tr key={`${f.field_id}-${t.field_type_id}`}>
                                    <td className="px-4 py-2 border-b bg-white text-sm">
                                      {t.type_name}
                                    </td>
                                    <td className="px-4 py-2 border-b bg-white text-sm">
                                      {t.players}
                                    </td>
                                    <td className="px-4 py-2 border-b bg-white text-sm">
                                      {formatCurrency(t.price_per_hour)}
                                    </td>
                                    <td className="px-4 py-2 border-b bg-white text-sm">
                                      {t.max_players ?? "-"}
                                    </td>
                                    <td className="px-4 py-2 border-b bg-white text-sm">
                                      {t.status ?? "-"}
                                    </td>
                                    <td className="px-4 py-2 border-b bg-white text-sm">
                                      {t.field_field_type_id ? `#${t.field_field_type_id}` : "-"}
                                    </td>
                                    <td className="px-4 py-2 border-b bg-white text-sm">
                                      <button
                                        type="button"
                                        disabled={
                                          !t.field_field_type_id ||
                                          !!seedPricingLoadingByFftId[
                                            t.field_field_type_id
                                          ]
                                        }
                                        onClick={() =>
                                          handleSeedDefaultPricingRules(
                                            t.field_field_type_id,
                                          )
                                        }
                                        className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
                                      >
                                        {seedPricingLoadingByFftId[
                                          t.field_field_type_id
                                        ]
                                          ? "Đang tạo..."
                                          : "Bổ sung"}
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">
                            Chưa gán loại sân nào.
                          </p>
                        )}
                      </div>

                      <div className="mt-4 border-t pt-4">
                        <p className="font-medium text-gray-700 mb-3">
                          Gán loại sân (field_field_types)
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="md:col-span-2">
                            <label className="block text-gray-700 text-sm font-medium mb-2">
                              Loại sân
                            </label>
                            <select
                              value={assignForm.field_type_id}
                              onChange={(e) =>
                                handleSelectFieldType(f, e.target.value)
                              }
                              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${assignErrors.field_type_id ? "border-red-500" : "border-gray-300"}`}
                            >
                              <option value="">-- Chọn loại sân --</option>
                              {fieldTypes.map((t) => (
                                <option
                                  key={t.field_type_id}
                                  value={t.field_type_id}
                                >
                                  {t.type_name} ({t.players})
                                </option>
                              ))}
                            </select>
                            {assignErrors.field_type_id && (
                              <p className="text-red-500 text-sm mt-1">
                                {assignErrors.field_type_id}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">
                              Giá / giờ
                            </label>
                            <input
                              type="number"
                              value={assignForm.price_per_hour}
                              onChange={(e) =>
                                updateAssignForm(f.field_id, {
                                  price_per_hour: e.target.value,
                                })
                              }
                              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${assignErrors.price_per_hour ? "border-red-500" : "border-gray-300"}`}
                              placeholder="300000"
                            />
                            {assignErrors.price_per_hour && (
                              <p className="text-red-500 text-sm mt-1">
                                {assignErrors.price_per_hour}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">
                              max_players
                            </label>
                            <input
                              type="text"
                              value={assignForm.max_players}
                              onChange={(e) =>
                                updateAssignForm(f.field_id, {
                                  max_players: e.target.value,
                                })
                              }
                              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${assignErrors.max_players ? "border-red-500" : "border-gray-300"}`}
                              placeholder="Ví dụ: 5"
                            />
                            {assignErrors.max_players && (
                              <p className="text-red-500 text-sm mt-1">
                                {assignErrors.max_players}
                              </p>
                            )}
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-gray-700 text-sm font-medium mb-2">
                              Trạng thái (fft.status)
                            </label>
                            <select
                              value={assignForm.status}
                              onChange={(e) =>
                                updateAssignForm(f.field_id, {
                                  status: e.target.value,
                                })
                              }
                              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${assignErrors.status ? "border-red-500" : "border-gray-300"}`}
                            >
                              <option value="available">available</option>
                              <option value="maintenance">maintenance</option>
                              <option value="locked">locked</option>
                            </select>
                            {assignErrors.status && (
                              <p className="text-red-500 text-sm mt-1">
                                {assignErrors.status}
                              </p>
                            )}
                          </div>

                          <div className="md:col-span-2 flex items-end">
                            <button
                              type="button"
                              onClick={() => handleAssignSubmit(f.field_id)}
                              className="w-full bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700 transition duration-300 shadow-md"
                            >
                              Lưu gán loại sân
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-gray-500">Chưa có sân nào.</p>
              )}
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition"
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages || 1}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FieldsBranch;
