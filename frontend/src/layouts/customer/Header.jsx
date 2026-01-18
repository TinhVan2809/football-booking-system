import { useNavigate } from "react-router-dom";
function Header() {

    const navigate = useNavigate();
    return (
        <>
            <header className="w-full sticky top-0">
                <div>
                    <button className="bg-transparent border border-green-700 text-green-700 rounded-2xl px-4 py-1.5" onClick={() => navigate('/login')}>Đăng nhập</button>
                </div>
            </header>
        </>
    );
}

export default Header;